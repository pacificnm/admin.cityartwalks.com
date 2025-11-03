/**
 * @file index.js
 * @description IndexNowSubmission Actions Module - Export Interface
 *
 * This module provides the public API for all IndexNowSubmission operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 * @namespace CityArtWalks.Actions.IndexNowSubmission
 * @version 1.0.0
 * @author CityArtWalks Development Team
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNowSubmission-Model} - IndexNowSubmission model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#IndexNowSubmission} - Database schema reference
 */

// Export all hooks for React components
export * from './hooks.js';

// Export all requests for server actions and utilities
export * from './requests.js';
