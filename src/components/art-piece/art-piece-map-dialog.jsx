/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMap
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import { stripHtmlTags } from 'src/utils/change-case';

import { CloseIcon } from 'src/components/icons';
import { TextMaxLine } from 'src/components/text-max-line';
import { ArtPieceFollowers } from 'src/components/art-piece';
import { ArtPieceNotFound } from 'src/components/art-piece/art-piece-not-found';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMapDialog
 * @function ArtPieceMapDialog
 * @description
 * ArtPieceMapDialog component displays a modal dialog with details about an art piece,
 * including its title, description, image, and follower statistics.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.artPiece - The art piece details. Supports both regular art pieces and cart items with different property structures:
 *   - Regular: `imageUrl`, `slug`, `Artist.slug`
 *   - Cart items: `image`, `artPieceSlug`, `artistSlug`
 * @param {boolean} props.open - Indicates whether the dialog is open.
 * @param {function} props.onClose - Callback function triggered when the dialog is closed.
 *
 * @returns {JSX.Element|null} A modal dialog displaying the art piece details, or null if no art piece is provided.
 *
 * @example
 * const mockArtPiece = {
 *   title: 'Starry Night',
 *   description: '<p>A masterpiece by Vincent van Gogh.</p>',
 *   imageUrl: '/images/starry-night.jpg',
 *   artPieceId: 1,
 *   artist: {
 *     slug: 'vincent-van-gogh',
 *   },
 *   slug: 'starry-night',
 * };
 *
 * <ArtPieceMapDialog
 *   artPiece={mockArtPiece}
 *   open={true}
 *   onClose={() => console.log('Dialog closed')}
 * />
 */
export function ArtPieceMapDialog({ artPiece, open, onClose }) {
  if (!artPiece) {
    return null;
  }

  const displayDescription = artPiece.description
    ? stripHtmlTags(artPiece.description)
    : 'No description available.';

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {artPiece.title}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 1.5,
                overflow: 'hidden',
                width: '100%',
              }}
            >
              {artPiece.imageUrl || artPiece.image ? (
                <Link
                  href={paths.art.artist.artwork.details(
                    artPiece?.Artist?.slug || artPiece.artistSlug,
                    artPiece.slug || artPiece.artPieceSlug
                  )}
                  title={artPiece.title}
                >
                  <Image
                    alt={artPiece.title}
                    src={artPiece.imageUrl || artPiece.image}
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                </Link>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link
                    href={paths.art.artist.artwork.details(
                      artPiece?.Artist?.slug || artPiece.artistSlug,
                      artPiece.slug || artPiece.artPieceSlug
                    )}
                    title={artPiece.title}
                  >
                    <ArtPieceNotFound
                      title="Image Not Available"
                      description="No image available for this art piece."
                    />
                  </Link>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid xs={12} md={8}>
            <TextMaxLine
              line={6}
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'center' }}
            >
              {displayDescription}
            </TextMaxLine>
          </Grid>
        </Grid>
        <Divider />
        <ArtPieceFollowers
          favoriteCount={artPiece.favoriteCount || 0}
          imageCount={artPiece.imageCount || 1}
          viewCount={artPiece.viewCount || 0}
        />
      </DialogContent>
    </Dialog>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMapDialog
 * @prop {Object} artPiece - The art piece details, including `title`, `description`, `imageUrl`, `artPieceId`, and `artist` information. This prop is required.
 * @prop {boolean} open - Indicates whether the dialog is open. This prop is required.
 * @prop {Function} onClose - Callback function triggered when the dialog is closed. This prop is required.
 */
ArtPieceMapDialog.propTypes = {
  artPiece: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string, // Regular art pieces
    image: PropTypes.string, // Cart items
    artPieceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    artist: PropTypes.shape({
      slug: PropTypes.string,
    }),
    Artist: PropTypes.shape({
      slug: PropTypes.string,
    }),
    slug: PropTypes.string, // Regular art pieces
    artPieceSlug: PropTypes.string, // Cart items
    artistSlug: PropTypes.string, // Cart items
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
