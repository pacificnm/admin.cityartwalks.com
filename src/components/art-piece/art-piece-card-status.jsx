/**
 * @fileoverview Art Piece Card Status Component
 *
 * Renders status indicators for art piece cards with ownership validation
 * and color-coded status chips. Handles authentication-aware ownership
 * checks and provides visual status management for art piece creators.
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

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

/**
 * Art Piece Card Status Component
 *
 * Renders owner-only status indicators with color-coded chips positioned
 * in the top-right corner of art piece cards. Validates ownership through
 * authentication context and provides visual status management.
 *
 * Features:
 * - Owner-only visibility with authentication validation
 * - Color-coded status chips (success, warning, error)
 * - Positioned overlay design for card integration
 * - OwnerGuard protection for sensitive status information
 * - Responsive typography and spacing
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceCardStatus
 * @param {Object} props - The component props
 * @param {('ACTIVE'|'PENDING'|'DRAFT'|'REVIEW'|'ARCHIVED')} [props.status] - Current status of the art piece
 * @param {(string|number)} [props.createdBy] - User ID of the art piece creator (for ownership validation)
 * @returns {JSX.Element|null} The rendered status component or null if not owner or no status
 *
 * @example
 * // Basic usage within art piece card
 * <ArtPieceCardStatus
 *   status="ACTIVE"
 *   createdBy="123"
 * />
 *
 * @example
 * // Usage with different status values
 * <ArtPieceCardStatus status="PENDING" createdBy={userId} />
 * <ArtPieceCardStatus status="DRAFT" createdBy="456" />
 * <ArtPieceCardStatus status="REVIEW" createdBy={789} />
 *
 * @example
 * // Status color mapping:
 * // ACTIVE → Green chip (success) - Published and visible
 * // PENDING → Orange chip (warning) - Awaiting review or approval
 * // All others → Red chip (error) - Draft, archived, or error states
 */
export function ArtPieceCardStatus(props) {
  const { status, createdBy } = props;
  const { user } = useAuthContext();

  /**
   * Determines if the current authenticated user owns this art piece.
   * Compares user ID from auth context with the createdBy prop.
   * Uses Number() conversion to handle both string and number ID formats.
   *
   * @type {boolean}
   */
  const isOwner = user && createdBy && Number(user.userId) === Number(createdBy);

  /**
   * Maps art piece status values to Material-UI chip color schemes.
   * Provides visual status indicators for art piece management.
   *
   * @function getStatusColors
   * @param {string} statusValue - The status string to map
   * @returns {Object} Object containing chip color configuration
   * @returns {string} returns.chipColor - Material-UI color variant (success|warning|error)
   *
   * Status Color Mapping:
   * - ACTIVE: Green (success) - Published and visible
   * - PENDING: Orange (warning) - Awaiting review or approval
   * - All others: Red (error) - Draft, archived, or error states
   */
  const getStatusColors = (statusValue) => {
    switch (statusValue?.toUpperCase()) {
      case 'ACTIVE':
        return {
          chipColor: 'success',
        };
      case 'PENDING':
        return {
          chipColor: 'warning',
        };
      default:
        return {
          chipColor: 'error',
        };
    }
  };

  const { chipColor } = getStatusColors(status);

  // Only render if user owns the art piece and status exists
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
 * PropTypes Validation for ArtPieceCardStatus Component
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @name ArtPieceCardStatus.propTypes
 * @type {Object}
 * @property {string} [status] - Art piece status for color mapping
 * @property {(string|number)} [createdBy] - Creator user ID for ownership validation
 */
ArtPieceCardStatus.propTypes = {
  status: PropTypes.string,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
