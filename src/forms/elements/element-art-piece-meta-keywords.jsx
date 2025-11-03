/**
 * @fileoverview Form element for art piece meta keywords with AI generation functionality
 *
 * @namespace CityArtWalks.Forms.Elements.ArtPieceMetaKeywords
 * @version 1.0.0
 * @author Jaimie Garner
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import { sanitizeText } from 'src/lib/sanitize';
import { useGenerateArtPieceAIMetaKeywords } from 'src/actions/art-piece/hooks';

import { toast } from 'src/components/snackbar';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaKeywords
 * @function ElementArtPieceMetaKeywords
 * @description Form element component for art piece meta keywords with AI generation capability.
 *
 * This component provides a text field for SEO meta keywords with the ability to generate
 * AI-powered keywords based on the full art piece description and metadata. It includes proper
 * validation, character limits (255 chars), error handling, and consistent styling.
 *
 * Features:
 * - Text field with character counter for SEO optimization
 * - AI-powered meta keywords generation from full description and art piece data
 * - 255 character limit validation with visual feedback
 * - Comma-separated keywords format
 * - Input sanitization for security
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Authentication-aware functionality
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="metaKeywords"] - The form field name for the meta keywords
 * @param {string} [props.label="Meta Keywords"] - The label text for the field
 * @param {string} [props.helperText="SEO keywords (max 255 characters, comma-separated)"] - Helper text to display
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.showAIButton=true] - Whether to show the AI generation button
 * @param {Object} [props.currentArtPiece] - Current art piece data for AI generation
 * @param {string} [props.descriptionFieldName="description"] - Name of the description field to use as source
 * @param {Object} [props.sx] - Additional styling props for the text field
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered art piece meta keywords field element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceMetaKeywords />
 *
 * @example
 * // With AI generation for existing art piece
 * <ElementArtPieceMetaKeywords
 *   name="metaKeywords"
 *   label="SEO Meta Keywords"
 *   currentArtPiece={artPiece}
 *   helperText="Relevant keywords for search engines (max 255 characters)"
 * />
 *
 * @example
 * // Without AI button for basic editing
 * <ElementArtPieceMetaKeywords
 *   showAIButton={false}
 *   descriptionFieldName="customDescription"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceMetaKeywords(props) {
  const {
    name = 'metaKeywords',
    label = 'Meta Keywords',
    helperText = 'SEO keywords (max 255 characters, comma-separated)',
    disabled = false,
    showAIButton = true,
    currentArtPiece,
    descriptionFieldName = 'description',
    sx = {},
    ...other
  } = props;

  const { control, setValue, watch } = useFormContext();
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Use the AI hook (will need to be created)
  const generateAIMetaKeywords = useGenerateArtPieceAIMetaKeywords(accessToken);

  // Watch the description field to use as source for AI generation
  const descriptionContent = watch(descriptionFieldName);

  // Watch current field for character count
  const currentValue = watch(name) || '';
  const characterCount = currentValue.length;
  const isOverLimit = characterCount > 255;

  // Helper function to check if AI generation is available
  const isAIGenerationAvailable = () => {
    // Check both possible artist name locations
    const artistName = currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name;

    if (!artistName || !currentArtPiece?.title) return false;

    // Check if we have a description to work from
    if (!descriptionContent || descriptionContent.trim().length === 0) return false;

    // Check if sanitized values would be meaningful
    const sanitizedArtistName = sanitizeText(artistName);
    const sanitizedTitle = sanitizeText(currentArtPiece.title);

    return Boolean(sanitizedArtistName && sanitizedTitle);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaKeywords.ElementArtPieceMetaKeywords
   * @function fetchAIMetaKeywords
   * @description Generates AI-powered meta keywords for the art piece using the full description and metadata.
   *
   * Security Features:
   * - Sanitizes input data (artist name, title, and description) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Uses the full art piece description, title, artist name, and location data as source material to generate
   * relevant, comma-separated SEO keywords. Strips HTML tags and formats the response appropriately.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIMetaKeywords = async () => {
    // Check both possible artist name locations
    const artistName = currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name;

    if (!artistName || !currentArtPiece?.title) {
      toast.error('Artist name and art piece title are required for AI meta keywords generation');
      return;
    }

    if (!descriptionContent || descriptionContent.trim().length === 0) {
      toast.error('Art piece description is required to generate meta keywords');
      return;
    }

    // Sanitize input data to prevent XSS, SQL injection, and other security issues
    const sanitizedArtistName = sanitizeText(artistName);
    const sanitizedTitle = sanitizeText(currentArtPiece.title);
    const sanitizedDescription = sanitizeText(descriptionContent);

    // Validate that sanitized data is still meaningful
    if (!sanitizedArtistName || !sanitizedTitle || !sanitizedDescription) {
      toast.error(
        'Invalid input data detected. Please check the artist name, title, and description.'
      );
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceMetaKeywords.ElementArtPieceMetaKeywords.fetchAIMetaKeywords',
        'Sanitized input validation failed',
        {
          originalArtistName: artistName,
          originalTitle: currentArtPiece.title,
          originalDescriptionLength: descriptionContent?.length || 0,
          sanitizedArtistName,
          sanitizedTitle,
          sanitizedDescriptionLength: sanitizedDescription?.length || 0,
          artPieceId: currentArtPiece.artPieceId,
        }
      );
      return;
    }

    setLoading(true);
    try {
      // Use the AI hook to generate meta keywords
      const metaKeywords = await generateAIMetaKeywords(
        currentArtPiece.artPieceId,
        sanitizedArtistName,
        sanitizedTitle,
        sanitizedDescription,
        {
          city: currentArtPiece.city,
          state: currentArtPiece.state,
          medium: currentArtPiece.medium,
          artPieceType: currentArtPiece.artPieceType,
          artPieceMaterial: currentArtPiece.artPieceMaterial,
          artPieceTag: currentArtPiece.artPieceTag,
        }
      );

      if (!metaKeywords) {
        toast.error('No meta keywords received from AI service. Please try again.');
        return;
      }

      // Sanitize the AI response to prevent any potential XSS
      const sanitizedResponse = sanitizeText(metaKeywords);

      if (!sanitizedResponse) {
        toast.error('Invalid response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.ArtPieceMetaKeywords.ElementArtPieceMetaKeywords.fetchAIMetaKeywords',
          'AI response sanitization failed',
          {
            originalResponse: metaKeywords,
            sanitizedResponse,
            artPieceId: currentArtPiece.artPieceId,
          }
        );
        return;
      }

      // Ensure the response is within the 255 character limit
      const trimmedResponse =
        sanitizedResponse.length > 255
          ? sanitizedResponse.substring(0, 252) + '...'
          : sanitizedResponse;

      // Update the form field
      setValue(name, trimmedResponse);

      toast.success('AI meta keywords generated successfully!');
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceMetaKeywords.ElementArtPieceMetaKeywords.fetchAIMetaKeywords',
        'Failed to fetch AI meta keywords',
        {
          error: error.message,
          artistName: sanitizedArtistName,
          title: sanitizedTitle,
          descriptionLength: sanitizedDescription?.length || 0,
          artPieceId: currentArtPiece?.artPieceId,
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      let userMessage = 'Failed to generate AI meta keywords. Please try again.';
      if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'You do not have permission to generate AI meta keywords.';
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
      <Stack spacing={1.5}>
        {/* Header with label and AI button */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>

          {showAIButton && currentArtPiece && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchAIMetaKeywords}
              disabled={loading || !isAIGenerationAvailable()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Generating...' : 'Get AI Keywords'}
            </Button>
          )}
        </Box>

        {/* Text Field */}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              value={field.value || ''}
              multiline
              rows={2}
              disabled={disabled}
              error={!!error || isOverLimit}
              helperText={
                error?.message ||
                (isOverLimit
                  ? `${characterCount}/255 characters (${characterCount - 255} over limit)`
                  : `${characterCount}/255 characters. ${helperText}`)
              }
              placeholder="public art, sculpture, mural, street art, urban art..."
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.875rem',
                },
                '& .MuiFormHelperText-root': {
                  color: isOverLimit ? 'error.main' : 'text.secondary',
                },
                ...sx,
              }}
              {...other}
            />
          )}
        />
      </Stack>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaKeywords
 * @prop {string} [name="metaKeywords"] - The form field name for the meta keywords. Defaults to "metaKeywords".
 * @prop {string} [label="Meta Keywords"] - The label text for the field. Defaults to "Meta Keywords".
 * @prop {string} [helperText="SEO keywords (max 255 characters, comma-separated)"] - Helper text to display below the field. Defaults to SEO guidance.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [showAIButton=true] - Whether to show the AI generation button. Defaults to true.
 * @prop {Object} [currentArtPiece] - Current art piece data for AI generation. Should include artist.name and title. This prop is optional.
 * @prop {string} [descriptionFieldName="description"] - Name of the description field to use as source. Defaults to "description".
 * @prop {Object} [sx] - Additional styling props for the text field. This prop is optional.
 */
ElementArtPieceMetaKeywords.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showAIButton: PropTypes.bool,
  currentArtPiece: PropTypes.shape({
    artPieceId: PropTypes.number,
    title: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    medium: PropTypes.string,
    artPieceType: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    artPieceMaterial: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    artPieceTag: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    artist: PropTypes.shape({
      name: PropTypes.string,
    }),
    Artist: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  descriptionFieldName: PropTypes.string,
  sx: PropTypes.object,
};
