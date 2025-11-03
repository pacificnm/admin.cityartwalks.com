/**
 * @fileoverview Art Piece Meta Title form element with automatic generation capabilities.
 *
 * This component provides a specialized input field for SEO meta titles in art piece forms.
 * It automatically generates titles in the format "Artist Name - Art Piece Title" with
 * smart truncation to stay within the 60-character SEO limit.
 *
 * @version 1.0.0
 * @author CityArtWalks Team
 * @created 2024
 * @namespace CityArtWalks.Forms.Elements.ArtPieceMetaTitle
 */

import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';

/**
 * Simple text sanitization function
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
};

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaTitle
 * @function ElementArtPieceMetaTitle
 * @description Form element component for art piece meta title with automatic generation capability.

import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, TextField, Typography } from '@mui/material';

import { sanitizeText } from '../../utils/validation-utils';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaTitle
 * @function ElementArtPieceMetaTitle
 * @description Form element component for art piece meta title with automatic generation capability.
 *
 * This component provides a text field for SEO meta titles with the ability to automatically
 * generate titles using the format "Artist Name - Art Piece Title". It includes proper
 * validation, character limits (60 chars), error handling, and consistent styling.
 *
 * Features:
 * - Text field with character counter for SEO optimization
 * - Automatic meta title generation from artist name and art piece title
 * - 60 character limit validation with visual feedback
 * - Manual generation button for updating titles
 * - Form integration with React Hook Form
 * - Real-time updates when source fields change
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="metaTitle"] - The form field name for the meta title
 * @param {string} [props.label="Meta Title"] - The label text for the field
 * @param {string} [props.helperText="SEO title (max 60 characters)"] - Helper text to display
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.showGenerateButton=true] - Whether to show the generation button
 * @param {Object} [props.currentArtPiece] - Current art piece data for generation
 * @param {string} [props.titleFieldName="title"] - Name of the title field to watch
 * @param {string} [props.artistFieldName="artistId"] - Name of the artist field to watch
 * @param {boolean} [props.autoGenerate=false] - Whether to auto-generate on field changes
 * @param {Object} [props.sx] - Additional styling props for the text field
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered art piece meta title field element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceMetaTitle />
 *
 * @example
 * // With auto-generation for existing art piece
 * <ElementArtPieceMetaTitle
 *   name="metaTitle"
 *   label="SEO Meta Title"
 *   currentArtPiece={artPiece}
 *   autoGenerate={true}
 *   helperText="Page title for search engines (max 60 characters)"
 * />
 *
 * @example
 * // Without auto-generation, manual button only
 * <ElementArtPieceMetaTitle
 *   showGenerateButton={true}
 *   autoGenerate={false}
 *   titleFieldName="customTitle"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceMetaTitle(props) {
  const {
    name = 'metaTitle',
    label = 'Meta Title',
    helperText = 'SEO title (max 60 characters)',
    disabled = false,
    showGenerateButton = true,
    currentArtPiece,
    titleFieldName = 'title',
    artistFieldName = 'artistId',
    autoGenerate = false,
    sx = {},
    ...other
  } = props;

  const { control, setValue, watch } = useFormContext();

  // Filter out custom props that shouldn't be passed to TextField DOM element
  const textFieldProps = { ...other };
  delete textFieldProps.showAIButton;
  delete textFieldProps.aiButtonLabel;
  delete textFieldProps.onAIGenerate;
  delete textFieldProps.isAIGenerating;

  // Watch the title and artist fields for auto-generation
  const titleContent = watch(titleFieldName);
  const artistContent = watch(artistFieldName);

  // Watch current field for character count
  const currentValue = watch(name) || '';
  const characterCount = currentValue.length;
  const isOverLimit = characterCount > 60;

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaTitle.ElementArtPieceMetaTitle
   * @function generateMetaTitle
   * @description Generates a meta title using the format "Artist Name - Art Piece Title".
   *
   * Uses data from either the current art piece prop or form fields to create a properly
   * formatted meta title. Handles multiple data sources and formats consistently.
   *
   * @returns {void}
   */
  const generateMetaTitle = useCallback(() => {
    let artistName = '';
    let artPieceTitle = '';

    // Try to get data from currentArtPiece first
    if (currentArtPiece) {
      artistName = currentArtPiece.artist?.name || currentArtPiece.Artist?.name || '';
      artPieceTitle = currentArtPiece.title || '';
    }

    // If not available from currentArtPiece, try form fields
    if (!artistName || !artPieceTitle) {
      artPieceTitle = titleContent || artPieceTitle;

      // For artist field, handle both ID and direct name scenarios
      if (typeof artistContent === 'object' && artistContent?.name) {
        artistName = artistContent.name;
      } else if (typeof artistContent === 'string') {
        artistName = artistContent;
      } else if (!artistName) {
        artistName = 'Unknown Artist';
      }
    }

    // Sanitize the inputs
    const sanitizedArtistName = sanitizeText(artistName) || 'Unknown Artist';
    const sanitizedTitle = sanitizeText(artPieceTitle) || 'Untitled';

    // Generate the meta title in the format "Artist Name - Art Piece Title"
    let metaTitle = `${sanitizedArtistName} - ${sanitizedTitle}`;

    // Ensure it's within the 60 character limit
    if (metaTitle.length > 60) {
      // Try different truncation strategies
      const separator = ' - ';
      const maxArtistLength = Math.floor((60 - separator.length) * 0.4); // 40% for artist
      const maxTitleLength = 60 - maxArtistLength - separator.length;

      const truncatedArtist =
        sanitizedArtistName.length > maxArtistLength
          ? sanitizedArtistName.substring(0, maxArtistLength - 3) + '...'
          : sanitizedArtistName;

      const truncatedTitle =
        sanitizedTitle.length > maxTitleLength
          ? sanitizedTitle.substring(0, maxTitleLength - 3) + '...'
          : sanitizedTitle;

      metaTitle = `${truncatedArtist}${separator}${truncatedTitle}`;

      // Final check - if still too long, prioritize the title
      if (metaTitle.length > 60) {
        metaTitle =
          sanitizedTitle.length > 57 ? sanitizedTitle.substring(0, 57) + '...' : sanitizedTitle;
      }
    }

    // Update the form field
    setValue(name, metaTitle);

    toast.success('Meta title generated successfully!');
  }, [currentArtPiece, titleContent, artistContent, setValue, name]);

  // Auto-generate when dependencies change (if enabled)
  useEffect(() => {
    if (autoGenerate && (titleContent || currentArtPiece?.title)) {
      const timeoutId = setTimeout(() => {
        generateMetaTitle();
      }, 500); // Debounce to avoid excessive updates

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [
    titleContent,
    artistContent,
    currentArtPiece?.title,
    currentArtPiece?.artist?.name,
    autoGenerate,
    generateMetaTitle,
  ]);

  // Helper function to check if generation is available
  const isGenerationAvailable = () => {
    const hasArtPieceData =
      currentArtPiece?.title && (currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name);
    const hasFormData = titleContent && (artistContent || currentArtPiece?.artist?.name);

    return hasArtPieceData || hasFormData;
  };

  return (
    <Stack spacing={1.5}>
      {/* Header with label and generate button */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">{label}</Typography>

        {showGenerateButton && (
          <Button
            variant="outlined"
            size="small"
            onClick={generateMetaTitle}
            disabled={disabled || !isGenerationAvailable()}
          >
            Generate Title
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
            disabled={disabled}
            error={!!error || isOverLimit}
            helperText={
              error?.message ||
              (isOverLimit
                ? `${characterCount}/60 characters (${characterCount - 60} over limit)`
                : `${characterCount}/60 characters. ${helperText}`)
            }
            placeholder="Artist Name - Art Piece Title"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '0.875rem',
              },
              '& .MuiFormHelperText-root': {
                color: isOverLimit ? 'error.main' : 'text.secondary',
              },
              ...sx,
            }}
            {...textFieldProps}
          />
        )}
      />

      {/* Format guidance */}
      {!currentValue && (
        <Typography variant="caption" color="text.secondary">
          Format: &quot;Artist Name - Art Piece Title&quot; (automatically generated from form
          fields)
        </Typography>
      )}
    </Stack>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceMetaTitle
 * @prop {string} [name="metaTitle"] - The form field name for the meta title. Defaults to "metaTitle".
 * @prop {string} [label="Meta Title"] - The label text for the field. Defaults to "Meta Title".
 * @prop {string} [helperText="SEO title (max 60 characters)"] - Helper text to display below the field. Defaults to SEO guidance.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [showGenerateButton=true] - Whether to show the generation button. Defaults to true.
 * @prop {Object} [currentArtPiece] - Current art piece data for generation. Should include artist.name and title. This prop is optional.
 * @prop {string} [titleFieldName="title"] - Name of the title field to watch for auto-generation. Defaults to "title".
 * @prop {string} [artistFieldName="artistId"] - Name of the artist field to watch for auto-generation. Defaults to "artistId".
 * @prop {boolean} [autoGenerate=false] - Whether to auto-generate when source fields change. Defaults to false.
 * @prop {Object} [sx] - Additional styling props for the text field. This prop is optional.
 */
ElementArtPieceMetaTitle.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showGenerateButton: PropTypes.bool,
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
  titleFieldName: PropTypes.string,
  artistFieldName: PropTypes.string,
  autoGenerate: PropTypes.bool,
  sx: PropTypes.object,
};

export default ElementArtPieceMetaTitle;
