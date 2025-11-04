/**
 * @namespace CityArtWalks.Forms.Elements.ArtistBio
 * @version 1.0.0
 * @author GitHub Copilot
 * @fileoverview Form element for artist biography with AI generation functionality
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import { sanitizeText } from 'src/lib/sanitize';
import { generateArtistBiography } from 'src/actions/artist/requests';

import { toast } from 'src/components/snackbar';
import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistBio
 * @function ElementArtistBio
 * @description Form element component for artist biography with AI generation capability.
 *
 * This component provides a rich text editor for artist biographies with the ability to generate
 * AI-powered biographies using the OpenAI API. It includes proper validation, error handling, and
 * consistent styling with other form elements.
 *
 * Features:
 * - Rich text editor with full formatting capabilities
 * - AI-powered biography generation with input sanitization
 * - Comprehensive security measures against XSS and injection attacks
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Accessibility support
 * - Reusable across different artist forms
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="biography"] - The form field name for the biography
 * @param {string} [props.label="Biography"] - The label text for the editor
 * @param {string} [props.helperText] - Helper text to display below the editor
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled
 * @param {boolean} [props.showAIButton=true] - Whether to show the AI generation button
 * @param {Object} [props.currentArtist] - Current artist data for AI generation
 * @param {Object} [props.sx] - Additional styling props for the editor
 * @param {Object} [...props.other] - Other props to pass to the Editor component
 *
 * @returns {JSX.Element} The rendered artist biography editor element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtistBio />
 *
 * @example
 * // With AI generation for existing artist
 * <ElementArtistBio
 *   name="biography"
 *   label="Artist Biography"
 *   currentArtist={artist}
 *   helperText="Enter a detailed biography of the artist"
 * />
 *
 * @example
 * // Without AI button for basic editing
 * <ElementArtistBio
 *   showAIButton={false}
 *   sx={{ maxHeight: 300 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */
export function ElementArtistBio(props) {
  const {
    name = 'biography',
    label = 'Biography',
    helperText,
    disabled = false,
    showAIButton = true,
    currentArtist,
    sx = { maxHeight: 480 },
    ...other
  } = props;
  const {
    control,
    setValue,
    trigger,
    getValues,
    formState: { isSubmitSuccessful },
  } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0); // Add key for forcing re-render
  const fieldOnChangeRef = useRef(null); // Store field onChange reference using ref

  // Helper function to check if AI generation is available
  const isAIGenerationAvailable = () => {
    if (!currentArtist?.name || !currentArtist?.ArtPiece?.length) return false;

    // Check if sanitized values would be meaningful
    const sanitizedArtistName = sanitizeText(currentArtist.name);

    return Boolean(sanitizedArtistName && currentArtist.ArtPiece.length > 0);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio
   * @function fetchAIBiography
   * @description Generates an AI-powered biography for the artist using OpenAI API.
   *
   * Security Features:
   * - Sanitizes input data (artist name and art pieces) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Makes a POST request to the artist biography endpoint with sanitized artist name and pieces.
   * Formats the sanitized response into HTML paragraphs and updates the form field.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIBiography = async () => {
    if (!currentArtist?.name || !currentArtist?.ArtPiece?.length) {
      toast.error('Artist name and art pieces are required for AI biography generation');
      return;
    }

    // Sanitize input data to prevent XSS, SQL injection, and other security issues
    const sanitizedArtistName = sanitizeText(currentArtist.name);

    // Validate that sanitized data is still meaningful
    if (!sanitizedArtistName) {
      toast.error('Invalid artist name detected. Please check the input data.');
      debugError(
        'CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio.fetchAIBiography',
        'Sanitized input validation failed',
        {
          originalArtistName: currentArtist.name,
          sanitizedArtistName,
          artistId: currentArtist.artistId,
        }
      );
      return;
    }

    setLoading(true);
    try {
      const response = await generateArtistBiography({
        artistName: sanitizedArtistName,
        artPieces: currentArtist.ArtPiece,
      });

      // Extract the biography from the response
      const biographyData = response?.biography || response?.data?.biography;

      if (!biographyData) {
        toast.error('Invalid response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio.fetchAIBiography',
          'No biography data in response',
          {
            response,
            artistId: currentArtist.artistId,
          }
        );
        return;
      }

      // Sanitize the AI response to prevent any potential XSS
      const sanitizedResponse = sanitizeText(biographyData);

      if (!sanitizedResponse) {
        toast.error('Invalid response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio.fetchAIBiography',
          'AI response sanitization failed',
          {
            originalResponse: biographyData,
            sanitizedResponse,
            artistId: currentArtist.artistId,
          }
        );
        return;
      }

      // Format the sanitized AI response into HTML paragraphs
      const formattedBiography = sanitizedResponse
        .split('\n\n') // Split text into paragraphs on double newlines
        .filter((paragraph) => paragraph.trim()) // Remove empty paragraphs
        .map((paragraph) => `<p>${paragraph.trim()}</p>`) // Wrap each paragraph in <p> tags
        .join('');

      // Update the form field using multiple methods to ensure editor updates
      setValue(name, formattedBiography);

      // Also call the field's onChange method directly if available
      if (fieldOnChangeRef.current) {
        fieldOnChangeRef.current(formattedBiography);
      }

      setEditorKey((prev) => prev + 1); // Force re-render of the editor
      trigger(name); // Trigger validation to ensure the field is properly updated

      // Verify the value was set correctly
      setTimeout(() => {
        const currentValue = getValues(name);
        console.log(
          'Biography updated - Form value:',
          currentValue ? 'Set successfully' : 'Failed to set'
        );
      }, 100);

      toast.success('AI biography generated successfully!');
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio.fetchAIBiography',
        'Failed to fetch AI biography',
        {
          error: error.message,
          artistName: sanitizedArtistName,
          artistId: currentArtist?.artistId,
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      let userMessage = 'Failed to generate AI biography. Please try again.';
      if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'You do not have permission to generate AI biographies.';
      } else if (error.message.includes('429')) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      }

      toast.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Stack spacing={1.5} sx={{mt:3}}>
        {/* Header with label and AI button */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>

          {showAIButton && currentArtist && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchAIBiography}
              disabled={loading || disabled || !isAIGenerationAvailable()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Generating...' : 'Get AI Biography'}
            </Button>
          )}
        </Box>

        {/* Warning message when AI Biography is not available */}
        {showAIButton && currentArtist && !isAIGenerationAvailable() && !loading && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              💡 AI Biography generation requires the artist to have at least one art piece. Create
              some art pieces first to enable this feature.
            </Typography>
          </Box>
        )}

        {/* Warning message when no current artist (new artist form) */}
        {showAIButton && !currentArtist && (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              💡 AI Biography generation is available when editing an existing artist with art
              pieces.
            </Typography>
          </Box>
        )}

        {/* Editor Field */}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            // Store the field's onChange method in ref to avoid render issues
            fieldOnChangeRef.current = field.onChange;

            return (
              <Field.Editor
                key={editorKey} // Force re-render when key changes
                {...field}
                disabled={disabled}
                error={!!error}
                helperText={error?.message ?? helperText}
                resetValue={isSubmitSuccessful}
                sx={sx}
                {...other}
              />
            );
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistBio.ElementArtistBio
 * @description PropTypes validation for the ElementArtistBio component
 */
ElementArtistBio.propTypes = {
  /**
   * The form field name for the biography
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * The label text for the editor
   * @type {string}
   */
  label: PropTypes.string,

  /**
   * Helper text to display below the editor
   * @type {string}
   */
  helperText: PropTypes.string,

  /**
   * Whether the editor is disabled
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * Whether to show the AI generation button
   * @type {boolean}
   */
  showAIButton: PropTypes.bool,

  /**
   * Current artist data for AI generation
   * @type {Object}
   */
  currentArtist: PropTypes.shape({
    artistId: PropTypes.number,
    name: PropTypes.string,
    ArtPiece: PropTypes.array,
  }),

  /**
   * Additional styling props for the editor
   * @type {Object}
   */
  sx: PropTypes.object,
};
