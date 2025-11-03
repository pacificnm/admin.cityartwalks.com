/**
 * @namespace CityArtWalks.Actions.UserFavoriteArtPiece.Hooks
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
 * Hook to get favorite art piece by artPieceId.
 * @function useGetUserFavoriteArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserFavoriteArtPiece(artPieceId) {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;
  const key = ['getUserFavoriteArtPiece', artPieceId, userId];

  const { data, isLoading, error, isValidating } = useSWR(
    artPieceId && userId ? key : null,
    () => requests.getUserFavoriteArtPiece(artPieceId, accessToken, userId),
    swrOptions
  );

  return useMemo(
    () => ({
      favorite: data?.data?.userFavoriteArtPiece || null,
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
 * Hook to toggle user favorite art piece status.
 * @function useToggleUserFavoriteArtPiece
 * @returns {Function} Function to toggle favorite status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useToggleUserFavoriteArtPiece() {
  const { accessToken, user } = useAuthContext();
  const userId = user?.userId;

  return async (artPieceId) => {
    const result = await requests.toggleUserFavoriteArtPiece(artPieceId, accessToken);

    // Update SWR cache if toggle was successful
    if (result.status === 'success' && userId) {
      const key = ['getUserFavoriteArtPiece', artPieceId, userId];

      // Update the cache with the new favorite status
      mutate(
        key,
        {
          data: {
            userFavoriteArtPiece: result.data.userFavoriteArtPiece,
            isFavorited: result.data.userFavoriteArtPiece.isFavorite,
          },
        },
        false
      );
    }

    return result;
  };
}
