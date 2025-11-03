/**
 * @namespace CityArtWalks.Components.Filters.ArtistFilter
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';
import { useArtistFilterState } from 'src/hooks/use-filter-state';

import { useGetPaginatedArtists } from 'src/actions/artist/hooks';

import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.Filters.ArtistFilter
 * @description ArtistFilter component provides an autocomplete dropdown for filtering artists.
 * It includes debounced search, artist avatars, and API integration.
 *
 * Key Features:
 * - Autocomplete with debounced search functionality
 * - Artist avatars displayed in dropdown options
 * - API integration with paginated results
 * - Loading states and error handling
 * - "All Artists" option to clear filter
 *
 * @component
 * @example
 * // Basic usage
 * <ArtistFilter
 *   value={filters.artistId}
 *   onChange={handleArtistChange}
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - Current artist filter value (artist ID).
 * @param {Function} props.onChange - Callback function when artist filter changes.
 * @param {string} [props.label="Artist"] - Label for the autocomplete input.
 * @param {string} [props.placeholder="Search for an artist..."] - Placeholder text for the input.
 * @param {string} [props.ariaLabel="Filter by artist"] - ARIA label for accessibility.
 * @param {number} [props.minWidth=200] - Minimum width of the autocomplete control.
 * @param {Array} [props.artists=[]] - Pre-loaded artists from parent component.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The ArtistFilter component.
 */
export function ArtistFilter({
  value = '',
  onChange,
  label = 'Artist',
  placeholder = 'Search for an artist...',
  ariaLabel = 'Filter by artist',
  minWidth = 200,
  artists = [], // Pre-loaded artists from parent
  sx = {},
}) {
  const { accessToken } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Use the reusable filter state hook
  const filterState = useArtistFilterState({ value, onChange });

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use accessToken for authentication
  const authToken = accessToken || '';

  // Only fetch artists when user has typed something (don't load on mount)
  const shouldFetchArtists = debouncedSearchTerm && debouncedSearchTerm.trim().length > 0;

  // Fetch artists with debounced search
  const {
    artists: searchedArtists,
    artistsLoading: isLoadingArtists,
    artistsError,
  } = useGetPaginatedArtists(
    shouldFetchArtists ? { search: debouncedSearchTerm } : { skip: true },
    1,
    20, // Limit to 20 results
    authToken,
    600 // 10-minute cache
  );

  // Prepare options - include search results, pre-loaded artists, and preserve selected artist
  const options = useMemo(() => {
    const artistOptions = [];

    // Add search results from API if we have them
    if (shouldFetchArtists && searchedArtists && searchedArtists.length > 0) {
      artistOptions.push(
        ...searchedArtists.map((artist) => ({
          id: artist.artistId,
          name: artist.name,
          imageUrl: artist.imageUrl,
          isArtist: true,
        }))
      );
    }

    // Add pre-loaded artists from parent (these may include selected artist info)
    if (artists && artists.length > 0) {
      artists.forEach((artist) => {
        const artistOption = {
          id: artist.artistId || artist.id,
          name: artist.name,
          imageUrl: artist.imageUrl,
          isArtist: true,
        };
        // Only add if not already in options
        if (!artistOptions.find((option) => option.id === artistOption.id)) {
          artistOptions.push(artistOption);
        }
      });
    }

    // Always include the selected artist if it exists and isn't already in the list
    if (
      filterState.selectedItem &&
      !artistOptions.find((option) => option.id === filterState.selectedItem.id)
    ) {
      artistOptions.unshift(filterState.selectedItem); // Add to beginning
    }

    return artistOptions;
  }, [artists, searchedArtists, shouldFetchArtists, filterState.selectedItem]);

  // Find the currently selected option
  const selectedOption = useMemo(() => {
    if (!value || value === '') {
      return null;
    }

    // Find in current options (which now includes the selected artist)
    return options.find((option) => option.id.toString() === value.toString()) || null;
  }, [options, value]);

  /**
   * @memberof CityArtWalks.Components.Filters.ArtistFilter.ArtistFilter
   * @function handleInputChange
   * @description Handles input changes and updates search term for debounced API calls.
   * Only updates search when user is typing to find artists, NOT when showing selected artist.
   * @param {Event} event - The input change event
   * @param {string} newValue - The new input value
   */
  const handleInputChange = (_, newValue) => {
    filterState.setInputValue(newValue);

    // Only set search term if we don't have a selected artist (value is empty)
    // This prevents API calls when showing selected artist name
    if (!value || value === '') {
      setSearchTerm(newValue);
    }
    // Do NOT call onChange here - only search for artists, don't filter results
  };

  /**
   * @memberof CityArtWalks.Components.Filters.ArtistFilter.ArtistFilter
   * @function handleChange
   * @description Handles autocomplete selection changes - ONLY triggers when an artist is selected.
   * This sends the artistId to the parent to filter art pieces by artistId.
   * Does NOT make any more API calls to artist endpoints.
   * @param {Event} event - The change event
   * @param {Object|null} selected - The selected option object
   */
  const handleChange = (_, selected) => {
    if (selected && selected.id) {
      // Use the filter state hook to handle the change
      filterState.handleFilterChange(selected.id, selected);
      // CRITICAL: Clear search term to stop any further artist API calls
      setSearchTerm('');
    } else {
      // Nothing selected or cleared - use filter state to clear
      filterState.handleFilterChange('', null);
      setSearchTerm('');
    }
  };

  /**
   * @memberof CityArtWalks.Components.Filters.ArtistFilter.ArtistFilter
   * @function getOptionLabel
   * @description Returns the display label for an option.
   * @param {Object} option - The option object
   * @returns {string} The option name or empty string
   */
  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option?.name || '';
  };

  /**
   * @memberof CityArtWalks.Components.Filters.ArtistFilter.ArtistFilter
   * @function renderOption
   * @description Renders an option with avatar and name.
   * @param {Object} optionProps - The option props from Autocomplete
   * @param {Object} option - The option object
   * @returns {JSX.Element} The rendered option
   */
  const renderOption = (optionProps, option) => (
    <li {...optionProps} key={option.id || option.name}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
        {option.isArtist ? (
          <Avatar
            alt={option.name}
            src={option.imageUrl}
            variant="rounded"
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 1,
              backgroundColor: 'grey.200',
            }}
          >
            {option.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        ) : (
          <Box sx={{ width: 40, height: 40, flexShrink: 0 }} />
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            noWrap
            sx={{ fontStyle: option.isArtist ? 'normal' : 'italic' }}
          >
            {option.name}
          </Typography>
        </Box>
      </Box>
    </li>
  );

  // Show error state
  if (artistsError) {
    return (
      <ErrorBoundary>
        <TextField
          label={label}
          error
          helperText="Failed to load artists. Please try again."
          disabled
          sx={{ minWidth, ...sx }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Autocomplete
        fullWidth
        loading={isLoadingArtists}
        options={options}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        inputValue={filterState.inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        value={selectedOption}
        isOptionEqualToValue={(option, val) => option.id === val?.id}
        filterOptions={(x) => x} // Don't filter options, let API handle filtering
        noOptionsText={shouldFetchArtists ? 'No artists found' : 'Type to search for artists'}
        loadingText="Searching artists..."
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            aria-label={ariaLabel}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingArtists ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{ minWidth, ...sx }}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ArtistFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string,
  minWidth: PropTypes.number,
  artists: PropTypes.array,
  sx: PropTypes.object,
};
