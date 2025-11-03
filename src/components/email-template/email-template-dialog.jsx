/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplateDialog
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';
import { emailTemplateCreateSchema } from 'src/validators/email-template';

import { Form, RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const TEMPLATE_CATEGORIES = [
  { value: 'contact', label: 'Contact' },
  { value: 'notification', label: 'Notification' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'system', label: 'System' },
  { value: 'transactional', label: 'Transactional' },
];

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplateDialog
 * @description Dialog for creating and editing email templates
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Dialog close handler
 * @param {Object} props.template - Template data for editing (optional)
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onPreview - Preview callback
 * @param {boolean} props.loading - Save loading state
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateDialog({
  open,
  onClose,
  template,
  onSave,
  onPreview,
  loading = false,
}) {
  const [currentTab, setCurrentTab] = useState('basic');
  const isEdit = Boolean(template?.templateId);

  const defaultValues = {
    name: template?.name || '',
    category: template?.category || 'contact',
    subjectTemplate: template?.subjectTemplate || '',
    htmlTemplate: template?.htmlTemplate || '',
    textTemplate: template?.textTemplate || '',
    variables: template?.variables || {},
    isActive: template?.isActive ?? true,
  };

  const methods = useForm({
    resolver: zodResolver(emailTemplateCreateSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (template) {
      reset({
        name: template?.name || '',
        category: template?.category || 'contact',
        subjectTemplate: template?.subjectTemplate || '',
        htmlTemplate: template?.htmlTemplate || '',
        textTemplate: template?.textTemplate || '',
        variables: template?.variables || {},
        isActive: template?.isActive ?? true,
      });
    }
  }, [template, reset]);

  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSave = handleSubmit(async (data) => {
    try {
      debugLog('EmailTemplateDialog.handleSave', 'Saving template', { isEdit, data });
      await onSave?.(data);
      if (!isEdit) {
        reset({
          name: '',
          category: 'contact',
          subjectTemplate: '',
          htmlTemplate: '',
          textTemplate: '',
          variables: {},
          isActive: true,
        });
      }
    } catch (error) {
      debugError('EmailTemplateDialog.handleSave', 'Failed to save template', error);
    }
  });

  const handlePreview = useCallback(() => {
    debugLog('EmailTemplateDialog.handlePreview', 'Previewing template', { values });
    onPreview?.(values);
  }, [onPreview, values]);

  const handleClose = useCallback(() => {
    if (!isEdit) {
      reset({
        name: '',
        category: 'contact',
        subjectTemplate: '',
        htmlTemplate: '',
        textTemplate: '',
        variables: {},
        isActive: true,
      });
    }
    setCurrentTab('basic');
    onClose();
  }, [isEdit, reset, onClose]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
      <Form methods={methods} onSubmit={handleSave}>
        <DialogTitle>{isEdit ? 'Edit Email Template' : 'Create Email Template'}</DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              bgcolor: 'background.neutral',
            }}
          >
            <Tab label="Basic Information" value="basic" />
            <Tab label="Content" value="content" />
            <Tab label="Variables" value="variables" />
            <Tab label="Settings" value="settings" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {currentTab === 'basic' && (
              <Stack spacing={3}>
                <RHFTextField
                  name="name"
                  label="Template Name"
                  placeholder="Enter template name..."
                  helperText="A unique name to identify this template"
                />

                <RHFSelect name="category" label="Category">
                  {TEMPLATE_CATEGORIES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name="subjectTemplate"
                  label="Email Subject"
                  placeholder="Enter email subject..."
                  helperText="Support variable substitution with {{variable}} syntax"
                />
              </Stack>
            )}

            {currentTab === 'content' && (
              <Stack spacing={3}>
                <RHFTextField
                  name="htmlTemplate"
                  label="HTML Template"
                  multiline
                  rows={12}
                  placeholder="Enter HTML email template..."
                  helperText="HTML content for the email. Use {{variable}} for dynamic content."
                />

                <RHFTextField
                  name="textTemplate"
                  label="Plain Text Template"
                  multiline
                  rows={8}
                  placeholder="Enter plain text version..."
                  helperText="Plain text fallback version of the email"
                />
              </Stack>
            )}

            {currentTab === 'variables' && (
              <Stack spacing={3}>
                <Typography variant="h6">Available Variables</Typography>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                    {`User Variables:
{{user.name}} - User's full name
{{user.email}} - User's email address
{{user.firstName}} - User's first name
{{user.lastName}} - User's last name

System Variables:
{{system.siteName}} - Site name
{{system.siteUrl}} - Site URL
{{system.currentDate}} - Current date
{{system.unsubscribeUrl}} - Unsubscribe link

Contact Variables:
{{contact.name}} - Contact name
{{contact.email}} - Contact email
{{contact.subject}} - Contact subject
{{contact.message}} - Contact message`}
                  </Typography>
                </Box>
              </Stack>
            )}

            {currentTab === 'settings' && (
              <Stack spacing={3}>
                <RHFSwitch
                  name="isActive"
                  label="Active Template"
                  helperText="Enable this template for use in email sending"
                />

                <Typography variant="body2" color="text.secondary">
                  Template Version: {template?.version || 1}
                </Typography>
              </Stack>
            )}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={handlePreview} variant="outlined">
            Preview
          </Button>

          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting || loading}>
            {isEdit ? 'Update' : 'Create'} Template
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
