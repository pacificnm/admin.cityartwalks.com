/**
 * @fileoverview IndexNow Status Chip Component
 * @namespace CityArtWalks.Components.IndexNow
 */

import Chip from '@mui/material/Chip';

import { ClockIcon, DocumentIcon, CheckCircleIcon, CloseCircleIcon } from 'src/components/icons';

export function StatusChip({ status }) {
  const statusConfig = {
    PENDING: { label: 'Pending', color: 'warning', icon: <ClockIcon size={16} /> },
    SUBMITTED: { label: 'Submitted', color: 'info', icon: <DocumentIcon size={16} /> },
    SUCCESS: { label: 'Success', color: 'success', icon: <CheckCircleIcon size={16} /> },
    FAILED: { label: 'Failed', color: 'error', icon: <CloseCircleIcon size={16} /> },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon}
      variant="soft"
    />
  );
}
