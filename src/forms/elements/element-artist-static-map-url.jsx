/**
 * @fileoverview Form element for artist static map generation with upload functionality
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { endpoints } from 'src/endpoints';

import { toast } from 'src/components/snackbar';
import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistStaticMapUrl
 * @function ElementArtistStaticMapUrl
 * @description Form element for artist static map generation and file upload.
 *
 * Features:
 * - Static map generation via API based on artist's art pieces
 * - File upload capability for custom maps
 * - Automatic form field updates
 * - Loading states and error handling
 * - Disabled state when artist data is unavailable
 *
 * Security Features:
 * - Validates artist data before API calls
 * - Proper error handling and logging
 * - Safe file size limits
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="static_map_url"] - The form field name for the static map URL
 * @param {string} [props.label="Static Map"] - The label text for the upload field
 * @param {string} [props.helperText] - Helper text to display below the upload field
 * @param {boolean} [props.disabled=false] - Whether the element is disabled
 * @param {Object} [props.currentArtist] - Current artist data for map generation
 * @param {number} [props.maxSize=3145728] - Maximum file size in bytes (default: 3MB)
 * @param {Object} [props.sx] - Additional styling props for the upload field
 * @param {Object} [...props.other] - Other props to pass to the Field.Upload component
 *
 * @returns {JSX.Element} The rendered artist static map element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtistStaticMapUrl />
 *
 * @example
 * // With map generation for existing artist
 * <ElementArtistStaticMapUrl
 *   name="static_map_url"
 *   label="Static Map Image"
 *   currentArtist={artist}
 *   helperText="Upload a static map or generate one automatically"
 * />
 *
 * @example
 * // Custom file size limit
 * <ElementArtistStaticMapUrl
 *   maxSize={5242880} // 5MB
 *   sx={{ mb: 3 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */
export function ElementArtistStaticMapUrl(props) {
  const {
    name = 'static_map_url',
    helperText,
    disabled = false,
    currentArtist,
    maxSize = 3145728, // 3MB default
    sx,
    ...other
  } = props;
  const { setValue } = useFormContext();
  const [loading, setLoading] = useState(false);

  // Helper function to check if static map generation is available
  const isMapGenerationAvailable = () =>
    Boolean(
      currentArtist &&
        currentArtist.artistId &&
        currentArtist.slug &&
        currentArtist.pieces &&
        currentArtist.pieces.length > 0
    );

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtistStaticMapUrl.ElementArtistStaticMapUrl
   * @function fetchStaticMap
   * @description Generates a static map image for the artist using their art pieces.
   *
   * Security Features:
   * - Validates artist data before making API calls
   * - Proper error handling and logging
   * - Safe API endpoint usage
   *
   * Uses the artist static map API endpoint to generate a map based on all art pieces.
   * Updates the form field with the generated map URL.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails or required data is missing
   */
  const fetchStaticMap = async () => {
    if (!isMapGenerationAvailable()) {
      toast.error('Artist data with art pieces is required for static map generation');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(endpoints.artist.staticMap(currentArtist.artistId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artPieces: currentArtist.pieces,
          artistSlug: currentArtist.slug,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create static map image: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error('No URL returned from static map generation');
      }

      setValue(name, data.url);
      toast.success('Static map generated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to generate static map');
      console.error('Error fetching static map:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateButtonText = loading ? 'Generating...' : 'Generate Static Map';
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
                    disabled={isElementDisabled || loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
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

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistStaticMapUrl.ElementArtistStaticMapUrl
 * @description PropTypes validation for the ElementArtistStaticMapUrl component
 */
ElementArtistStaticMapUrl.propTypes = {
  /**
   * The form field name for the static map URL
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * Helper text to display below the upload field
   * @type {React.Node}
   */
  helperText: PropTypes.node,

  /**
   * Whether the element is disabled
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * Current artist data for map generation
   * @type {Object}
   */
  currentArtist: PropTypes.shape({
    artistId: PropTypes.number,
    slug: PropTypes.string,
    pieces: PropTypes.array,
  }),

  /**
   * Maximum file size in bytes
   * @type {number}
   */
  maxSize: PropTypes.number,

  /**
   * Additional styling props for the upload field
   * @type {Object}
   */
  sx: PropTypes.object,
};
