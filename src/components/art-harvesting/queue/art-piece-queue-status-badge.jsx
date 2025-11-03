/**
 * ArtPieceQueueStatusBadge Component
 *
 * Displays status badges for art piece queue items with appropriate
 * colors and icons based on the queue status.
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @fileoverview Art piece queue status badge component
 * @version 1.0.0
 */

'use client';

import PropTypes from 'prop-types';

import { Label } from 'src/components/label';

/**
 * Get status configuration based on status value
 * @param {string} status - Queue item status
 * @returns {Object} Status configuration with color and label
 */
const getStatusConfig = (status) => {
  const statusMap = {
    PENDING: {
      color: 'warning',
      label: 'Pending',
    },
    PROCESSING: {
      color: 'info',
      label: 'Processing',
    },
    REVIEWING: {
      color: 'secondary',
      label: 'Reviewing',
    },
    APPROVED: {
      color: 'success',
      label: 'Approved',
    },
    REJECTED: {
      color: 'error',
      label: 'Rejected',
    },
    PUBLISHED: {
      color: 'primary',
      label: 'Published',
    },
    ERROR: {
      color: 'error',
      label: 'Error',
    },
  };

  return statusMap[status] || { color: 'default', label: status || 'Unknown' };
};

/**
 * ArtPieceQueueStatusBadge Component
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @param {Object} props - Component properties
 * @param {string} props.status - Queue item status
 * @param {Object} props.sx - Additional MUI sx styles
 * @returns {JSX.Element} Rendered status badge
 */
export function ArtPieceQueueStatusBadge({ status, sx }) {
  const config = getStatusConfig(status);

  return (
    <Label color={config.color} sx={sx}>
      {config.label}
    </Label>
  );
}

ArtPieceQueueStatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'PENDING',
    'PROCESSING',
    'REVIEWING',
    'APPROVED',
    'REJECTED',
    'PUBLISHED',
    'ERROR',
  ]),
  sx: PropTypes.object,
};
