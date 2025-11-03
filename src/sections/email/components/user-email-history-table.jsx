'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { debugLog, debugError } from 'src/lib/debug';

import { ViewIcon } from 'src/components/icons/view-icon';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { CursorIcon } from 'src/components/icons/cursor-icon';
import { RefreshIcon } from 'src/components/icons/refresh-icon';
import { CloseCircleIcon } from 'src/components/icons/close-circle-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { ClockCircleIcon } from 'src/components/icons/clock-circle-icon';
import { LetterOpenedIcon } from 'src/components/icons/letter-opened-icon';

// ----------------------------------------------------------------------

const StatusChip = ({ status }) => {
  const statusConfig = {
    sent: { label: 'Sent', color: 'primary', icon: <LetterIcon sx={{ fontSize: 'small' }} /> },
    delivered: {
      label: 'Delivered',
      color: 'success',
      icon: <CheckCircleIcon sx={{ fontSize: 'small' }} />,
    },
    opened: {
      label: 'Opened',
      color: 'info',
      icon: <LetterOpenedIcon sx={{ fontSize: 'small' }} />,
    },
    clicked: {
      label: 'Clicked',
      color: 'secondary',
      icon: <CursorIcon sx={{ fontSize: 'small' }} />,
    },
    bounced: {
      label: 'Bounced',
      color: 'error',
      icon: <CloseCircleIcon sx={{ fontSize: 'small' }} />,
    },
    failed: {
      label: 'Failed',
      color: 'error',
      icon: <CloseCircleIcon sx={{ fontSize: 'small' }} />,
    },
    pending: {
      label: 'Pending',
      color: 'warning',
      icon: <ClockCircleIcon sx={{ fontSize: 'small' }} />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon}
      variant="soft"
    />
  );
};

// ----------------------------------------------------------------------

export function UserEmailHistoryTable({ userId }) {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEmailHistory = useCallback(async () => {
    try {
      debugLog('UserEmailHistoryTable.fetchEmailHistory', 'Fetching user email history', {
        userId,
        page,
        rowsPerPage,
      });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${userId}/emails?page=${page}&limit=${rowsPerPage}`);
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        const templates = [
          'welcome',
          'weekly_digest',
          'art_notification',
          'path_approved',
          'newsletter',
          'password_reset',
        ];
        const statuses = ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'];

        const mockEmails = Array.from(
          { length: Math.min(rowsPerPage, 50 - page * rowsPerPage) },
          (_, index) => {
            const emailId = (page * rowsPerPage + index + 1).toString();
            const template = templates[Math.floor(Math.random() * templates.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const sentAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

            return {
              id: emailId,
              subject: getSubjectForTemplate(template),
              template,
              status,
              sentAt,
              openedAt: ['opened', 'clicked'].includes(status)
                ? new Date(sentAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
                : null,
              clickCount: status === 'clicked' ? Math.floor(Math.random() * 5) + 1 : 0,
              metadata: {
                campaign: `${template}_campaign`,
                device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
                location: ['New York', 'Los Angeles', 'Chicago'][Math.floor(Math.random() * 3)],
                deliveryTime: Math.floor(Math.random() * 300) + 30,
              },
            };
          }
        );

        setEmails(mockEmails);
        setTotalCount(50); // Mock total count
        setLoading(false);
      }, 600);
    } catch (error) {
      debugError('UserEmailHistoryTable.fetchEmailHistory', 'Failed to fetch email history', error);
      setLoading(false);
    }
  }, [userId, page, rowsPerPage]);

  useEffect(() => {
    if (userId) {
      fetchEmailHistory();
    }
  }, [userId, fetchEmailHistory]);

  const getSubjectForTemplate = (template) => {
    const subjects = {
      welcome: 'Welcome to City Art Walks!',
      weekly_digest: 'Your Weekly Art Walk Digest',
      art_notification: 'New Art Piece Added Near You',
      path_approved: 'Your Path Has Been Approved',
      newsletter: 'Monthly Newsletter',
      password_reset: 'Password Reset Request',
    };
    return subjects[template] || 'Email Notification';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewEmail = (email) => {
    debugLog('UserEmailHistoryTable.handleViewEmail', 'View email details', { emailId: email.id });
    // TODO: Implement view email details
  };

  const handleResendEmail = (email) => {
    debugLog('UserEmailHistoryTable.handleResendEmail', 'Resend email', { emailId: email.id });
    // TODO: Implement resend email
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CardHeader title="Email History" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
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
            {emails.map((email) => (
              <TableRow key={email.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 250 }} noWrap>
                    {email.subject}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={email.template.replace('_', ' ')} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <StatusChip status={email.status} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{fDateTime(email.sentAt)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {email.openedAt ? fDateTime(email.openedAt) : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {email.clickCount > 0 ? email.clickCount : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewEmail(email)}>
                      <ViewIcon sx={{ fontSize: 'small' }} />
                    </IconButton>
                  </Tooltip>
                  {['failed', 'bounced'].includes(email.status) && (
                    <Tooltip title="Resend">
                      <IconButton size="small" onClick={() => handleResendEmail(email)}>
                        <RefreshIcon sx={{ fontSize: 'small' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </>
  );
}
