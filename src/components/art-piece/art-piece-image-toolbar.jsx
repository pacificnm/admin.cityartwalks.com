/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Toolbar component for art piece image list with sorting and count display.
 */

'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { debugLog } from 'src/lib/debug';

import { AddIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar
 * @function ArtPieceImageToolbar
 * @description Displays image count and sorting controls for the art piece image list.
 * Provides sorting by popularity (positive reviews) and date options.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number|string} props.artPieceId - The ID of the art piece (for upload context).
 * @param {number} [props.totalCount=0] - Total number of images.
 * @param {string} [props.sortBy='popularity'] - Current sort option.
 * @param {Function} [props.onSortChange] - Callback when sort option changes.
 * @param {Function} [props.onUpload] - Callback when upload button is clicked.
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArtPieceImageToolbar component.
 *
 * @example
 * <ArtPieceImageToolbar
 *   artPieceId={123}
 *   totalCount={24}
 *   sortBy="popularity"
 *   onSortChange={handleSortChange}
 *   onUpload={handleUpload}
 * />
 */
export function ArtPieceImageToolbar(props) {
  const {
    artPieceId,
    totalCount = 0,
    sortBy = 'popularity',
    onSortChange,
    onUpload,
    sx,
    ...other
  } = props;

  const { user } = useAuthContext();

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar
   * @function handleSortChange
   * @description Handles sort option change and calls parent callback.
   * @private
   * @param {Object} event - The event object.
   */
  const handleSortChange = (event) => {
    const newSort = event.target.value;
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar.handleSortChange',
      'Sort changed',
      {
        from: sortBy,
        to: newSort,
      }
    );

    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar
   * @function handleUpload
   * @description Handles upload button click and calls parent callback.
   * @private
   */
  const handleUpload = () => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar.handleUpload',
      'Upload button clicked',
      {
        artPieceId,
        userId: user?.userId,
      }
    );

    if (onUpload) {
      onUpload();
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={sx} {...other}>
      {/* Left Side - Image Count */}
      <Typography variant="h6" component="h2">
        Images ({totalCount})
      </Typography>

      {/* Right Side - Sort Control and Upload Button */}
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Sort Control */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={handleSortChange}>
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="date">Newest First</MenuItem>
          </Select>
        </FormControl>

        {/* Upload Button - Only for members and admins */}
        <RoleBasedGuard allowedRoles={['MEMBER', 'ADMIN']} protecting="ArtPieceImageToolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleUpload} size="small">
            Upload Image
          </Button>
        </RoleBasedGuard>
      </Stack>
    </Stack>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageToolbar
 * PropTypes validation for the ArtPieceImageToolbar component
 */
ArtPieceImageToolbar.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  totalCount: PropTypes.number,
  sortBy: PropTypes.oneOf(['popularity', 'date']),
  onSortChange: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
};
