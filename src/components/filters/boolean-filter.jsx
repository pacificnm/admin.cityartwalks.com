/**
 * @namespace CityArtWalks.Components.Filters.BooleanFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { CloseIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.BooleanFilter
 * @description BooleanFilter component provides a reusable boolean/toggle filter with clear functionality.
 * It includes a switch control and a clear button when the switch is enabled.
 *
 * Key Features:
 * - Switch control for boolean filtering
 * - Clear button when switch is enabled
 * - Customizable label and colors
 * - Responsive design with flexible layout
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <BooleanFilter
 *   value={filters.featured}
 *   onChange={(checked) => handleFilterChange('featured', checked)}
 *   onClear={() => handleFilterChange('featured', false)}
 *   label="Featured"
 * />
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.value - Current boolean value.
 * @param {Function} props.onChange - Callback function when switch value changes.
 * @param {Function} props.onClear - Callback function to clear/reset the filter.
 * @param {string} [props.label="Toggle"] - Label for the switch control.
 * @param {string} [props.ariaLabel="Toggle filter"] - ARIA label for accessibility.
 * @param {string} [props.clearAriaLabel="Clear toggle filter"] - ARIA label for clear button.
 * @param {string} [props.color="info"] - Color theme for the switch.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The BooleanFilter component.
 */
export function BooleanFilter({
  value = false,
  onChange,
  onClear,
  label = 'Toggle',
  ariaLabel = 'Toggle filter',
  clearAriaLabel = 'Clear toggle filter',
  color = 'info',
  sx = {},
}) {
  /**
   * Handles switch change
   * @memberof CityArtWalks.Components.Filters.BooleanFilter
   * @param {Event} event - The switch change event
   */
  const handleChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={handleChange} color={color} aria-label={ariaLabel} />
        }
        label={label}
        sx={{ minWidth: 'auto', mr: 0 }}
      />
      {value && (
        <IconButton size="small" onClick={onClear} aria-label={clearAriaLabel} sx={{ ml: 0.5 }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
}

BooleanFilter.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  clearAriaLabel: PropTypes.string,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
  ]),
  sx: PropTypes.object,
};
