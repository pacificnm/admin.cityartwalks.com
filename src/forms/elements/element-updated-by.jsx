/**
 * @file element-updated-by.jsx
 * @description Display-only element for showing who last updated an entity. Shows user avatar, name, and email.
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Forms.Elements
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { ErrorBoundary } from 'src/components/error';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementUpdatedBy
 * @description Display-only element for showing who last updated an entity with avatar, name, and email.
 * Not a form field - purely for display purposes in edit mode.
 *
 * @param {Object} props - Component props
 * @param {Object|null} [props.updatedByUser] - User who last updated the entity
 * @param {number} [props.updatedByUser.userId] - User ID
 * @param {string} [props.updatedByUser.name] - User's display name
 * @param {string} [props.updatedByUser.email] - User's email address
 * @param {string} [props.updatedByUser.image] - User's profile image URL
 * @param {string} [props.label='Last Updated By'] - Label text
 * @param {Object} [props.sx] - Additional sx props for the container
 * @param {Object} [props.avatarProps] - Additional props for the Avatar component
 * @param {Object} [props.typographyProps] - Additional props for Typography components
 * @returns {JSX.Element|null} The rendered user display or null if no user data
 *
 * @example
 * // Basic usage in edit mode
 * {isEdit && currentArtist?.updatedByUser && (
 *   <ElementUpdatedBy updatedByUser={currentArtist.updatedByUser} />
 * )}
 *
 * @example
 * // With custom label
 * <ElementUpdatedBy
 *   updatedByUser={currentImage.updatedByUser}
 *   label="Last Modified By"
 * />
 *
 * @example
 * // With custom styling
 * <ElementUpdatedBy
 *   updatedByUser={user}
 *   sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}
 *   avatarProps={{ sx: { width: 56, height: 56 } }}
 * />
 */
export function ElementUpdatedBy({
  updatedByUser = null,
  sx,
  avatarProps,
  typographyProps,
  ...other
}) {
  // Don't render if no user data
  if (!updatedByUser) {
    return null;
  }

  const { name, email, image, userId } = updatedByUser;

  // Use email as fallback if name is not provided or is same as email
  const displayName = name && name !== email ? name : email;

  return (
    <ErrorBoundary>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          ...sx,
        }}
        {...other}
      >
        {/* User Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {/* Avatar */}
          <Avatar
            src={image}
            alt={displayName}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
            }}
            {...avatarProps}
          >
            {!image && displayName ? displayName.charAt(0).toUpperCase() : '?'}
          </Avatar>

          {/* Name and Email */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>
            {name && name !== email && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Optional User ID for debugging */}
        {process.env.NODE_ENV === 'development' && userId && (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
            User ID: {userId}
          </Typography>
        )}
      </Box>
    </ErrorBoundary>
  );
}

ElementUpdatedBy.propTypes = {
  /**
   * User who last updated the entity
   */
  updatedByUser: PropTypes.shape({
    userId: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
  }),

  /**
   * Additional sx props for the container Box
   */
  sx: PropTypes.object,

  /**
   * Additional props to pass to Avatar component
   */
  avatarProps: PropTypes.object,

  /**
   * Additional props to pass to Typography components
   */
  typographyProps: PropTypes.object,
};
