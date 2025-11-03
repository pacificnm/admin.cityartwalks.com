/**
 * Notification Delivery Dashboard Component
 *
 * This component provides a comprehensive admin interface for monitoring
 * notification delivery status, statistics, and performance metrics.
 * It includes filtering, search, and retry capabilities.
 *
 * @namespace CityArtWalks.Components.NotificationDelivery
 * @fileoverview Admin dashboard for notification delivery tracking
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Material-UI} Material-UI - UI components
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuth - Authentication context
 * @requires CityArtWalks.Actions.NotificationDelivery.Hooks - Data fetching hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Notification-Delivery} - Delivery tracking documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface} - Admin interface patterns
 */

import { format } from 'date-fns';
import React, { useMemo, useState, useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Tab,
  Card,
  Chip,
  Grid,
  Tabs,
  Alert,
  Paper,
  Stack,
  Table,
  Button,
  Select,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  CardContent,
  FormControl,
  LinearProgress,
  TableContainer,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import {
  useDeliveryActions,
  useDeliveryRecords,
  useDeliveryStatistics,
} from 'src/actions/notification-delivery/hooks';

import Iconify from 'src/components/iconify';
import { RestartIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.NotificationDelivery
 * @description Delivery status constants with display configuration
 * @constant {Object} DELIVERY_STATUS_CONFIG
 */
const DELIVERY_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'warning',
    icon: 'solar:restart-bold',
    description: 'Waiting to be sent',
  },
  sent: {
    label: 'Sent',
    color: 'info',
    icon: 'solar:export-bold',
    description: 'Successfully sent to provider',
  },
  delivered: {
    label: 'Delivered',
    color: 'success',
    icon: 'solar:inbox-in-bold',
    description: 'Confirmed delivery to recipient',
  },
  failed: {
    label: 'Failed',
    color: 'error',
    icon: 'solar:danger-bold',
    description: 'Delivery attempt failed',
  },
  bounced: {
    label: 'Bounced',
    color: 'error',
    icon: 'solar:danger-triangle-bold',
    description: 'Message bounced back',
  },
  read: {
    label: 'Read',
    color: 'success',
    icon: 'solar:eye-bold',
    description: 'Message opened by recipient',
  },
  expired: {
    label: 'Expired',
    color: 'default',
    icon: 'solar:danger-triangle-bold',
    description: 'Message expired before delivery',
  },
};

/**
 * @memberof CityArtWalks.Components.NotificationDelivery
 * @description Delivery channel constants with display configuration
 * @constant {Object} DELIVERY_CHANNEL_CONFIG
 */
const DELIVERY_CHANNEL_CONFIG = {
  email: { label: 'Email', icon: 'solar:inbox-bold', color: '#1976d2' },
  inApp: { label: 'In-App', icon: 'solar:inbox-in-bold', color: '#9c27b0' },
  push: { label: 'Push', icon: 'solar:smartphone-2-bold', color: '#f57c00' },
  sms: { label: 'SMS', icon: 'solar:phone-bold', color: '#388e3c' },
};

/**
 * Statistics Card Component
 *
 * @memberof CityArtWalks.Components.NotificationDelivery
 * @function StatCard
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Primary value
 * @param {string} [props.subtitle] - Additional information
 * @param {string} [props.color='primary'] - Theme color
 * @param {ReactComponent} [props.icon] - Display icon
 * @returns {ReactElement} Statistics card component
 */
function StatCard({ title, value, subtitle, color = 'primary', icon }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" color={`${color}.main`} fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Iconify icon={icon} sx={{ fontSize: 48, color: `${color}.main`, opacity: 0.7 }} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Delivery Record Row Component
 *
 * @memberof CityArtWalks.Components.NotificationDelivery
 * @function DeliveryRow
 * @param {Object} props - Component props
 * @param {Object} props.delivery - Delivery record
 * @param {Function} props.onRetry - Retry callback function
 * @param {boolean} props.retrying - Whether retry is in progress
 * @returns {ReactElement} Table row component
 */
function DeliveryRow({ delivery, onRetry, retrying }) {
  const statusConfig = DELIVERY_STATUS_CONFIG[delivery.status] || DELIVERY_STATUS_CONFIG.pending;
  const channelConfig = DELIVERY_CHANNEL_CONFIG[delivery.channel] || DELIVERY_CHANNEL_CONFIG.email;

  const canRetry = delivery.status === 'failed' && delivery.attemptCount < 3;

  return (
    <TableRow hover>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Iconify icon={channelConfig.icon} sx={{ color: channelConfig.color, fontSize: 20 }} />
          <Typography variant="body2">{channelConfig.label}</Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {delivery.Notification?.User?.email || delivery.recipientEmail || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Iconify icon={statusConfig.icon} sx={{ fontSize: 16 }} />
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            variant="outlined"
          />
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2" fontWeight="bold">
          {delivery.attemptCount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {delivery.createdAt ? format(new Date(delivery.createdAt), 'MMM dd, HH:mm') : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {delivery.sentAt ? format(new Date(delivery.sentAt), 'MMM dd, HH:mm') : '-'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {delivery.deliveredAt ? format(new Date(delivery.deliveredAt), 'MMM dd, HH:mm') : '-'}
        </Typography>
      </TableCell>
      <TableCell>
        {delivery.errorMessage && (
          <Tooltip title={delivery.errorMessage}>
            <Typography
              variant="body2"
              color="error"
              sx={{
                maxWidth: 150,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {delivery.errorMessage}
            </Typography>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        {canRetry && (
          <Tooltip title="Retry delivery">
            <IconButton
              size="small"
              onClick={() => onRetry(delivery.deliveryId)}
              disabled={retrying}
            >
              {retrying ? <CircularProgress size={16} /> : <RestartIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
}

/**
 * Main Notification Delivery Dashboard Component
 *
 * @memberof CityArtWalks.Components.NotificationDelivery
 * @function NotificationDeliveryDashboard
 * @returns {ReactElement} Dashboard component
 */
export function NotificationDeliveryDashboard() {
  const { user, getAccessToken } = useAuthContext();
  const [accessToken, setAccessToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [retryingDeliveries, setRetryingDeliveries] = useState(new Set());

  // Filter states
  const [filters, setFilters] = useState({
    page: 0,
    limit: 20,
    channel: '',
    status: '',
    fromDate: null,
    toDate: null,
    userId: '',
    notificationId: '',
  });

  // Statistics date range
  const [statsDateRange, setStatsDateRange] = useState({
    fromDate: null,
    toDate: null,
    channel: '',
  });

  // Get access token
  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
      } catch (error) {
        debugError('NotificationDeliveryDashboard.getToken', error);
      }
    }
    if (user) {
      getToken();
    }
  }, [user, getAccessToken]);

  // Data fetching hooks
  const {
    deliveries,
    pagination,
    availableFilters,
    error: deliveriesError,
    isLoading: deliveriesLoading,
    mutate: refreshDeliveries,
  } = useDeliveryRecords(filters, accessToken);

  const {
    statistics,
    error: statisticsError,
    isLoading: statisticsLoading,
    mutate: refreshStatistics,
  } = useDeliveryStatistics(statsDateRange, accessToken);

  const { retryDelivery } = useDeliveryActions(accessToken);

  // Filter handlers
  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 0, // Reset page when filters change
    }));
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 0,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 0,
      limit: 20,
      channel: '',
      status: '',
      fromDate: null,
      toDate: null,
      userId: '',
      notificationId: '',
    });
  }, []);

  // Retry handler
  const handleRetry = useCallback(
    async (deliveryId) => {
      if (!accessToken) return;

      setRetryingDeliveries((prev) => new Set(prev).add(deliveryId));

      try {
        debugLog('NotificationDeliveryDashboard.handleRetry', `Retrying delivery ${deliveryId}`);

        await retryDelivery(deliveryId);
        await refreshDeliveries();

        debugLog(
          'NotificationDeliveryDashboard.handleRetry',
          `Successfully retried delivery ${deliveryId}`
        );
      } catch (error) {
        debugError('NotificationDeliveryDashboard.handleRetry', error);
      } finally {
        setRetryingDeliveries((prev) => {
          const next = new Set(prev);
          next.delete(deliveryId);
          return next;
        });
      }
    },
    [accessToken, retryDelivery, refreshDeliveries]
  );

  // Statistics calculations
  const statsCards = useMemo(() => {
    if (!statistics) return [];

    const { total, deliveryRate, failureRate, readRate } = statistics;

    return [
      {
        title: 'Total Deliveries',
        value: total?.toLocaleString() || '0',
        subtitle: 'All time',
        color: 'primary',
        icon: 'solar:inbox-bold',
      },
      {
        title: 'Delivery Rate',
        value: `${deliveryRate?.toFixed(1) || 0}%`,
        subtitle: 'Successfully delivered',
        color: 'success',
        icon: 'solar:inbox-in-bold',
      },
      {
        title: 'Failure Rate',
        value: `${failureRate?.toFixed(1) || 0}%`,
        subtitle: 'Failed deliveries',
        color: 'error',
        icon: 'solar:danger-bold',
      },
      {
        title: 'Read Rate',
        value: `${readRate?.toFixed(1) || 0}%`,
        subtitle: 'Messages opened',
        color: 'info',
        icon: 'solar:eye-bold',
      },
    ];
  }, [statistics]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <Alert severity="error">
        Access denied. Admin privileges required to view delivery tracking.
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notification Delivery Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Monitor notification delivery status, performance metrics, and retry failed deliveries.
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Main Content Tabs */}
        <Paper elevation={1}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="Delivery Records" />
            <Tab label="Statistics" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <>
                {/* Filters */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                        <Iconify icon="solar:filter-bold" />
                        Filters
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          startIcon={<Iconify icon="solar:close-bold" />}
                          onClick={clearFilters}
                          size="small"
                        >
                          Clear Filters
                        </Button>
                        <Button
                          startIcon={<Iconify icon="solar:refresh-bold" />}
                          onClick={refreshDeliveries}
                          size="small"
                        >
                          Refresh
                        </Button>
                      </Stack>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Channel</InputLabel>
                          <Select
                            value={filters.channel}
                            label="Channel"
                            onChange={(e) => handleFilterChange('channel', e.target.value)}
                          >
                            <MenuItem value="">All Channels</MenuItem>
                            {availableFilters.channels.map((channel) => (
                              <MenuItem key={channel} value={channel}>
                                {DELIVERY_CHANNEL_CONFIG[channel]?.label || channel}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filters.status}
                            label="Status"
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                          >
                            <MenuItem value="">All Statuses</MenuItem>
                            {availableFilters.statuses.map((status) => (
                              <MenuItem key={status} value={status}>
                                {DELIVERY_STATUS_CONFIG[status]?.label || status}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                          label="From Date"
                          value={filters.fromDate}
                          onChange={(date) => handleFilterChange('fromDate', date)}
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                          label="To Date"
                          value={filters.toDate}
                          onChange={(date) => handleFilterChange('toDate', date)}
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="User ID"
                          value={filters.userId}
                          onChange={(e) => handleFilterChange('userId', e.target.value)}
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Notification ID"
                          value={filters.notificationId}
                          onChange={(e) => handleFilterChange('notificationId', e.target.value)}
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Delivery Records Table */}
                <Card>
                  <CardContent sx={{ p: 0 }}>
                    {deliveriesLoading && <LinearProgress />}

                    {deliveriesError && (
                      <Alert severity="error" sx={{ m: 2 }}>
                        Error loading delivery records: {deliveriesError.message}
                      </Alert>
                    )}

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Channel</TableCell>
                            <TableCell>Recipient</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Attempts</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Sent</TableCell>
                            <TableCell>Delivered</TableCell>
                            <TableCell>Error</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {deliveries.map((delivery) => (
                            <DeliveryRow
                              key={delivery.deliveryId}
                              delivery={delivery}
                              onRetry={handleRetry}
                              retrying={retryingDeliveries.has(delivery.deliveryId)}
                            />
                          ))}
                          {deliveries.length === 0 && !deliveriesLoading && (
                            <TableRow>
                              <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                <Typography color="text.secondary">
                                  No delivery records found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {pagination.total > 0 && (
                      <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        onPageChange={handlePageChange}
                        rowsPerPage={pagination.limit}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                      />
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 1 && (
              <>
                {/* Statistics Filters */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="h6">Statistics Filters</Typography>
                      <Button
                        startIcon={<Iconify icon="solar:refresh-bold" />}
                        onClick={refreshStatistics}
                        size="small"
                      >
                        Refresh Statistics
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Channel</InputLabel>
                          <Select
                            value={statsDateRange.channel}
                            label="Channel"
                            onChange={(e) =>
                              setStatsDateRange((prev) => ({
                                ...prev,
                                channel: e.target.value,
                              }))
                            }
                          >
                            <MenuItem value="">All Channels</MenuItem>
                            {Object.entries(DELIVERY_CHANNEL_CONFIG).map(([key, config]) => (
                              <MenuItem key={key} value={key}>
                                {config.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                          label="From Date"
                          value={statsDateRange.fromDate}
                          onChange={(date) =>
                            setStatsDateRange((prev) => ({
                              ...prev,
                              fromDate: date,
                            }))
                          }
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <DatePicker
                          label="To Date"
                          value={statsDateRange.toDate}
                          onChange={(date) =>
                            setStatsDateRange((prev) => ({
                              ...prev,
                              toDate: date,
                            }))
                          }
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Statistics Content */}
                {statisticsLoading && <LinearProgress sx={{ mb: 2 }} />}

                {statisticsError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading statistics: {statisticsError.message}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {/* Status Breakdown */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Status Breakdown
                        </Typography>
                        <Stack spacing={2}>
                          {Object.entries(statistics.byStatus || {}).map(([status, count]) => {
                            const config = DELIVERY_STATUS_CONFIG[status];
                            const percentage =
                              statistics.total > 0
                                ? ((count / statistics.total) * 100).toFixed(1)
                                : 0;

                            return (
                              <Box
                                key={status}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip
                                    label={config?.label || status}
                                    color={config?.color || 'default'}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Typography variant="body2">{count.toLocaleString()}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {percentage}%
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Channel Breakdown */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Channel Breakdown
                        </Typography>
                        <Stack spacing={2}>
                          {Object.entries(statistics.byChannel || {}).map(([channel, count]) => {
                            const config = DELIVERY_CHANNEL_CONFIG[channel];
                            const percentage =
                              statistics.total > 0
                                ? ((count / statistics.total) * 100).toFixed(1)
                                : 0;

                            return (
                              <Box
                                key={channel}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Iconify
                                    icon={config?.icon || 'solar:inbox-bold'}
                                    sx={{ color: config?.color, fontSize: 20 }}
                                  />
                                  <Typography variant="body2">
                                    {config?.label || channel}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {count.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {percentage}%
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
