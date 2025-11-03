/**
 * @file email-template-form.jsx
 * @description Form component for creating and editing email templates
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Forms.EmailTemplate
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog, debugError } from 'src/lib/debug';
import {
  emailTemplateCreateSchema,
  emailTemplateUpdateSchema,
} from 'src/validators/email-template';

import { Form, Field } from 'src/components/hook-form';
import { EmailTemplatePreviewDialog } from 'src/components/email-template';
import {
  ViewIcon,
  DisketteIcon,
  AddCircleIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  DangerTriangleIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * Email template categories
 * @constant {Array<Object>} TEMPLATE_CATEGORIES
 * @memberof CityArtWalks.Forms.EmailTemplate
 */
const TEMPLATE_CATEGORIES = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'notification', label: 'Notification' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'other', label: 'Other' },
];

/**
 * Common template variables
 * @constant {Array<Object>} COMMON_VARIABLES
 * @memberof CityArtWalks.Forms.EmailTemplate
 */
const COMMON_VARIABLES = [
  { name: 'userName', description: "User's display name" },
  { name: 'userEmail', description: "User's email address" },
  { name: 'appName', description: 'Application name' },
  { name: 'appUrl', description: 'Application URL' },
  { name: 'supportEmail', description: 'Support email address' },
  { name: 'currentDate', description: 'Current date' },
  { name: 'unsubscribeUrl', description: 'Unsubscribe URL' },
];

// ----------------------------------------------------------------------

/**
 * Email template form component
 * @function EmailTemplateForm
 * @memberof CityArtWalks.Forms.EmailTemplate
 * @param {Object} props - Component properties
 * @param {Object} [props.currentTemplate] - Current template data for editing
 * @param {Function} props.onSubmit - Form submission callback
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.submitText] - Custom submit button text
 * @returns {JSX.Element} Email template form component
 */
export function EmailTemplateForm({
  currentTemplate,
  onSubmit,
  isLoading = false,
  submitText = 'Create Template',
}) {
  const isEdit = !!currentTemplate;
  const schema = isEdit ? emailTemplateUpdateSchema : emailTemplateCreateSchema;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentTemplate?.name || '',
      category: currentTemplate?.category || 'other',
      subjectTemplate: currentTemplate?.subjectTemplate || '',
      htmlTemplate: currentTemplate?.htmlTemplate || '',
      textTemplate: currentTemplate?.textTemplate || '',
      variables: currentTemplate?.variables || {},
      isActive: currentTemplate?.isActive ?? true,
    }),
    [currentTemplate]
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

  const watchedHtmlTemplate = watch('htmlTemplate');
  const watchedSubjectTemplate = watch('subjectTemplate');
  const watchedTextTemplate = watch('textTemplate');
  const watchedVariables = watch('variables');

  // Extract and validate template variables
  const templateValidation = useMemo(() => {
    const declaredVariables = Object.keys(watchedVariables || {});
    debugLog('EmailTemplateForm.templateValidation', 'Validating templates', {
      declaredVariables,
      subjectTemplate: watchedSubjectTemplate,
      htmlTemplate: watchedHtmlTemplate,
      textTemplate: watchedTextTemplate,
    });

    // Validate each template independently - don't require all variables in all templates
    const subjectValidation = {
      foundVariables: [],
      errors: [],
    };
    const htmlValidation = {
      foundVariables: [],
      errors: [],
    };
    const textValidation = {
      foundVariables: [],
      errors: [],
    };

    // Extract variables from each template
    const variablePattern = /\{\{(\w+)\}\}/g;

    // Subject template validation
    if (watchedSubjectTemplate) {
      let match;
      const subjectFoundVariables = new Set();
      while ((match = variablePattern.exec(watchedSubjectTemplate)) !== null) {
        subjectFoundVariables.add(match[1]);
      }
      subjectValidation.foundVariables = Array.from(subjectFoundVariables);

      // Check for undeclared variables in subject
      const undeclaredInSubject = subjectValidation.foundVariables.filter(
        (variable) => !declaredVariables.includes(variable)
      );
      if (undeclaredInSubject.length > 0) {
        subjectValidation.errors.push(
          `Subject line uses undeclared variables: ${undeclaredInSubject.join(', ')}`
        );
      }
    }

    // HTML template validation
    if (watchedHtmlTemplate) {
      variablePattern.lastIndex = 0; // Reset regex
      let match;
      const htmlFoundVariables = new Set();
      while ((match = variablePattern.exec(watchedHtmlTemplate)) !== null) {
        htmlFoundVariables.add(match[1]);
      }
      htmlValidation.foundVariables = Array.from(htmlFoundVariables);

      // Check for undeclared variables in HTML
      const undeclaredInHtml = htmlValidation.foundVariables.filter(
        (variable) => !declaredVariables.includes(variable)
      );
      if (undeclaredInHtml.length > 0) {
        htmlValidation.errors.push(
          `HTML template uses undeclared variables: ${undeclaredInHtml.join(', ')}`
        );
      }
    }

    // Text template validation
    if (watchedTextTemplate) {
      variablePattern.lastIndex = 0; // Reset regex
      let match;
      const textFoundVariables = new Set();
      while ((match = variablePattern.exec(watchedTextTemplate)) !== null) {
        textFoundVariables.add(match[1]);
      }
      textValidation.foundVariables = Array.from(textFoundVariables);

      // Check for undeclared variables in text
      const undeclaredInText = textValidation.foundVariables.filter(
        (variable) => !declaredVariables.includes(variable)
      );
      if (undeclaredInText.length > 0) {
        textValidation.errors.push(
          `Text template uses undeclared variables: ${undeclaredInText.join(', ')}`
        );
      }
    }

    // Collect all errors and found variables
    const allErrors = [
      ...subjectValidation.errors,
      ...htmlValidation.errors,
      ...textValidation.errors,
    ];
    const allFoundVariables = new Set([
      ...subjectValidation.foundVariables,
      ...htmlValidation.foundVariables,
      ...textValidation.foundVariables,
    ]);

    // Only warn about unused variables if they're not used in ANY template
    const usedVariables = Array.from(allFoundVariables);
    const unusedVariables = declaredVariables.filter(
      (variable) => !usedVariables.includes(variable)
    );
    if (unusedVariables.length > 0) {
      allErrors.push(`Declared variables not used in any template: ${unusedVariables.join(', ')}`);
    }

    const result = {
      isValid: allErrors.length === 0,
      errors: allErrors,
      foundVariables: Array.from(allFoundVariables),
      validationDetails: {
        subject: subjectValidation,
        html: htmlValidation,
        text: textValidation,
      },
    };

    debugLog('EmailTemplateForm.templateValidation', 'Validation result', result);
    return result;
  }, [watchedHtmlTemplate, watchedSubjectTemplate, watchedTextTemplate, watchedVariables]);

  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        debugLog('EmailTemplateForm.handleFormSubmit', 'Submitting template form', { data });
        await onSubmit(data);
      } catch (error) {
        debugError('EmailTemplateForm.handleFormSubmit', 'Failed to submit template form', error);
      }
    },
    [onSubmit]
  );

  const handleAddVariable = useCallback(
    (variableName) => {
      const currentVariables = watchedVariables || {};
      setValue('variables', {
        ...currentVariables,
        [variableName]: `{{${variableName}}}`,
      });
    },
    [setValue, watchedVariables]
  );

  const handleRemoveVariable = useCallback(
    (variableName) => {
      const currentVariables = watchedVariables || {};
      const newVariables = { ...currentVariables };
      delete newVariables[variableName];
      setValue('variables', newVariables);
    },
    [setValue, watchedVariables]
  );

  const insertVariable = useCallback(
    (fieldName, variableName) => {
      const currentValue = watch(fieldName) || '';
      const newValue = currentValue + `{{${variableName}}}`;
      setValue(fieldName, newValue);
    },
    [watch, setValue]
  );

  const handleAutoAddFoundVariables = useCallback(() => {
    const foundVariables = templateValidation.foundVariables || [];
    const declaredVariables = Object.keys(watchedVariables || {});
    const undeclaredVariables = foundVariables.filter(
      (variable) => !declaredVariables.includes(variable)
    );

    if (undeclaredVariables.length > 0) {
      const currentVariables = watchedVariables || {};
      const newVariables = { ...currentVariables };

      undeclaredVariables.forEach((variableName) => {
        newVariables[variableName] = `{{${variableName}}}`;
      });

      setValue('variables', newVariables);
      debugLog(
        'EmailTemplateForm.handleAutoAddFoundVariables',
        'Auto-added undeclared variables',
        undeclaredVariables
      );
    }
  }, [templateValidation.foundVariables, watchedVariables, setValue]);

  const handlePreview = useCallback(() => {
    debugLog('EmailTemplateForm.handlePreview', 'Opening preview dialog');
    setIsPreviewOpen(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  // Prepare template data for preview
  const previewTemplate = useMemo(
    () => ({
      name: watch('name') || 'Untitled Template',
      subjectTemplate: watchedSubjectTemplate || '',
      htmlTemplate: watchedHtmlTemplate || '',
      textTemplate: watchedTextTemplate || '',
      variables: watchedVariables || {},
    }),
    [watch, watchedSubjectTemplate, watchedHtmlTemplate, watchedTextTemplate, watchedVariables]
  );

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Left Column: Template Information and Email Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              {/* Template Information */}
              <Card>
                <CardHeader title="Template Information" />
                <CardContent>
                  <Stack spacing={3}>
                    <Field.Text
                      name="name"
                      label="Template Name"
                      placeholder="Enter template name..."
                      helperText="A descriptive name for your email template"
                    />

                    <Field.Select
                      name="category"
                      label="Category"
                      helperText="Select the template category"
                    >
                      {TEMPLATE_CATEGORIES.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Field.Select>

                    <FormControlLabel
                      control={<Field.Switch name="isActive" />}
                      label="Active"
                      labelPlacement="start"
                      sx={{ ml: 0, justifyContent: 'space-between' }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Email Content */}
              <Card>
                <CardHeader title="Email Content" />
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="subtitle2">Subject Line</Typography>
                        <Stack direction="row" spacing={1}>
                          {Object.keys(watchedVariables || {})
                            .slice(0, 3)
                            .map((variableName) => (
                              <Button
                                key={variableName}
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => insertVariable('subjectTemplate', variableName)}
                                sx={{ minWidth: 'auto', px: 1 }}
                              >
                                {variableName}
                              </Button>
                            ))}
                          {Object.keys(watchedVariables || {}).length > 3 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ alignSelf: 'center' }}
                            >
                              +{Object.keys(watchedVariables).length - 3} more
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      <Field.Text
                        name="subjectTemplate"
                        placeholder="Enter email subject template..."
                        helperText="Use {{variableName}} for dynamic content. Click variable buttons above to insert."
                        multiline
                        rows={2}
                      />
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="subtitle2">HTML Template</Typography>
                        <Stack direction="row" spacing={1}>
                          {Object.keys(watchedVariables || {})
                            .slice(0, 3)
                            .map((variableName) => (
                              <Button
                                key={variableName}
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => insertVariable('htmlTemplate', variableName)}
                                sx={{ minWidth: 'auto', px: 1 }}
                              >
                                {variableName}
                              </Button>
                            ))}
                          {Object.keys(watchedVariables || {}).length > 3 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ alignSelf: 'center' }}
                            >
                              +{Object.keys(watchedVariables).length - 3} more
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      <Field.Text
                        name="htmlTemplate"
                        placeholder="Enter HTML email template..."
                        helperText="Full HTML email template with variables. Click variable buttons above to insert."
                        multiline
                        rows={12}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                        Plain Text Template (Optional)
                      </Typography>
                      <Field.Text
                        name="textTemplate"
                        placeholder="Enter plain text version..."
                        helperText="Plain text fallback for email clients that don't support HTML"
                        multiline
                        rows={6}
                        sx={{
                          '& .MuiInputBase-input': {
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          },
                        }}
                      />
                    </Box>

                    {/* Template Validation */}
                    {!templateValidation.isValid && (
                      <Alert
                        severity="warning"
                        action={
                          templateValidation.foundVariables.some(
                            (variable) => !Object.keys(watchedVariables || {}).includes(variable)
                          ) && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={handleAutoAddFoundVariables}
                              startIcon={<AddCircleIcon />}
                            >
                              Auto-add Missing Variables
                            </Button>
                          )
                        }
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Template Validation Issues:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                          {templateValidation.errors.map((error, index) => (
                            <li key={index}>
                              <Typography variant="body2">{error}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Alert>
                    )}

                    {templateValidation.foundVariables.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Variables Found in Templates:
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {templateValidation.foundVariables.map((variable) => {
                            const isDeclared = Object.keys(watchedVariables || {}).includes(
                              variable
                            );
                            return (
                              <Chip
                                key={variable}
                                label={variable}
                                size="small"
                                color={isDeclared ? 'success' : 'warning'}
                                variant={isDeclared ? 'soft' : 'outlined'}
                                icon={isDeclared ? <CheckCircleIcon /> : <DangerTriangleIcon />}
                              />
                            );
                          })}
                        </Stack>
                        {templateValidation.foundVariables.some(
                          (variable) => !Object.keys(watchedVariables || {}).includes(variable)
                        ) && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            <DangerTriangleIcon sx={{ mr: 0.5, fontSize: 14 }} />
                            Variables with warning icon are not declared and may cause issues
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Sidebar: Variables Panel - spans Template Info and Email Content */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                position: 'sticky',
                top: 24,
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto',
              }}
            >
              <CardHeader title="Template Variables" subheader="Manage dynamic content variables" />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Common Variables</Typography>
                  <Stack spacing={1}>
                    {COMMON_VARIABLES.map((variable) => (
                      <Box
                        key={variable.name}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 2,
                          p: 1.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{
                              display: 'block',
                              wordBreak: 'break-word',
                            }}
                          >
                            {variable.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              mt: 0.25,
                              wordBreak: 'break-word',
                            }}
                          >
                            {variable.description}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleAddVariable(variable.name)}
                          startIcon={<AddCircleIcon />}
                          sx={{
                            flexShrink: 0,
                            minWidth: 'auto',
                            px: 1,
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    ))}
                  </Stack>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                      Used Variables
                    </Typography>
                    {Object.keys(watchedVariables || {}).length === 0 ? (
                      <Box
                        sx={{
                          p: 2,
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          textAlign: 'center',
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No variables added yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Add variables from the list above
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 1.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {Object.keys(watchedVariables || {}).map((variableName) => (
                            <Chip
                              key={variableName}
                              label={variableName}
                              onDelete={() => handleRemoveVariable(variableName)}
                              size="small"
                              color="primary"
                              variant="soft"
                              deleteIcon={<CloseCircleIcon />}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Submit Actions - Full Width */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handlePreview}
                startIcon={<ViewIcon />}
                disabled={!watchedSubjectTemplate && !watchedHtmlTemplate && !watchedTextTemplate}
              >
                Preview
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                startIcon={<DisketteIcon />}
              >
                {submitText}
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Form>

      {/* Email Template Preview Dialog */}
      <EmailTemplatePreviewDialog
        open={isPreviewOpen}
        onClose={handlePreviewClose}
        template={previewTemplate}
      />
    </>
  );
}
