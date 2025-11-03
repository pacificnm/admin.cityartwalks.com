/**
 * @namespace CityArtWalks.Components.Filters.DateFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { CloseIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.DateFilter
 * @description DateFilter component provides a reusable date range filter with clear functionality.
 * It includes two date pickers (from and to) and a clear button when dates are selected.
 *
 * Key Features:
 * - From and To date pickers
 * - Clear button when dates are selected
 * - Customizable labels and field names
 * - Responsive design with flexible layout
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <DateFilter
 *   fromValue={filters.creationDateFrom}
 *   toValue={filters.creationDateTo}
 *   onFromChange={(value) => handleFilterChange('creationDateFrom', value)}
 *   onToChange={(value) => handleFilterChange('creationDateTo', value)}
 *   onClear={() => {
 *     handleFilterChange('creationDateFrom', null);
 *     handleFilterChange('creationDateTo', null);
 *   }}
 *   fromLabel="Created From"
 *   toLabel="Created To"
 * />
 *
 * @param {Object} props - The component props.
 * @param {Date|null} props.fromValue - Current "from" date value.
 * @param {Date|null} props.toValue - Current "to" date value.
 * @param {Function} props.onFromChange - Callback function when "from" date changes.
 * @param {Function} props.onToChange - Callback function when "to" date changes.
 * @param {Function} props.onClear - Callback function to clear both dates.
 * @param {string} [props.fromLabel="From"] - Label for the "from" date picker.
 * @param {string} [props.toLabel="To"] - Label for the "to" date picker.
 * @param {string} [props.fromAriaLabel="Filter by date from"] - ARIA label for "from" date picker.
 * @param {string} [props.toAriaLabel="Filter by date to"] - ARIA label for "to" date picker.
 * @param {string} [props.clearAriaLabel="Clear date filter"] - ARIA label for clear button.
 * @param {number} [props.minWidth=150] - Minimum width of date picker inputs.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The DateFilter component.
 */
export function DateFilter({
  fromValue = null,
  toValue = null,
  onFromChange,
  onToChange,
  onClear,
  fromLabel = 'From',
  toLabel = 'To',
  fromAriaLabel = 'Filter by date from',
  toAriaLabel = 'Filter by date to',
  clearAriaLabel = 'Clear date filter',
  minWidth = 150,
  sx = {},
}) {
  const hasValues = fromValue || toValue;

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', ...sx }}>
      <DatePicker
        label={fromLabel}
        value={fromValue}
        onChange={onFromChange}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth },
          },
        }}
        aria-label={fromAriaLabel}
      />
      <DatePicker
        label={toLabel}
        value={toValue}
        onChange={onToChange}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth },
          },
        }}
        aria-label={toAriaLabel}
      />
      {hasValues && (
        <IconButton size="small" onClick={onClear} aria-label={clearAriaLabel}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
}

DateFilter.propTypes = {
  fromValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  toValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onFromChange: PropTypes.func.isRequired,
  onToChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  fromLabel: PropTypes.string,
  toLabel: PropTypes.string,
  fromAriaLabel: PropTypes.string,
  toAriaLabel: PropTypes.string,
  clearAriaLabel: PropTypes.string,
  minWidth: PropTypes.number,
  sx: PropTypes.object,
};
