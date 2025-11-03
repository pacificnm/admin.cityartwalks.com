/**
 * @fileoverview Form element for art piece meta description with AI generation functionality
 *
 * @namespace CityArtWalks.Forms.Elements.ArtPieceMetaDescription
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
import { useGenerateArtPieceAIMetaDescription } from 'src/actions/art-piece/hooks';

import { toast } from 'src/components/snackbar';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaDescription
 * @function ElementArtPieceMetaDescription
 * @description Form element component for art piece meta description with AI generation capability.
 *
 * This component provides a text field for SEO meta descriptions with the ability to generate
 * AI-powered meta descriptions based on the full art piece description. It includes proper
 * validation, character limits (160 chars), error handling, and consistent styling.
 *
 * Features:
 * - Text field with character counter for SEO optimization
 * - AI-powered meta description generation from full description
 * - 160 character limit validation with visual feedback
 * - Input sanitization for security
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Authentication-aware functionality
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="metaDescription"] - The form field name for the meta description
 * @param {string} [props.label="Meta Description"] - The label text for the field
 * @param {string} [props.helperText="SEO description (max 160 characters)"] - Helper text to display
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.showAIButton=true] - Whether to show the AI generation button
 * @param {Object} [props.currentArtPiece] - Current art piece data for AI generation
 * @param {string} [props.descriptionFieldName="description"] - Name of the description field to use as source
 * @param {Object} [props.sx] - Additional styling props for the text field
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered art piece meta description field element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceMetaDescription />
 *
 * @example
 * // With AI generation for existing art piece
 * <ElementArtPieceMetaDescription
 *   name="metaDescription"
 *   label="SEO Meta Description"
 *   currentArtPiece={artPiece}
 *   helperText="Brief description for search engines (max 160 characters)"
 * />
 *
 * @example
 * // Without AI button for basic editing
 * <ElementArtPieceMetaDescription
 *   showAIButton={false}
 *   descriptionFieldName="customDescription"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceMetaDescription(props) {
  const {
    name = 'metaDescription',
    label = 'Meta Description',
    helperText = 'SEO description (max 160 characters)',
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
  const generateAIMetaDescription = useGenerateArtPieceAIMetaDescription(accessToken);

  // Watch the description field to use as source for AI generation
  const descriptionContent = watch(descriptionFieldName);

  // Watch current field for character count
  const currentValue = watch(name) || '';
  const characterCount = currentValue.length;
  const isOverLimit = characterCount > 160;

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
   * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaDescription.ElementArtPieceMetaDescription
   * @function fetchAIMetaDescription
   * @description Generates an AI-powered meta description for the art piece using the full description.
   *
   * Security Features:
   * - Sanitizes input data (artist name, title, and description) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Uses the full art piece description as source material to generate a concise 160-character
   * SEO-optimized meta description. Strips HTML tags and formats the response appropriately.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIMetaDescription = async () => {
    // Check both possible artist name locations
    const artistName = currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name;

    if (!artistName || !currentArtPiece?.title) {
      toast.error(
        'Artist name and art piece title are required for AI meta description generation'
      );
      return;
    }

    if (!descriptionContent || descriptionContent.trim().length === 0) {
      toast.error('Art piece description is required to generate meta description');
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
        'CityArtWalks.Forms.Elements.ArtPieceMetaDescription.ElementArtPieceMetaDescription.fetchAIMetaDescription',
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
      // Use the AI hook to generate meta description
      const metaDescription = await generateAIMetaDescription(
        currentArtPiece.artPieceId,
        sanitizedArtistName,
        sanitizedTitle,
        sanitizedDescription
      );

      if (!metaDescription) {
        toast.error('No meta description received from AI service. Please try again.');
        return;
      }

      // Sanitize the AI response to prevent any potential XSS
      const sanitizedResponse = sanitizeText(metaDescription);

      if (!sanitizedResponse) {
        toast.error('Invalid response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.ArtPieceMetaDescription.ElementArtPieceMetaDescription.fetchAIMetaDescription',
          'AI response sanitization failed',
          {
            originalResponse: metaDescription,
            sanitizedResponse,
            artPieceId: currentArtPiece.artPieceId,
          }
        );
        return;
      }

      // Ensure the response is within the 160 character limit
      const trimmedResponse =
        sanitizedResponse.length > 160
          ? sanitizedResponse.substring(0, 157) + '...'
          : sanitizedResponse;

      // Update the form field
      setValue(name, trimmedResponse);

      toast.success('AI meta description generated successfully!');
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceMetaDescription.ElementArtPieceMetaDescription.fetchAIMetaDescription',
        'Failed to fetch AI meta description',
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
      let userMessage = 'Failed to generate AI meta description. Please try again.';
      if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'You do not have permission to generate AI meta descriptions.';
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
              onClick={fetchAIMetaDescription}
              disabled={loading || !isAIGenerationAvailable()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Generating...' : 'Get AI Meta Description'}
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
              rows={3}
              disabled={disabled}
              error={!!error || isOverLimit}
              helperText={
                error?.message ||
                (isOverLimit
                  ? `${characterCount}/160 characters (${characterCount - 160} over limit)`
                  : `${characterCount}/160 characters. ${helperText}`)
              }
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
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaDescription
 * @prop {string} [name="metaDescription"] - The form field name for the meta description. Defaults to "metaDescription".
 * @prop {string} [label="Meta Description"] - The label text for the field. Defaults to "Meta Description".
 * @prop {string} [helperText="SEO description (max 160 characters)"] - Helper text to display below the field. Defaults to SEO guidance.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [showAIButton=true] - Whether to show the AI generation button. Defaults to true.
 * @prop {Object} [currentArtPiece] - Current art piece data for AI generation. Should include artist.name and title. This prop is optional.
 * @prop {string} [descriptionFieldName="description"] - Name of the description field to use as source. Defaults to "description".
 * @prop {Object} [sx] - Additional styling props for the text field. This prop is optional.
 */
ElementArtPieceMetaDescription.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showAIButton: PropTypes.bool,
  currentArtPiece: PropTypes.shape({
    artPieceId: PropTypes.number,
    title: PropTypes.string,
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
