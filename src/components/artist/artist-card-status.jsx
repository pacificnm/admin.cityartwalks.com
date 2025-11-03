/**
 * @fileoverview Artist Card Status Component
 *
 * Renders status indicators for artist cards with ownership validation
 * and color-coded status chips. Handles authentication-aware ownership
 * checks and provides visual status management for artist creators.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.Artist
 * @memberof CityArtWalks.Components.Artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist|Artist Schema Documentation}
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

/**
 * Artist Card Status Component
 *
 * Renders owner-only status indicators with color-coded chips positioned
 * in the top-right corner of artist cards. Validates ownership through
 * authentication context and provides visual status management.
 *
 * Features:
 * - Owner-only visibility with authentication validation
 * - Color-coded status chips (success, warning, info, error)
 * - Positioned overlay design for card integration
 * - OwnerGuard protection for sensitive status information
 * - Responsive typography and spacing
 * - Artist-specific status color mapping
 *
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistCardStatus
 * @param {Object} props - The component props
 * @param {('ACTIVE'|'ARCHIVED'|'REVIEW'|'DELETED')} [props.status] - Current status of the artist
 * @param {(string|number)} [props.createdBy] - User ID of the artist creator (for ownership validation)
 * @returns {JSX.Element|null} The rendered status component or null if not owner or no status
 *
 * @example
 * // Basic usage within artist card
 * <ArtistCardStatus
 *   status="ACTIVE"
 *   createdBy="123"
 * />
 *
 * @example
 * // Usage with different status values
 * <ArtistCardStatus status="REVIEW" createdBy={userId} />
 * <ArtistCardStatus status="ARCHIVED" createdBy="456" />
 * <ArtistCardStatus status="DELETED" createdBy={789} />
 *
 * @example
 * // Status color mapping for Artist entities:
 * // ACTIVE → Green chip (success) - Published and visible
 * // REVIEW → Orange chip (warning) - Under review or approval
 * // ARCHIVED → Blue chip (info) - Archived but preserved
 * // DELETED → Red chip (error) - Marked for deletion
 */
export function ArtistCardStatus(props) {
  const { status, createdBy } = props;
  const { user } = useAuthContext();

  /**
   * Determines if the current authenticated user owns this artist.
   * Compares user ID from auth context with the createdBy prop.
   * Uses Number() conversion to handle both string and number ID formats.
   *
   * @type {boolean}
   */
  const isOwner = user && createdBy && Number(user.userId) === Number(createdBy);

  /**
   * Maps artist status values to Material-UI chip color schemes.
   * Provides visual status indicators for artist management.
   *
   * @function getStatusColors
   * @param {string} statusValue - The status string to map
   * @returns {Object} Object containing chip color configuration
   * @returns {string} returns.chipColor - Material-UI color variant (success|warning|info|error)
   *
   * Status Color Mapping:
   * - ACTIVE: Green (success) - Published and visible
   * - REVIEW: Orange (warning) - Under review or approval
   * - ARCHIVED: Blue (info) - Archived but preserved
   * - DELETED: Red (error) - Marked for deletion
   */
  const getStatusColors = (statusValue) => {
    switch (statusValue?.toUpperCase()) {
      case 'ACTIVE':
        return {
          chipColor: 'success',
        };
      case 'REVIEW':
        return {
          chipColor: 'warning',
        };
      case 'ARCHIVED':
        return {
          chipColor: 'info',
        };
      case 'DELETED':
        return {
          chipColor: 'error',
        };
      default:
        return {
          chipColor: 'default',
        };
    }
  };

  const { chipColor } = getStatusColors(status);

  // Only render if user owns the artist and status exists
  if (!isOwner || !status) {
    return null;
  }

  return (
    <OwnerGuard userId={createdBy}>
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
        }}
      >
        <Chip
          label={status || 'Unknown'}
          color={chipColor}
          size="small"
          variant="filled"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: '0.7rem',
          }}
        />
      </Box>
    </OwnerGuard>
  );
}

/**
 * PropTypes Validation for ArtistCardStatus Component
 *
 * @memberof CityArtWalks.Components.Artist
 * @name ArtistCardStatus.propTypes
 * @type {Object}
 * @property {string} [status] - Artist status for color mapping (ACTIVE|ARCHIVED|REVIEW|DELETED)
 * @property {(string|number)} [createdBy] - Creator user ID for ownership validation
 */
ArtistCardStatus.propTypes = {
  status: PropTypes.oneOf(['ACTIVE', 'ARCHIVED', 'REVIEW', 'DELETED']),
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
