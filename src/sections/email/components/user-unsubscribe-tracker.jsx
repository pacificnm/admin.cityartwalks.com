'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import DialogContentText from '@mui/material/DialogContentText';

import { fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';

import { WarningIcon } from 'src/components/icons/warning-icon';
import { RestoreIcon } from 'src/components/icons/restore-icon';
import { ExpandLessIcon } from 'src/components/icons/expand-less-icon';
import { ExpandMoreIcon } from 'src/components/icons/expand-more-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { ForbiddenCircleIcon } from 'src/components/icons/forbidden-circle-icon';

// ----------------------------------------------------------------------

const UnsubscribeReasonChip = ({ reason }) => {
  const reasonConfig = {
    too_frequent: { label: 'Too Frequent', color: 'warning' },
    not_relevant: { label: 'Not Relevant', color: 'info' },
    spam: { label: 'Marked as Spam', color: 'error' },
    user_request: { label: 'User Request', color: 'primary' },
    bounced: { label: 'Email Bounced', color: 'error' },
    list_cleaning: { label: 'List Cleaning', color: 'secondary' },
  };

  const config = reasonConfig[reason] || { label: reason, color: 'default' };

  return <Chip label={config.label} color={config.color} size="small" variant="soft" />;
};

// ----------------------------------------------------------------------

export function UserUnsubscribeTracker({ userId, unsubscribeHistory = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [resubscribeDialog, setResubscribeDialog] = useState({ open: false, type: null });

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleResubscribe = (type) => {
    setResubscribeDialog({ open: true, type });
  };

  const handleConfirmResubscribe = async () => {
    try {
      debugLog('UserUnsubscribeTracker.handleConfirmResubscribe', 'Resubscribing user', {
        userId,
        type: resubscribeDialog.type,
      });

      // TODO: Replace with actual API call
      // await fetch(`/api/users/${userId}/resubscribe`, {
      //   method: 'POST',
      //   body: JSON.stringify({ type: resubscribeDialog.type })
      // });

      setResubscribeDialog({ open: false, type: null });
    } catch (error) {
      debugLog('UserUnsubscribeTracker.handleConfirmResubscribe', 'Failed to resubscribe', error);
    }
  };

  const handleCancelResubscribe = () => {
    setResubscribeDialog({ open: false, type: null });
  };

  // Group unsubscribe history by type
  const groupedHistory = unsubscribeHistory.reduce((groups, item) => {
    const key = item.type || 'general';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  const hasUnsubscribeHistory = unsubscribeHistory.length > 0;

  return (
    <>
      <Card>
        <CardHeader
          title="Unsubscribe Status & History"
          action={
            hasUnsubscribeHistory && (
              <IconButton onClick={handleToggleExpanded}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )
          }
        />
        <CardContent>
          {!hasUnsubscribeHistory ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              This user has never unsubscribed from any email communications.
            </Alert>
          ) : (
            <Stack spacing={3}>
              {/* Summary */}
              <Alert severity="warning" icon={<WarningIcon />}>
                This user has unsubscribed from {unsubscribeHistory.length} email type(s). Review
                the history below and consider resubscribing them to relevant communications.
              </Alert>

              {/* Unsubscribe Types Summary */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Unsubscribed From:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.keys(groupedHistory).map((type) => (
                    <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={type.replace('_', ' ').toUpperCase()}
                        color="error"
                        variant="outlined"
                        size="small"
                        icon={<ForbiddenCircleIcon />}
                      />
                      <Button
                        size="small"
                        startIcon={<RestoreIcon />}
                        onClick={() => handleResubscribe(type)}
                        variant="text"
                        color="success"
                      >
                        Resubscribe
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Detailed History */}
              <Collapse in={expanded}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Detailed Unsubscribe History
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Campaign</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {unsubscribeHistory.map((item, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Typography variant="caption">{fDateTime(item.date)}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.type?.replace('_', ' ') || 'General'}
                                size="small"
                                variant="outlined"
                                color="error"
                              />
                            </TableCell>
                            <TableCell>
                              <UnsubscribeReasonChip reason={item.reason} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {item.campaignId || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Resubscribe to this type">
                                <IconButton
                                  size="small"
                                  onClick={() => handleResubscribe(item.type)}
                                  color="success"
                                >
                                  <RestoreIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>

              {/* Quick Actions */}
              <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Quick Actions:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<RestoreIcon />}
                    onClick={() => handleResubscribe('all')}
                  >
                    Resubscribe to All
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      debugLog(
                        'UserUnsubscribeTracker.exportHistory',
                        'Export unsubscribe history',
                        { userId }
                      );
                      // TODO: Implement export functionality
                    }}
                  >
                    Export History
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Resubscribe Confirmation Dialog */}
      <Dialog
        open={resubscribeDialog.open}
        onClose={handleCancelResubscribe}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Resubscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to resubscribe this user to{' '}
            {resubscribeDialog.type === 'all'
              ? 'all email communications'
              : `${resubscribeDialog.type?.replace('_', ' ')} emails`}
            ?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              The user will start receiving these emails again according to their frequency
              preferences. They will also receive a confirmation email about this change.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelResubscribe}>Cancel</Button>
          <Button
            onClick={handleConfirmResubscribe}
            variant="contained"
            color="success"
            startIcon={<RestoreIcon />}
          >
            Confirm Resubscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
