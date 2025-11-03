'use client';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { fToNow, fDateTime } from 'src/utils/format-time';

import { debugLog, debugError } from 'src/lib/debug';

import { LetterIcon } from 'src/components/icons/letter-icon';
import { CursorIcon } from 'src/components/icons/cursor-icon';
import { SettingsIcon } from 'src/components/icons/settings-icon';
import { UserPlusIcon } from 'src/components/icons/user-plus-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { CloseCircleIcon } from 'src/components/icons/close-circle-icon';
import { LetterOpenedIcon } from 'src/components/icons/letter-opened-icon';
import { ForbiddenCircleIcon } from 'src/components/icons/forbidden-circle-icon';

// ----------------------------------------------------------------------

const EventIcon = ({ type, status }) => {
  const iconMap = {
    email_sent: <LetterIcon />,
    email_delivered: <CheckCircleIcon />,
    email_opened: <LetterOpenedIcon />,
    email_clicked: <CursorIcon />,
    email_bounced: <CloseCircleIcon />,
    subscription: <UserPlusIcon />,
    preference_change: <SettingsIcon />,
    unsubscribe: <ForbiddenCircleIcon />,
  };

  const colorMap = {
    email_sent: 'primary',
    email_delivered: 'success',
    email_opened: 'info',
    email_clicked: 'secondary',
    email_bounced: 'error',
    subscription: 'success',
    preference_change: 'warning',
    unsubscribe: 'error',
  };

  return (
    <TimelineDot color={colorMap[type] || 'grey'} variant="filled">
      {iconMap[type] || <LetterIcon />}
    </TimelineDot>
  );
};

// ----------------------------------------------------------------------

export function UserCommunicationTimeline({ userId }) {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showMore, setShowMore] = useState(false);

  const fetchTimeline = useCallback(async () => {
    try {
      debugLog('UserCommunicationTimeline.fetchTimeline', 'Fetching user timeline', {
        userId,
        filter,
      });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${userId}/timeline?filter=${filter}`);
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        const mockTimeline = [
          {
            id: '1',
            type: 'email_clicked',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            title: 'Clicked email link',
            description: 'Weekly Art Walk Digest',
            metadata: {
              emailId: 'email_123',
              template: 'weekly_digest',
              clickedLink: 'View New Art Piece',
              device: 'mobile',
            },
          },
          {
            id: '2',
            type: 'email_opened',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            title: 'Opened email',
            description: 'Weekly Art Walk Digest',
            metadata: {
              emailId: 'email_123',
              template: 'weekly_digest',
              device: 'mobile',
              location: 'New York, NY',
            },
          },
          {
            id: '3',
            type: 'email_delivered',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            title: 'Email delivered',
            description: 'Weekly Art Walk Digest',
            metadata: {
              emailId: 'email_123',
              template: 'weekly_digest',
              deliveryTime: 45,
            },
          },
          {
            id: '4',
            type: 'email_sent',
            timestamp: new Date(Date.now() - 1000 * 60 * 65),
            title: 'Email sent',
            description: 'Weekly Art Walk Digest',
            metadata: {
              emailId: 'email_123',
              template: 'weekly_digest',
              campaign: 'weekly_digest_jan_2024',
            },
          },
          {
            id: '5',
            type: 'preference_change',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            title: 'Updated email preferences',
            description: 'Disabled marketing emails',
            metadata: {
              changed: ['marketing'],
              action: 'disabled',
            },
          },
          {
            id: '6',
            type: 'email_opened',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            title: 'Opened email',
            description: 'New Art Piece Added Near You',
            metadata: {
              emailId: 'email_122',
              template: 'art_notification',
              device: 'desktop',
            },
          },
          {
            id: '7',
            type: 'subscription',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            title: 'Subscribed to newsletter',
            description: 'User joined City Art Walks',
            metadata: {
              source: 'website_signup',
              referrer: 'google',
            },
          },
          {
            id: '8',
            type: 'email_bounced',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
            title: 'Email bounced',
            description: 'Welcome Email - Soft bounce',
            metadata: {
              emailId: 'email_121',
              bounceType: 'soft',
              reason: 'Mailbox full',
            },
          },
        ];

        // Apply filtering
        let filteredTimeline = mockTimeline;
        if (filter !== 'all') {
          filteredTimeline = mockTimeline.filter((event) => event.type.startsWith(filter));
        }

        setTimeline(filteredTimeline);
        setLoading(false);
      }, 600);
    } catch (error) {
      debugError('UserCommunicationTimeline.fetchTimeline', 'Failed to fetch timeline', error);
      setLoading(false);
    }
  }, [userId, filter]);

  useEffect(() => {
    if (userId) {
      fetchTimeline();
    }
  }, [userId, fetchTimeline]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const displayedTimeline = showMore ? timeline : timeline.slice(0, 6);

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

  return (
    <Card>
      <CardHeader
        title="Communication Timeline"
        subheader="Recent email interactions and events"
        action={
          <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange} size="small">
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="email">Email</ToggleButton>
            <ToggleButton value="preference">Settings</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        {timeline.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No communication events found for this filter.
            </Typography>
          </Box>
        ) : (
          <>
            <Timeline position="right">
              {displayedTimeline.map((event, index) => (
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
                    <TimelineConnector
                      sx={{ bgcolor: index === 0 ? 'primary.main' : 'grey.400' }}
                    />
                    <EventIcon type={event.type} />
                    <TimelineConnector
                      sx={{
                        bgcolor:
                          index === displayedTimeline.length - 1 ? 'grey.400' : 'primary.main',
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
                            <Typography variant="subtitle2">{event.title}</Typography>
                            <Chip
                              label={event.type.replace('_', ' ')}
                              size="small"
                              color={
                                event.type.includes('email') && !event.type.includes('bounced')
                                  ? 'primary'
                                  : event.type.includes('bounced')
                                    ? 'error'
                                    : event.type.includes('preference')
                                      ? 'warning'
                                      : event.type.includes('subscription')
                                        ? 'success'
                                        : 'default'
                              }
                              variant="soft"
                            />
                          </Box>

                          <Typography variant="body2">{event.description}</Typography>

                          <Typography variant="caption" color="text.secondary">
                            {fDateTime(event.timestamp)}
                          </Typography>

                          {/* Event-specific metadata */}
                          {event.metadata && (
                            <Box sx={{ mt: 1 }}>
                              {event.metadata.device && (
                                <Chip
                                  label={`Device: ${event.metadata.device}`}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {event.metadata.location && (
                                <Chip
                                  label={`Location: ${event.metadata.location}`}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {event.metadata.clickedLink && (
                                <Chip
                                  label={`Link: ${event.metadata.clickedLink}`}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {event.metadata.deliveryTime && (
                                <Chip
                                  label={`Delivered in ${event.metadata.deliveryTime}s`}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {event.metadata.bounceType && (
                                <Chip
                                  label={`${event.metadata.bounceType} bounce: ${event.metadata.reason}`}
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                />
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

            {timeline.length > 6 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => setShowMore(!showMore)} variant="text" size="small">
                  {showMore ? 'Show Less' : `Show ${timeline.length - 6} More Events`}
                </Button>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
