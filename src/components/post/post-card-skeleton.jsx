/**
 * @namespace CityArtWalks.Components.Post.PostCardSkeleton
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';

/**
 * @memberof CityArtWalks.Components.Post.PostCardSkeleton
 * @function PostCardSkeleton
 * @description Renders a skeleton loading state for a single post card.
 * Matches the layout and structure of the actual PostCard component.
 *
 * @component
 * @returns {JSX.Element} The rendered PostCardSkeleton component.
 *
 * @example
 * // Usage example
 * import { PostCardSkeleton } from './PostCardSkeleton';
 *
 * function App() {
 *   return <PostCardSkeleton />;
 * }
 */
export function PostCardSkeleton() {
  return (
    <Card sx={{ textAlign: 'center', mb: 3, position: 'relative' }}>
      {/* Featured Image Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} />

      {/* Title Skeleton */}
      <Box sx={{ mt: 2, mb: 1, px: 2 }}>
        <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto' }} />
      </Box>

      {/* Meta Information Skeleton */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={80} height={16} />
        </Stack>
      </Box>

      {/* Description Skeleton */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Skeleton variant="text" width="90%" height={16} sx={{ mx: 'auto', mb: 0.5 }} />
        <Skeleton variant="text" width="85%" height={16} sx={{ mx: 'auto', mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mx: 'auto' }} />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* Footer Skeleton */}
      <Box sx={{ py: 2 }}>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          sx={{ mb: 2 }}
        >
          <Stack width={1} alignItems="center" spacing={0.5}>
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={60} height={14} />
          </Stack>
          <Stack width={1} alignItems="center" spacing={0.5}>
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="text" width={50} height={14} />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </Box>
    </Card>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardSkeleton
 * @function PostCardSkeletonList
 * @description Renders a grid of skeleton loading states for multiple post cards.
 * Useful for displaying loading state while post data is being fetched.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.count=6] - Number of skeleton cards to display.
 * @returns {JSX.Element} The rendered PostCardSkeletonList component.
 *
 * @example
 * // Usage example
 * import { PostCardSkeletonList } from './PostCardSkeleton';
 *
 * function App() {
 *   return <PostCardSkeletonList count={9} />;
 * }
 */
export function PostCardSkeletonList({ count = 6 }) {
  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {Array.from({ length: count }, (_, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <PostCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardSkeleton
 * @prop {number} [count] - Number of skeleton cards to display. This prop is optional.
 */
PostCardSkeletonList.propTypes = {
  count: PropTypes.number,
};
