/**
 * @fileoverview Art Piece Avatar Action Component
 *
 * Renders an upload action button for art piece avatar images with admin-only
 * functionality. Handles file upload, image processing, and art piece updates
 * with comprehensive error handling and user feedback.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.ArtPiece
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 */

'use client';

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useCreateImage } from 'src/actions/image';
import { useUpdateArtPiece } from 'src/actions/art-piece';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Art Piece Avatar Action Component
 *
 * Renders an upload action button for art piece avatar images with admin-only
 * access control. Provides complete upload workflow including file selection,
 * image upload, art piece update, and user feedback.
 *
 * Features:
 * - Admin-only access control with role validation
 * - File input integration with camera icon trigger
 * - Progress indication during upload process
 * - Comprehensive error handling and user feedback
 * - Automatic art piece record updates
 * - Toast notifications for success/error states
 * - Accessibility-compliant button labeling
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceAvatarAction
 * @param {Object} props - The component props
 * @param {string} props.artPieceId - Unique identifier for the art piece (required for uploads)
 * @param {(string|number)} [props.createdBy] - User ID of the art piece creator (for ownership validation)
 * @param {boolean} [props.uploadable=false] - If true, shows upload action for admin users
 * @param {Function} [props.onUploadSuccess] - Callback fired when upload completes successfully
 * @returns {JSX.Element|null} The rendered upload action button or null if not uploadable/admin
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/auth/Admin-Controls|Admin Controls}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Upload-Components|Upload Components}
 *
 * @example
 * // Basic usage within art piece avatar
 * <ArtPieceAvatarAction
 *   artPieceId="123"
 *   uploadable={true}
 *   onUploadSuccess={(imageUrl) => setAvatarUrl(imageUrl)}
 * />
 *
 * @example
 * // Usage with error handling
 * <ArtPieceAvatarAction
 *   artPieceId="456"
 *   uploadable={user?.role === 'ADMIN'}
 *   onUploadSuccess={(imageUrl) => {
 *     updateLocalState(imageUrl);
 *     toast.success('Avatar updated successfully!');
 *   }}
 * />
 *
 * @example
 * // Conditional rendering based on permissions
 * {canEdit && (
 *   <ArtPieceAvatarAction
 *     artPieceId={artPiece.id}
 *     uploadable={true}
 *     onUploadSuccess={handleAvatarUpdate}
 *   />
 * )}
 *
 * @example
 * // Upload workflow:
 * // 1. User clicks camera icon
 * // 2. File dialog opens
 * // 3. User selects image file
 * // 4. File uploads to server
 * // 5. Art piece record updates with new image URL
 * // 6. onUploadSuccess callback fires
 * // 7. UI updates with new avatar
 *
 * @example
 * // Error scenarios handled:
 * // - Missing artPieceId
 * // - No file selected
 * // - Upload server errors
 * // - Art piece update failures
 * // - Network connectivity issues
 *
 * @example
 * // Admin access control:
 * // - Only users with role 'ADMIN' can upload
 * // - Button hidden for non-admin users
 * // - Authentication state checked before upload
 *
 * @example
 * // Accessibility features:
 * // - Proper ARIA labels for screen readers
 * // - Keyboard navigation support
 * // - Loading state indication
 * // - High contrast button styling
 */
export function ArtPieceAvatarAction({
  artPieceId,
  createdBy,
  uploadable = false,
  onUploadSuccess,
}) {
  const { user } = useAuthContext();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const createImage = useCreateImage();
  const updateArtPiece = useUpdateArtPiece();

  /**
   * Handles camera icon click to trigger file input dialog.
   * Validates that artPieceId is present before opening file selector.
   *
   * @function handleCameraClick
   * @returns {void}
   */
  const handleCameraClick = () => {
    if (!artPieceId) {
      toast.error('Art piece ID is required to upload an avatar');
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };

  /**
   * Handles file selection and upload process.
   * Manages complete upload workflow including file validation,
   * server upload, art piece update, and user feedback.
   *
   * @function handleFileChange
   * @param {Event} e - File input change event
   * @returns {Promise<void>}
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageType', 'artPieceImage');
        formData.append('artPieceId', artPieceId);
        const response = await createImage(formData);
        if (response.status === 'success' && response.data?.url) {
          const image = response.data?.url;
          const updatedArtPiece = await updateArtPiece(artPieceId, { image });
          if (updatedArtPiece.status === 'success') {
            toast.success('Art piece image uploaded successfully');
            if (onUploadSuccess) {
              onUploadSuccess(image);
            }
          } else {
            toast.error('Update art piece failed: No art piece update response');
            console.error('Update art piece failed:', updatedArtPiece);
          }
        } else {
          toast.error('Upload failed: No image URL returned');
          console.error('Upload failed:', response);
        }
      } catch (err) {
        toast.error(err.message || 'Upload failed');
        console.error('Error uploading art piece image:', err);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('No file selected for upload');
      e.target.value = '';
    }
  };

  // Only allow upload if current user is admin or owner of the art piece
  const canUpload =
    uploadable &&
    user &&
    (user.role === 'ADMIN' || (createdBy && String(user.userId) === String(createdBy)));

  // Don't render if user cannot upload
  if (!canUpload) {
    return null;
  }

  return (
    <IconButton
      aria-label="Upload artist avatar"
      onClick={handleCameraClick}
      sx={{
        position: 'absolute',
        bottom: -28,
        right: -8,
        zIndex: 12,
        bgcolor: 'rgba(0,0,0,0.48)',
        color: 'common.white',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
        width: 24,
        height: 24,
      }}
      size="small"
      disabled={uploading}
    >
      {uploading ? (
        <CircularProgress size={12} color="inherit" />
      ) : (
        <Iconify icon="solar:camera-add-bold" width={12} height={12} />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </IconButton>
  );
}

/**
 * PropTypes Validation for ArtPieceAvatarAction Component
 *
 * Defines the expected prop types and validation rules for the ArtPieceAvatarAction component.
 * Ensures type safety and provides development-time warnings for incorrect prop usage.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @name ArtPieceAvatarAction.propTypes
 * @type {Object}
 * @property {string} artPieceId - Unique identifier for the art piece (required)
 * @property {boolean} [uploadable] - If true, shows upload action for admin users
 * @property {Function} [onUploadSuccess] - Callback fired when upload completes successfully
 *
 * @example
 * // PropTypes validation will warn if required props are missing:
 * // Warning: Failed prop type: The prop `artPieceId` is marked as required
 * // in `ArtPieceAvatarAction`, but its value is `undefined`.
 *
 * @example
 * // PropTypes validation will warn for incorrect types:
 * // Warning: Failed prop type: Invalid prop `uploadable` of type `string`
 * // supplied to `ArtPieceAvatarAction`, expected `boolean`.
 */
ArtPieceAvatarAction.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploadable: PropTypes.bool,
  onUploadSuccess: PropTypes.func,
};
