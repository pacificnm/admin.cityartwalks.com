/**
 * @fileoverview Form element for artist selection with autocomplete functionality
 * @namespace CityArtWalks.Forms.Elements.SelectArtist
 * @version 1.0.0
 * @author CityArtWalks Development Team
 * @see {@link https://github.com/pacificnm/cityartwalks.com/w            fullWidth
            disabled={disabled}
            loading={isLoadingArtists || selectedArtistLoading}
            options={combinedArtists}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={(event, value) => {
              // Set the artistId as the form value
              field.onChange(value?.artistId || null);
            }}
            value={combinedArtists.find(artist => artist.artistId === field.value) || null}
            isOptionEqualToValue={(option, value) => option.artistId === value?.artistId}orm components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetArtistById, useGetPaginatedArtists } from 'src/actions/artist/hooks';

import { AddIcon } from 'src/components/icons';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.SelectArtist
 * @function ElementSelectArtist
 * @description Form element component for artist selection with autocomplete functionality.
 *
 * This component provides an autocomplete field for selecting artists with the following features:
 * - Debounced search to prevent excessive API calls
 * - Artist avatar display in dropdown options
 * - Paginated results with 20 items limit
 * - Returns artist ID as the value
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Optional "+" button to create new artists
 *
 * Features:
 * - Autocomplete with search functionality
 * - Debounced input (500ms delay) to optimize API calls
 * - Artist images displayed in dropdown options
 * - Paginated artist fetching (20 results per search)
 * - Returns artistId as form value
 * - Loading indicators during search
 * - Error boundaries for robust error handling
 * - Create artist button with navigation to artist creation page
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="artistId"] - The form field name for the artist selection
 * @param {string} [props.label="Artist"] - The label text for the autocomplete field
 * @param {string} [props.placeholder="Search for an artist..."] - Placeholder text
 * @param {string} [props.helperText] - Helper text to display below the field
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.showAddButton=true] - Whether to show the create artist button
 * @param {Object} [props.sx] - Additional styling props
 *
 * @returns {JSX.Element} The rendered artist selection autocomplete element
 *
 * @example
 * // Basic usage in a form
 * <ElementSelectArtist />
 *
 * @example
 * // With custom props and add button
 * <ElementSelectArtist
 *   name="artistId"
 *   label="Select Artist"
 *   placeholder="Type to search artists..."
 *   helperText="Choose the artist for this art piece"
 *   required
 *   showAddButton={true}
 * />
 *
 * @example
 * // Without add button
 * <ElementSelectArtist
 *   name="artistId"
 *   showAddButton={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */
export function ElementSelectArtist(props) {
  const {
    name = 'artistId',
    label = 'Artist',
    placeholder = 'Search for an artist...',
    helperText,
    disabled = false,
    required = false,
    showAddButton = true,
    sx,
    ...other
  } = props;

  const router = useRouter();
  const { control, watch } = useFormContext();
  const { accessToken } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Watch the current artistId value from the form
  const currentArtistId = watch(name);

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use accessToken for authentication
  const authToken = accessToken || '';

  // Fetch the selected artist by ID (for initial display)
  const { artist: selectedArtist, artistLoading: selectedArtistLoading } = useGetArtistById(
    currentArtistId,
    authToken,
    600
  );

  // Fetch artists with debounced search
  const {
    artists,
    artistsLoading: isLoadingArtists,
    artistsError,
  } = useGetPaginatedArtists(
    { search: debouncedSearchTerm },
    1,
    20, // Limit to 20 results as requested
    authToken,
    600 // 10-minute cache
  );

  // Combine search results with selected artist (avoid duplicates)
  const combinedArtists = useMemo(() => {
    const searchResults = artists || [];

    // If we have a selected artist and it's not already in search results
    if (selectedArtist && !searchResults.find((a) => a.artistId === selectedArtist.artistId)) {
      return [selectedArtist, ...searchResults];
    }

    return searchResults;
  }, [artists, selectedArtist]);

  /**
   * @memberof CityArtWalks.Forms.Elements.SelectArtist.ElementSelectArtist
   * @function handleInputChange
   * @description Handles input changes and updates search term for debounced API calls.
   * @param {Event} event - The input change event
   * @param {string} value - The new input value
   */
  const handleInputChange = (_event, value) => {
    setInputValue(value);
    setSearchTerm(value);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.SelectArtist.ElementSelectArtist
   * @function handleAddArtist
   * @description Navigates to the artist creation page.
   */
  const handleAddArtist = () => {
    router.push(paths.art.artist.create);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.SelectArtist.ElementSelectArtist
   * @function getOptionLabel
   * @description Returns the display label for an artist option.
   * @param {Object} option - The artist option object
   * @returns {string} The artist name or empty string
   */
  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option?.name || '';
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.SelectArtist.ElementSelectArtist
   * @function renderOption
   * @description Renders an artist option with avatar and name.
   * @param {Object} optionProps - The option props from Autocomplete
   * @param {Object} artist - The artist object
   * @returns {JSX.Element} The rendered option
   */
  const renderOption = (optionProps, artist) => (
    <li {...optionProps} key={artist.artistId}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
        <Avatar
          alt={artist.name}
          src={artist.imageUrl}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 1,
            backgroundColor: 'grey.200',
          }}
        >
          {artist.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" noWrap>
            {artist.name}
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
          fullWidth
          label={label}
          error
          helperText="Failed to load artists. Please try again."
          disabled
          sx={sx}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              fullWidth
              disabled={disabled}
              loading={isLoadingArtists || selectedArtistLoading}
              options={combinedArtists}
              getOptionLabel={getOptionLabel}
              renderOption={renderOption}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onChange={(_event, value) => {
                // Set the artistId as the form value
                field.onChange(value?.artistId || null);
              }}
              value={combinedArtists.find((artist) => artist.artistId === field.value) || null}
              isOptionEqualToValue={(option, value) => option.artistId === value?.artistId}
              filterOptions={(x) => x} // Don't filter options, let API handle filtering
              noOptionsText={
                debouncedSearchTerm ? 'No artists found' : 'Start typing to search artists...'
              }
              loadingText="Searching artists..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                  required={required}
                  error={!!error}
                  helperText={error?.message || helperText}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingArtists || selectedArtistLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={sx}
                  {...other}
                />
              )}
            />
          )}
        />
        {showAddButton && (
          <Tooltip title="Create new artist">
            <IconButton
              onClick={handleAddArtist}
              disabled={disabled}
              sx={{
                mt: 1,
                minWidth: 40,
                height: 40,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.SelectArtist
 * @prop {string} [name="artistId"] - The form field name for the artist selection. Defaults to "artistId".
 * @prop {string} [label="Artist"] - The label text for the autocomplete field. Defaults to "Artist".
 * @prop {string} [placeholder="Search for an artist..."] - Placeholder text for the input field.
 * @prop {string} [helperText] - Helper text to display below the field. This prop is optional.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [required=false] - Whether the field is required. Defaults to false.
 * @prop {boolean} [showAddButton=true] - Whether to show the add artist button. Defaults to true.
 * @prop {Object} [sx] - Additional styling props for the autocomplete field. This prop is optional.
 */
ElementSelectArtist.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  showAddButton: PropTypes.bool,
  sx: PropTypes.object,
};
