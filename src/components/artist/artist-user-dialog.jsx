/**
 * @file artist-user-dialog.jsx
 * @description Dialog component for displaying user details from artist records
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

/**
 * @description Dialog for displaying detailed user information with avatar, status, and actions
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistUserDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {Object} props.user - User data object
 * @param {boolean} props.loading - Whether user data is loading
 * @returns {JSX.Element} The Artist User Dialog component.
 */
export function ArtistUserDialog({ open, onClose, user, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        User Details
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        ) : user ? (
          <Box sx={{ pt: 2 }}>
            {/* Status Badge in Upper Right */}
            <Box sx={{ position: 'absolute', top: 72, right: 24 }}>
              <Chip
                label={user.status || 'N/A'}
                size="small"
                color={user.status === 'ACTIVE' ? 'success' : 'default'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* Avatar and Info Layout */}
            <Stack direction="row" spacing={3}>
              {/* Avatar on Left */}
              <Box sx={{ flexShrink: 0 }}>
                <Avatar src={user.image} alt={user.name} sx={{ width: 100, height: 100 }} />
              </Box>

              {/* User Information on Right */}
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.name || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email
                  </Typography>
                  <Typography variant="body2">{user.email || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Chip
                    label={user.role || 'N/A'}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  />
                </Box>
              </Stack>
            </Stack>

            {/* Additional Info Below */}
            <Stack spacing={2} sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              {user.city && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {user.city}, {user.state}, {user.country}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={4}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Login
                  </Typography>
                  <Typography variant="body2">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>Failed to load user data</Box>
        )}
      </DialogContent>
      {user && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            component={RouterLink}
            href={paths.user.details(user.userId)}
            variant="contained"
            color="primary"
          >
            View User
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
