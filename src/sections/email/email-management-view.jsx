'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { debugLog } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { RefreshIcon, DownloadIcon } from 'src/components/icons';

import { EmailFilters } from './components/email-filters';
import { EmailListTable } from './components/email-list-table';
import { EmailBulkActions } from './components/email-bulk-actions';
import { EmailDetailDialog } from './components/email-detail-dialog';
import { EmailExportDialog } from './components/email-export-dialog';

// ----------------------------------------------------------------------

export function EmailManagementView() {
  const settings = useSettingsContext();

  const [filters, setFilters] = useState({
    status: 'all',
    template: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFilterChange = useCallback((newFilters) => {
    debugLog('EmailManagementView.handleFilterChange', 'Filters updated', newFilters);
    setFilters(newFilters);
  }, []);

  const handleEmailSelect = useCallback((emailIds) => {
    debugLog('EmailManagementView.handleEmailSelect', 'Emails selected', emailIds);
    setSelectedEmails(emailIds);
  }, []);

  const handleEmailView = useCallback((email) => {
    debugLog('EmailManagementView.handleEmailView', 'View email details', { emailId: email.id });
    setSelectedEmail(email);
    setDetailDialogOpen(true);
  }, []);

  const handleCloseDetailDialog = useCallback(() => {
    setDetailDialogOpen(false);
    setSelectedEmail(null);
  }, []);

  const handleBulkAction = useCallback(
    (action) => {
      debugLog('EmailManagementView.handleBulkAction', 'Bulk action performed', {
        action,
        count: selectedEmails.length,
      });
      // TODO: Implement bulk actions
      setSelectedEmails([]);
      setRefreshKey((prev) => prev + 1);
    },
    [selectedEmails]
  );

  const handleExport = useCallback(() => {
    debugLog('EmailManagementView.handleExport', 'Opening export dialog');
    setExportDialogOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    debugLog('EmailManagementView.handleRefresh', 'Refreshing email list');
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4">Email Management</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
                Export
              </Button>
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Filters */}
          <EmailFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Bulk Actions */}
          {selectedEmails.length > 0 && (
            <EmailBulkActions selectedCount={selectedEmails.length} onAction={handleBulkAction} />
          )}

          {/* Email List Table */}
          <Card>
            <EmailListTable
              filters={filters}
              onSelectEmails={handleEmailSelect}
              onViewEmail={handleEmailView}
              refreshKey={refreshKey}
            />
          </Card>
        </Stack>

        {/* Email Detail Dialog */}
        <EmailDetailDialog
          open={detailDialogOpen}
          email={selectedEmail}
          onClose={handleCloseDetailDialog}
        />

        {/* Export Dialog */}
        <EmailExportDialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          filters={filters}
        />
      </Container>
    </DashboardContent>
  );
}
