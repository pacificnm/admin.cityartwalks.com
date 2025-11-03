/**
 * @fileoverview IndexNow Submission Detail View Component
 *
 * Detailed management interface for individual IndexNow URL submissions providing
 * comprehensive oversight of submission status, response data, and retry operations.
 * This view serves as the primary interface for debugging and managing individual
 * URL submissions within the SEO automation workflow.
 *
 * @namespace CityArtWalks.Sections.IndexNowSubmission.View
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for UI structure
 * @requires src/routes - Application routing and navigation
 * @requires src/lib/debug - Debug logging utilities
 * @requires src/layouts/dashboard - Dashboard layout components
 * @requires src/components/settings - Settings context and utilities
 * @requires src/components/icons - Icon components library
 * @requires src/auth/hooks - Authentication context and utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Detail-View} - IndexNow Detail View Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Automation} - SEO Automation Overview
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface} - Admin Interface Guidelines
 * @see {@link https://www.indexnow.org/documentation} - IndexNow API Documentation
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetIndexNowSubmissionById,
  useProcessIndexNowSubmission,
} from 'src/actions/index-now-submission/hooks';

import { StatusChip } from 'src/components/index-now';
import { ErrorView } from 'src/components/error/error-view';
import { useSettingsContext } from 'src/components/settings';
import { SendIcon, ArrowLeftIcon } from 'src/components/icons';
import { ErrorBoundary } from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

import { IndexNowSubmissionDetailSkeleton } from '../index-now-submission-detail-skeleton';

// ----------------------------------------------------------------------

export function IndexNowSubmissionDetailView({ submissionId }) {
  const settings = useSettingsContext();
  const { accessToken } = useAuthContext();

  const {
    indexNowSubmission: submission,
    indexNowSubmissionLoading: loading,
    indexNowSubmissionError: hookError,
  } = useGetIndexNowSubmissionById(submissionId, accessToken);

  const processSubmission = useProcessIndexNowSubmission(accessToken);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleProcess = async () => {
    try {
      setProcessing(true);
      setError(null);

      const result = await processSubmission(submissionId);
      debugLog('IndexNowSubmissionDetailView.handleProcess', 'Processing completed', result);

      // Note: processSubmission() already handles cache invalidation for both
      // the detail view and list view, so no manual refresh is needed
    } catch (err) {
      debugLog('IndexNowSubmissionDetailView.handleProcess', 'Processing error', err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <IndexNowSubmissionDetailSkeleton />;
  if (error || hookError)
    return (
      <ErrorView
        message={error || hookError?.message || 'Failed to load IndexNow submission'}
        error={hookError}
        status={500}
      />
    );
  if (!submission) return <ErrorView message="Submission not found" status={404} />;

  return (
    <ErrorBoundary fallback="Failed to load IndexNow submission details. Please refresh the page or contact support if the issue persists.">
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Button
                    component={RouterLink}
                    href={paths.dashboard.indexNow.root}
                    startIcon={<ArrowLeftIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Back to List
                  </Button>
                </Stack>
                <Typography variant="h4" gutterBottom>
                  Submission #{submission.indexNowSubmissionId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed information and management for this IndexNow submission
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {(submission.status === 'PENDING' || submission.status === 'FAILED') && (
                  <Button
                    variant="contained"
                    onClick={handleProcess}
                    loading={processing}
                    startIcon={<SendIcon />}
                    color="primary"
                  >
                    Submit to IndexNow
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Error Message */}
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Submission ID:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.indexNowSubmissionId}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        <StatusChip status={submission.status} />
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Entity Type:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.entityType}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Entity ID:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.entityId}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Action:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.action}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Created:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {fDateTime(submission.createdAt)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Updated:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {fDateTime(submission.updatedAt)}
                        </Typography>
                      </Stack>

                      {submission.submittedAt && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Submitted:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {fDateTime(submission.submittedAt)}
                          </Typography>
                        </Stack>
                      )}

                      {submission.responseCode !== null &&
                        submission.responseCode !== undefined && (
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Response Code:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              color={
                                submission.responseCode >= 200 && submission.responseCode < 300
                                  ? 'success.main'
                                  : 'error.main'
                              }
                            >
                              {submission.responseCode}
                            </Typography>
                          </Stack>
                        )}

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Created By ID:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.createdBy}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Updated By ID:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.updatedBy}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* URL Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  URL Information
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {submission.url}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Response Information */}
            {submission.responseBody && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    IndexNow API Response
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Response Code:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color={
                              submission.responseCode >= 200 && submission.responseCode < 300
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            {submission.responseCode}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Response Status:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color={
                              submission.responseCode >= 200 && submission.responseCode < 300
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            {submission.responseCode >= 200 && submission.responseCode < 300
                              ? 'Success'
                              : 'Error'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Response Body:
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor:
                            submission.responseCode >= 200 && submission.responseCode < 300
                              ? 'success.lighter'
                              : 'error.lighter',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor:
                            submission.responseCode >= 200 && submission.responseCode < 300
                              ? 'success.light'
                              : 'error.light',
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                          sx={{ wordBreak: 'break-all' }}
                        >
                          {submission.responseBody}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* User Information */}
            {(submission.Creator || submission.Updater) && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Information
                  </Typography>
                  <Grid container spacing={3}>
                    {submission.Creator && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Created By:
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              User ID:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Creator.userId}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Creator.name}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Email:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Creator.email}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Display Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Creator.displayName}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Role:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              {submission.Creator.role}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    )}

                    {submission.Updater && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Updated By:
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              User ID:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Updater.userId}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Updater.name}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Email:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Updater.email}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Display Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.Updater.displayName}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Role:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              {submission.Updater.role}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Entity Information */}
            {submission.entity && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Related Entity
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(submission.entity).map(([key, value]) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={key}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            {key}:
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ wordBreak: 'break-all' }}
                          >
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Audit Trail */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Audit Trail
                </Typography>
                <Stack spacing={2}>
                  {submission.createdBy && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Created by:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        User {submission.createdBy}
                      </Typography>
                    </Stack>
                  )}

                  {submission.updatedBy && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Updated by:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        User {submission.updatedBy}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </DashboardContent>
    </ErrorBoundary>
  );
}
