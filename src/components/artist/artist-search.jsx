/**
 * @namespace CityArtWalks.Components.Artist.ArtistSearch
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SearchIcon } from 'src/components/icons';
import { SearchNotFound } from 'src/components/search-not-found';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistSearch
 * @function ArtistSearch
 * @description ArtistSearch component renders an autocomplete input field for searching artists.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.query - The current search query.
 * @param {Array} props.results - The list of search results, each containing `name`, `artistId`, `slug`, and optionally `imageUrl`.
 * @param {function} props.onSearch - Callback function to handle search input changes.
 * @param {boolean} props.loading - Indicates whether search results are loading.
 * @returns {JSX.Element} The rendered ArtistSearch component.
 *
 * @example
 * const mockResults = [
 *   { artistId: 1, name: 'Van Gogh', slug: 'van-gogh', imageUrl: '/images/van-gogh.jpg' },
 *   { artistId: 2, name: 'Da Vinci', slug: 'da-vinci', imageUrl: '/images/da-vinci.jpg' },
 * ];
 *
 * function handleSearch(query) {
 *   console.log('Search query:', query);
 * }
 *
 * <ArtistSearch
 *   query="Van Gogh"
 *   results={mockResults}
 *   onSearch={handleSearch}
 *   loading={false}
 * />
 */
export function ArtistSearch({ query, results, onSearch, loading }) {
  const router = useRouter();

  const handleClick = (slug) => {
    const path = paths.artist.details(slug);
    router.push(path);
  };

  const handleKeyUp = (event) => {
    if (query && event.key === 'Enter') {
      handleClick(query);
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.artistId === value.artistId}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: { minWidth: 320 },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, artist, { inputValue }) => {
        const matches = match(artist.name, inputValue);
        const parts = parse(artist.name, matches);

        return (
          <li {...props} key={artist.artistId}>
            <Avatar
              alt={artist.name}
              src={artist.imageUrl}
              variant="rounded"
              sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
              onClick={() => handleClick(artist.slug)}
            />
            <Link underline="none" onClick={() => handleClick(artist.slug)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
