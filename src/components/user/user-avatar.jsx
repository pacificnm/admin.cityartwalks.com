import Link from 'next/link';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { debugError } from 'src/lib/debug';
import { useImageMutations } from 'src/actions/image';
import { updateUserProfileImage } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

/**
 * Renders a user avatar with upload capability and support for multiple avatars in a group.
 *
 * @param {Object} props - The component props.
 * @param {string} props.userId - The unique identifier of the user.
 * @param {string} props.alt - The alternative text for the avatar image.
 * @param {string} props.src - The source URL of the avatar image.
 * @param {boolean} [props.uploadable] - If true, shows camera icon and enables upload.
 * @returns {JSX.Element} The rendered UserAvatar component.
 */
export function UserAvatar({ userId, alt, src, uploadable }) {
  const { user, loading, accessToken } = useAuthContext();

  const fileInputRef = useRef();
  const [avatarUrl, setAvatarUrl] = useState(src);
  const [uploading, setUploading] = useState(false);
  const { uploadAndCreateImage } = useImageMutations(accessToken);

  const handleCameraClick = () => {
    if (!userId) {
      toast.error('User ID is required to upload an avatar');
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        // Check userId before proceeding
        if (!userId) {
          toast.error('User ID is missing');
          setUploading(false);
          return;
        }

        const imageData = {
          imageType: 'avatarImage',
          userId,
        };
        const response = await uploadAndCreateImage(file, imageData);
        if (response.status === 'success' && response.data?.url) {
          const image = response.data?.url;
          const updatedUser = await updateUserProfileImage(userId, image, accessToken);
          if (updatedUser.status === 'success') {
            toast.success('Avatar uploaded successfully');
            setAvatarUrl(image);
          } else {
            toast.error('Update user failed: No user update response');
            debugError('UserAvatar.handleFileChange', 'Update user failed', updatedUser);
          }
        } else {
          toast.error('Upload failed: No image URL returned');
          debugError('UserAvatar.handleFileChange', 'Upload failed', response);
        }
      } catch (err) {
        toast.error(err.message || 'Upload failed');
        debugError('UserAvatar.handleFileChange', 'Error uploading avatar', err);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('No file selected for upload');
      e.target.value = '';
    }
  };

  // Only allow upload if current user is admin or matches userId
  const canUpload =
    uploadable && user && (user.role === 'ADMIN' || String(user.userId) === String(userId));
  if (loading) return null;
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        component={Link}
        href={`/member/${userId}`}
        key={userId}
        alt={alt}
        src={avatarUrl}
        sx={[
          (theme) => ({
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.vars.palette.common.white}`,
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8,
            },
          }),
        ]}
      >
        {alt?.charAt(0).toUpperCase()}
      </Avatar>
      {canUpload && (
        <IconButton
          aria-label="Upload avatar"
          onClick={handleCameraClick}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.48)',
            color: 'common.white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
            width: 40,
            height: 40,
          }}
          size="medium"
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Iconify icon="solar:camera-add-bold" width={24} height={24} />
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
    </Box>
  );
}
