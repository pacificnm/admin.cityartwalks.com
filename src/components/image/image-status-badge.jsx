/**
 * @namespace CityArtWalks.Components.Image.ImageStatusBadge
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Status badges for images showing flags, featured status, and other states.
 */

'use client';

import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

/**
 * @memberof CityArtWalks.Components.Image.ImageStatusBadge
 * @function ImageStatusBadge
 * @description Displays status badges for images showing flags and other status states.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.status - The status of the image (ACTIVE, FLAGGED, REMOVED, etc.).
 * @returns {JSX.Element|null} The rendered ImageStatusBadge component or null if status is ACTIVE.
 *
 * @example
 * <ImageStatusBadge status="FLAGGED" />
 */
export function ImageStatusBadge(props) {
  const { status } = props;

  // Don't render anything for ACTIVE status
  if (status === 'ACTIVE') {
    return null;
  }

  return (
    <>
      {status === 'FLAGGED' && (
        <Chip
          label="Flagged"
          size="small"
          color="warning"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      {status === 'REMOVED' && (
        <Chip
          label="Removed"
          size="small"
          color="error"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      {status === 'ARCHIVED' && (
        <Chip
          label="Archived"
          size="small"
          color="default"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      {status === 'REVIEW' && (
        <Chip
          label="Under Review"
          size="small"
          color="info"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}
    </>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageStatusBadge
 * PropTypes validation for the ImageStatusBadge component
 */
ImageStatusBadge.propTypes = {
  status: PropTypes.oneOf(['ACTIVE', 'FLAGGED', 'REMOVED', 'ARCHIVED', 'REVIEW', 'DELETED'])
    .isRequired,
};
