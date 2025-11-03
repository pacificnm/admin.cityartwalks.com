'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import TimelineContent from '@mui/lab/TimelineContent';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';

import {
  CloseIcon,
  LetterIcon,
  CursorIcon,
  RefreshIcon,
  DevicesIcon,
  MapPointIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  ClockCircleIcon,
  LetterOpenedIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

const StatusChip = ({ status }) => {
  const statusConfig = {
    sent: { label: 'Sent', color: 'primary', icon: () => <LetterIcon size={16} /> },
    delivered: { label: 'Delivered', color: 'success', icon: () => <CheckCircleIcon size={16} /> },
    opened: { label: 'Opened', color: 'info', icon: () => <LetterOpenedIcon size={16} /> },
    clicked: { label: 'Clicked', color: 'secondary', icon: () => <CursorIcon size={16} /> },
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

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`email-detail-tabpanel-${index}`}
    aria-labelledby={`email-detail-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

// ----------------------------------------------------------------------

export function EmailDetailDialog({ open, email, onClose }) {
  const [tabValue, setTabValue] = useState(0);

  if (!email) return null;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResend = () => {
    debugLog('EmailDetailDialog.handleResend', 'Resending email', { emailId: email.emailId });
    // TODO: Implement resend functionality
  };

  // Extract template name and recipient info
  const templateName = email.EmailTemplate?.name || email.emailType || 'Unknown';
  const recipient = email.User || {
    name: 'Unknown',
    email: email.recipientEmail || email.email || 'N/A',
  };

  // Build email history with proper null checks
  const sentDate = email.sentAt
    ? new Date(email.sentAt)
    : email.createdAt
      ? new Date(email.createdAt)
      : new Date();
  const deliveredDate = email.deliveredAt ? new Date(email.deliveredAt) : null;

  const emailHistory = [
    {
      id: '1',
      event: 'sent',
      timestamp: sentDate,
      description: 'Email sent successfully',
    },
    ...(email.deliveryStatus === 'delivered' && deliveredDate
      ? [
          {
            id: '2',
            event: 'delivered',
            timestamp: deliveredDate,
            description: 'Email delivered to recipient',
          },
        ]
      : []),
    ...(email.deliveryStatus === 'bounced' && email.bouncedAt
      ? [
          {
            id: '3',
            event: 'bounced',
            timestamp: new Date(email.bouncedAt),
            description: 'Email bounced',
          },
        ]
      : []),
    ...(email.deliveryStatus === 'failed'
      ? [
          {
            id: '4',
            event: 'failed',
            timestamp: sentDate,
            description: 'Email delivery failed',
          },
        ]
      : []),
  ];

  const emailContent =
    email.htmlContent ||
    `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${email.subject || 'No Subject'}</h2>
        <p>Dear ${recipient.name || 'User'},</p>
        <p>This is a sample email content for the ${templateName} template.</p>
        <p>Thank you for using City Art Walks!</p>
        <br/>
        <p>Best regards,<br/>The City Art Walks Team</p>
      </body>
    </html>
  `;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Email Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {/* Email Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>
                    {recipient.name ? recipient.name.charAt(0) : recipient.email?.charAt(0) || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{recipient.name || 'Unknown User'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipient.email}
                    </Typography>
                  </Box>
                </Box>
                <StatusChip status={email.deliveryStatus} />
              </Box>

              <Typography variant="h6">
                {email.subject || email.description || 'No Subject'}
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={`Template: ${templateName}`} variant="outlined" size="small" />
                <Chip label={`Sent: ${fDateTime(sentDate)}`} variant="outlined" size="small" />
                {deliveredDate && (
                  <Chip
                    label={`Delivered: ${fDateTime(deliveredDate)}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Content" />
            <Tab label="Metadata" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* Content Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Email Preview
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  bgcolor: 'background.default',
                  minHeight: 300,
                  overflow: 'auto',
                }}
                dangerouslySetInnerHTML={{ __html: emailContent }}
              />
            </CardContent>
          </Card>
        </TabPanel>

        {/* Metadata Tab */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Delivery Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Email ID:
                    </Typography>
                    <Typography variant="body2">{email.emailId}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <StatusChip status={email.deliveryStatus} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Template:
                    </Typography>
                    <Typography variant="body2">{templateName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sent At:
                    </Typography>
                    <Typography variant="body2">{fDateTime(sentDate)}</Typography>
                  </Box>
                  {email.metadata?.deliveryTime && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Delivery Time:
                      </Typography>
                      <Typography variant="body2">{email.metadata.deliveryTime}s</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {deliveredDate && (
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Delivery Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Delivered At:
                      </Typography>
                      <Typography variant="body2">{fDateTime(deliveredDate)}</Typography>
                    </Box>
                    {email.bounceReason && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Bounce Reason:
                        </Typography>
                        <Typography variant="body2">{email.bounceReason}</Typography>
                      </Box>
                    )}
                    {email.metadata?.device && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DevicesIcon size={16} sx={{ color: 'action.active' }} />
                          <Typography variant="body2" color="text.secondary">
                            Device:
                          </Typography>
                        </Box>
                        <Typography variant="body2">{email.metadata.device}</Typography>
                      </Box>
                    )}
                    {email.metadata?.location && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MapPointIcon size={16} sx={{ color: 'action.active' }} />
                          <Typography variant="body2" color="text.secondary">
                            Location:
                          </Typography>
                        </Box>
                        <Typography variant="body2">{email.metadata.location}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Email Timeline
              </Typography>
              <Timeline position="right">
                {emailHistory.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0', maxWidth: '30%' }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {fToNow(event.timestamp)}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot
                        color={
                          event.event === 'sent'
                            ? 'primary'
                            : event.event === 'delivered'
                              ? 'success'
                              : event.event === 'opened'
                                ? 'info'
                                : event.event === 'clicked'
                                  ? 'secondary'
                                  : 'error'
                        }
                      >
                        {event.event === 'sent' && <LetterIcon size={16} />}
                        {event.event === 'delivered' && <CheckCircleIcon size={16} />}
                        {event.event === 'opened' && <LetterOpenedIcon size={16} />}
                        {event.event === 'clicked' && <CursorIcon size={16} />}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="subtitle2">
                        {event.event.charAt(0).toUpperCase() + event.event.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fDateTime(event.timestamp)}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        {email.deliveryStatus === 'failed' && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleResend}>
            Resend
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
