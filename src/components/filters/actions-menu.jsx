/**
 * @namespace CityArtWalks.Components.Filters.ActionsMenu
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { StarIcon, PrintIcon, RefreshIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.ActionsMenu
 * @description ActionsMenu component provides a reusable actions menu with common bulk operations.
 * It includes print, import, export, feature toggle, and clear filters functionality.
 *
 * Key Features:
 * - Print action with selected row count
 * - Import/Export data functionality
 * - Toggle featured items for selected rows
 * - Clear all filters action
 * - Proper disabled states based on context
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <ActionsMenu
 *   open={menuOpen}
 *   anchorEl={anchorElement}
 *   onClose={handleClose}
 *   onBulkAction={handleBulkAction}
 *   onClearFilters={handleClearFilters}
 *   selectedRows={selectedRows}
 *   activeFilterCount={activeFilterCount}
 * />
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the menu popover is open.
 * @param {HTMLElement} props.anchorEl - The anchor element for the popover.
 * @param {Function} props.onClose - Callback function when menu closes.
 * @param {Function} [props.onBulkAction] - Callback function for bulk actions.
 * @param {Function} [props.onClearFilters] - Callback function to clear all filters.
 * @param {Array} [props.selectedRows=[]] - Array of currently selected rows.
 * @param {number} [props.activeFilterCount=0] - Number of active filters.
 * @param {Object} [props.slotProps] - Additional props for CustomPopover.
 * @returns {JSX.Element} The ActionsMenu component.
 */
export function ActionsMenu({
  open,
  anchorEl,
  onClose,
  onBulkAction,
  onClearFilters,
  selectedRows = [],
  activeFilterCount = 0,
  slotProps = { arrow: { placement: 'right-top' } },
}) {
  /**
   * Handles bulk action with menu close
   * @memberof CityArtWalks.Components.Filters.ActionsMenu
   * @param {string} action - The action type
   */
  const handleBulkAction = (action) => {
    onBulkAction && onBulkAction(action, selectedRows);
    onClose();
  };

  /**
   * Handles clear filters with menu close
   * @memberof CityArtWalks.Components.Filters.ActionsMenu
   */
  const handleClearFilters = () => {
    onClearFilters && onClearFilters();
    onClose();
  };

  return (
    <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose} slotProps={slotProps}>
      <MenuList>
        <MenuItem onClick={() => handleBulkAction('print')} disabled={!onBulkAction}>
          <PrintIcon />
          Print {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
        </MenuItem>

        <MenuItem onClick={() => handleBulkAction('import')} disabled={!onBulkAction}>
          <Iconify icon="solar:import-bold" />
          Import Data
        </MenuItem>

        <MenuItem onClick={() => handleBulkAction('export')} disabled={!onBulkAction}>
          <Iconify icon="solar:export-bold" />
          Export {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
        </MenuItem>

        <MenuItem
          onClick={() => handleBulkAction('feature')}
          disabled={!onBulkAction || selectedRows.length === 0}
        >
          <StarIcon />
          Toggle Featured ({selectedRows.length})
        </MenuItem>

        <MenuItem onClick={handleClearFilters} disabled={activeFilterCount === 0}>
          <RefreshIcon />
          Clear All Filters
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );
}

ActionsMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onBulkAction: PropTypes.func,
  onClearFilters: PropTypes.func,
  selectedRows: PropTypes.array,
  activeFilterCount: PropTypes.number,
  slotProps: PropTypes.object,
};
