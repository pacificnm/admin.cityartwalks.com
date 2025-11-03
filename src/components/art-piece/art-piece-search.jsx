/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPiecesSearch
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';
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
 * @memberof CityArtWalks.Components.ArtPiece.ArtPiecesSearch
 * @function ArtPiecesSearch
 * @description Renders a searchable autocomplete component for art pieces, allowing users to navigate to selected art pieces.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.query - The current search query.
 * @param {Array} props.results - The list of search results, where each result includes `artPieceId`, `title`, `artist_slug`, and `slug`.
 * @param {Function} props.onSearch - Callback function to handle changes in the search input.
 * @param {boolean} props.loading - Indicates whether the search results are loading.
 * @returns {JSX.Element} The rendered ArtPiecesSearch component.
 *
 * @example
 * const mockResults = [
 *   { artPieceId: 1, title: 'Starry Night', artist_slug: 'van-gogh', slug: 'starry-night', imageUrl: '/images/starry-night.jpg' },
 *   { artPieceId: 2, title: 'The Persistence of Memory', artist_slug: 'dali', slug: 'persistence-of-memory', imageUrl: '/images/dali.jpg' },
 * ];
 *
 * <ArtPiecesSearch
 *   query="Starry Night"
 *   results={mockResults}
 *   onSearch={(value) => console.log('Searching for:', value)}
 *   loading={false}
 * />
 */
export default function ArtPiecesSearch({ query, results, onSearch, loading }) {
  const router = useRouter();

  // Handle click to navigate to the selected art piece
  const handleClick = useCallback(
    (post) => {
      router.push(paths.artist.piece(post.artist_slug, post.slug));
    },
    [router]
  );

  // Handle key press events (like Enter) for searching
  const handleKeyUp = useCallback(
    (event) => {
      if (query && event.key === 'Enter') {
        handleClick(query);
      }
    },
    [query, handleClick]
  );

  return (
    <Autocomplete
      sx={{ width: { xs: 1 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.artPieceId === value.artPieceId}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: { minWidth: 320 },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: { pl: 0.75 },
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
      renderOption={(props, post, { inputValue }) => {
        const matches = match(post.title, inputValue);
        const parts = parse(post.title, matches);

        return (
          // Ensure each `li` has a unique key prop
          <li {...props} key={post.artPieceId}>
            <Avatar
              alt={post.title}
              src={post.imageUrl}
              variant="rounded"
              sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
            />
            <Link
              key={`${post.artPieceId}-${inputValue}`}
              underline="none"
              onClick={() => handleClick(post)}
            >
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
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPiecesSearch
 * @prop {string} query - The current search query. This prop is required.
 * @prop {Array<Object>} results - The list of search results, where each result includes `artPieceId`, `title`, `artist_slug`, and `slug`. This prop is required.
 * @prop {Function} onSearch - Callback function to handle changes in the search input. This prop is required.
 * @prop {boolean} loading - Indicates whether the search results are loading. This prop is required.
 */
ArtPiecesSearch.propTypes = {
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      artPieceId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      artist_slug: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })
  ).isRequired,
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
