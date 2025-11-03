/**
 * Art Piece Queue Actions Module - Export Interface
 *
 * This module provides the public API for all art piece queue operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 *
 * @namespace CityArtWalks.Actions.ArtPieceQueue
 * @fileoverview Public exports for art piece queue actions module
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue-Model} - ArtPieceQueue model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */

// Export all requests for server actions and utilities
export {
  createArtPieceQueue,
  updateArtPieceQueue,
  deleteArtPieceQueue,
  getArtPieceQueueById,
  getPaginatedArtPieceQueues,
} from './requests.js';

// Export all hooks for React components
export {
  useCreateArtPieceQueue,
  useUpdateArtPieceQueue,
  useDeleteArtPieceQueue,
  useGetArtPieceQueueById,
  useArtPieceQueueMutations,
  useGetPaginatedArtPieceQueues,
} from './hooks.js';
