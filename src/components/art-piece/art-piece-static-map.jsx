/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceStaticMap
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { getArtistStaticMapUrl } from 'src/utils/map';

import { debugLog, debugError } from 'src/lib/debug';
import { useUpdateArtPiece } from 'src/actions/art-piece/hooks';
import { updateArtPieceSchema } from 'src/validators/art-piece';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceStaticMap
 * @function ArtPieceStaticMap
 * @description Displays a static map image for an art piece with an optional link to its details page.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.staticMapUrl - The URL of the static map image.
 * @param {string} props.title - The alt text for the static map image.
 * @param {string} props.artPieceSlug - The slug of the art piece for generating the link.
 * @param {string} props.artistSlug - The slug of the artist for generating the link.
 * @param {number} [props.width=380] - The width of the static map image.
 * @param {number} [props.height=380] - The height of the static map image.
 * @param {boolean} [props.allowLink=true] - Indicates whether the map image should link to the art piece details page.
 * @returns {JSX.Element} The rendered ArtPieceStaticMap component.
 *
 * @example
 * <ArtPieceStaticMap
 *   staticMapUrl="/maps/starry-night-map.jpg"
 *   title="Map of Starry Night"
 *   artPieceSlug="starry-night"
 *   artistSlug="van-gogh"
 *   width={400}
 *   height={400}
 *   allowLink={true}
 * />
 */
export function ArtPieceStaticMap(props) {
  const {
    artPieceId,
    staticMapUrl,
    title,
    artPieceSlug,
    artistSlug,
    createdBy,
    latitude,
    longitude,
    width = 380,
    height = 380,
    allowLink = true,
    fullScreenDialog,
  } = props;

  const { accessToken } = useAuthContext();
  const updateArtPiece = useUpdateArtPiece(accessToken);
  const [isGenerating, setIsGenerating] = useState(false);

  debugLog('CityArtWalks.Components.ArtPiece.ArtPieceStaticMap', 'Component rendered', {
    artPieceId,
    hasStaticMapUrl: !!staticMapUrl,
    hasCoordinates: !!(latitude && longitude),
  });

  /**
   * Handle generating static map by calling the map generation API
   */
  const handleGenerateStaticMap = async () => {
    if (!latitude || !longitude) {
      toast.error('Latitude and longitude are required to generate a map');
      return;
    }

    setIsGenerating(true);
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
      'Starting static map generation',
      {
        artPieceId,
        latitude,
        longitude,
      }
    );

    try {
      // Generate the static map URL using the coordinates
      // Create the data structure that getArtistStaticMapUrl expects
      const mapData = {
        pieces: [
          {
            latitude,
            longitude,
            title: title || 'Art Piece Location',
          },
        ],
      };

      const newStaticMapUrl = await getArtistStaticMapUrl(mapData);

      if (!newStaticMapUrl) {
        throw new Error('Failed to generate static map URL');
      }

      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
        'Static map URL generated successfully',
        {
          artPieceId,
          newStaticMapUrl,
        }
      ); // Validate and prepare update data
      const updateData = updateArtPieceSchema.parse({
        id: artPieceId,
        staticMapUrl: newStaticMapUrl,
      });

      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
        'Update data prepared, calling updateArtPiece',
        {
          artPieceId,
          updateData,
          updateArtPieceType: typeof updateArtPiece,
          updateArtPieceAvailable: !!updateArtPiece,
        }
      );

      // Update the art piece with the new static map URL
      try {
        const result = await updateArtPiece(artPieceId, updateData);

        debugLog(
          'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
          'Art piece updated with static map URL',
          {
            artPieceId,
            result: result ? 'success' : 'no result',
            resultType: typeof result,
          }
        );
      } catch (updateError) {
        debugError(
          'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
          'Error during updateArtPiece call',
          {
            error: updateError.message,
            errorStack: updateError.stack,
            artPieceId,
            updateData,
          }
        );
        throw updateError;
      }

      toast.success('Static map generated and saved successfully!');
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPiece.ArtPieceStaticMap.handleGenerateStaticMap',
        'Failed to generate static map',
        {
          error: error.message,
          artPieceId,
          latitude,
          longitude,
        }
      );

      toast.error(`Failed to generate static map: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!staticMapUrl || staticMapUrl === 'null') {
    return (
      <Box
        sx={{
          width: '100%',
          height,
          minHeight: 200,
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          position: 'relative',
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', p: 3 }}>
          <Iconify
            icon="solar:map-point-outline"
            width={48}
            height={48}
            sx={{ color: 'grey.400' }}
          />
          <Typography variant="body2" color="text.secondary">
            No map available for this Art Piece
          </Typography>

          <OwnerGuard userId={createdBy}>
            <Button
              variant="contained"
              size="small"
              disabled={isGenerating || !latitude || !longitude}
              startIcon={
                isGenerating ? (
                  <Iconify icon="svg-spinners:8-dots-rotate" width={16} height={16} />
                ) : (
                  <Iconify icon="solar:map-point-add-bold" width={16} height={16} />
                )
              }
              onClick={handleGenerateStaticMap}
              sx={{ mt: 1 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Map'}
            </Button>
            {(!latitude || !longitude) && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                Coordinates required to generate map
              </Typography>
            )}
          </OwnerGuard>
        </Stack>
      </Box>
    );
  }

  if (allowLink) {
    return (
      <Link href={paths.art.artist.artwork.details(artPieceSlug, artistSlug)}>
        <Image
          src={staticMapUrl}
          alt={title}
          width={width}
          height={height}
          style={{ width: '100%', height: 'auto' }}
        />
      </Link>
    );
  }

  return (
    <Image
      src={staticMapUrl}
      alt={title}
      width={width}
      height={height}
      style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
      onClick={() => fullScreenDialog?.onTrue()}
    />
  );
}
/**
 * @prop {string} artPieceId - The ID of the art piece. This prop is required.
 * @prop {string} staticMapUrl - The URL of the static map image. This prop is required.
 * @prop {string} title - The alt text for the static map image. This prop is required.
 * @prop {string} artPieceSlug - The slug of the art piece for generating the link. This prop is required.
 * @prop {string} artistSlug - The slug of the artist for generating the link. This prop is required.
 * @prop {string} createdBy - The ID of the user who created the art piece. This prop is required.
 * @prop {number} latitude - The latitude coordinate for map generation. This prop is optional.
 * @prop {number} longitude - The longitude coordinate for map generation. This prop is optional.
 * @prop {number} [width=380] - The width of the static map image. This prop is optional.
 * @prop {number} [height=380] - The height of the static map image. This prop is optional.
 * @prop {boolean} [allowLink=true] - Indicates whether the map image should link to the art piece details page. This prop is optional.
 * @prop {Object} [fullScreenDialog] - Dialog state object for full screen viewing. This prop is optional.
 */
ArtPieceStaticMap.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  staticMapUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  allowLink: PropTypes.bool,
  fullScreenDialog: PropTypes.shape({
    value: PropTypes.bool,
    onTrue: PropTypes.func,
    onFalse: PropTypes.func,
  }),
};
