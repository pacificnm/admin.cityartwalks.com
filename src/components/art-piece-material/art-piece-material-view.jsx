/**
 * @namespace CityArtWalks.Components.ArtPieceMaterial
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { Box } from '@mui/material';

import { ArtPieceMaterialTable } from './art-piece-material-table';

/**
 * ArtPieceMaterial Management View Component
 *
 * Provides a complete interface for managing art piece materials with table view,
 * filtering, search, and CRUD operations. This is a full-featured management page
 * component that can be used directly in dashboard pages.
 *
 * @namespace CityArtWalks.Components.ArtPieceMaterial
 * @fileoverview Complete art piece material management interface
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires ArtPieceMaterialTable - Main table component
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 */

/**
 * ArtPieceMaterial Management View
 * Complete management interface with table, filtering, and actions
 *
 * @param {Object} props - Component props
 * @param {Object} [props.initialFilters] - Initial filter state
 * @param {boolean} [props.showInactives=false] - Whether to show inactive materials by default
 * @returns {JSX.Element} The art piece material management view
 *
 * @example
 * // Usage in a dashboard page
 * <ArtPieceMaterialView
 *   initialFilters={{ active: 'true' }}
 *   showInactives={false}
 * />
 */
export function ArtPieceMaterialView({
  initialFilters = { active: 'all' },
  showInactives = false,
}) {
  // Default to active materials only unless showInactives is true
  const defaultFilters = showInactives ? { active: 'all' } : { active: 'true' };
  const filters = { ...defaultFilters, ...initialFilters };

  return (
    <Box sx={{ p: 0 }}>
      <ArtPieceMaterialTable
        filters={filters}
        tabOptions={[
          { value: 'all', label: 'All' },
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ]}
        displayFilters={{
          search: true,
          active: true,
          toolMenu: true,
        }}
      />
    </Box>
  );
}
