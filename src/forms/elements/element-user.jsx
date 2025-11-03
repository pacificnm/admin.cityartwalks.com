/**
 * @fileoverview Generic user display element component for forms
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Elements
 *
 * @requires {@link module:react} - React library
 * @requires {@link module:react-hook-form} - Form management library
 * @requires {@link module:@mui/material} - Material-UI components
 * @requires {@link module:src/components/error/error-boundary} - Error boundary wrapper
 * @requires {@link module:src/actions/user/hooks} - User data fetching hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, Avatar, TextField, Typography, CircularProgress } from '@mui/material';

import { useGetUser } from 'src/actions/user/hooks';

import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementUser
 * @description Generic user display component for forms. Fetches and displays user information
 * including avatar and name based on user ID. Used for audit fields like createdBy, updatedBy.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="createdBy"] - Form field name for the user ID
 * @param {string} [props.label="Created By"] - Display label for the field
 * @param {string} [props.helperText="User who performed this action"] - Helper text explaining the field
 * @param {boolean} [props.disabled=true] - Whether the field is disabled (default: true for read-only)
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered user element component
 *
 * @example
 * // Basic usage for created by field
 * <ElementUser />
 *
 * @example
 * // Custom usage for updated by field
 * <ElementUser
 *   name="updatedBy"
 *   label="Last Updated By"
 *   helperText="User who last modified this record"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementUser(props) {
  const {
    name = 'createdBy',
    label = 'Created By',
    helperText = 'User who performed this action',
    disabled = true,
    sx,
    ...other
  } = props;

  const { control, watch } = useFormContext();
  const { accessToken } = useAuthContext();

  // Watch the user ID field value
  const userId = watch(name);

  // Use the proper hook to fetch user data
  const { user, userLoading, userError } = useGetUser(userId, accessToken);

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Box sx={{ position: 'relative' }}>
            <TextField
              {...field}
              fullWidth
              label={label}
              disabled={disabled}
              error={!!error}
              helperText={error ? error.message : helperText}
              value={userId || ''}
              sx={{
                ...sx,
                '& .MuiInputBase-input': {
                  paddingLeft: user ? '60px' : '14px',
                },
              }}
              {...other}
            />

            {/* User Avatar and Name Overlay */}
            {user && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <Avatar
                  src={user.profileImageUrl || user.avatar}
                  alt={user.displayName || user.name}
                  sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
                >
                  {(user.displayName || user.name)?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                  }}
                >
                  {user.displayName || user.name}
                </Typography>
              </Box>
            )}

            {/* Loading Indicator */}
            {userLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Loading user...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {userError && userId && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'error.main' }}>
                  ?
                </Avatar>
                <Typography variant="body2" color="error">
                  User not found
                </Typography>
              </Box>
            )}
          </Box>
        )}
      />
    </ErrorBoundary>
  );
}

ElementUser.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
