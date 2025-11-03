/**
 * @fileoverview IndexNow Submission List View Component
 *
 * Comprehensive management interface for IndexNow URL submissions providing
 * complete administrative control over SEO automation submissions. This view
 * serves as the primary dashboard for monitoring URL submission status,
 * processing queues, and managing search engine indexing operations.
 *
 * @namespace CityArtWalks.Sections.IndexNowSubmission.View
 * @version 2.0.0
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
 * @requires src/components/index-now - IndexNow-specific UI components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Dashboard} - IndexNow Dashboard Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Automation} - SEO Automation Overview
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface} - Admin Interface Guidelines
 * @see {@link https://www.indexnow.org/documentation} - IndexNow API Documentation
 */

'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { debugLog } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { ErrorBoundary } from 'src/components/error/error-boundary';
import { ChartIcon, DownloadIcon, SettingsIcon } from 'src/components/icons';
import {
  RefreshButton,
  IndexNowFilters,
  IndexNowListTable,
  IndexNowBulkActions,
  IndexNowDetailDialog,
  IndexNowExportDialog,
} from 'src/components/index-now';

export function IndexNowSubmissionListView() {
  const settings = useSettingsContext();

  const [filters, setFilters] = useState({
    status: 'all',
    entityType: 'all',
    action: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Handles filter changes from the filter component
   * Updates filter state and logs the change for debugging
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleFilterChange
   * @param {Object} newFilters - New filter configuration object
   * @param {string} newFilters.status - Updated status filter
   * @param {string} newFilters.entityType - Updated entity type filter
   * @param {string} newFilters.action - Updated action filter
   * @param {string} newFilters.dateRange - Updated date range filter
   * @param {string} newFilters.searchQuery - Updated search query
   *
   * @example
   * handleFilterChange({
   *   status: 'pending',
   *   entityType: 'ART_PIECE',
   *   action: 'CREATED',
   *   dateRange: 'week',
   *   searchQuery: 'sculptures'
   * });
   */
  const handleFilterChange = useCallback((newFilters) => {
    debugLog('IndexNowSubmissionListView.handleFilterChange', 'Filters updated', newFilters);
    setFilters(newFilters);
  }, []);

  /**
   * Handles submission selection changes from the table component
   * Updates selected submissions for bulk operations and logs selection
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleSubmissionSelect
   * @param {number[]} submissionIds - Array of selected submission IDs
   *
   * @example
   * handleSubmissionSelect([123, 456, 789]);
   */
  const handleSubmissionSelect = useCallback((submissionIds) => {
    debugLog(
      'IndexNowSubmissionListView.handleSubmissionSelect',
      'Submissions selected',
      submissionIds
    );
    setSelectedSubmissions(submissionIds);
  }, []);

  /**
   * Handles viewing individual submission details
   * Opens detail dialog with selected submission data
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleSubmissionView
   * @param {Object} submission - Complete submission object from API
   * @param {number} submission.indexNowSubmissionId - Unique submission identifier
   * @param {string} submission.url - Submitted URL
   * @param {string} submission.status - Current submission status
   * @param {string} submission.entityType - Type of entity being submitted
   * @param {Object} submission.responseData - API response data if available
   *
   * @example
   * handleSubmissionView({
   *   indexNowSubmissionId: 123,
   *   url: 'https://example.com/art/sculpture-1',
   *   status: 'SUBMITTED',
   *   entityType: 'ART_PIECE',
   *   responseData: { code: 200, message: 'Success' }
   * });
   */

  /**
   * Closes the submission detail dialog
   * Clears selected submission and hides detail modal
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleCloseDetailDialog
   */
  const handleCloseDetailDialog = useCallback(() => {
    setDetailDialogOpen(false);
    setSelectedSubmission(null);
  }, []);

  /**
   * Handles bulk actions on selected submissions
   * Processes multiple submissions and triggers data refresh
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleBulkAction
   * @param {string} action - Type of bulk action to perform
   *   - 'resubmit': Resubmit failed or pending submissions
   *   - 'delete': Remove submissions from queue
   *   - 'export': Export selected submissions
   *
   * @example
   * handleBulkAction('resubmit'); // Resubmit selected submissions
   * handleBulkAction('delete');   // Delete selected submissions
   */
  const handleBulkAction = useCallback(
    (action) => {
      debugLog('IndexNowSubmissionListView.handleBulkAction', 'Bulk action performed', {
        action,
        count: selectedSubmissions.length,
      });
      // TODO: Implement bulk actions via IndexNow service
      setSelectedSubmissions([]);
      setRefreshKey((prev) => prev + 1);
    },
    [selectedSubmissions]
  );

  /**
   * Opens the export configuration dialog
   * Allows users to configure and download submission data
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleExport
   *
   * @example
   * handleExport(); // Opens export dialog with current filters
   */
  const handleExport = useCallback(() => {
    debugLog('IndexNowSubmissionListView.handleExport', 'Opening export dialog');
    setExportDialogOpen(true);
  }, []);

  /**
   * Handles manual data refresh
   * Triggers revalidation of submission data and updates UI
   *
   * @memberof CityArtWalks.Sections.IndexNowSubmission.View
   * @function handleRefresh
   *
   * @example
   * handleRefresh(); // Manually refresh all submission data
   */
  const handleRefresh = useCallback(() => {
    debugLog('IndexNowSubmissionListView.handleRefresh', 'Refreshing submission list');
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <ErrorBoundary fallback="Failed to load IndexNow submissions dashboard. Please refresh the page or contact support if the issue persists.">
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" gutterBottom>
                  IndexNow Submissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor and manage URL submissions to search engines via IndexNow API
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.indexNow.stats}
                  startIcon={<ChartIcon />}
                  variant="outlined"
                >
                  Statistics
                </Button>

                <Button
                  component={RouterLink}
                  href={paths.dashboard.indexNow.process}
                  startIcon={<SettingsIcon />}
                  variant="outlined"
                >
                  Process Queue
                </Button>

                <RefreshButton onClick={handleRefresh} iconOnly />

                <IconButton onClick={handleExport} title="Export Data">
                  <DownloadIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Card>
              <IndexNowFilters filters={filters} onFiltersChange={handleFilterChange} />
            </Card>

            {selectedSubmissions.length > 0 && (
              <IndexNowBulkActions
                selectedIds={selectedSubmissions}
                onBulkAction={handleBulkAction}
                onClearSelection={() => setSelectedSubmissions([])}
              />
            )}
            <Card>
              <IndexNowListTable
                filters={filters}
                onSelectSubmissions={handleSubmissionSelect}
                refreshKey={refreshKey}
              />
            </Card>
          </Stack>

          <IndexNowDetailDialog
            open={detailDialogOpen}
            onClose={handleCloseDetailDialog}
            submission={selectedSubmission}
          />

          <IndexNowExportDialog
            open={exportDialogOpen}
            onClose={() => setExportDialogOpen(false)}
            filters={filters}
          />
        </Container>
      </DashboardContent>
    </ErrorBoundary>
  );
}
