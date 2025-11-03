'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { debugLog, debugError } from 'src/lib/debug';

import { BellIcon } from 'src/components/icons/bell-icon';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { UserBoldIcon } from 'src/components/icons/user-bold-icon';
import { MegaphoneIcon } from 'src/components/icons/megaphone-icon';
import { ClockCircleIcon } from 'src/components/icons/clock-circle-icon';
import { CloseCircleIcon } from 'src/components/icons/close-circle-icon';
import { VerifiedCheckIcon } from 'src/components/icons/verified-check-icon';

// ----------------------------------------------------------------------

const TimelineIcon = ({ type, status }) => {
  const iconMap = {
    welcome: <UserBoldIcon />,
    notification: <BellIcon />,
    marketing: <MegaphoneIcon />,
    transactional: <VerifiedCheckIcon />,
    newsletter: <LetterIcon />,
  };

  const colorMap = {
    delivered: 'success',
    opened: 'info',
    clicked: 'primary',
    failed: 'error',
    pending: 'warning',
  };

  return (
    <TimelineDot color={colorMap[status] || 'grey'} variant="filled">
      {iconMap[type] || <LetterIcon />}
    </TimelineDot>
  );
};

// ----------------------------------------------------------------------

export function EmailTimelineWidget() {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showMore, setShowMore] = useState(false);

  const fetchTimeline = useCallback(async () => {
    try {
      debugLog('EmailTimelineWidget.fetchTimeline', 'Fetching communication timeline', { filter });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/email/analytics/timeline?filter=${filter}`);
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        const mockTimeline = [
          {
            id: '1',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            type: 'notification',
            status: 'opened',
            subject: 'New Art Piece Added Near You',
            recipient: {
              email: 'john.doe@example.com',
              name: 'John Doe',
              avatar: null,
            },
            metadata: {
              openedAt: new Date(Date.now() - 1000 * 60 * 2),
              clickCount: 3,
            },
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            type: 'welcome',
            status: 'delivered',
            subject: 'Welcome to City Art Walks!',
            recipient: {
              email: 'jane.smith@example.com',
              name: 'Jane Smith',
              avatar: null,
            },
            metadata: {
              deliveredAt: new Date(Date.now() - 1000 * 60 * 29),
            },
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            type: 'newsletter',
            status: 'clicked',
            subject: 'Weekly Art Walk Digest',
            recipient: {
              email: 'bob.wilson@example.com',
              name: 'Bob Wilson',
              avatar: null,
            },
            metadata: {
              openedAt: new Date(Date.now() - 1000 * 60 * 45),
              clickCount: 5,
              linksClicked: ['View Art Piece', 'Artist Profile'],
            },
          },
          {
            id: '4',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            type: 'transactional',
            status: 'failed',
            subject: 'Password Reset Request',
            recipient: {
              email: 'alice.johnson@example.com',
              name: 'Alice Johnson',
              avatar: null,
            },
            metadata: {
              failureReason: 'Invalid email address',
            },
          },
          {
            id: '5',
            timestamp: new Date(Date.now() - 1000 * 60 * 180),
            type: 'marketing',
            status: 'pending',
            subject: 'Special Art Exhibition This Weekend',
            recipient: {
              email: 'charlie.brown@example.com',
              name: 'Charlie Brown',
              avatar: null,
            },
            metadata: {
              scheduledFor: new Date(Date.now() + 1000 * 60 * 60),
            },
          },
          {
            id: '6',
            timestamp: new Date(Date.now() - 1000 * 60 * 240),
            type: 'notification',
            status: 'opened',
            subject: 'Your Path Has Been Approved',
            recipient: {
              email: 'emma.davis@example.com',
              name: 'Emma Davis',
              avatar: null,
            },
            metadata: {
              openedAt: new Date(Date.now() - 1000 * 60 * 200),
              clickCount: 2,
            },
          },
        ];

        setTimeline(mockTimeline);
        setLoading(false);
      }, 500);
    } catch (error) {
      debugError('EmailTimelineWidget.fetchTimeline', 'Failed to fetch timeline', error);
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const displayedTimeline = showMore ? timeline : timeline.slice(0, 4);

  return (
    <Card>
      <CardHeader
        title="User Communication Timeline"
        subheader="Recent email interactions"
        action={
          <Stack direction="row" spacing={1}>
            {['all', 'opened', 'failed', 'pending'].map((filterOption) => (
              <Chip
                key={filterOption}
                label={filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                onClick={() => handleFilterChange(filterOption)}
                color={filter === filterOption ? 'primary' : 'default'}
                variant={filter === filterOption ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Stack>
        }
      />
      <CardContent>
        <Timeline position="right">
          {displayedTimeline.map((item, index) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0', maxWidth: '30%' }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {fToNow(item.timestamp)}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: index === 0 ? 'primary.main' : 'grey.400' }} />
                <TimelineIcon type={item.type} status={item.status} />
                <TimelineConnector
                  sx={{
                    bgcolor: index === displayedTimeline.length - 1 ? 'grey.400' : 'primary.main',
                  }}
                />
              </TimelineSeparator>

              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {item.recipient.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{item.recipient.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.recipient.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={item.status}
                          size="small"
                          color={
                            item.status === 'delivered'
                              ? 'success'
                              : item.status === 'opened'
                                ? 'info'
                                : item.status === 'clicked'
                                  ? 'primary'
                                  : item.status === 'failed'
                                    ? 'error'
                                    : 'warning'
                          }
                          variant="soft"
                        />
                      </Box>

                      <Typography variant="body2">{item.subject}</Typography>

                      {item.metadata && (
                        <Box>
                          {item.metadata.openedAt && (
                            <Typography variant="caption" color="text.secondary">
                              Opened: {fDateTime(item.metadata.openedAt)}
                            </Typography>
                          )}
                          {item.metadata.clickCount && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                              Clicks: {item.metadata.clickCount}
                            </Typography>
                          )}
                          {item.metadata.failureReason && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <CloseCircleIcon
                                sx={{ width: 14, height: 14, color: 'error.main' }}
                              />
                              <Typography variant="caption" color="error.main">
                                {item.metadata.failureReason}
                              </Typography>
                            </Box>
                          )}
                          {item.metadata.scheduledFor && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <ClockCircleIcon
                                sx={{ width: 14, height: 14, color: 'warning.main' }}
                              />
                              <Typography variant="caption" color="warning.main">
                                Scheduled: {fDateTime(item.metadata.scheduledFor)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        {timeline.length > 4 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setShowMore(!showMore)} variant="text" size="small">
              {showMore ? 'Show Less' : `Show ${timeline.length - 4} More`}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
