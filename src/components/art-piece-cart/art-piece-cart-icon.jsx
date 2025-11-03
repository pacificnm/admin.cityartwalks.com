import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
// ----------------------------------------------------------------------

/**
 * Art Piece Cart Icon - Floating cart icon showing number of collected art pieces
 * for path generation. Provides quick access to the art piece cart management.
 *
 * @component
 * @memberof CityArtWalks.Components.ArtPieceCart
 * @param {Object} props - Component props
 * @param {number} props.totalItems - Number of art pieces in cart
 * @param {Object} props.sx - Additional styling
 * @returns {JSX.Element} Floating cart icon with badge
 *
 * @description
 * Features:
 * - Shows badge with count of art pieces in cart
 * - Fixed position floating icon on right side
 * - Links to art piece cart/path generation page
 * - Hover effects and smooth transitions
 *
 * @example
 * ```jsx
 * const { totalItems } = useArtPieceCartContext();
 *
 * <ArtPieceCartIcon totalItems={totalItems} />
 * ```
 */
export function ArtPieceCartIcon({ totalItems, sx, ...other }) {
  return (
    <RoleBasedGuard
      allowedRoles={['USER', 'MEMBER', 'ADMIN']}
      displayMode="hidden"
      protecting="ArtPieceCartIcon"
    >
      <Box
        component={RouterLink}
        href={paths.artPiece.cart}
        sx={[
          (theme) => ({
            right: 0,
            top: 120, // Moved higher up to avoid covering content
            zIndex: 999,
            display: 'flex',
            cursor: 'pointer',
            position: 'fixed',
            color: 'text.primary',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            bgcolor: 'background.paper',
            padding: theme.spacing(1, 3, 1, 2),
            boxShadow: theme.vars.customShadows.dropdown,
            transition: theme.transitions.create(['opacity']),
            '&:hover': { opacity: 0.72 },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Badge showZero badgeContent={totalItems} color="primary" max={99}>
          <Iconify icon="solar:map-bold" width={24} />
        </Badge>
      </Box>
    </RoleBasedGuard>
  );
}
