/**
 * @file owner-bulk-actions.jsx
 * @description Bulk operations toolbar for content owner review management
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerBulkActions
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

/**
 * @memberof CityArtWalks.Components.Review.OwnerBulkActions
 * @description Flag reason options for bulk flagging
 * @constant {Array<Object>} FLAG_REASONS
 */
const FLAG_REASONS = [
  {
    value: 'INAPPROPRIATE_CONTENT',
    label: 'Inappropriate Content',
    description: 'Content contains inappropriate or offensive material',
  },
  {
    value: 'SPAM',
    label: 'Spam',
    description: 'Review appears to be spam or automated',
  },
  {
    value: 'OFF_TOPIC',
    label: 'Off Topic',
    description: 'Review is not relevant to the content',
  },
  {
    value: 'FAKE_REVIEW',
    label: 'Fake Review',
    description: 'Review appears to be fake or misleading',
  },
  {
    value: 'PERSONAL_ATTACK',
    label: 'Personal Attack',
    description: 'Review contains personal attacks or harassment',
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Other reason requiring admin attention',
  },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerBulkActions
 * @description Bulk flag action component with reason selection
 * @function BulkFlagAction
 * @param {Object} props - Component props
 * @param {Array} props.selected - Selected review IDs
 * @param {Function} props.onFlag - Flag handler function
 * @param {boolean} [props.disabled] - Disabled state
 * @returns {JSX.Element} Bulk flag action component
 */
function BulkFlagAction({ selected, onFlag, disabled = false }) {
  const popover = usePopover();
  const [selectedReason, setSelectedReason] = useState('');

  const handleReasonSelect = useCallback((reason) => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerBulkActions.handleReasonSelect',
      `Selected reason: ${reason}`
    );
    setSelectedReason(reason);
  }, []);

  const handleConfirmFlag = useCallback(() => {
    if (!selectedReason) return;

    debugLog(
      'CityArtWalks.Components.Review.OwnerBulkActions.handleConfirmFlag',
      `Flagging ${selected.length} reviews with reason: ${selectedReason}`
    );

    onFlag(selectedReason);
    popover.onClose();
    setSelectedReason('');
  }, [selectedReason, selected.length, onFlag, popover]);

  return (
    <>
      <Tooltip title="Flag selected reviews for admin review">
        <Button
          color="warning"
          variant="outlined"
          size="small"
          disabled={disabled || selected.length === 0}
          startIcon={<Iconify icon="solar:flag-bold-duotone" />}
          onClick={popover.onOpen}
        >
          Flag ({selected.length})
        </Button>
      </Tooltip>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ paper: { sx: { width: 320 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Flag Reviews for Moderation
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a reason for flagging {selected.length} review{selected.length > 1 ? 's' : ''}:
          </Typography>
        </Box>

        <Divider />

        <MenuList>
          {FLAG_REASONS.map((reason) => (
            <MenuItem
              key={reason.value}
              selected={selectedReason === reason.value}
              onClick={() => handleReasonSelect(reason.value)}
              sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}
            >
              <Typography variant="subtitle2">{reason.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {reason.description}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" color="inherit" onClick={popover.onClose}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="warning"
              disabled={!selectedReason}
              onClick={handleConfirmFlag}
              startIcon={<Iconify icon="solar:flag-bold-duotone" />}
            >
              Flag Reviews
            </Button>
          </Stack>
        </Box>
      </CustomPopover>
    </>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerBulkActions
 * @description Export to CSV action component
 * @function ExportCSVAction
 * @param {Object} props - Component props
 * @param {Array} props.selected - Selected review IDs
 * @param {Function} props.onExport - Export handler function
 * @param {boolean} [props.disabled] - Disabled state
 * @returns {JSX.Element} Export CSV action component
 */
function ExportCSVAction({ selected, onExport, disabled = false }) {
  const handleExport = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerBulkActions.handleExport',
      `Exporting ${selected.length} reviews to CSV`
    );
    onExport(selected);
  }, [selected, onExport]);

  return (
    <Tooltip title="Export selected reviews to CSV file">
      <Button
        color="info"
        variant="outlined"
        size="small"
        disabled={disabled || selected.length === 0}
        startIcon={<Iconify icon="solar:download-bold-duotone" />}
        onClick={handleExport}
      >
        Export ({selected.length})
      </Button>
    </Tooltip>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerBulkActions
 * @description Main bulk actions toolbar for content owner review management
 * @function OwnerBulkActions
 * @param {Object} props - Component props
 * @param {Array} props.selected - Array of selected review IDs
 * @param {Function} [props.onBulkFlag] - Bulk flag handler
 * @param {Function} [props.onBulkExport] - Bulk export handler
 * @param {boolean} [props.disabled] - Disabled state for all actions
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} Owner bulk actions toolbar
 */
export function OwnerBulkActions({
  selected = [],
  onBulkFlag,
  onBulkExport,
  disabled = false,
  sx,
  ...other
}) {
  // Handle bulk flag with reason
  const handleBulkFlag = useCallback(
    (reason) => {
      debugLog(
        'CityArtWalks.Components.Review.OwnerBulkActions.handleBulkFlag',
        `Bulk flagging ${selected.length} reviews with reason: ${reason}`
      );
      if (onBulkFlag) {
        onBulkFlag(selected, reason);
      }
    },
    [selected, onBulkFlag]
  );

  // Handle bulk export
  const handleBulkExport = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerBulkActions.handleBulkExport',
      `Bulk exporting ${selected.length} reviews`
    );
    if (onBulkExport) {
      onBulkExport(selected);
    }
  }, [selected, onBulkExport]);

  if (selected.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="body2" color="text.secondary">
        {selected.length} review{selected.length > 1 ? 's' : ''} selected
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" spacing={1}>
        {/* Bulk Flag Action */}
        {onBulkFlag && (
          <BulkFlagAction selected={selected} onFlag={handleBulkFlag} disabled={disabled} />
        )}

        {/* Bulk Export Action */}
        {onBulkExport && (
          <ExportCSVAction selected={selected} onExport={handleBulkExport} disabled={disabled} />
        )}
      </Stack>
    </Stack>
  );
}

export default OwnerBulkActions;
