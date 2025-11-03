'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { debugLog, debugError } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import { EmailTemplateForm } from 'src/forms/email-template';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function EmailTemplateCreateView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        debugLog('EmailTemplateCreateView.handleSubmit', 'Creating email template', { data });

        // TODO: Implement API call to create template
        // const response = await apiPost('/api/email-templates/create', data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        debugLog('EmailTemplateCreateView.handleSubmit', 'Email template created successfully');

        // Navigate back to templates list
        router.push(paths.dashboard.email.emailTemplates);
      } catch (error) {
        debugError(
          'EmailTemplateCreateView.handleSubmit',
          'Failed to create email template',
          error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create Email Template
        </Typography>

        <EmailTemplateForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Create Template"
        />
      </Container>
    </DashboardContent>
  );
}
