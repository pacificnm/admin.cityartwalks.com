/**
 * @namespace CityArtWalks.Components.Filters.SelectFilter
 * @version 1.0.0
 * @author jaimie garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';

import { CloseIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.SelectFilter
 * @description SelectFilter component provides a reusable select dropdown filter with clear functionality.
 * It includes a select control and a clear button when a value is selected.
 *
 * Key Features:
 * - Select dropdown for single-value filtering
 * - Clear button when value is selected
 * - Customizable options and labels
 * - Responsive design with flexible layout
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <SelectFilter
 *   value={filters.pathType}
 *   onChange={(value) => handleFilterChange('pathType', value)}
 *   onClear={() => handleFilterChange('pathType', '')}
 *   options={[
 *     { value: 'WALKING', label: 'Walking' },
 *     { value: 'CYCLING', label: 'Cycling' },
 *   ]}
 *   label="Path Type"
 *   placeholder="Select path type"
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - Current selected value.
 * @param {Function} props.onChange - Callback function when select value changes.
 * @param {Function} props.onClear - Callback function to clear/reset the filter.
 * @param {Array} props.options - Array of option objects with value and label properties.
 * @param {string} [props.label="Select"] - Label for the select control.
 * @param {string} [props.placeholder="Select an option"] - Placeholder text when no value is selected.
 * @param {string} [props.ariaLabel="Select filter"] - ARIA label for accessibility.
 * @param {string} [props.clearAriaLabel="Clear select filter"] - ARIA label for clear button.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The SelectFilter component.
 */
export function SelectFilter({
  value = '',
  onChange,
  onClear,
  options = [],
  label = 'Select',
  placeholder = 'Select an option',
  ariaLabel = 'Select filter',
  clearAriaLabel = 'Clear select filter',
  sx = {},
}) {
  /**
   * Handles select change
   * @memberof CityArtWalks.Components.Filters.SelectFilter
   * @param {Event} event - The select change event
   */
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const hasValue = value && value !== '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200, ...sx }}>
      <FormControl fullWidth size="small">
        <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-select-label`}
          value={value}
          onChange={handleChange}
          label={label}
          displayEmpty
          aria-label={ariaLabel}
        >
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {hasValue && (
        <IconButton size="small" onClick={onClear} aria-label={clearAriaLabel} sx={{ ml: 0.5 }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
}

SelectFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  clearAriaLabel: PropTypes.string,
  sx: PropTypes.object,
};
