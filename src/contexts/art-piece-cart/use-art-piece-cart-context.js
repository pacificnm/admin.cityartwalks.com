'use client';

import { use } from 'react';

import { ArtPieceCartContext } from './art-piece-cart-context';

// ----------------------------------------------------------------------

export function useArtPieceCartContext() {
  const context = use(ArtPieceCartContext);

  if (!context) throw new Error('useArtPieceCartContext must be used inside ArtPieceCartProvider');

  return context;
}
