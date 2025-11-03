/**
 * @namespace CityArtWalks.Components.Table.TableSearchFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Stack, TextField, InputAdornment } from '@mui/material';

import { SearchIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Table.TableSearchFilter
 * @description TableSearchFilter component provides a reusable search input with debounced functionality
 * specifically designed for table toolbars. It maintains consistent styling with other filter components
 * and provides responsive behavior across different screen sizes.
 *
 * Key Features:
 * - Debounced input to reduce API calls
 * - Consistent sizing with location filter components
 * - Responsive design with proper mobile styling
 * - Search icon for visual clarity
 * - Accessibility support with proper labeling
 *
 * @component
 * @example
 * // Basic usage in table toolbar
 * <TableSearchFilter
 *   value={searchValue}
 *   onDebouncedChange={handleSearchChange}
 *   placeholder="Search art pieces..."
 *   debounceDelay={300}
 * />
 *
 * @param {Object} props - Component props.
 * @param {string} props.value - Current search state value.
 * @param {Function} props.onDebouncedChange - Handler to update the search state.
 * @param {string} [props.placeholder='Search...'] - Placeholder text.
 * @param {number} [props.debounceDelay=500] - Debounce delay in milliseconds.
 * @returns {JSX.Element} The rendered search filter component.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */
export function TableSearchFilter({
  value,
  onDebouncedChange,
  placeholder = 'Search...',
  debounceDelay = 500,
}) {
  const [inputValue, setInputValue] = useState(value);

  // Sync inputValue to the parent state after debounce delay
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onDebouncedChange(inputValue);
      }
    }, debounceDelay);

    return () => clearTimeout(handler); // Cleanup timeout on component unmount or input change
  }, [inputValue, debounceDelay, value, onDebouncedChange]);

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        sx={{
          minWidth: { xs: '100%', sm: 150 },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(145, 158, 171, 0.32)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(145, 158, 171, 0.48)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

TableSearchFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onDebouncedChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceDelay: PropTypes.number,
};
