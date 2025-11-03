'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';
import { useGetPaginatedEmails } from 'src/actions/email/hooks';

import {
  ViewIcon,
  LetterIcon,
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
    failed: { label: 'Failed', color: 'error', icon: () => <CloseCircleIcon size={16} /> },
    pending: { label: 'Pending', color: 'warning', icon: () => <ClockCircleIcon size={16} /> },
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

export function EmailRecentTable() {
  const { accessToken } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    emails,
    paginationMeta,
    emailsLoading: loading,
    mutate,
  } = useGetPaginatedEmails({}, page + 1, rowsPerPage, accessToken ?? '', 600);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    mutate();
  };

  const handleViewEmail = (emailId) => {
    debugLog('EmailRecentTable.handleViewEmail', 'View email details', { emailId });
    // TODO: Implement view email details
  };

  const handleResendEmail = (emailId) => {
    debugLog('EmailRecentTable.handleResendEmail', 'Resend email', { emailId });
    // TODO: Implement resend email
  };

  return (
    <Card>
      <CardHeader
        title="Recent Emails"
        action={
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        }
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Sent At</TableCell>
                  <TableCell>Delivered At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emails.map((email) => {
                  const recipient = email.User || {
                    name: 'Unknown',
                    email: email.recipientEmail || email.email || 'N/A',
                  };
                  const templateName = email.EmailTemplate?.name || email.emailType || 'Unknown';

                  return (
                    <TableRow key={email.emailId} hover>
                      <TableCell>
                        <Typography variant="body2">{recipient.name || recipient.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }} noWrap>
                          {email.subject || email.description || 'No Subject'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={templateName.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
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
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewEmail(email.emailId)}>
                            <ViewIcon size={16} />
                          </IconButton>
                        </Tooltip>
                        {email.deliveryStatus === 'failed' && (
                          <Tooltip title="Resend">
                            <IconButton
                              size="small"
                              onClick={() => handleResendEmail(email.emailId)}
                            >
                              <RefreshIcon size={16} />
                            </IconButton>
                          </Tooltip>
                        )}
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
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Card>
  );
}
