/**
 * @namespace CityArtWalks.Components.Filters.NumberRangeFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { CloseIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.NumberRangeFilter
 * @description NumberRangeFilter component provides a reusable number range filter with clear functionality.
 * It includes two number input fields (min and max) and a clear button when values are entered.
 *
 * Key Features:
 * - Min and Max number input fields
 * - Clear button when values are entered
 * - Customizable labels and field widths
 * - Input validation with min value constraints
 * - Responsive design with flexible layout
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <NumberRangeFilter
 *   minValue={filters.minViewCount}
 *   maxValue={filters.maxViewCount}
 *   onMinChange={(value) => handleFilterChange('minViewCount', value)}
 *   onMaxChange={(value) => handleFilterChange('maxViewCount', value)}
 *   onClear={() => {
 *     handleFilterChange('minViewCount', '');
 *     handleFilterChange('maxViewCount', '');
 *   }}
 *   minLabel="Min Views"
 *   maxLabel="Max Views"
 * />
 *
 * @param {Object} props - The component props.
 * @param {string|number} props.minValue - Current minimum value.
 * @param {string|number} props.maxValue - Current maximum value.
 * @param {Function} props.onMinChange - Callback function when minimum value changes.
 * @param {Function} props.onMaxChange - Callback function when maximum value changes.
 * @param {Function} props.onClear - Callback function to clear both values.
 * @param {string} [props.minLabel="Min"] - Label for the minimum input field.
 * @param {string} [props.maxLabel="Max"] - Label for the maximum input field.
 * @param {string} [props.minAriaLabel="Minimum value filter"] - ARIA label for min input.
 * @param {string} [props.maxAriaLabel="Maximum value filter"] - ARIA label for max input.
 * @param {string} [props.clearAriaLabel="Clear number range filter"] - ARIA label for clear button.
 * @param {number} [props.fieldWidth=120] - Width of input fields.
 * @param {number} [props.minConstraint=0] - Minimum allowed value constraint.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The NumberRangeFilter component.
 */
export function NumberRangeFilter({
  minValue = '',
  maxValue = '',
  onMinChange,
  onMaxChange,
  onClear,
  minLabel = 'Min',
  maxLabel = 'Max',
  minAriaLabel = 'Minimum value filter',
  maxAriaLabel = 'Maximum value filter',
  clearAriaLabel = 'Clear number range filter',
  fieldWidth = 120,
  minConstraint = 0,
  sx = {},
}) {
  const hasValues = minValue || maxValue;

  /**
   * Handles minimum value change
   * @memberof CityArtWalks.Components.Filters.NumberRangeFilter
   * @param {Event} event - The input change event
   */
  const handleMinChange = (event) => {
    onMinChange(event.target.value);
  };

  /**
   * Handles maximum value change
   * @memberof CityArtWalks.Components.Filters.NumberRangeFilter
   * @param {Event} event - The input change event
   */
  const handleMaxChange = (event) => {
    onMaxChange(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', ...sx }}>
      <TextField
        label={minLabel}
        type="number"
        size="small"
        value={minValue}
        onChange={handleMinChange}
        sx={{ width: fieldWidth }}
        slotProps={{
          htmlInput: { min: minConstraint },
        }}
        aria-label={minAriaLabel}
      />
      <TextField
        label={maxLabel}
        type="number"
        size="small"
        value={maxValue}
        onChange={handleMaxChange}
        sx={{ width: fieldWidth }}
        slotProps={{
          htmlInput: { min: minConstraint },
        }}
        aria-label={maxAriaLabel}
      />
      {hasValues && (
        <IconButton size="small" onClick={onClear} aria-label={clearAriaLabel}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
}

NumberRangeFilter.propTypes = {
  minValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMinChange: PropTypes.func.isRequired,
  onMaxChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  minAriaLabel: PropTypes.string,
  maxAriaLabel: PropTypes.string,
  clearAriaLabel: PropTypes.string,
  fieldWidth: PropTypes.number,
  minConstraint: PropTypes.number,
  sx: PropTypes.object,
};
