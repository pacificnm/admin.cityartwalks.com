/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceTabDetail
 * @version 1.0.0
 * @author jaimie garner
 */

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import {
  ArtPieceTags,
  ArtPieceAbout,
  ArtPieceImage,
  ArtPieceNearby,
  ArtPieceDetails,
  ArtPieceFollowers,
  ArtPieceStaticMap,
} from 'src/components/art-piece';

import ErrorBoundary from '../error/error-boundary';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabDetail
 * @function ArtPieceTabDetail
 * @description Renders a detailed view of an art piece, including its title, description, static map, followers, image, and tags.
 * Divides content into two columns: information and metadata.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artPieceId - The unique ID of the art piece.
 * @param {string} props.artistId - The unique ID of the artist.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.description - A detailed description of the art piece.
 * @param {string} props.staticMapUrl - The URL of the static map image for the art piece's location.
 * @param {number} props.latitude - The latitude coordinate of the art piece location.
 * @param {number} props.longitude - The longitude coordinate of the art piece location.
 * @param {string} props.imageUrl - The URL of the art piece's main image.
 * @param {string} props.artPieceSlug - The slug of the art piece, used for navigation.
 * @param {string} props.artistSlug - The slug of the artist, used for navigation.
 * @param {string} props.artistName - The name of the artist.
 * @param {function} props.editDialog - Function to handle the edit dialog.
 * @param {function} props.deleteDialog - Function to handle the delete dialog.
 * @param {function} props.fullScreenDialog - Function to handle the full screen dialog.
 * @param {function} props.imageUploadDialog - Function to handle the image upload dialog.
 * @param {Array<string>} props.tags - Tags associated with the art piece.
 * @param {Array<string>} props.material - Materials used in the creation of the art piece.
 * @param {number} props.viewCount - The number of views for the art piece.
 * @param {number} props.imageCount - The number of images associated with the art piece.
 * @param {number} props.favoriteCount - The number of times the art piece has been favorited.
 * @param {number} props.createdBy - The ID of the user who created the art piece.
 * @returns {JSX.Element} The rendered ArtPieceTabDetail component.
 *
 * @example
 * // Usage example
 * import { ArtPieceTabDetail } from './ArtPieceTabDetail';
 *
 * function App() {
 *   return (
 *     <ArtPieceTabDetail
 *       artPieceId="123"
 *       artistId="456"
 *       title="Starry Night"
 *       description="A masterpiece by Vincent van Gogh depicting a swirling night sky."
 *       staticMapUrl="/maps/starry-night-map.jpg"
 *       latitude={40.7128}
 *       longitude={-74.0060}
 *       imageUrl="/images/starry-night.jpg"
 *       artPieceSlug="starry-night"
 *       artistSlug="vincent-van-gogh"
 *       artistName="Vincent van Gogh"
 *       editDialog={handleEdit}
 *       deleteDialog={handleDelete}
 *       fullScreenDialog={handleFullScreen}
 *       imageUploadDialog={handleImageUpload}
 *       tags={['Impressionism', 'Post-Impressionism']}
 *       material={['Oil Paint', 'Canvas']}
 *       viewCount={1250}
 *       imageCount={5}
 *       favoriteCount={89}
 *       createdBy="user123"
 *     />
 *   );
 * }
 */
export function ArtPieceTabDetail(props) {
  const {
    artPieceId,
    artistId,
    title,
    description,
    staticMapUrl,
    latitude,
    longitude,
    imageUrl,
    artPieceSlug,
    artistSlug,
    artistName,
    editDialog,
    deleteDialog,
    fullScreenDialog,
    imageUploadDialog,
    tags,
    material,
    viewCount,
    imageCount,
    favoriteCount,
    createdBy,
    createdAt,
  } = props;
  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-tab-detail">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <ArtPieceAbout
                artPieceId={artPieceId}
                artistId={artistId}
                title={title}
                imageUrl={imageUrl}
                description={description}
                latitude={latitude}
                longitude={longitude}
                artPieceSlug={artPieceSlug}
                artistSlug={artistSlug}
                artistName={artistName}
                editDialog={editDialog}
                deleteDialog={deleteDialog}
                fullScreenDialog={fullScreenDialog}
                imageUploadDialog={imageUploadDialog}
                createdBy={createdBy}
              />
              <Card>
                <ArtPieceStaticMap
                  artPieceId={artPieceId}
                  staticMapUrl={staticMapUrl}
                  title={title}
                  artPieceSlug={artPieceSlug}
                  artistSlug={artistSlug}
                  createdBy={createdBy}
                  latitude={latitude}
                  longitude={longitude}
                  width={800}
                  height={800}
                  allowLink={false}
                  fullScreenDialog={fullScreenDialog}
                />
              </Card>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Card>
                <ArtPieceFollowers
                  favoriteCount={favoriteCount}
                  imageCount={imageCount}
                  viewCount={viewCount}
                />
              </Card>
              <ArtPieceImage
                imageUrl={imageUrl}
                title={title}
                width={200}
                height={300}
                artPieceId={artPieceId}
                createdBy={createdBy}
              />
              <ArtPieceTags
                tags={tags}
                materials={material}
                artPieceId={artPieceId}
                createdBy={createdBy}
              />
              <ArtPieceDetails
                artPieceId={artPieceId}
                createdBy={createdBy}
                latitude={latitude}
                longitude={longitude}
                artistName={artistName}
                createdAt={createdAt}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* Nearby art pieces section */}
            {latitude && longitude && (
              <ArtPieceNearby
                latitude={latitude}
                longitude={longitude}
                currentArtPieceId={artPieceId}
                artPieceSlug={artPieceSlug}
                artistSlug={artistSlug}
                title="Nearby Art Pieces"
                radiusKm={5}
                maxResults={8}
                sx={{ mt: 4 }}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabDetail
 * PropTypes for the ArtPieceTabDetail component
 */
ArtPieceTabDetail.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  artistId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  staticMapUrl: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  editDialog: PropTypes.func.isRequired,
  deleteDialog: PropTypes.func.isRequired,
  fullScreenDialog: PropTypes.func.isRequired,
  imageUploadDialog: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  material: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewCount: PropTypes.number.isRequired,
  imageCount: PropTypes.number.isRequired,
  favoriteCount: PropTypes.number.isRequired,
  createdBy: PropTypes.number.isRequired,
};
