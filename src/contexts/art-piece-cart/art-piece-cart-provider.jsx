'use client';

import { isEqual } from 'es-toolkit';
import { getStorage } from 'minimal-shared/utils';
import { useLocalStorage } from 'minimal-shared/hooks';
import { useMemo, useState, Suspense, useEffect, useCallback } from 'react';

import { debugLog, debugError } from 'src/lib/debug';

import { SplashScreen } from 'src/components/loading-screen';

import { ArtPieceCartContext } from './art-piece-cart-context';

// ----------------------------------------------------------------------

const ART_PIECE_CART_STORAGE_KEY = 'app-art-piece-cart';

const initialState = {
  items: [],
  totalItems: 0,
};

// ----------------------------------------------------------------------

/**
 * Art Piece Cart Provider - Manages a cart-like system for collecting art pieces
 * that can be used to generate AI-optimized walking paths.
 *
 * @component
 * @memberof CityArtWalks.Contexts.ArtPieceCart
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component with art piece cart context
 *
 * @description
 * Provides functionality to:
 * - Add art pieces to a collection/cart
 * - Remove art pieces from collection
 * - Clear entire collection
 * - Persist cart state in localStorage
 * - Generate AI-optimized paths from collected art pieces
 *
 * @example
 * ```jsx
 * // Wrap your app with the provider
 * <ArtPieceCartProvider>
 *   <App />
 * </ArtPieceCartProvider>
 *
 * // Use in components
 * const { addArtPiece, removeArtPiece, items, totalItems } = useArtPieceCartContext();
 * ```
 */
export function ArtPieceCartProvider({ children }) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <ArtPieceCartContainer>{children}</ArtPieceCartContainer>
    </Suspense>
  );
}

// ----------------------------------------------------------------------

function ArtPieceCartContainer({ children }) {
  const [loading, setLoading] = useState(true);

  const { state, setState, setField, resetState } = useLocalStorage(
    ART_PIECE_CART_STORAGE_KEY,
    initialState,
    { initializeWithValue: false }
  );

  const canReset = !isEqual(state, initialState);

  const updateTotals = useCallback(() => {
    const totalItems = state.items.length;
    setField('totalItems', totalItems);
  }, [setField, state.items]);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        const restoredValue = getStorage(ART_PIECE_CART_STORAGE_KEY);
        if (restoredValue) {
          updateTotals();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, [updateTotals]);

  /**
   * Adds an art piece to the cart. Prevents duplicates by checking artPieceId.
   * Ensures all required ArtPieceCard props are included with appropriate defaults.
   *
   * @function onAddArtPiece
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @param {Object} newArtPiece - Art piece object to add
   * @param {number} newArtPiece.userId - ID of the user adding the piece
   * @param {number} newArtPiece.artPieceId - Unique ID of the art piece
   * @param {number} newArtPiece.artistId - ID of the artist
   * @param {string} newArtPiece.title - Title of the art piece
   * @param {string} newArtPiece.image - Image URL (mapped to artPieceImageUrl in components)
   * @param {number} newArtPiece.latitude - Latitude coordinate
   * @param {number} newArtPiece.longitude - Longitude coordinate
   * @param {string} newArtPiece.artPieceSlug - Art piece slug for navigation
   * @param {string} newArtPiece.artistSlug - Artist slug for navigation
   * @param {string} newArtPiece.artistName - Name of the artist
   * @param {string} [newArtPiece.description] - Optional description (defaults to empty string)
   * @param {string} [newArtPiece.artistImageUrl] - Optional artist image URL (defaults to empty string)
   * @param {number} [newArtPiece.favoriteCount] - Optional favorite count (defaults to 0)
   * @param {number} [newArtPiece.imageCount] - Optional image count (defaults to 1)
   * @param {number} [newArtPiece.viewCount] - Optional view count (defaults to 0)
   * @returns {boolean} True if item was added successfully, false if already exists
   */
  const onAddArtPiece = useCallback(
    (newArtPiece) => {
      // Check if art piece already exists in cart
      const existingItem = state.items.find((item) => item.artPieceId === newArtPiece.artPieceId);

      if (existingItem) {
        debugLog(
          'CityArtWalks.Contexts.ArtPieceCart',
          'Art piece already in cart:',
          newArtPiece.title
        );
        return false; // Indicate item was not added
      }

      // Ensure all required ArtPieceCard props are included with defaults
      const cartItem = {
        ...newArtPiece,
        id: newArtPiece.artPieceId,
        // Required props for ArtPieceCard with fallbacks
        title: newArtPiece.title || 'Untitled',
        description: newArtPiece.description || '',
        artistName: newArtPiece.artistName || 'Unknown Artist',
        artPieceImageUrl: newArtPiece.image || newArtPiece.artPieceImageUrl || '',
        artistImageUrl: newArtPiece.artistImageUrl || '',
        artPieceSlug: newArtPiece.artPieceSlug || '',
        artistSlug: newArtPiece.artistSlug || '',
        favoriteCount: newArtPiece.favoriteCount || 0,
        imageCount: newArtPiece.imageCount || 1,
        viewCount: newArtPiece.viewCount || 0,
        // Keep original image field for map compatibility
        image: newArtPiece.image || newArtPiece.artPieceImageUrl || '',
      };

      const updatedItems = [...state.items, cartItem];
      setField('items', updatedItems);

      debugLog('CityArtWalks.Contexts.ArtPieceCart', 'Added art piece to cart:', newArtPiece.title);
      return true; // Indicate item was added successfully
    },
    [setField, state.items]
  );

  /**
   * Adds multiple art pieces to the cart in a single operation.
   * This prevents race conditions when adding many items at once.
   *
   * @function onAddMultipleArtPieces
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @param {Array} newArtPieces - Array of art piece objects to add
   * @returns {number} Number of items actually added (excluding duplicates)
   */
  const onAddMultipleArtPieces = useCallback(
    (newArtPieces) => {
      let addedCount = 0;
      const itemsToAdd = [];

      newArtPieces.forEach((newArtPiece) => {
        // Check if art piece already exists in current cart OR in items being added
        const existsInCart = state.items.find((item) => item.artPieceId === newArtPiece.artPieceId);
        const existsInBatch = itemsToAdd.find((item) => item.artPieceId === newArtPiece.artPieceId);

        if (existsInCart || existsInBatch) {
          debugLog(
            'CityArtWalks.Contexts.ArtPieceCart',
            'Art piece already in cart or batch:',
            newArtPiece.title
          );
          return; // Skip this item
        }

        // Ensure all required ArtPieceCard props are included with defaults
        const cartItem = {
          ...newArtPiece,
          id: newArtPiece.artPieceId,
          // Required props for ArtPieceCard with fallbacks
          title: newArtPiece.title || 'Untitled',
          description: newArtPiece.description || '',
          artistName: newArtPiece.artistName || 'Unknown Artist',
          artPieceImageUrl: newArtPiece.image || newArtPiece.artPieceImageUrl || '',
          artistImageUrl: newArtPiece.artistImageUrl || '',
          artPieceSlug: newArtPiece.artPieceSlug || '',
          artistSlug: newArtPiece.artistSlug || '',
          favoriteCount: newArtPiece.favoriteCount || 0,
          imageCount: newArtPiece.imageCount || 1,
          viewCount: newArtPiece.viewCount || 0,
          // Keep original image field for map compatibility
          image: newArtPiece.image || newArtPiece.artPieceImageUrl || '',
        };

        itemsToAdd.push(cartItem);
        addedCount++;
      });

      if (itemsToAdd.length > 0) {
        const updatedItems = [...state.items, ...itemsToAdd];
        setField('items', updatedItems);
        debugLog(
          'CityArtWalks.Contexts.ArtPieceCart',
          'Added multiple art pieces to cart:',
          addedCount
        );
      }

      return addedCount;
    },
    [setField, state.items]
  );

  /**
   * Removes an art piece from the cart by artPieceId.
   *
   * @function onRemoveArtPiece
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @param {number} artPieceId - ID of the art piece to remove
   */
  const onRemoveArtPiece = useCallback(
    (artPieceId) => {
      const updatedItems = state.items.filter((item) => item.artPieceId !== artPieceId);
      setField('items', updatedItems);

      debugLog('CityArtWalks.Contexts.ArtPieceCart', 'Removed art piece from cart:', artPieceId);
    },
    [setField, state.items]
  );

  /**
   * Clears all art pieces from the cart.
   *
   * @function onClearCart
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   */
  const onClearCart = useCallback(() => {
    resetState(initialState);
    debugLog('CityArtWalks.Contexts.ArtPieceCart', 'Cleared cart');
  }, [resetState]);

  /**
   * Reorders the art pieces in the cart.
   *
   * @function onReorderItems
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @param {Array} reorderedItems - Array of art pieces in new order
   */
  const onReorderItems = useCallback(
    (reorderedItems) => {
      setField('items', reorderedItems);
      debugLog('CityArtWalks.Contexts.ArtPieceCart', 'Reordered cart items');
    },
    [setField]
  );

  /**
   * Checks if an art piece is already in the cart.
   *
   * @function isInCart
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @param {number} artPieceId - ID of the art piece to check
   * @returns {boolean} True if art piece is in cart
   */
  const isInCart = useCallback(
    (artPieceId) => state.items.some((item) => item.artPieceId === artPieceId),
    [state.items]
  );

  /**
   * Generates an AI-optimized path from the collected art pieces.
   * This will be implemented to call an AI service that creates optimal walking routes.
   *
   * @function onGeneratePath
   * @memberof CityArtWalks.Contexts.ArtPieceCart.ArtPieceCartContainer
   * @async
   * @returns {Promise<Object>} Generated path data
   */
  const onGeneratePath = useCallback(async () => {
    try {
      if (state.items.length < 2) {
        throw new Error('Need at least 2 art pieces to generate a path');
      }

      debugLog(
        'CityArtWalks.Contexts.ArtPieceCart',
        'Generating AI path for items:',
        state.items.length
      );

      // TODO: Implement AI path generation
      // This will call an AI service to optimize the walking route
      // const optimizedPath = await generateAIPath(state.items);

      // For now, return a placeholder
      return {
        success: true,
        pathId: Date.now(),
        artPieces: state.items,
        estimatedDistance: '2.5 km',
        estimatedTime: '45 minutes',
        optimizedOrder: state.items, // TODO: Replace with AI-optimized order
      };
    } catch (error) {
      debugError('CityArtWalks.Contexts.ArtPieceCart', 'Failed to generate path:', error);
      throw error;
    }
  }, [state.items]);

  // Update totals when items change
  useEffect(() => {
    updateTotals();
  }, [state.items, updateTotals]);

  const memoizedValue = useMemo(
    () => ({
      // State
      items: state.items,
      totalItems: state.totalItems,
      loading,
      canReset,

      // Actions
      onAddArtPiece,
      onAddMultipleArtPieces,
      onRemoveArtPiece,
      onClearCart,
      onGeneratePath,
      onReorderItems,
      isInCart,

      // Raw state access (if needed)
      state,
      setState,
      setField,
    }),
    [
      state,
      loading,
      canReset,
      onAddArtPiece,
      onAddMultipleArtPieces,
      onRemoveArtPiece,
      onClearCart,
      onGeneratePath,
      onReorderItems,
      isInCart,
      setState,
      setField,
    ]
  );

  return <ArtPieceCartContext value={memoizedValue}>{children}</ArtPieceCartContext>;
}
