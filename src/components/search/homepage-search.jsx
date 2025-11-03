/**
 * @namespace CityArtWalks.Components.Search.HomepageSearch
 * @description Homepage search component with autocomplete functionality and categorized results
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import {
  Box,
  Chip,
  Avatar,
  TextField,
  Typography,
  Autocomplete,
  ListSubheader,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { useSearchSuggestions } from 'src/actions/search';

import { Iconify } from 'src/components/iconify';
import { SearchIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Search.HomepageSearch
 * @description Homepage search component with autocomplete suggestions and categorized results
 *
 * Features:
 * - Real-time autocomplete suggestions
 * - Categorized search results (Artists, Art Pieces, Cities, Paths)
 * - Location-aware filtering
 * - Keyboard navigation support
 * - Loading states and error handling
 * - Click-to-navigate functionality
 * - Responsive design
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.placeholder="Search for artists, art pieces, or locations..."] - Input placeholder text
 * @param {Object} [props.location] - User's current location for filtering
 * @param {string} [props.location.countryId] - Country ID for location filtering
 * @param {string} [props.location.stateId] - State ID for location filtering
 * @param {string} [props.location.cityId] - City ID for location filtering
 * @param {number} [props.debounceDelay=300] - Debounce delay in milliseconds
 * @param {number} [props.minQueryLength=2] - Minimum query length to trigger search
 * @param {Function} [props.onResultSelect] - Callback when a result is selected
 * @param {Object} [props.sx] - Material-UI sx prop for custom styling
 * @returns {JSX.Element} The rendered homepage search component
 * @example
 * // Basic usage
 * <HomepageSearch
 *   placeholder="Search for art in your city..."
 *   location={userLocation}
 *   onResultSelect={(result) => console.log('Selected:', result)}
 * />
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */
export function HomepageSearch({
  placeholder = 'Search for artists, art pieces, or locations...',
  location,
  debounceDelay = 300,
  minQueryLength = 2,
  onResultSelect,
  sx,
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, debounceDelay);

  // Fetch search suggestions using our hook
  const { data, isLoading, hasResults } = useSearchSuggestions({
    query: debouncedQuery,
    countryId: location?.countryId,
    stateId: location?.stateId,
    cityId: location?.cityId,
    minQueryLength,
    limit: 3, // Show top 3 results per category for autocomplete
  });

  /**
   * @memberof CityArtWalks.Components.Search.HomepageSearch
   * @description Formats search results into grouped options for Autocomplete component
   * @param {Object} searchData - Search results data
   * @returns {Array} Formatted options with group headers
   */
  const formatOptions = useCallback((searchData) => {
    if (!searchData) return [];

    const options = [];

    // Add Artists section
    if (searchData.artists && searchData.artists.length > 0) {
      options.push({ type: 'header', category: 'Artists' });
      searchData.artists.forEach((artist) => {
        options.push({
          ...artist,
          category: 'Artists',
          displayText: artist.name,
          subtitle: artist.location || 'Artist',
          icon: 'mdi:account-music',
        });
      });
    }

    // Add Art Pieces section
    if (searchData.artPieces && searchData.artPieces.length > 0) {
      options.push({ type: 'header', category: 'Art Pieces' });
      searchData.artPieces.forEach((artPiece) => {
        options.push({
          ...artPiece,
          category: 'Art Pieces',
          displayText: artPiece.title,
          subtitle: artPiece.artistName || artPiece.location || 'Art Piece',
          icon: 'mdi:palette',
        });
      });
    }

    // Add Cities section
    if (searchData.cities && searchData.cities.length > 0) {
      options.push({ type: 'header', category: 'Cities' });
      searchData.cities.forEach((city) => {
        options.push({
          ...city,
          category: 'Cities',
          displayText: city.name,
          subtitle: `${city.stateName || ''}, ${city.countryName || ''}`.replace(/^, |, $/, ''),
          icon: 'mdi:city',
        });
      });
    }

    // Add Paths section
    if (searchData.paths && searchData.paths.length > 0) {
      options.push({ type: 'header', category: 'Paths' });
      searchData.paths.forEach((path) => {
        options.push({
          ...path,
          category: 'Paths',
          displayText: path.name,
          subtitle: path.location || `${path.distance || 0}km walk`,
          icon: 'mdi:map-marker-path',
        });
      });
    }

    return options;
  }, []);

  /**
   * @memberof CityArtWalks.Components.Search.HomepageSearch
   * @description Handles selection of a search result
   * @param {Event} event - The selection event
   * @param {Object} value - Selected option value
   */
  const handleResultSelect = useCallback(
    (_event, value) => {
      // Handle cases where value is a string (user typed text) or null/undefined
      if (!value || typeof value === 'string' || value.type === 'header') return;

      // Call custom callback if provided
      if (onResultSelect) {
        onResultSelect(value);
      }

      // Navigate to the result's link
      if (value.link) {
        router.push(value.link);
      }
    },
    [router, onResultSelect]
  );

  /**
   * @memberof CityArtWalks.Components.Search.HomepageSearch
   * @description Custom rendering for autocomplete options
   * @param {Object} props - Option rendering props
   * @param {Object} option - Option data
   * @returns {JSX.Element} Rendered option
   */
  const renderOption = (props, option) => {
    // Render section headers
    if (option.type === 'header') {
      return (
        <ListSubheader key={`header-${option.category}`} sx={{ bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2" color="text.primary">
            {option.category}
          </Typography>
        </ListSubheader>
      );
    }

    // Extract key from props to avoid React warning about spreading key
    const { key, ...restProps } = props;

    // Render search result options
    return (
      <Box component="li" key={key} {...restProps}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: 'primary.lighter',
            color: 'primary.main',
          }}
          src={option.imageUrl}
        >
          {option.imageUrl ? null : <Iconify icon={option.icon} width={20} />}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.primary" noWrap>
            {option.displayText}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {option.subtitle}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={option.category.slice(0, -1)} // Remove 's' from category name
          variant="soft"
          color="primary"
        />
      </Box>
    );
  };

  /**
   * @memberof CityArtWalks.Components.Search.HomepageSearch
   * @description Custom rendering for input field
   * @param {Object} params - Input field props
   * @returns {JSX.Element} Rendered input field
   */
  const renderInput = (params) => (
    <TextField
      {...params}
      placeholder={placeholder}
      fullWidth
      slotProps={{
        input: {
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={20} thickness={4} />
              ) : (
                params.InputProps.endAdornment
              )}
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'background.paper',
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
    />
  );

  const options = formatOptions(data);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={handleResultSelect}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.displayText || '';
        }}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === 'string') return option === value;
          return option.id === value.id;
        }}
        getOptionKey={(option) => {
          if (option.type === 'header') {
            return `header-${option.category}`;
          }
          return `${option.category}-${option.id}`;
        }}
        groupBy={(option) => option.category}
        renderOption={renderOption}
        renderInput={renderInput}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              maxHeight: 400,
              overflow: 'auto',
            },
          },
          popper: {
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          },
        }}
        loading={isLoading}
        noOptionsText={
          inputValue.length < minQueryLength
            ? `Type at least ${minQueryLength} characters to search...`
            : hasResults === false
              ? 'No results found in this area'
              : 'Type to search...'
        }
        loadingText="Searching..."
        clearOnEscape
        selectOnFocus
        clearOnBlur={false}
        handleHomeEndKeys
        sx={{
          '& .MuiAutocomplete-listbox': {
            '& .MuiAutocomplete-option': {
              py: 1,
            },
          },
        }}
      />
    </Box>
  );
}

HomepageSearch.propTypes = {
  placeholder: PropTypes.string,
  location: PropTypes.shape({
    countryId: PropTypes.string,
    stateId: PropTypes.string,
    cityId: PropTypes.string,
  }),
  debounceDelay: PropTypes.number,
  minQueryLength: PropTypes.number,
  onResultSelect: PropTypes.func,
  sx: PropTypes.object,
};
