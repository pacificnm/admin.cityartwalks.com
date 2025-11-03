/**
 * @namespace CityArtWalks.Actions.UserFavoriteArtists.Hooks
 * @version 2.0.0
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
 * Hook to get all favorite artists for user.
 * @function useGetUserFavoriteArtists
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserFavoriteArtists(userId) {
  const key = ['getUserFavoriteArtists', userId];
  const { data, isLoading, error, isValidating } = useSWR(
    userId ? key : null,
    () => requests.getUserFavoriteArtists(userId),
    swrOptions
  );

  return useMemo(() => {
    const artists = data?.data?.artists || [];
    return {
      artists,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && artists.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook to get single favorite artist with toggle status support.
 * @function useGetUserFavoriteArtist
 * @param {number} artistId - Artist ID to check favorite status for
 * @returns {Object} Hook result with favorite status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserFavoriteArtist(artistId) {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;
  const key = ['getUserFavoriteArtist', artistId, userId];

  const { data, isLoading, error, isValidating } = useSWR(
    artistId && userId ? key : null,
    () => requests.getUserFavoriteArtist(artistId, accessToken, userId),
    swrOptions
  );

  return useMemo(
    () => ({
      favorite: data?.data?.userFavoriteArtist || null,
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
 * Hook to toggle user favorite artist status.
 * @function useToggleUserFavoriteArtist
 * @returns {Function} Function to toggle favorite status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useToggleUserFavoriteArtist() {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;

  return async (artistId) => {
    const result = await requests.toggleUserFavoriteArtist(artistId, accessToken);

    // Update SWR cache if toggle was successful
    if (result.status === 'success' && userId) {
      const key = ['getUserFavoriteArtist', artistId, userId];

      // Update the cache with the new favorite status
      mutate(
        key,
        {
          data: {
            userFavoriteArtist: result.data.userFavoriteArtist,
            isFavorited: result.data.userFavoriteArtist.isFavorite,
          },
        },
        false
      );
    }

    return result;
  };
}
