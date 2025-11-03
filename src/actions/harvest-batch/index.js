/**
 * @file index.js
 * @description Harvest Batch Actions Module - Export Interface
 *
 * This module provides the public API for all harvest batch operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 * @namespace CityArtWalks.Actions.HarvestBatch
 * @version 1.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/HarvestBatch-Model} - HarvestBatch model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#HarvestBatch} - Database schema reference
 */

// Export all requests for server actions and utilities
export {
  createHarvestBatch,
  updateHarvestBatch,
  deleteHarvestBatch,
  getHarvestBatchById,
  getPaginatedHarvestBatches,
} from './requests.js';

// Export all hooks for React components
export {
  useCreateHarvestBatch,
  useUpdateHarvestBatch,
  useDeleteHarvestBatch,
  useGetHarvestBatchById,
  useHarvestBatchMutations,
  useGetPaginatedHarvestBatches,
} from './hooks.js';
