/**
 * @namespace CityArtWalks.Forms.Elements.ArtPieceDescription
 * @version 1.0.0
 * @author Jaexport function ElementArtPieceDescription(props) {
  const {
    name = "description",
    label = "Description",
    helperText,
    disabled = false,
    showAIButton = true,
    currentArtPiece,
    sx = { maxHeight: 480 },
    ...other
  } = props;

  const { control, setValue, formState: { isSubmitSuccessful } } = useFormContext();
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Use the proper hook instead of raw fetch
  const generateAIDescription = useGenerateArtPieceAIDescription(accessToken);
   * @memberof CityArtWalks.Forms.Elements.ArtPieceDescription.ElementArtPieceDescription
   * @function fetchAIDescription
   * @description Generates an AI-powered description for the art piece using OpenAI API.
   *
   * Security Features:
   * - Sanitizes input data (artist name and title) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
/**
 * @fileoverview Form element for art piece description with AI generation functionality
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
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
import { useGenerateArtPieceAIDescription } from 'src/actions/art-piece/hooks';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceDescription
 * @function ElementArtPieceDescription
 * @description Form element component for art piece description with AI generation capability.
 *
 * This component provides a rich text editor for art piece descriptions with the ability to generate
 * AI-powered descriptions using the OpenAI API. It includes proper validation, error handling, and
 * consistent styling with other form elements.
 *
 * Features:
 * - Rich text editor with full formatting capabilities
 * - AI-powered description generation with input sanitization
 * - Comprehensive security measures against XSS and injection attacks
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Authentication-aware functionality
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="description"] - The form field name for the description
 * @param {string} [props.label="Description"] - The label text for the editor
 * @param {string} [props.helperText] - Helper text to display below the editor
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled
 * @param {boolean} [props.showAIButton=true] - Whether to show the AI generation button
 * @param {Object} [props.currentArtPiece] - Current art piece data for AI generation
 * @param {Object} [props.sx] - Additional styling props for the editor
 * @param {Object} [...props.other] - Other props to pass to the Editor component
 *
 * @returns {JSX.Element} The rendered art piece description editor element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceDescription />
 *
 * @example
 * // With AI generation for existing art piece
 * <ElementArtPieceDescription
 *   name="description"
 *   label="Art Piece Description"
 *   currentArtPiece={artPiece}
 *   helperText="Enter a detailed description of the art piece"
 * />
 *
 * @example
 * // Without AI button for basic editing
 * <ElementArtPieceDescription
 *   showAIButton={false}
 *   sx={{ maxHeight: 300 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceDescription(props) {
  const {
    name = 'description',
    label = 'Description',
    helperText,
    disabled = false,
    showAIButton = true,
    currentArtPiece,
    sx = { maxHeight: 480 },
    ...other
  } = props;
  const {
    control,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const editorFieldRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const generateAIDescription = useGenerateArtPieceAIDescription(accessToken);

  // Helper function to check if AI generation is available
  const isAIGenerationAvailable = () => {
    // Must have currentArtPiece object
    if (!currentArtPiece) return false;

    // Must have artPieceId
    if (!currentArtPiece.artPieceId) return false;

    // Check both possible artist name locations
    const artistName = currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name;

    // Must have artist name and title
    if (!artistName || !currentArtPiece?.title) return false;

    // Check if sanitized values would be meaningful
    const sanitizedArtistName = sanitizeText(artistName);
    const sanitizedTitle = sanitizeText(currentArtPiece.title);

    return Boolean(sanitizedArtistName && sanitizedTitle);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ArtPieceDescription.ElementArtPieceDescription
   * @function fetchAIDescription
   * @description Generates an AI-powered description for the art piece using OpenAI API.
   *
   * Security Features:
   * - Sanitizes input data (artist name and title) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Makes a POST request to the art piece description endpoint with sanitized artist name and title.
   * Formats the sanitized response into HTML paragraphs and updates the form field.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIDescription = async () => {
    // Check both possible artist name locations
    const artistName = currentArtPiece?.artist?.name || currentArtPiece?.Artist?.name;

    if (!artistName || !currentArtPiece?.title) {
      toast.error('Artist name and art piece title are required for AI description generation');
      return;
    }

    // Sanitize input data to prevent XSS, SQL injection, and other security issues
    const sanitizedArtistName = sanitizeText(artistName);
    const sanitizedTitle = sanitizeText(currentArtPiece.title);

    // Validate that sanitized data is still meaningful
    if (!sanitizedArtistName || !sanitizedTitle) {
      toast.error('Invalid artist name or title detected. Please check the input data.');
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceDescription.ElementArtPieceDescription.fetchAIDescription',
        'Sanitized input validation failed',
        {
          originalArtistName: artistName,
          originalTitle: currentArtPiece.title,
          sanitizedArtistName,
          sanitizedTitle,
          artPieceId: currentArtPiece.artPieceId,
        }
      );
      return;
    }

    setLoading(true);
    try {
      // Use the proper hook instead of raw fetch
      const description = await generateAIDescription(
        currentArtPiece.artPieceId,
        sanitizedArtistName,
        sanitizedTitle
      );

      if (!description) {
        toast.error('No description received from AI service. Please try again.');
        return;
      }

      // Sanitize the AI response to prevent any potential XSS
      const sanitizedResponse = sanitizeText(description);

      if (!sanitizedResponse) {
        toast.error('Invalid response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.ArtPieceDescription.ElementArtPieceDescription.fetchAIDescription',
          'AI response sanitization failed',
          {
            originalResponse: description,
            sanitizedResponse,
            artPieceId: currentArtPiece.artPieceId,
          }
        );
        return;
      }

      // Format the sanitized AI response into HTML paragraphs
      const formattedDescription = sanitizedResponse
        .split('\n\n') // Split text into paragraphs on double newlines
        .filter((paragraph) => paragraph.trim()) // Remove empty paragraphs
        .map((paragraph) => `<p>${paragraph.trim()}</p>`) // Wrap each paragraph in <p> tags
        .join('');

      // Update the form field directly using both setValue and field reference
      setValue(name, formattedDescription);

      // Force the Editor component to update by accessing the editor instance directly
      if (editorFieldRef.current && editorFieldRef.current.onChange) {
        // First call onChange to update the form state
        editorFieldRef.current.onChange(formattedDescription);
      }

      // Try to access the editor instance directly to force content update
      if (editorInstanceRef.current && editorInstanceRef.current.commands) {
        editorInstanceRef.current.commands.setContent(formattedDescription);
      }

      // Force re-render of the Editor component by changing its key
      setEditorKey((prev) => prev + 1);

      toast.success('AI description generated successfully!');
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceDescription.ElementArtPieceDescription.fetchAIDescription',
        'Failed to fetch AI description',
        {
          error: error.message,
          artistName: sanitizedArtistName,
          title: sanitizedTitle,
          artPieceId: currentArtPiece?.artPieceId,
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      let userMessage = 'Failed to generate AI description. Please try again.';
      if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'You do not have permission to generate AI descriptions.';
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
              onClick={fetchAIDescription}
              disabled={loading || !isAIGenerationAvailable()}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Generating...' : 'Get AI Description'}
            </Button>
          )}
        </Box>

        {/* Editor Field */}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            // Store field reference for AI description updates
            editorFieldRef.current = field;

            return (
              <Editor
                key={editorKey}
                {...field}
                ref={editorInstanceRef}
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
 * @memberof CityArtWalks.Forms.Elements.ArtPieceDescription
 * @prop {string} [name="description"] - The form field name for the description. Defaults to "description".
 * @prop {string} [label="Description"] - The label text for the editor. Defaults to "Description".
 * @prop {string} [helperText] - Helper text to display below the editor. This prop is optional.
 * @prop {boolean} [disabled=false] - Whether the editor is disabled. Defaults to false.
 * @prop {boolean} [showAIButton=true] - Whether to show the AI generation button. Defaults to true.
 * @prop {Object} [currentArtPiece] - Current art piece data for AI generation. Should include artist.name and title. This prop is optional.
 * @prop {Object} [sx] - Additional styling props for the editor. This prop is optional.
 */
ElementArtPieceDescription.propTypes = {
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
  }),
  sx: PropTypes.object,
};
