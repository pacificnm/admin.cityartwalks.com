import { useRef, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

import { debugWarn, debugError } from 'src/lib/debug';
import { useImageMutations } from 'src/actions/image';
import { updateUserCoverImage } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { UserAvatar } from 'src/components/user';

import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export function ProfileCover({
  sx,
  name,
  role,
  coverUrl: initialCoverUrl,
  avatarUrl,
  userId,
  ...other
}) {
  const { user, loading, accessToken } = useAuthContext();

  const fileInputRef = useRef();
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [uploading, setUploading] = useState(false);

  // Use the image upload hook
  const { uploadAndCreateImage } = useImageMutations(accessToken);

  const handleCameraClick = () => {
    if (!userId) {
      toast.error('User ID is required to upload a cover image');
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const imageData = {
          imageType: 'profileCover',
          userId,
        };
        const response = await uploadAndCreateImage(file, imageData);

        if (response.status === 'success' && response.data?.url) {
          // Update user cover image in the backend
          const coverImage = response.data?.url;

          const updatedUser = await updateUserCoverImage(userId, coverImage, accessToken);
          // Check if the user update was successful
          if (updatedUser.status === 'success') {
            toast.success('Cover image uploaded successfully');
            setCoverUrl(response.data.url);
          } else {
            toast.error('Update user failed: No user update response');
            debugError('ProfileCover.handleFileChange', 'Update user failed', updatedUser);
          }
        } else {
          toast.error('Upload failed: No image URL returned');
          debugError('ProfileCover.handleFileChange', 'Upload failed', response);
        }
      } catch (err) {
        toast.error(err.message || 'Upload failed');
        debugError('ProfileCover.handleFileChange', 'Error uploading cover image', err);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('No file selected for upload');
      debugWarn('ProfileCover.handleFileChange', 'No file selected for upload');
      e.target.value = '';
    }
  };

  // Only allow cover upload if current user is admin or matches userId
  const canUpload = user && (user.role === 'ADMIN' || String(user.userId) === String(userId));
  if (loading) return null;

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: 1,
          color: 'common.white',
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Camera icon overlay for cover upload */}
      {canUpload && (
        <IconButton
          aria-label="Upload cover image"
          onClick={handleCameraClick}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 20,
            bgcolor: 'rgba(0,0,0,0.48)',
            color: 'common.white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
          }}
          size="large"
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress size={28} color="inherit" />
          ) : (
            <Iconify icon="solar:camera-add-bold" width={28} height={28} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </IconButton>
      )}
      <Box
        sx={{
          display: 'flex',
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <UserAvatar userId={userId} alt={name} src={avatarUrl} uploadable />
        <Stack direction="column" sx={{ mt: 3, ml: { md: 3 } }}>
          <ListItemText
            primary={name}
            secondary={role}
            slotProps={{
              primary: { sx: { typography: 'h4' } },
              secondary: {
                sx: { mt: 0.5, opacity: 0.48, color: 'inherit' },
              },
            }}
            sx={{ textAlign: { xs: 'center', md: 'unset' } }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
