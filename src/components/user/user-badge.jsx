/**
 * @namespace CityArtWalks.Components.User.UserBadge
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.User
 * @description User badge component that displays user information for art pieces, artists, or paths.
 * Shows avatar, member status with gold star, and membership duration.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Model} - User documentation
 */

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { fToNow } from 'src/utils/format-time';

import { useGetUserAvatar } from 'src/actions/user/hooks';

import { StarIcon } from 'src/components/icons';
import { UserIcon } from 'src/components/icons/user-icon';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Components.User.UserBadge
 * @function UserBadge
 * @description Displays a user badge showing avatar, name, member status, and membership duration.
 *
 * @param {Object} props - Component props
 * @param {string|number} props.userId - The user ID to fetch and display
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {string} [props.size='medium'] - Size variant: 'small', 'medium', 'large'
 * @param {boolean} [props.showMemberSince=true] - Whether to show "Member since" text
 * @param {boolean} [props.compact=false] - Compact layout without text
 * @returns {JSX.Element} The rendered UserBadge component
 */
export function UserBadge(props) {
  const { userId, sx, size = 'medium', showMemberSince = true, compact = false, ...other } = props;

  const theme = useTheme();
  const router = useRouter();
  const { user: currentUser, accessToken } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);

  // Fetch user data using the hook
  const { user, userLoading, userError } = useGetUserAvatar(userId, accessToken);

  // Memoize size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      small: {
        avatar: 32,
        fontSize: 'body2',
        spacing: 1,
        iconSize: 16,
        starSize: 14,
      },
      medium: {
        avatar: 40,
        fontSize: 'body1',
        spacing: 1.5,
        iconSize: 18,
        starSize: 16,
      },
      large: {
        avatar: 48,
        fontSize: 'h6',
        spacing: 2,
        iconSize: 20,
        starSize: 18,
      },
    };
    return configs[size] || configs.medium;
  }, [size]);

  // Format membership duration
  const memberSince = useMemo(() => {
    if (!user?.createdAt) return '';
    return fToNow(user.createdAt);
  }, [user?.createdAt]);

  // Check if user is a member (MEMBER or ADMIN role)
  const isMember = useMemo(
    () => user?.role && (user.role === 'MEMBER' || user.role === 'ADMIN'),
    [user?.role]
  );

  // Handle loading state
  if (userLoading) {
    return (
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            gap: sizeConfig.spacing,
            opacity: 0.7,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Avatar
          sx={{
            width: sizeConfig.avatar,
            height: sizeConfig.avatar,
            bgcolor: alpha(theme.palette.grey[500], 0.12),
          }}
        />
        {!compact && (
          <Box>
            <Typography
              variant={sizeConfig.fontSize}
              sx={{
                color: 'text.disabled',
                fontWeight: 'medium',
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Handle error or no user found
  if (userError || !user) {
    return (
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            gap: sizeConfig.spacing,
            opacity: 0.5,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Avatar
          sx={{
            width: sizeConfig.avatar,
            height: sizeConfig.avatar,
            bgcolor: alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <UserIcon size={sizeConfig.iconSize} />
        </Avatar>
        {!compact && (
          <Box>
            <Typography
              variant={sizeConfig.fontSize}
              sx={{
                color: 'text.disabled',
                fontWeight: 'medium',
              }}
            >
              Unknown User
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  const displayName = user.displayName || user.name || user.username || 'Anonymous';
  const avatarUrl = user.image;

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">{displayName}</Typography>
          {user.role && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Role: {user.role}
            </Typography>
          )}
          {memberSince && (
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
              Member for {memberSince}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        onClick={() => {
          const currentRole = currentUser?.role || 'PUBLIC';
          const hasAccess = ['USER', 'MEMBER', 'ADMIN'].includes(currentRole);

          if (hasAccess) {
            router.push(paths.member.details(userId));
          } else {
            setShowDialog(true);
          }
        }}
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            gap: sizeConfig.spacing,
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              opacity: 0.8,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {/* Avatar with member star overlay */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={avatarUrl}
            alt={displayName}
            sx={{
              width: sizeConfig.avatar,
              height: sizeConfig.avatar,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          {/* Gold star for members */}
          {isMember && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                left: -2,
                zIndex: 1,
                bgcolor: 'warning.main',
                borderRadius: '50%',
                width: sizeConfig.starSize,
                height: sizeConfig.starSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${theme.palette.background.paper}`,
              }}
            >
              <StarIcon size={sizeConfig.starSize - 4} sx={{ color: 'warning.contrastText' }} />
            </Box>
          )}
        </Box>

        {/* User info text */}
        {!compact && (
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant={sizeConfig.fontSize}
                sx={{
                  fontWeight: 'medium',
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </Typography>
              {isMember && (
                <Chip
                  label={user.role}
                  size="small"
                  variant="outlined"
                  color="info"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    '& .MuiChip-label': { px: 0.5 },
                  }}
                />
              )}
            </Box>

            {showMemberSince && memberSince && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                Member for {memberSince}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <RoleBasedGuard
        allowedRoles={['USER', 'MEMBER', 'ADMIN']}
        displayMode="dialog"
        dialogOpen={showDialog}
        onDialogClose={() => setShowDialog(false)}
      >
        <div style={{ display: 'none' }} />
      </RoleBasedGuard>
    </Tooltip>
  );
}
