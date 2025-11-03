'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';
import { useGetPaginatedEmails } from 'src/actions/email/hooks';

import {
  ViewIcon,
  LetterIcon,
  CursorIcon,
  RefreshIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  ClockCircleIcon,
  LetterOpenedIcon,
} from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const StatusChip = ({ status }) => {
  const statusConfig = {
    sent: { label: 'Sent', color: 'primary', icon: () => <LetterIcon size={16} /> },
    delivered: { label: 'Delivered', color: 'success', icon: () => <CheckCircleIcon size={16} /> },
    opened: { label: 'Opened', color: 'info', icon: () => <LetterOpenedIcon size={16} /> },
    clicked: { label: 'Clicked', color: 'secondary', icon: () => <CursorIcon size={16} /> },
    failed: { label: 'Failed', color: 'error', icon: () => <CloseCircleIcon size={16} /> },
    pending: { label: 'Pending', color: 'warning', icon: () => <ClockCircleIcon size={16} /> },
    bounced: { label: 'Bounced', color: 'error', icon: () => <CloseCircleIcon size={16} /> },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon()}
      variant="soft"
    />
  );
};

// ----------------------------------------------------------------------

export function EmailListTable({ filters, onSelectEmails, onViewEmail, refreshKey }) {
  const { accessToken } = useAuthContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Build filters for the hook
  const hookFilters = {
    search: filters.searchQuery || '',
    recordType: filters.status !== 'all' ? filters.status : '',
    email: '', // Could be used for filtering by recipient email
    userId: '', // Could be used for filtering by user
  };

  const {
    emails,
    paginationMeta,
    emailsLoading: loading,
    emailsEmpty,
  } = useGetPaginatedEmails(hookFilters, page + 1, rowsPerPage, accessToken ?? '', 600, refreshKey);

  const handleSelectAll = useCallback(
    (event) => {
      const newSelectedIds = event.target.checked ? emails.map((email) => email.emailId) : [];
      setSelectedIds(newSelectedIds);
      onSelectEmails(newSelectedIds);
    },
    [emails, onSelectEmails]
  );

  const handleSelectOne = useCallback(
    (emailId) => {
      const selectedIndex = selectedIds.indexOf(emailId);
      const newSelectedIds = [...selectedIds];

      if (selectedIndex === -1) {
        newSelectedIds.push(emailId);
      } else {
        newSelectedIds.splice(selectedIndex, 1);
      }

      setSelectedIds(newSelectedIds);
      onSelectEmails(newSelectedIds);
    },
    [selectedIds, onSelectEmails]
  );

  const handleChangePage = useCallback(
    (_, newPage) => {
      setPage(newPage);
      setSelectedIds([]);
      onSelectEmails([]);
    },
    [onSelectEmails]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
      setSelectedIds([]);
      onSelectEmails([]);
    },
    [onSelectEmails]
  );

  const handleViewEmail = useCallback(
    (email) => {
      onViewEmail(email);
    },
    [onViewEmail]
  );

  const handleResendEmail = useCallback((emailId) => {
    debugLog('EmailListTable.handleResendEmail', 'Resend email', { emailId });
    // TODO: Implement resend functionality
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (emailsEmpty) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="body2" color="text.secondary">
          No emails found
        </Typography>
      </Box>
    );
  }

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;
  const selectedAllEmails = emails.length > 0 && selectedIds.length === emails.length;
  const selectedSomeEmails = selectedIds.length > 0 && selectedIds.length < emails.length;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedSomeEmails}
                  checked={selectedAllEmails}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Sent At</TableCell>
              <TableCell>Opened At</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => {
              const isItemSelected = isSelected(email.emailId);
              const recipient = email.User || {
                name: 'Unknown',
                email: email.recipientEmail || email.email || 'N/A',
              };
              const templateName = email.EmailTemplate?.name || email.emailType || 'Unknown';

              return (
                <TableRow key={email.emailId} hover selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleSelectOne(email.emailId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {recipient.name
                          ? recipient.name.charAt(0)
                          : recipient.email?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {recipient.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {recipient.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
                      {email.subject || email.description || 'No Subject'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={templateName.replace('_', ' ')} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={email.deliveryStatus} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {email.sentAt ? fDateTime(email.sentAt) : fDateTime(email.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {email.deliveredAt ? fDateTime(email.deliveredAt) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">-</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewEmail(email)}>
                          <ViewIcon size={16} />
                        </IconButton>
                      </Tooltip>
                      {email.deliveryStatus === 'failed' && (
                        <Tooltip title="Resend">
                          <IconButton size="small" onClick={() => handleResendEmail(email.emailId)}>
                            <RefreshIcon size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={paginationMeta.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </>
  );
}
