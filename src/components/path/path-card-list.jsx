/**
 * @namespace CityArtWalks.Components.Path.PathCardList
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Box from '@mui/material/Box';

import { PathCard, PathEmpty } from 'src/components/path';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Path.PathCardList
 * @description Renders a list of path cards.
 * @function PathCardList
 * @param {Object} props - The component props.
 * @param {Array} props.paths - The array of path objects to display.
 * @param {string} [props.gridTemplateColumns='repeat(auto-fill, minmax(250px, 1fr))'] - The CSS grid template columns property.
 * @returns {JSX.Element} The rendered component.
 */
export function PathCardList({
  paths,
  gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))',
}) {
  if (!paths || paths.length === 0)
    return (
      <PathEmpty
        title="No paths found"
        description={`There are no paths available for this location `}
      />
    );

  return (
    <ErrorBoundary>
      <Box
        data-cy="artist-card-list"
        gap={3}
        display="grid"
        gridTemplateColumns={gridTemplateColumns}
      >
        {paths.map((path, index) => (
          <PathCard
            key={index}
            pathId={path.pathId}
            title={path.title}
            description={path.description}
            imageUrl={
              path.staticMapUrl ||
              'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-full.png'
            }
            favoriteCount={0}
            pieceCount={path._count.PathMap}
            viewCount={path.viewCount}
          />
        ))}
      </Box>
    </ErrorBoundary>
  );
}
