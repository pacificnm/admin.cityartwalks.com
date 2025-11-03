/**
 * @file index.js
 * @description Image Actions Module - Export Interface
 *
 * This module provides the public API for all image operations,
 * exporting both hooks and requests functions for maximum flexibility.
 * Components should use hooks for reactive data, while server actions
 * and utilities should use requests for direct API operations.
 * @namespace CityArtWalks.Actions.Image
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Image} - Database schema reference
 */

// Export all hooks for React components
export * from './hooks';

// Export all requests for server actions and utilities
export * from './requests';
