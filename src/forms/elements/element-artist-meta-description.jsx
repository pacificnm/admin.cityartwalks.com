/**
 * @fileoverview Form element for artist meta description with AI generation functionality
 *
 * @namespace CityArtWalks.Forms.Elements.ArtistMetaDescription
 * @version 1.0.0
 * @author CityArtWalks Team
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
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
import { useGenerateArtistAIMetaDescription } from 'src/actions/artist/hooks';

import { toast } from 'src/components/snackbar';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistMetaDescription
 * @function ElementArtistMetaDescription
 * @description Form element component for artist meta description with AI generation capability.
 *
 * This component provides a text field for SEO meta descriptions with the ability to generate
 * AI-powered meta descriptions based on the artist's biography and information. It includes proper
 * validation, character limits (160 chars), error handling, and consistent styling.
 *
 * Features:
 * - Text field with character counter for SEO optimization
 * - AI-powered meta description generation from artist biography
 * - 160 character limit validation with visual feedback
 * - Input sanitization for security
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Authentication-aware functionality
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="metaDescription"] - Form field name for the meta description
 * @param {string} [props.label="Meta Description"] - Label text for the field
 * @param {string} [props.helperText="SEO description (max 160 characters)"] - Helper text to display
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.showGenerateButton=true] - Whether to show the AI generation button
 * @param {Object} [props.currentArtist] - Current artist data for AI generation
 * @param {string} [props.biographyFieldName="biography"] - Name of the biography field to use for generation
 * @param {Object} [props.sx] - Additional styling props for the text field
 *
 * @returns {JSX.Element} The artist meta description form element
 *
 * @example
 * ```jsx
 * // Basic usage
 * <ElementArtistMetaDescription name="metaDescription" />
 *
 * // With custom configuration
 * <ElementArtistMetaDescription
 *   name="seoDescription"
 *   label="SEO Meta Description"
 *   currentArtist={artistData}
 *   biographyFieldName="bio"
 *   showGenerateButton={true}
 * />
 * ```
 */
export function ElementArtistMetaDescription({
  name = 'metaDescription',
  label = 'Meta Description',
  helperText = 'SEO description (max 160 characters)',
  disabled = false,
  showGenerateButton = true,
  currentArtist = null,
  biographyFieldName = 'biography',
  sx,
  ...other
}) {
  // Form context
  const { control, setValue, watch } = useFormContext();

  // Local state for AI generation
  const [loading, setLoading] = useState(false);

  // Use the AI hook
  const generateAIMetaDescription = useGenerateArtistAIMetaDescription();

  // Watch the biography field for AI generation
  const biographyContent = watch(biographyFieldName);

  // Watch current field for character count
  const currentValue = watch(name) || '';
  const characterCount = currentValue.length;
  const isOverLimit = characterCount > 160;

  // Helper function to check if AI generation is available
  const isAIGenerationAvailable = () => {
    if (!currentArtist?.name) return false;

    // Check if we have a biography to work from
    if (!biographyContent || biographyContent.trim().length === 0) return false;

    // Check if sanitized values would be meaningful
    const sanitizedArtistName = sanitizeText(currentArtist.name);

    return Boolean(sanitizedArtistName);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtistMetaDescription.ElementArtistMetaDescription
   * @function fetchAIMetaDescription
   * @description Generates an AI-powered meta description for the artist using the full biography.
   *
   * Security Features:
   * - Sanitizes input data (artist name and biography) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Uses the full artist biography as source material to generate a concise 160-character
   * SEO-optimized meta description. Strips HTML tags and formats the response appropriately.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIMetaDescription = async () => {
    if (!currentArtist?.name) {
      toast.error('Artist name is required for AI meta description generation');
      return;
    }

    if (!biographyContent || biographyContent.trim().length === 0) {
      toast.error('Artist biography is required to generate meta description');
      return;
    }

    // Sanitize input data to prevent XSS, SQL injection, and other security issues
    const sanitizedArtistName = sanitizeText(currentArtist.name);
    const sanitizedBiography = sanitizeText(biographyContent);

    // Validate that sanitized data is still meaningful
    if (!sanitizedArtistName || !sanitizedBiography) {
      toast.error('Invalid input data detected. Please check the artist name and biography.');
      debugError(
        'CityArtWalks.Forms.Elements.ArtistMetaDescription.ElementArtistMetaDescription.fetchAIMetaDescription',
        'Sanitized input validation failed',
        {
          originalArtistName: currentArtist.name,
          originalBiographyLength: biographyContent?.length || 0,
          sanitizedArtistName,
          sanitizedBiographyLength: sanitizedBiography?.length || 0,
          artistId: currentArtist.artistId,
        }
      );
      return;
    }

    setLoading(true);
    try {
      // Use the AI hook to generate meta description
      const metaDescription = await generateAIMetaDescription(
        currentArtist.artistId,
        sanitizedArtistName,
        sanitizedBiography
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
          'CityArtWalks.Forms.Elements.ArtistMetaDescription.ElementArtistMetaDescription.fetchAIMetaDescription',
          'AI response sanitization failed',
          {
            originalResponse: metaDescription,
            sanitizedResponse,
            artistId: currentArtist.artistId,
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
        'CityArtWalks.Forms.Elements.ArtistMetaDescription.ElementArtistMetaDescription.fetchAIMetaDescription',
        'Failed to fetch AI meta description',
        {
          error: error.message,
          artistName: sanitizedArtistName,
          biographyLength: sanitizedBiography?.length || 0,
          artistId: currentArtist?.artistId,
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

          {showGenerateButton && currentArtist && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchAIMetaDescription}
              disabled={loading || !isAIGenerationAvailable()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Generating...' : 'Generate with AI'}
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
 * @memberof CityArtWalks.Forms.Elements.ArtistMetaDescription
 * @prop {string} [name="metaDescription"] - The form field name for the meta description. Defaults to "metaDescription".
 * @prop {string} [label="Meta Description"] - The label text for the field. Defaults to "Meta Description".
 * @prop {string} [helperText="SEO description (max 160 characters)"] - Helper text to display below the field. Defaults to SEO guidance.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [showGenerateButton=true] - Whether to show the AI generation button. Defaults to true.
 * @prop {Object} [currentArtist] - Current artist data for AI generation. Should include biography, name, and other metadata. This prop is optional.
 * @prop {string} [biographyFieldName="biography"] - Name of the biography field to watch for AI generation. Defaults to "biography".
 * @prop {Object} [sx] - Additional styling props for the text field. This prop is optional.
 */
ElementArtistMetaDescription.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showGenerateButton: PropTypes.bool,
  currentArtist: PropTypes.shape({
    artistId: PropTypes.number,
    name: PropTypes.string,
    biography: PropTypes.string,
    nationality: PropTypes.string,
    website: PropTypes.string,
  }),
  biographyFieldName: PropTypes.string,
  sx: PropTypes.object,
};

export default ElementArtistMetaDescription;
