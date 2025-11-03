import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';

import { fToNow } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Map notification types to icons and colors
const notificationConfig = {
  // System notifications
  INFO: {
    icon: 'solar:info-circle-bold-duotone',
    color: 'info',
    category: 'System',
  },
  WARNING: {
    icon: 'solar:danger-triangle-bold-duotone',
    color: 'warning',
    category: 'System',
  },
  ERROR: {
    icon: 'solar:close-circle-bold-duotone',
    color: 'error',
    category: 'System',
  },
  SUCCESS: {
    icon: 'solar:check-circle-bold-duotone',
    color: 'success',
    category: 'System',
  },

  // Review notifications
  REVIEW_SUBMITTED: {
    icon: 'solar:chat-round-dots-bold-duotone',
    color: 'primary',
    category: 'Review',
  },
  REVIEW_APPROVED: {
    icon: 'solar:check-read-bold-duotone',
    color: 'success',
    category: 'Review',
  },
  REVIEW_REJECTED: {
    icon: 'solar:close-square-bold-duotone',
    color: 'error',
    category: 'Review',
  },
  REVIEW_FLAGGED: {
    icon: 'solar:flag-bold-duotone',
    color: 'warning',
    category: 'Review',
  },

  // User interactions
  USER_MENTION: {
    icon: 'solar:user-speak-bold-duotone',
    color: 'info',
    category: 'Mention',
  },
  USER_FOLLOWED: {
    icon: 'solar:user-plus-bold-duotone',
    color: 'primary',
    category: 'Social',
  },

  // Content notifications
  ART_PIECE_ADDED: {
    icon: 'solar:gallery-bold-duotone',
    color: 'primary',
    category: 'Art',
  },
  ARTIST_UPDATED: {
    icon: 'solar:user-bold-duotone',
    color: 'info',
    category: 'Artist',
  },
  PATH_CREATED: {
    icon: 'solar:routing-2-bold-duotone',
    color: 'primary',
    category: 'Path',
  },

  // Admin notifications
  SYSTEM: {
    icon: 'solar:settings-bold-duotone',
    color: 'default',
    category: 'System',
  },
  ADMIN_MESSAGE: {
    icon: 'solar:shield-user-bold-duotone',
    color: 'primary',
    category: 'Admin',
  },

  // Default fallback
  DEFAULT: {
    icon: 'solar:bell-bold-duotone',
    color: 'default',
    category: 'Notification',
  },
};

// Get configuration for a notification type
const getNotificationConfig = (type) => notificationConfig[type] || notificationConfig.DEFAULT;

// Parse notification priority to color
const getPriorityColor = (priority) => {
  const priorityColors = {
    low: 'default',
    normal: 'primary',
    medium: 'warning',
    high: 'error',
  };
  return priorityColors[priority?.toLowerCase()] || 'default';
};

// ----------------------------------------------------------------------

export function NotificationItem({ notification, onMarkAsRead }) {
  const config = getNotificationConfig(notification.type);

  // Parse metadata if it exists
  let metadata = {};
  try {
    if (notification.metadata) {
      metadata = JSON.parse(notification.metadata);
    }
  } catch (error) {
    debugLog('NotificationItem.parseMetadata', 'Failed to parse metadata', error);
  }

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.notificationId);
    }

    // Navigate to notification detail page
    const detailUrl = paths.profile.notificationDetail(notification.notificationId);
    debugLog('NotificationItem.handleClick', 'Navigating to notification detail', {
      notificationId: notification.notificationId,
      detailUrl,
    });
    window.location.href = detailUrl;
  };

  const renderAvatar = () => (
    <ListItemAvatar>
      {metadata.avatarUrl ? (
        <Avatar src={metadata.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
          }}
        >
          <Iconify
            icon={config.icon}
            sx={{
              width: 24,
              height: 24,
              color: `${config.color}.main`,
            }}
          />
        </Box>
      )}
    </ListItemAvatar>
  );

  const renderText = () => (
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            dangerouslySetInnerHTML={{ __html: notification.title }}
            sx={{
              flex: 1,
              '& p': { m: 0, typography: 'body2' },
              '& a': { color: 'primary.main', textDecoration: 'none' },
              '& strong': { typography: 'subtitle2' },
            }}
          />
          {notification.priority && notification.priority !== 'normal' && (
            <Label
              variant="soft"
              color={getPriorityColor(notification.priority)}
              sx={{ ml: 'auto' }}
            >
              {notification.priority}
            </Label>
          )}
        </Box>
      }
      secondary={
        <>
          <Box
            component="span"
            sx={{
              typography: 'body2',
              color: 'text.secondary',
              display: 'block',
              mb: 0.5,
            }}
          >
            {notification.message}
          </Box>
          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'text.disabled',
            }}
          >
            {fToNow(notification.createdAt)}
            <Box
              component="span"
              sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }}
            />
            {config.category}
          </Box>
        </>
      }
      slotProps={{
        primary: {
          sx: { mb: 0.5 },
        },
        secondary: {
          sx: { mt: 0.5 },
        },
      }}
    />
  );

  const renderUnReadBadge = () =>
    !notification.isRead && (
      <Box
        sx={{
          top: 26,
          width: 8,
          height: 8,
          right: 20,
          borderRadius: '50%',
          bgcolor: 'info.main',
          position: 'absolute',
        }}
      />
    );

  // Render action buttons based on metadata
  const renderActions = () => {
    if (!metadata.actions || !Array.isArray(metadata.actions)) {
      return null;
    }

    return (
      <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
        {metadata.actions.map((action, index) => (
          <Button
            key={index}
            size="small"
            variant={action.variant || (index === 0 ? 'contained' : 'outlined')}
            color={action.color || 'primary'}
            onClick={() => {
              debugLog('NotificationItem.actionClick', 'Action clicked', action);
              if (action.url) {
                window.location.href = action.url;
              }
            }}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    );
  };

  // Render link if provided in metadata
  const renderLink = () => {
    if (!metadata.link) {
      return null;
    }

    return (
      <Box sx={{ mt: 1 }}>
        <Link href={metadata.link.url} target="_blank" rel="noopener" sx={{ typography: 'body2' }}>
          {metadata.link.label || 'View Details'}
        </Link>
      </Box>
    );
  };

  return (
    <ListItemButton
      disableRipple
      onClick={handleClick}
      sx={[
        (theme) => ({
          p: 2.5,
          alignItems: 'flex-start',
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          ...(notification.isRead && {
            bgcolor: 'transparent',
          }),
          ...(!notification.isRead && {
            bgcolor: theme.vars.palette.background.paper,
          }),
          '&:hover': {
            bgcolor: theme.vars.palette.action.hover,
          },
        }),
      ]}
    >
      {renderUnReadBadge()}
      {renderAvatar()}

      <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
        {renderText()}
        {renderActions()}
        {renderLink()}
      </Box>
    </ListItemButton>
  );
}
