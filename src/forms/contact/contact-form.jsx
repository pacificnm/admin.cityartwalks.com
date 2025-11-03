/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @memberof CityArtWalks.Forms.Contact
 */

'use client';

import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { track } from '@vercel/analytics';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugLog } from 'src/lib/debug';
import { useCreateContact, useUpdateContact } from 'src/actions/contact/hooks';
import {
  createContactSchema,
  updateContactSchema,
  defaultContactValues,
} from 'src/validators/contact';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Contact
 * @function ContactForm
 * @description Form component for creating and updating contact information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentContact=null] - Current contact data for editing, null for creating new contact
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ContactForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ContactForm({ currentContact = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentContact);

  // Use appropriate hooks for create/update operations
  const createContact = useCreateContact(accessToken);
  const updateContact = useUpdateContact(accessToken);

  // Get default values using validator utility
  const defaultValues = defaultContactValues(currentContact);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateContactSchema : createContactSchema;

  // React Hook Form setup
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Prevent double submissions by tracking submit state
  const isSubmittingRef = useRef(false);

  // Reference to reCAPTCHA widget for resetting
  const captchaRef = useRef(null);

  // Ensure captcha is ready after component mounts (fixes client-side navigation issue)
  useEffect(() => {
    // Small delay to ensure the DOM is ready and reCAPTCHA script is loaded
    const timer = setTimeout(() => {
      if (captchaRef.current && typeof captchaRef.current.reset === 'function') {
        // Reset to ensure fresh state (but don't clear form token)
        debugLog('ContactForm.useEffect', 'ReCAPTCHA ready for client-side navigation');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * @memberof CityArtWalks.Forms.Contact.ContactForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(
    async (data) => {
      // Track the contact form submission attempt
      track('contact_form_submit', {
        action: 'form_submit_click',
        formType: isEdit ? 'update' : 'create',
        hasName: Boolean(data.name),
        hasEmail: Boolean(data.email),
        hasSubject: Boolean(data.subject),
        hasMessage: Boolean(data.message),
        hasCaptcha: Boolean(data.captchaToken),
      });

      // Prevent double submissions
      if (isSubmittingRef.current) {
        return;
      }

      // Set submission flag
      isSubmittingRef.current = true;

      try {
        // Check for captcha token on new contacts
        if (!isEdit && !data.captchaToken) {
          toast.error('Please complete the captcha verification before submitting.');
          // Try to reset captcha to allow retry
          if (captchaRef.current) {
            captchaRef.current.reset();
          }
          return;
        }

        let result;

        if (isEdit) {
          // Update existing contact - validate that we have the required ID
          if (!currentContact?.contactId) {
            toast.error('Contact ID is required for update operation');
            return;
          }

          result = await updateContact(currentContact.contactId, data);

          if (!result) {
            toast.error('Failed to update contact - no response from server');
            return;
          }

          // Reset form with updated data
          const updatedContactData = result.data || result || currentContact;
          reset(defaultContactValues(updatedContactData));
          toast.success('Your contact has been updated successfully!');
        } else {
          // Create new contact
          result = await createContact(data);

          if (!result) {
            toast.error('Failed to create contact - no response from server');
            return;
          }

          // Reset form with created contact data
          const createdContactData = result.data || result;
          reset(defaultContactValues(createdContactData));
          toast.success('Contact created successfully!');
        }

        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess({
            result,
            operation: isEdit ? 'update' : 'create',
            contactData: result.data || result,
            isEdit,
            formData: data,
          });
        }
      } catch (error) {
        // Enhanced error message based on error type
        let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} contact. Please check your information and try again.`;

        // Check for specific error types and provide helpful messages
        const errorLower = error.message.toLowerCase();

        if (errorLower.includes('captcha')) {
          errorMessage =
            'Captcha verification failed. Please complete the captcha again and resubmit.';
          // Log for debugging but don't expose technical details to user
          debugLog('ContactForm.onSubmit', 'Captcha verification failed', {
            message: error.message,
            status: error.status,
          });
        } else if (errorLower.includes('validation')) {
          errorMessage = 'Please check the form fields for validation errors.';
        } else if (errorLower.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (errorLower.includes('permission')) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (errorLower.includes('duplicate')) {
          errorMessage = 'This contact already exists. Please use different values.';
        } else if (error.status === 400) {
          // Generic 400 error - likely validation or data issue
          errorMessage =
            'Please check your information and try again. If the problem persists, refresh the page.';
        } else if (error.status === 500) {
          // Server error
          errorMessage =
            'Server error. Please try again later or contact support if the issue persists.';
        }

        toast.error(errorMessage);
      } finally {
        // Always reset submission flag and captcha
        isSubmittingRef.current = false;

        // Reset reCAPTCHA widget to get a new token for next submission
        if (captchaRef.current) {
          captchaRef.current.reset();
          // Clear the captcha token from the form
          setValue('captchaToken', '');
        }
      }
    },
    (errors) => {
      // Handle form validation errors - this callback runs when validation fails
      // Show specific validation error messages
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const firstError = errors[errorFields[0]];
        const errorMessage = firstError?.message || 'Please check your form fields for errors.';
        toast.error(`Validation Error: ${errorMessage}`);
      } else {
        toast.error('Please fill in all required fields correctly.');
      }
    }
  );

  /**
   * @memberof CityArtWalks.Forms.Contact.ContactForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values.
   */
  const handleCancel = () => {
    reset(defaultValues);
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        {/* Primary Information Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Field.Text name="name" label="Name" required />
          <Field.Text name="email" label="Email" type="email" required />
          <Field.Text
            name="subject"
            label="Subject"
            required
            sx={{ gridColumn: { sm: 'span 2' } }}
          />
          <Field.Text
            name="message"
            label="Message"
            multiline
            rows={4}
            sx={{ gridColumn: { sm: 'span 2' } }}
          />
        </Box>

        {/* Security Verification (Create Only) */}
        {!isEdit && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Field.ReCaptcha
              key="contact-recaptcha" // Force re-render on navigation
              ref={captchaRef}
              name="captchaToken"
              helperText="Please verify you're not a robot to submit your message"
            />
          </Box>
        )}

        {/* System Fields (Edit Only) */}
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mt: 3, mb: 3 }}>
              <Field.Text
                name="contactId"
                label="Contact ID"
                disabled
                helperText="System-generated identifier"
              />
            </Box>
          </>
        )}

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Save changes' : 'Submit'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
