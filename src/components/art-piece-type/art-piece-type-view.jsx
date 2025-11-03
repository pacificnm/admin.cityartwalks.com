/**
 * @namespace CityArtWalks.Components.ArtPieceType.ArtPieceTypeView
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { Box } from '@mui/material';

import { ArtPieceTypeTable } from './art-piece-type-table';

/**
 * ArtPieceType Management View Component
 *
 * Provides a complete interface for managing art piece types with table view,
 * filtering, search, and CRUD operations. This is a full-featured management page
 * component that can be used directly in dashboard pages.
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Complete art piece type management interface
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires ArtPieceTypeTable - Main table component
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Type-Model} - ArtPieceType model documentation
 */

/**
 * ArtPieceType Management View
 * Complete management interface with table, filtering, and actions
 *
 * @param {Object} props - Component props
 * @param {Object} [props.initialFilters] - Initial filter state
 * @param {boolean} [props.showInactives=false] - Whether to show inactive types by default
 * @returns {JSX.Element} The art piece type management view
 *
 * @example
 * // Usage in a dashboard page
 * <ArtPieceTypeView
 *   initialFilters={{ active: 'true' }}
 *   showInactives={false}
 * />
 *
 * @example
 * // Show all types including inactive
 * <ArtPieceTypeView
 *   initialFilters={{ active: 'all' }}
 *   showInactives={true}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Type-Model} - ArtPieceType model documentation
 */
export function ArtPieceTypeView({ initialFilters = { active: 'all' }, showInactives = false }) {
  // Default to active types only unless showInactives is true
  const defaultFilters = showInactives ? { active: 'all' } : { active: 'true' };
  const filters = { ...defaultFilters, ...initialFilters };

  return (
    <Box sx={{ p: 0 }}>
      <ArtPieceTypeTable
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
