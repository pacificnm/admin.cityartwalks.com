/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceItem
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { ViewIcon } from 'src/components/icons';
import { SvgColor } from 'src/components/svg-color';

import { ArtPiecePopover } from './art-piece-popover';
import { ArtPieceCarousel } from './art-piece-carousel';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceItem
 * @function ArtPieceItem
 * @description Renders the details of an art piece, including its description, statistics (favorites, views, paths), and a carousel of images.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.artPiece - The art piece data, including `description`, `viewCount`, `_count.favoriteBy`, `_count.paths`, and `artPieceId`.
 * @returns {JSX.Element} The rendered ArtPieceItem component.
 *
 * @example
 * const mockArtPiece = {
 *   artPieceId: 1,
 *   description: 'A stunning mural showcasing vibrant colors.',
 *   viewCount: 120,
 *   _count: {
 *     favoriteBy: 15,
 *     paths: 3,
 *   },
 * };
 *
 * <ArtPieceItem artPiece={mockArtPiece} />
 */
export function ArtPieceItem({ artPiece }) {
  return (
    <>
      <Stack direction="row">
        <Stack>
          <Stack spacing={1} flexGrow={1}>
            <Box sx={{ typography: 'body2' }}>{parse(artPiece.description)}</Box>
            <ArtPiecePopover artPiece={artPiece} />
          </Stack>

          <Stack direction="row" alignItems="center">
            <Stack
              spacing={1.5}
              flexGrow={1}
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Stack direction="row" alignItems="center">
                <SvgColor
                  src="/assets/icons/app/ic_favorite.svg"
                  sx={{ width: 16, height: 16, mr: 0.5 }}
                />
                {artPiece._count.favoriteBy}
              </Stack>

              <Stack direction="row" alignItems="center">
                <ViewIcon width={16} sx={{ mr: 0.5 }} />
                {artPiece.viewCount}
              </Stack>

              <Stack direction="row" alignItems="center">
                <SvgColor
                  src="/assets/icons/navbar/ic_path.svg"
                  sx={{ width: 16, height: 16, mr: 0.5 }}
                />
                {artPiece._count.paths}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Box
        sx={{
          position: 'relative',
          flexShrink: 0,
          p: 1,
        }}
      >
        <ArtPieceCarousel artPieceId={artPiece.artPieceId} />
      </Box>
    </>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceItem
 * @prop {Object} artPiece - The art piece data, including `description`, `viewCount`, `_count.favoriteBy`, `_count.paths`, and `artPieceId`. This prop is required.
 */
ArtPieceItem.propTypes = {
  artPiece: PropTypes.shape({
    artPieceId: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    viewCount: PropTypes.number.isRequired,
    _count: PropTypes.shape({
      favoriteBy: PropTypes.number.isRequired,
      paths: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
