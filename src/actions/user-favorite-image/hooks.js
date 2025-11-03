/**
 * @namespace CityArtWalks.Actions.UserFavoriteImages.Hooks
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { useAuthContext } from 'src/auth/hooks';

import * as requests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

/**
 * Hook to get all favorite images for user.
 * @function useGetUserFavoriteImages
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserFavoriteImages(userId) {
  const key = ['getUserFavoriteImages', userId];
  const { data, isLoading, error, isValidating } = useSWR(
    userId ? key : null,
    () => requests.getUserFavoriteImages(userId),
    swrOptions
  );

  return useMemo(() => {
    const images = data?.data?.images || [];
    return {
      images,
      imageLoading: isLoading,
      imageError: error,
      imageValidating: isValidating,
      imageEmpty: !isLoading && images.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook to get single favorite image with toggle status support.
 * @function useGetUserFavoriteImage
 * @param {number} imageId - Image ID to check favorite status for
 * @returns {Object} Hook result with favorite status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserFavoriteImage(imageId) {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;
  const key = ['getUserFavoriteImage', imageId, userId];

  const { data, isLoading, error, isValidating } = useSWR(
    imageId && userId ? key : null,
    () => requests.getUserFavoriteImage(imageId, accessToken, userId),
    swrOptions
  );

  return useMemo(
    () => ({
      favorite: data?.data?.userFavoriteImage || null,
      isFavorited: data?.data?.isFavorited || false,
      favoriteLoading: isLoading,
      favoriteError: error,
      favoriteValidating: isValidating,
      favoriteEmpty: !isLoading && !data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook to toggle user favorite image status.
 * @function useToggleUserFavoriteImage
 * @returns {Function} Function to toggle favorite status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useToggleUserFavoriteImage() {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;

  return async (imageId) => {
    const result = await requests.toggleUserFavoriteImage(imageId, accessToken);

    // Update SWR cache if toggle was successful
    if (result.status === 'success' && userId) {
      const key = ['getUserFavoriteImage', imageId, userId];

      // Update the cache with the new favorite status
      mutate(
        key,
        {
          data: {
            userFavoriteImage: result.data.userFavoriteImage,
            isFavorited: result.data.userFavoriteImage.isFavorite,
          },
        },
        false
      );
    }

    return result;
  };
}
