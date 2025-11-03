/**
 * Art Harvesting Workflow Actions Module - Export Interface
 *
 * This module provides the public API for all art harvesting workflow operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 *
 * @namespace CityArtWalks.Actions.ArtHarvesting
 * @fileoverview Public exports for art harvesting workflow actions module
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting-Workflow} - Art harvesting workflow documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtHarvesting} - Database schema reference
 */

// Export all requests for server actions and utilities
export {
  extractArtPieces,
  publishArtPieces,
  getHarvestingStatus,
  batchProcessArtPieces,
} from './requests.js';

// Export all hooks for React components
export {
  useExtractArtPieces,
  usePublishArtPieces,
  useGetHarvestingStatus,
  useBatchProcessArtPieces,
  useArtHarvestingWorkflow,
} from './hooks.js';
