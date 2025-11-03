/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Dashboard.EmailTemplate.EmailTemplateHomeView
 */

'use client';

import { useState, useCallback } from 'react';

import { Box, Card, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog, debugError } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import { useEmailTemplates } from 'src/actions/email-template/hooks';
import {
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from 'src/actions/email-template/requests';

import { AddIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';
import { ErrorView } from 'src/components/error';
import { EmptyContent } from 'src/components/empty-content';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import {
  EmailTemplateTable,
  EmailTemplateDialog,
  EmailTemplatePreview,
} from 'src/components/email-template';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Sections.Dashboard.EmailTemplate.EmailTemplateHomeView
 * @description Email template management dashboard view with CRUD operations
 *
 * @component
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateHomeView() {
  const { accessToken } = useAuthContext();

  const { data: templates = [], loading, error, mutate } = useEmailTemplates({}, accessToken);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const createDialog = useBoolean();
  const editDialog = useBoolean();
  const previewDialog = useBoolean();

  const pageProgress = useScrollProgress();

  const handleCreateTemplate = useCallback(
    async (templateData) => {
      try {
        debugLog('EmailTemplateHomeView.handleCreateTemplate', 'Creating template', templateData);

        const newTemplate = await createEmailTemplate(templateData, accessToken);

        toast.success('Email template created successfully');
        mutate();
        createDialog.onFalse();

        return newTemplate;
      } catch (createError) {
        debugError(
          'EmailTemplateHomeView.handleCreateTemplate',
          'Failed to create template',
          createError
        );
        toast.error(createError.message || 'Failed to create template');
        throw createError;
      }
    },
    [mutate, createDialog, accessToken]
  );

  const handleUpdateTemplate = useCallback(
    async (templateData) => {
      if (!selectedTemplate?.templateId) return undefined;

      try {
        debugLog('EmailTemplateHomeView.handleUpdateTemplate', 'Updating template', {
          templateId: selectedTemplate.templateId,
          templateData,
        });

        const updatedTemplate = await updateEmailTemplate(
          selectedTemplate.templateId,
          templateData,
          accessToken
        );

        toast.success('Email template updated successfully');
        mutate();
        editDialog.onFalse();
        setSelectedTemplate(null);

        return updatedTemplate;
      } catch (updateError) {
        debugError(
          'EmailTemplateHomeView.handleUpdateTemplate',
          'Failed to update template',
          updateError
        );
        toast.error(updateError.message || 'Failed to update template');
        throw updateError;
      }
    },
    [selectedTemplate, mutate, editDialog, accessToken]
  );

  const handleDeleteTemplate = useCallback(
    async (templateId) => {
      try {
        debugLog('EmailTemplateHomeView.handleDeleteTemplate', 'Deleting template', { templateId });

        await deleteEmailTemplate(templateId, accessToken);

        toast.success('Email template deleted successfully');
        mutate();
      } catch (deleteError) {
        debugError(
          'EmailTemplateHomeView.handleDeleteTemplate',
          'Failed to delete template',
          deleteError
        );
        toast.error(deleteError.message || 'Failed to delete template');
      }
    },
    [mutate, accessToken]
  );

  const handleEditTemplate = useCallback(
    (templateId) => {
      const template = templates.find((t) => t.templateId === templateId);
      if (template) {
        setSelectedTemplate(template);
        editDialog.onTrue();
      }
    },
    [templates, editDialog]
  );

  const handlePreviewTemplate = useCallback(
    (templateId) => {
      const template = templates.find((t) => t.templateId === templateId);
      if (template) {
        setPreviewTemplate(template);
        previewDialog.onTrue();
      }
    },
    [templates, previewDialog]
  );

  const handleDuplicateTemplate = useCallback(
    async (templateId) => {
      const template = templates.find((t) => t.templateId === templateId);
      if (!template) return;

      try {
        const duplicateData = {
          ...template,
          name: `${template.name} (Copy)`,
          templateId: undefined, // Remove ID to create new
          version: 1, // Reset version
        };

        await handleCreateTemplate(duplicateData);
      } catch {
        // Error already handled in handleCreateTemplate
      }
    },
    [templates, handleCreateTemplate]
  );

  const handleTestTemplate = useCallback(async (templateId, testData) => {
    try {
      debugLog('EmailTemplateHomeView.handleTestTemplate', 'Sending test email', { templateId });

      // TODO: Implement test email sending
      toast.info('Test email functionality not yet implemented');
    } catch (testError) {
      debugError(
        'EmailTemplateHomeView.handleTestTemplate',
        'Failed to send test email',
        testError
      );
      toast.error('Failed to send test email');
    }
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    editDialog.onFalse();
    setSelectedTemplate(null);
  }, [editDialog]);

  const handleClosePreviewDialog = useCallback(() => {
    previewDialog.onFalse();
    setPreviewTemplate(null);
  }, [previewDialog]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading email templates...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <ErrorView message="Failed to load email templates. Please try again." />
      </DashboardContent>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardContent data-cy="email-template-home-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />

        <Container maxWidth="xl">
          <CustomBreadcrumbs
            heading="Email Templates"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Email Templates' }]}
            action={
              <Button variant="contained" startIcon={<AddIcon />} onClick={createDialog.onTrue}>
                New Template
              </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />

          {templates.length === 0 ? (
            <Card>
              <EmptyContent
                filled
                title="No Email Templates"
                description="Create your first email template to get started with email management."
                action={
                  <Button variant="contained" startIcon={<AddIcon />} onClick={createDialog.onTrue}>
                    Create Template
                  </Button>
                }
              />
            </Card>
          ) : (
            <EmailTemplateTable
              templates={templates}
              loading={loading}
              onEditRow={handleEditTemplate}
              onDeleteRow={handleDeleteTemplate}
              onPreviewRow={handlePreviewTemplate}
              onDuplicateRow={handleDuplicateTemplate}
              onTestRow={handleTestTemplate}
            />
          )}
        </Container>

        {/* Create Template Dialog */}
        <EmailTemplateDialog
          open={createDialog.value}
          onClose={createDialog.onFalse}
          onSave={handleCreateTemplate}
        />

        {/* Edit Template Dialog */}
        <EmailTemplateDialog
          open={editDialog.value}
          onClose={handleCloseEditDialog}
          template={selectedTemplate}
          onSave={handleUpdateTemplate}
        />

        {/* Preview Template Dialog */}
        <EmailTemplatePreview
          open={previewDialog.value}
          onClose={handleClosePreviewDialog}
          template={previewTemplate}
          onSendTest={handleTestTemplate}
        />
      </DashboardContent>
    </ErrorBoundary>
  );
}
