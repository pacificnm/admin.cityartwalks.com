/**
 * @namespace CityArtWalks.Components.Filters.SearchFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { CloseIcon, SearchIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Filters.SearchFilter
 * @description SearchFilter component provides a reusable search text field with clear functionality.
 * It includes a search icon, placeholder text, and a clear button when there's search text.
 *
 * Key Features:
 * - Search icon in start adornment
 * - Clear button in end adornment when search has value
 * - Customizable placeholder text
 * - Responsive design with flexible sizing
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <SearchFilter
 *   value={search}
 *   onChange={handleSearchChange}
 *   placeholder="Search items..."
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - Current search value.
 * @param {Function} props.onChange - Callback function when search value changes.
 * @param {string} [props.placeholder="Search..."] - Placeholder text for the input.
 * @param {string} [props.ariaLabel="Search"] - ARIA label for accessibility.
 * @param {boolean} [props.fullWidth=true] - Whether the input should take full width.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The SearchFilter component.
 */
export function SearchFilter({
  value = '',
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  fullWidth = true,
  sx = {},
}) {
  /**
   * Handles clearing the search input
   * @memberof CityArtWalks.Components.Filters.SearchFilter
   */
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <TextField
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      sx={{
        minWidth: { xs: '100%', sm: 150 },
        flex: { sm: '1 1 auto' },
        ...sx,
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} aria-label="Clear search">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

SearchFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};
