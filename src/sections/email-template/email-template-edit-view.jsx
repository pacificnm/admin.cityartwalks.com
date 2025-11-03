'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { debugLog, debugError } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import { EmailTemplateForm } from 'src/forms/email-template';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function EmailTemplateEditView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [error] = useState(null);

  const templateId = params?.id;

  // TODO: Implement useEffect to fetch template data
  // useEffect(() => {
  //   const fetchTemplate = async () => {
  //     try {
  //       setIsLoadingTemplate(true);
  //       const response = await apiGet(`/api/email-templates/${templateId}`);
  //       setCurrentTemplate(response.data);
  //     } catch (err) {
  //       setError('Failed to load template');
  //       debugError('EmailTemplateEditView.fetchTemplate', 'Failed to fetch template', err);
  //     } finally {
  //       setIsLoadingTemplate(false);
  //     }
  //   };

  //   if (templateId) {
  //     fetchTemplate();
  //   }
  // }, [templateId]);

  // Mock data for now
  useState(() => {
    setTimeout(() => {
      setCurrentTemplate({
        id: templateId,
        name: 'Welcome Email Template',
        category: 'welcome',
        subjectTemplate: 'Welcome to {{appName}}, {{userName}}!',
        htmlTemplate:
          '<h1>Welcome {{userName}}!</h1><p>Thank you for joining {{appName}}.</p><p>Best regards,<br>The {{appName}} Team</p>',
        textTemplate:
          'Welcome {{userName}}!\n\nThank you for joining {{appName}}.\n\nBest regards,\nThe {{appName}} Team',
        variables: {
          userName: '{{userName}}',
          appName: '{{appName}}',
        },
        isActive: true,
      });
      setIsLoadingTemplate(false);
    }, 500);
  }, [templateId]);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        debugLog('EmailTemplateEditView.handleSubmit', 'Updating email template', {
          templateId,
          data,
        });

        // TODO: Implement API call to update template
        // const response = await apiPut(`/api/email-templates/${templateId}/update`, data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        debugLog('EmailTemplateEditView.handleSubmit', 'Email template updated successfully');

        // Navigate back to templates list
        router.push(paths.dashboard.email.emailTemplates);
      } catch (submitError) {
        debugError(
          'EmailTemplateEditView.handleSubmit',
          'Failed to update email template',
          submitError
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, templateId]
  );

  if (isLoadingTemplate) {
    return (
      <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
        <Container maxWidth={settings.compactLayout ? false : 'xl'}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  if (error || !currentTemplate) {
    return (
      <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
        <Container maxWidth={settings.compactLayout ? false : 'xl'}>
          <Alert severity="error">{error || 'Template not found'}</Alert>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Edit Email Template
        </Typography>

        <EmailTemplateForm
          currentTemplate={currentTemplate}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Update Template"
        />
      </Container>
    </DashboardContent>
  );
}
