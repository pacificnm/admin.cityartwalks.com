/**
 * Empty IndexNow Submissions Component
 *
 * Displays empty state message for IndexNow submissions list when no
 * submissions are found. Provides contextual messaging based on whether
 * filters are applied or no submissions exist at all.
 *
 * @namespace CityArtWalks.Components.IndexNow
 * @fileoverview Empty state component for IndexNow submissions
 * @author GitHub Copilot
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DocumentIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.IndexNow
 * @function EmptyIndexNow
 * @description Displays empty state for IndexNow submissions with contextual messaging.
 *
 * Shows different messages based on whether filters are applied or no submissions
 * exist at all. Includes appropriate icon and styling for empty state.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state object
 * @param {string} [props.filters.searchQuery] - Search query if any
 * @returns {JSX.Element} The rendered empty state component
 *
 * @example
 * // Display empty state with no filters
 * <EmptyIndexNow filters={{}} />
 *
 * // Display empty state with search applied
 * <EmptyIndexNow filters={{ searchQuery: 'example' }} />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Empty-States} - Empty state documentation
 */
export function EmptyIndexNow({ filters = {} }) {
  const hasFilters = filters.searchQuery;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        textAlign: 'center',
      }}
    >
      <DocumentIcon size={48} color="text.disabled" />
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        No submissions found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hasFilters
          ? 'Try adjusting your search or filters'
          : 'No IndexNow submissions have been created yet'}
      </Typography>
    </Box>
  );
}

EmptyIndexNow.propTypes = {
  filters: PropTypes.shape({
    searchQuery: PropTypes.string,
  }),
};
