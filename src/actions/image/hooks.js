/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Images.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.Image.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 */

import { useMemo, useEffect } from 'react';

import { useBaseHook } from 'src/lib/base-hook';

import { ImageApiClient } from './requests';

// Create a single instance to use across all hooks
const imageApiClient = new ImageApiClient();

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useGetPaginatedImages
 * @description Hook to get paginated images with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Filter by status
 * @param {string} [params.artistId=''] - Filter by artist ID
 * @param {string} [params.artPieceId=''] - Filter by art piece ID
 * @param {string} [params.pathId=''] - Filter by path ID
 * @param {boolean} [params.featured=''] - Filter by featured status
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.imagesLoading - Loading state
 * @returns {Error} result.imagesError - Error state
 * @returns {boolean} result.imagesValidating - Validation state
 * @returns {boolean} result.imagesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedImages(params = {}, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  const {
    page = 1,
    limit = 10,
    search = '',
    status = '',
    artistId = '',
    artPieceId = '',
    pathId = '',
    featured = '',
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      'getPaginatedImages',
      page,
      limit,
      search,
      status,
      artistId,
      artPieceId,
      pathId,
      featured,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    status,
    artistId,
    artPieceId,
    pathId,
    featured,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await imageApiClient.getPaginatedImages(
          { page, limit, search, status, artistId, artPieceId, pathId, featured },
          revalidate
        );
        return response;
      },
      revalidate
    );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results,
      imagesLoading: isLoading,
      imagesError: error,
      imagesValidating: isValidating,
      imagesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useGetImage
 * @description Hook to get image by ID with IndexedDB caching.
 *
 * @param {string|number} imageId - The image ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and image data
 * @throws {Error} When imageId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetImage(imageId, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  const { swrKey } = useMemo(() => {
    if (!imageId) return { swrKey: null };
    const key = ['getImage', imageId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, imageId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await imageApiClient.getImage(imageId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const image = data?.results?.data || null;
    return {
      image,
      imageLoading: isLoading,
      imageError: error,
      imageValidating: isValidating,
      imageEmpty: !isLoading && !image,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useCreateImage
 * @description Hook to create a new image with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (image) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When image data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createImage = useCreateImage();
 * await createImage.mutate(imageData);
 */
export function useCreateImage() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (image) => {
      const result = await imageApiClient.createImage(image);
      return result;
    },
    ['image', 'getPaginatedImages']
  );
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useUpdateImage
 * @description Hook to update an existing image with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, imageData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When image ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateImage = useUpdateImage();
 * await updateImage.mutate(imageId, updatedImageData);
 */
export function useUpdateImage() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id, image) => {
      if (!id) {
        baseHook.logger.error('useUpdateImage', 'Image ID is required');
        throw new Error('Image ID is required');
      }

      const result = await imageApiClient.updateImage(id, image);
      return result;
    },
    ['image', 'getPaginatedImages']
  );
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useDeleteImage
 * @description Hook to delete an image with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When image ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteImage = useDeleteImage();
 * await deleteImage.mutate(imageId);
 */
export function useDeleteImage() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      if (!id) {
        baseHook.logger.error('useDeleteImage', 'Image ID is required');
        throw new Error('Image ID is required');
      }

      const result = await imageApiClient.deleteImage(id);
      return result;
    },
    ['image', 'getPaginatedImages']
  );
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useUploadImage
 * @description Hook to upload image file to storage with cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (fileOrFormData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When file upload fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const uploadImage = useUploadImage();
 * await uploadImage.mutate(fileOrFormData);
 */
export function useUploadImage() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Image.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (fileOrFormData) => {
      const result = await imageApiClient.uploadImage(fileOrFormData);
      return result;
    },
    ['image', 'getPaginatedImages']
  );
}

/**
 * @memberof CityArtWalks.Actions.Image.Hooks
 * @function useImageMutations
 * @description Hook that returns all image mutation functions for convenient access.
 *
 * @returns {Object} Collection of all image mutation functions
 * @returns {Function} result.createImage - Create image mutation function
 * @returns {Function} result.updateImage - Update image mutation function
 * @returns {Function} result.deleteImage - Delete image mutation function
 * @returns {Function} result.uploadImage - Upload image mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createImage, updateImage, deleteImage, uploadImage } = useImageMutations();
 * await createImage.mutate(imageData);
 * await updateImage.mutate(imageId, updatedData);
 * await deleteImage.mutate(imageId);
 * await uploadImage.mutate(fileOrFormData);
 */
export function useImageMutations() {
  const createImage = useCreateImage();
  const updateImage = useUpdateImage();
  const deleteImage = useDeleteImage();
  const uploadImage = useUploadImage();

  return {
    createImage,
    updateImage,
    deleteImage,
    uploadImage,
  };
}
