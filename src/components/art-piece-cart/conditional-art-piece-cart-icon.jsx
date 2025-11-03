'use client';

import { usePathname } from 'next/navigation';

import { useArtPieceCartContext } from 'src/contexts/art-piece-cart';

import { ArtPieceCartIcon } from './art-piece-cart-icon';

// ----------------------------------------------------------------------

/**
 * Conditional Art Piece Cart Icon - Shows cart icon on appropriate pages
 *
 * @component
 * @memberof CityArtWalks.Components.ArtPieceCart
 * @returns {JSX.Element|null} Cart icon or null based on current route
 *
 * @description
 * Shows the floating cart icon on:
 * - Art piece pages (/art/*)
 * - Path pages (/path/*)
 * - Explore pages (/explore/*)
 *
 * Hides the cart icon on:
 * - Home page (/)
 * - Profile pages (/profile/*)
 * - Auth pages (/auth/*)
 * - Admin/dashboard pages (/dashboard/*)
 */
export function ConditionalArtPieceCartIcon() {
  const pathname = usePathname();
  const { totalItems } = useArtPieceCartContext();

  // Define routes where cart should be shown
  const showCartRoutes = [
    '/art',
    '/path',
    '/explore',
    '/product', // Show on product pages too since they might browse art
  ];

  // Define routes where cart should be hidden
  const hideCartRoutes = ['/', '/profile', '/auth', '/dashboard', '/admin', '/login', '/checkout'];

  // Check if current path should hide cart
  const shouldHideCart = hideCartRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/'; // Only hide on exact home page
    }
    return pathname.startsWith(route);
  });

  // Check if current path should show cart
  const shouldShowCart = showCartRoutes.some((route) => pathname.startsWith(route));

  // Show cart if we're on a show route and not on a hide route
  if (shouldShowCart && !shouldHideCart) {
    return <ArtPieceCartIcon totalItems={totalItems} />;
  }

  return null;
}
