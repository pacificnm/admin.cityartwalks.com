/**
 * @fileoverview Form element for art piece static map generation with upload functionality
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useCreateStaticMap } from 'src/actions/map/hooks';

import { toast } from 'src/components/snackbar';
import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceStaticMap
 * @function ElementArtPieceStaticMap
 * @description Form element for art piece static map generation and file upload.
 *
 * Features:
 * - Static map generation via API based on art piece coordinates
 * - File upload capability for custom maps
 * - Automatic form field updates
 * - Loading states and error handling
 * - Disabled state when art piece data is unavailable
 *
 * Security Features:
 * - Validates art piece data before API calls
 * - Proper error handling and logging
 * - Safe file size limits
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="staticMapUrl"] - The form field name for the static map URL
 * @param {string} [props.label="Static Map"] - The label text for the upload field
 * @param {string} [props.helperText] - Helper text to display below the upload field
 * @param {boolean} [props.disabled=false] - Whether the element is disabled
 * @param {Object} [props.currentArtPiece] - Current art piece data for map generation
 * @param {number} [props.maxSize=3145728] - Maximum file size in bytes (default: 3MB)
 * @param {Object} [props.sx] - Additional styling props for the upload field
 * @param {Object} [...props.other] - Other props to pass to the Field.Upload component
 *
 * @returns {JSX.Element} The rendered art piece static map element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceStaticMap />
 *
 * @example
 * // With map generation for existing art piece
 * <ElementArtPieceStaticMap
 *   name="staticMapUrl"
 *   label="Static Map Image"
 *   currentArtPiece={artPiece}
 *   helperText="Upload a static map or generate one automatically"
 * />
 *
 * @example
 * // Custom file size limit
 * <ElementArtPieceStaticMap
 *   maxSize={5242880} // 5MB
 *   sx={{ mb: 3 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceStaticMap(props) {
  const {
    name = 'staticMapUrl',
    helperText,
    disabled = false,
    currentArtPiece,
    maxSize = 3145728, // 3MB default
    sx,
    ...other
  } = props;
  const { setValue } = useFormContext();
  const { accessToken } = useAuthContext();
  const { createStaticMap, creatingStaticMap } = useCreateStaticMap(accessToken);

  // Helper function to check if static map generation is available
  const isMapGenerationAvailable = () =>
    Boolean(
      currentArtPiece &&
        currentArtPiece.artPieceId &&
        currentArtPiece.slug &&
        currentArtPiece.latitude &&
        currentArtPiece.longitude
    );

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtPieceStaticMap.ElementArtPieceStaticMap
   * @function fetchStaticMap
   * @description Generates a static map image for the art piece using the hooks pattern.
   *
   * Security Features:
   * - Validates art piece data before making API calls
   * - Uses centralized hooks for consistent error handling
   * - Safe API endpoint usage through hooks
   *
   * Uses the createStaticMap hook to generate a map with art piece coordinates.
   * Updates the form field with the generated map URL.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails or required data is missing
   */
  const fetchStaticMap = async () => {
    if (!isMapGenerationAvailable()) {
      toast.error('Art piece data with coordinates is required for static map generation');
      return;
    }

    try {
      const mapData = {
        artPieceSlug: currentArtPiece.slug,
        latitude: currentArtPiece.latitude,
        longitude: currentArtPiece.longitude,
      };

      const result = await createStaticMap(mapData);

      if (!result?.url) {
        throw new Error('No URL returned from static map generation');
      }

      setValue(name, result.url);
      toast.success('Static map generated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to generate static map');
    }
  };

  const generateButtonText = creatingStaticMap ? 'Generating...' : 'Generate Static Map';
  const isElementDisabled = disabled || !isMapGenerationAvailable();
  return (
    <ErrorBoundary>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Field.Upload
            {...field}
            disabled={isElementDisabled}
            maxSize={maxSize}
            error={!!error}
            helperText={
              error?.message ||
              helperText || (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchStaticMap}
                    disabled={isElementDisabled || creatingStaticMap}
                    startIcon={creatingStaticMap ? <CircularProgress size={16} /> : null}
                  >
                    {generateButtonText}
                  </Button>
                </Typography>
              )
            }
            sx={sx}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementArtPieceStaticMap.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  disabled: PropTypes.bool,
  currentArtPiece: PropTypes.shape({
    artPieceId: PropTypes.number,
    slug: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  maxSize: PropTypes.number,
  sx: PropTypes.object,
};
