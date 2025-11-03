'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useClearIndexNowQueue,
  useProcessIndexNowQueue,
  useRetryFailedIndexNowSubmissions,
} from 'src/actions/index-now-submission/hooks';

import { useSettingsContext } from 'src/components/settings';
import { BackButton, RefreshButton } from 'src/components/index-now';
import {
  ClockIcon,
  RefreshIcon,
  SettingsIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * IndexNow Process View
 *
 * Provides manual processing interface for IndexNow submission queue:
 * - Manual queue processing and batch submission controls
 * - Real-time processing status and progress monitoring
 * - Configuration management for IndexNow API settings
 * - Emergency controls for queue management and error recovery
 * - Integration with IndexNow service for direct queue operations
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Processing|IndexNow Processing Documentation}
 */
export function IndexNowProcessView() {
  const settings = useSettingsContext();
  const { accessToken } = useAuthContext();

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Initialize hooks for batch operations
  const processQueue = useProcessIndexNowQueue(accessToken);
  const clearQueue = useClearIndexNowQueue(accessToken);
  const retryFailed = useRetryFailedIndexNowSubmissions(accessToken);

  const handleProcessQueue = async () => {
    try {
      setProcessing(true);
      setError(null);
      setResult(null);

      const processResult = await processQueue();
      setResult(processResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleClearQueue = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear all pending submissions? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setResult(null);

      const clearResult = await clearQueue();
      setResult(clearResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetryFailed = async () => {
    try {
      setProcessing(true);
      setError(null);
      setResult(null);

      const retryResult = await retryFailed();
      setResult(retryResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <BackButton href="/admin/index-now-submission" />
              <Typography variant="h4">IndexNow Processing</Typography>
            </Stack>
            <RefreshButton onClick={() => window.location.reload()} />
          </Stack>

          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <Alert severity="success" onClose={() => setResult(null)}>
              <Typography variant="subtitle2" gutterBottom>
                Operation Completed Successfully
              </Typography>
              <Typography variant="body2">
                {result.message || 'Operation completed successfully'}
              </Typography>
              {result.processed !== undefined && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Processed: {result.processed} | Failed: {result.failed || 0} | Total:{' '}
                  {result.total || 0}
                </Typography>
              )}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Manual Processing Section */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Manual Queue Processing
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        Process all pending IndexNow submissions manually. This will submit URLs to
                        the Microsoft Bing IndexNow API for immediate indexing.
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <LoadingButton
                        loading={processing}
                        startIcon={processing ? <ClockIcon /> : <ArrowRightIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleProcessQueue}
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : 'Process Queue'}
                      </LoadingButton>

                      <LoadingButton
                        loading={processing}
                        startIcon={processing ? <ClockIcon /> : <RefreshIcon />}
                        variant="outlined"
                        color="warning"
                        onClick={handleRetryFailed}
                        disabled={processing}
                      >
                        {processing ? 'Retrying...' : 'Retry Failed'}
                      </LoadingButton>

                      <LoadingButton
                        loading={processing}
                        startIcon={processing ? <ClockIcon /> : <SettingsIcon />}
                        variant="outlined"
                        color="error"
                        onClick={handleClearQueue}
                        disabled={processing}
                      >
                        {processing ? 'Clearing...' : 'Clear Queue'}
                      </LoadingButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Processing Status */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Processing Status
                      </Typography>
                    </Box>

                    {processing && (
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <RefreshIcon />
                          <Typography variant="body2">Processing submissions...</Typography>
                        </Stack>
                        <LinearProgress />
                      </Box>
                    )}

                    {!processing && (
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="body2">Ready for processing</Typography>
                        </Stack>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Configuration Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        IndexNow Configuration
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        IndexNow submissions are automatically queued when content is created or
                        updated. Use the manual processing controls above to submit pending URLs to
                        the IndexNow API.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Supported Operations:
                      </Typography>
                      <Stack spacing={1} sx={{ pl: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          • Process Queue: Submit all pending URLs to IndexNow API
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Retry Failed: Reprocess previously failed submissions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Clear Queue: Remove all pending submissions (cannot be undone)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Individual Processing: Available via submission detail view
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </DashboardContent>
  );
}
