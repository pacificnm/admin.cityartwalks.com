/**
 * Verification Log Actions Module - Export Interface
 *
 * This module provides the public API for all verification log operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 *
 * Note: VerificationLog is append-only, supporting create and read operations only.
 *
 * @namespace CityArtWalks.Actions.VerificationLog
 * @fileoverview Public exports for verification log actions module
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/VerificationLog-Model} - VerificationLog model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#VerificationLog} - Database schema reference
 */

// Export all requests for server actions and utilities
export {
  createVerificationLog,
  getVerificationLogById,
  getPaginatedVerificationLogs,
} from './requests.js';

// Export all hooks for React components
export {
  useCreateVerificationLog,
  useGetVerificationLogById,
  useVerificationLogMutations,
  useGetPaginatedVerificationLogs,
} from './hooks.js';
