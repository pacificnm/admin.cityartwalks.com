/**
 * @fileoverview Artist Meta Title form element with automatic generation capabilities.
 *
 * This component provides a specialized input field for SEO meta titles in artist forms.
 * It automatically generates titles using the artist name with smart truncation to stay
 * within the 60-character SEO limit.
 *
 * @version 1.0.0
 * @author CityArtWalks Team
 * @created 2024
 * @namespace CityArtWalks.Forms.Elements.ArtistMetaTitle
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
 * @memberof CityArtWalks.Forms.Elements.ArtistMetaTitle
 * @function ElementArtistMetaTitle
 * @description Form element component for artist meta title with automatic generation capability.
 *
 * This component provides a text field for SEO meta titles with automatic generation based on
 * the artist's name. It includes proper validation, character limits (60 chars), error handling,
 * and consistent styling with smart truncation strategies.
 *
 * Features:
 * - Text field with character counter for SEO optimization
 * - Automatic meta title generation from artist name
 * - 60 character limit validation with visual feedback
 * - Smart truncation with multiple fallback strategies
 * - Input sanitization for security
 * - Form integration with React Hook Form
 * - Optional auto-generation on field changes
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="metaTitle"] - Form field name for the meta title
 * @param {string} [props.label="Meta Title"] - Label text for the field
 * @param {string} [props.helperText="SEO title (max 60 characters)"] - Helper text to display
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.showGenerateButton=true] - Whether to show the generation button
 * @param {Object} [props.currentArtist] - Current artist data for generation
 * @param {string} [props.nameFieldName="name"] - Name of the name field to watch for auto-generation
 * @param {boolean} [props.autoGenerate=false] - Whether to auto-generate when source fields change
 * @param {Object} [props.sx] - Additional styling props for the text field
 *
 * @returns {JSX.Element} The artist meta title form element
 *
 * @example
 * ```jsx
 * // Basic usage
 * <ElementArtistMetaTitle name="metaTitle" />
 *
 * // With auto-generation
 * <ElementArtistMetaTitle
 *   name="seoTitle"
 *   label="SEO Meta Title"
 *   currentArtist={artistData}
 *   autoGenerate={true}
 *   showGenerateButton={true}
 * />
 * ```
 */
export function ElementArtistMetaTitle({
  name = 'metaTitle',
  label = 'Meta Title',
  helperText = 'SEO title (max 60 characters)',
  disabled = false,
  showGenerateButton = true,
  currentArtist = null,
  nameFieldName = 'name',
  autoGenerate = false,
  sx,
  ...other
}) {
  // Form context
  const { control, setValue, watch } = useFormContext();

  // Watch relevant fields for auto-generation
  const nameContent = watch(nameFieldName);

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtistMetaTitle.ElementArtistMetaTitle
   * @function generateMetaTitle
   * @description Generates a meta title using the artist name.
   *
   * Uses data from either the current artist prop or form fields to create a properly
   * formatted meta title. Handles multiple data sources and formats consistently.
   *
   * @returns {void}
   */
  const generateMetaTitle = useCallback(() => {
    let artistName = '';

    // Try to get data from currentArtist first
    if (currentArtist) {
      artistName = currentArtist.name || '';
    }

    // If not available from currentArtist, try form fields
    if (!artistName) {
      artistName = nameContent || '';
    }

    // Fallback to default if still no name
    if (!artistName) {
      artistName = 'Artist';
    }

    // Sanitize the inputs
    const sanitizedArtistName = sanitizeText(artistName) || 'Artist';

    // Generate the meta title - just use the artist name
    let metaTitle = sanitizedArtistName;

    // Ensure it's within the 60 character limit
    if (metaTitle.length > 60) {
      // Simple truncation with ellipsis
      metaTitle = metaTitle.substring(0, 57) + '...';
    }

    // Update the form field
    setValue(name, metaTitle);

    toast.success('Meta title generated successfully!');
  }, [currentArtist, nameContent, setValue, name]);

  /**
   * Auto-generate when watched fields change
   */
  useEffect(() => {
    if (autoGenerate && (nameContent || currentArtist?.name)) {
      generateMetaTitle();
    }
  }, [autoGenerate, nameContent, currentArtist?.name, generateMetaTitle]);

  return (
    <Stack spacing={1.5}>
      {/* Header with label and generate button */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">{label}</Typography>

        {showGenerateButton && (
          <Button variant="outlined" size="small" onClick={generateMetaTitle} disabled={disabled}>
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
            error={!!error || (field.value && field.value.length > 60)}
            helperText={
              error?.message ||
              `${field.value ? field.value.length : 0}/60 characters. ${helperText}`
            }
            placeholder="Artist Name"
            inputProps={{
              maxLength: 60,
              'aria-describedby': `${name}-helper-text`,
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '0.875rem',
              },
              '& .MuiFormHelperText-root': {
                color: field.value && field.value.length > 60 ? 'error.main' : 'text.secondary',
              },
              ...sx,
            }}
            {...other}
          />
        )}
      />

      {/* Format guidance */}
      {!watch(name) && (
        <Typography variant="caption" color="text.secondary">
          Format: Artist name (automatically generated from form fields)
        </Typography>
      )}
    </Stack>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtistMetaTitle
 * @prop {string} [name="metaTitle"] - The form field name for the meta title. Defaults to "metaTitle".
 * @prop {string} [label="Meta Title"] - The label text for the field. Defaults to "Meta Title".
 * @prop {string} [helperText="SEO title (max 60 characters)"] - Helper text to display below the field. Defaults to SEO guidance.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. Defaults to false.
 * @prop {boolean} [showGenerateButton=true] - Whether to show the generation button. Defaults to true.
 * @prop {Object} [currentArtist] - Current artist data for generation. Should include name. This prop is optional.
 * @prop {string} [nameFieldName="name"] - Name of the name field to watch for auto-generation. Defaults to "name".
 * @prop {boolean} [autoGenerate=false] - Whether to auto-generate when source fields change. Defaults to false.
 * @prop {Object} [sx] - Additional styling props for the text field. This prop is optional.
 */
ElementArtistMetaTitle.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showGenerateButton: PropTypes.bool,
  currentArtist: PropTypes.shape({
    artistId: PropTypes.number,
    name: PropTypes.string,
  }),
  nameFieldName: PropTypes.string,
  autoGenerate: PropTypes.bool,
  sx: PropTypes.object,
};

export default ElementArtistMetaTitle;
