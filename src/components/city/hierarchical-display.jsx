import Link from 'next/link';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

import { Box, Grid, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPaginatedCities } from 'src/actions/city/hooks';

import { ErrorView } from '../error';

/**
 * @function HierarchicalDisplay
 * @description Displays cities organized hierarchically by country > state > city structure.
 * Shows active cities with navigational links to explore pages for each location level.
 *
 * @param {...Object} other - Additional props to be spread on the root Box component
 * @returns {JSX.Element} Hierarchical city navigation component
 */
export function HierarchicalDisplay({ ...other }) {
  const linkStyles = {
    textDecoration: 'none !important', // Ensure underline is removed
    color: 'primary.main', // Set primary color
    '&:hover': {
      textDecoration: 'underline', // Optional hover underline
    },
  };

  // Get all active cities using paginated hook with high limit
  const {
    cities = [],
    citiesLoading,
    citiesError,
  } = useGetPaginatedCities(
    {
      status: 'ACTIVE', // Only get active cities
    },
    1, // First page
    100, // High limit - we'll never have more than 100 cities
    '', // No auth token needed for public data
    3600 // Cache for 1 hour
  );

  if (citiesLoading) return null;
  if (citiesError) return <ErrorView message="Failed to load cities" />;

  // Create a flat array of cities with their hierarchy info for better column distribution
  const flatCities = cities
    .map((city) => ({
      cityName: city.name,
      citySlug: city.slug,
      stateName: city.State?.name || 'Unknown State',
      stateSlug: city.State?.slug || '',
      // Try direct Country relationship first, then fall back to State.Country
      countryName: city.Country?.name || city.State?.Country?.name || 'Unknown Country',
      countrySlug: city.Country?.slug || city.State?.Country?.slug || '',
    }))
    .filter((city) => city.countryName !== 'Unknown Country'); // Only filter out cities without country data

  // Sort cities alphabetically for consistent display
  flatCities.sort((a, b) => {
    // First by country, then by state, then by city
    if (a.countryName !== b.countryName) return a.countryName.localeCompare(b.countryName);
    if (a.stateName !== b.stateName) return a.stateName.localeCompare(b.stateName);
    return a.cityName.localeCompare(b.cityName);
  });

  // Split cities into 4 columns for better distribution
  const itemsPerColumn = Math.ceil(flatCities.length / 4);
  const columns = [];
  for (let i = 0; i < 4; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    columns.push(flatCities.slice(start, end));
  }

  return (
    <ErrorBoundary>
      <Box {...other} sx={{ width: '100%' }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          {columns.map((column, columnIndex) => (
            <Grid item xs={12} sm={6} md={3} key={columnIndex}>
              <Box>
                {column.map((city, index) => (
                  <Box
                    key={`${city.countrySlug}-${city.stateSlug}-${city.citySlug}`}
                    sx={{ mb: 1.5 }}
                  >
                    {/* Show country/state context for first city or when it changes */}
                    {(index === 0 ||
                      city.countryName !== column[index - 1]?.countryName ||
                      city.stateName !== column[index - 1]?.stateName) && (
                      <Box sx={{ mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          component="div"
                          sx={{ fontWeight: 600 }}
                        >
                          {city.countryName} → {city.stateName}
                        </Typography>
                      </Box>
                    )}
                    <Link
                      href={paths.explore.city(city.countrySlug, city.stateSlug, city.citySlug)}
                      title={city.cityName}
                      passHref
                    >
                      <Typography variant="body2" sx={linkStyles} component="div">
                        {city.cityName}
                      </Typography>
                    </Link>
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
