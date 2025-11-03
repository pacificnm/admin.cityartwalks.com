import Link from 'next/link';

import { Box, Grid, Chip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetArtistLocationsByArtist } from 'src/actions/artist-location/hooks';

import { ErrorView } from '../error';
import ErrorBoundary from '../error/error-boundary';

/**
 * @function ArtistLocationsDisplay
 * @description Displays a list of locations where the artist has art pieces, organized hierarchically by country > state > city structure.
 * Shows active artist locations with navigational links to explore pages for each location level. Uses the same layout pattern as HierarchicalDisplay
 * with multi-column organization and grouped country/state headers.
 *
 * Features:
 * - Hierarchical organization by country > state > city
 * - Multi-column layout for better space utilization
 * - Clickable links to explore pages for each city
 * - Primary location badges
 * - Responsive grid layout (2 columns for few locations, 4 for many)
 * - Alphabetical sorting by country, state, then city
 *
 * @param {Object} props - Component props
 * @param {string|number} props.artistId - The artist ID to fetch locations for
 * @param {boolean} [props.showPrimaryBadge=true] - Whether to show primary location badge
 * @param {string} [props.emptyMessage='No locations found for this artist'] - Message to show when no locations
 * @param {...Object} other - Additional props to be spread on the root Box component
 * @returns {JSX.Element} Artist locations navigation component with hierarchical display
 */
export function ArtistLocationsDisplay({
  artistId,
  showPrimaryBadge = true,
  emptyMessage = 'No locations found for this artist',
  ...other
}) {
  const linkStyles = {
    textDecoration: 'none !important', // Ensure underline is removed
    color: 'primary.main', // Set primary color
    '&:hover': {
      textDecoration: 'underline', // Optional hover underline
    },
  };

  const { artistLocations, artistLocationsLoading, artistLocationsError } =
    useGetArtistLocationsByArtist(artistId);

  if (artistLocationsLoading) return null;
  if (artistLocationsError) return <ErrorView message="Failed to load artist locations" />;

  // Simple display of locations - no complex filtering
  if (!artistLocations || artistLocations.length === 0) {
    return (
      <ErrorBoundary>
        <Box {...other} sx={{ width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </ErrorBoundary>
    );
  }

  // Create a flat array of locations with their hierarchy info for better column distribution
  const flatLocations = artistLocations
    .map((location) => ({
      artistLocationId: location.artistLocationId,
      cityName: location.City?.name || 'Unknown City',
      citySlug: location.City?.slug || '',
      stateName: location.State?.name || 'Unknown State',
      stateSlug: location.State?.slug || '',
      // Try direct Country relationship first, then fall back to State.Country
      countryName: location.Country?.name || location.State?.Country?.name || 'Unknown Country',
      countrySlug: location.Country?.slug || location.State?.Country?.slug || '',
      primary: location.primary,
    }))
    .filter((location) => location.countryName !== 'Unknown Country'); // Only filter out locations without country data

  // Sort locations alphabetically for consistent display
  flatLocations.sort((a, b) => {
    // First by country, then by state, then by city
    if (a.countryName !== b.countryName) return a.countryName.localeCompare(b.countryName);
    if (a.stateName !== b.stateName) return a.stateName.localeCompare(b.stateName);
    return a.cityName.localeCompare(b.cityName);
  });

  // Split locations into columns for better distribution (adjust based on number of locations)
  const columnsCount = flatLocations.length <= 4 ? 2 : 4;
  const itemsPerColumn = Math.ceil(flatLocations.length / columnsCount);
  const columns = [];
  for (let i = 0; i < columnsCount; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    columns.push(flatLocations.slice(start, end));
  }

  return (
    <ErrorBoundary>
      <Box {...other} sx={{ width: '100%' }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {columns.map((column, columnIndex) => (
            <Grid item xs={12} sm={6} md={columnsCount === 2 ? 6 : 3} key={columnIndex}>
              <Box>
                {column.map((location, index) => (
                  <Box
                    key={`${location.countrySlug}-${location.stateSlug}-${location.citySlug}-${location.artistLocationId}`}
                    sx={{ mb: 1.5 }}
                  >
                    {/* Show country/state context for first location or when it changes */}
                    {(index === 0 ||
                      location.countryName !== column[index - 1]?.countryName ||
                      location.stateName !== column[index - 1]?.stateName) && (
                      <Box sx={{ mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          component="div"
                          sx={{ fontWeight: 600 }}
                        >
                          {location.countryName} → {location.stateName}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link
                        href={paths.explore.city(
                          location.countrySlug,
                          location.stateSlug,
                          location.citySlug
                        )}
                        title={location.cityName}
                        passHref
                      >
                        <Typography variant="body2" sx={linkStyles} component="div">
                          {location.cityName}
                        </Typography>
                      </Link>
                      {showPrimaryBadge && location.primary && (
                        <Chip
                          label="Primary"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ErrorBoundary>
  );
}
