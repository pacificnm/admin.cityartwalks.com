'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';

import { ViewIcon } from 'src/components/icons/view-icon';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { SettingsIcon } from 'src/components/icons/settings-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { DangerTriangleIcon } from 'src/components/icons/danger-triangle-icon';
import { ForbiddenCircleIcon } from 'src/components/icons/forbidden-circle-icon';

// ----------------------------------------------------------------------

const SubscriptionStatus = ({ status }) => {
  const statusConfig = {
    subscribed: {
      label: 'Subscribed',
      color: 'success',
      icon: <CheckCircleIcon sx={{ fontSize: 'small' }} />,
    },
    unsubscribed: {
      label: 'Unsubscribed',
      color: 'error',
      icon: <ForbiddenCircleIcon sx={{ fontSize: 'small' }} />,
    },
    bounced: {
      label: 'Bounced',
      color: 'warning',
      icon: <DangerTriangleIcon sx={{ fontSize: 'small' }} />,
    },
  };

  const config = statusConfig[status] || statusConfig.subscribed;

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

export function UserCommunicationList({ searchQuery, onUserSelect }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      debugLog('UserCommunicationList.fetchUsers', 'Fetching user communication data', {
        searchQuery,
        page,
        rowsPerPage,
      });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/communication?${new URLSearchParams({
      //   search: searchQuery,
      //   page: page.toString(),
      //   limit: rowsPerPage.toString()
      // })}`);
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        const mockUsers = Array.from(
          { length: Math.min(rowsPerPage, 150 - page * rowsPerPage) },
          (_, index) => {
            const userId = (page * rowsPerPage + index + 1).toString();
            const names = [
              'John Doe',
              'Jane Smith',
              'Bob Wilson',
              'Alice Johnson',
              'Charlie Brown',
              'Emma Davis',
              'Michael Jones',
              'Sarah Miller',
              'David Garcia',
              'Lisa Martinez',
            ];
            const domains = [
              'gmail.com',
              'yahoo.com',
              'hotmail.com',
              'example.com',
              'cityartwalks.com',
            ];
            const statuses = ['subscribed', 'unsubscribed', 'bounced'];

            const name = names[Math.floor(Math.random() * names.length)];
            const domain = domains[Math.floor(Math.random() * domains.length)];
            const email = `${name.toLowerCase().replace(' ', '.')}_${index}@${domain}`;
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            const totalSent = Math.floor(Math.random() * 100) + 10;
            const delivered = Math.floor(totalSent * (0.8 + Math.random() * 0.15));
            const opened = Math.floor(delivered * (0.3 + Math.random() * 0.4));
            const clicked = Math.floor(opened * (0.1 + Math.random() * 0.3));

            return {
              id: userId,
              name,
              email,
              avatar: null,
              subscriptionStatus: status,
              emailStats: {
                totalSent,
                delivered,
                opened,
                clicked,
                deliveryRate: (delivered / totalSent) * 100,
                openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
                clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
              },
              lastEmailSent: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              preferences: {
                newsletter: Math.random() > 0.3,
                notifications: Math.random() > 0.2,
                marketing: Math.random() > 0.6,
                transactional: true,
              },
              frequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)],
              joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            };
          }
        );

        // Apply search filtering
        let filteredUsers = mockUsers;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredUsers = mockUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
          );
        }

        setUsers(filteredUsers);
        setTotalCount(Math.min(150, filteredUsers.length + page * rowsPerPage));
        setLoading(false);
      }, 800);
    } catch (error) {
      debugError('UserCommunicationList.fetchUsers', 'Failed to fetch users', error);
      setLoading(false);
    }
  }, [searchQuery, page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleViewUser = useCallback(
    (user) => {
      debugLog('UserCommunicationList.handleViewUser', 'Viewing user details', { userId: user.id });
      router.push(`/dashboard/email/users/${user.id}`);
    },
    [router]
  );

  const handleManagePreferences = useCallback((user) => {
    debugLog('UserCommunicationList.handleManagePreferences', 'Managing user preferences', {
      userId: user.id,
    });
    // TODO: Implement preferences management
  }, []);

  const handleSendEmail = useCallback((user) => {
    debugLog('UserCommunicationList.handleSendEmail', 'Sending email to user', { userId: user.id });
    // TODO: Implement send email functionality
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email Stats</TableCell>
              <TableCell>Engagement</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Last Sent</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{user.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <SubscriptionStatus status={user.subscriptionStatus} />
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="caption">
                      Sent: {fNumber(user.emailStats.totalSent)} | Delivered:{' '}
                      {fNumber(user.emailStats.delivered)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={user.emailStats.deliveryRate}
                        sx={{ width: 60, height: 4 }}
                        color="success"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {fPercent(user.emailStats.deliveryRate)}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="caption">
                      Opens: {fPercent(user.emailStats.openRate)} | Clicks:{' '}
                      {fPercent(user.emailStats.clickRate)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={user.emailStats.openRate}
                        sx={{ width: 60, height: 4 }}
                        color="info"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {user.emailStats.opened} opens
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.frequency}
                    size="small"
                    variant="outlined"
                    color={
                      user.frequency === 'daily'
                        ? 'error'
                        : user.frequency === 'weekly'
                          ? 'warning'
                          : 'success'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{fDateTime(user.lastEmailSent)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewUser(user)}>
                        <ViewIcon sx={{ fontSize: 'small' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleSendEmail(user)}
                          disabled={user.subscriptionStatus === 'unsubscribed'}
                        >
                          <LetterIcon sx={{ fontSize: 'small' }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Manage Preferences">
                      <IconButton size="small" onClick={() => handleManagePreferences(user)}>
                        <SettingsIcon sx={{ fontSize: 'small' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
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
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </>
  );
}
