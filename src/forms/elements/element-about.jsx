/**
 * @namespace CityArtWalks.Forms.Elements.About
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 */

/**
 * @fileoverview Form element for user about section with rich text editing and HTML sanitization
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 */

import PropTypes from 'prop-types';
import { useRef, useState, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import { sanitizeHtml } from 'src/lib/sanitize';

import { Editor } from 'src/components/editor';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.About
 * @function ElementAbout
 * @description Form element component for user about section with rich text editing.
 *
 * This component provides a rich text editor for user about sections with comprehensive
 * HTML sanitization to prevent XSS attacks and other security vulnerabilities. It
 * automatically cleans dangerous HTML, CSS, and JavaScript while preserving safe
 * formatting elements.
 *
 * Features:
 * - Rich text editor with full formatting capabilities
 * - Comprehensive HTML sanitization against XSS and injection attacks
 * - Removes dangerous HTML elements (script, style, iframe, object, embed)
 * - Sanitizes CSS properties to prevent malicious styles
 * - Form integration with React Hook Form
 * - Error handling and validation support
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="about"] - The form field name for the about section
 * @param {string} [props.label="About"] - The label text for the editor
 * @param {string} [props.helperText] - Helper text to display below the editor
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled
 * @param {Object} [props.sx] - Additional styling props for the editor
 * @param {Object} [...props.other] - Other props to pass to the Editor component
 *
 * @returns {JSX.Element} The rendered about section editor element
 *
 * @example
 * // Basic usage in a form
 * <ElementAbout />
 *
 * @example
 * // With custom configuration
 * <ElementAbout
 *   name="about"
 *   label="Tell us about yourself"
 *   helperText="Share your background, interests, and experience with art"
 *   sx={{ maxHeight: 300 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 */
export function ElementAbout(props) {
  const {
    name = 'about',
    label = 'About',
    helperText = 'Tell us about yourself, your background, and your connection to art',
    disabled = false,
    sx = { maxHeight: 400 },
    ...other
  } = props;

  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();
  const [editorKey] = useState(0);
  const editorFieldRef = useRef(null);
  const editorInstanceRef = useRef(null);

  /**
   * @memberof CityArtWalks.Forms.Elements.About.ElementAbout
   * @function handleContentChange
   * @description Handles content changes in the editor with HTML sanitization.
   *
   * This function is called whenever the editor content changes. It sanitizes
   * the HTML content to remove any potentially dangerous elements, attributes,
   * or scripts while preserving safe formatting.
   *
   * Security Features:
   * - Removes script, style, iframe, object, embed, and other dangerous tags
   * - Sanitizes CSS properties to prevent style-based attacks
   * - Removes JavaScript event handlers (onclick, onload, etc.)
   * - Validates and cleans URLs in links and images
   * - Preserves safe formatting elements (p, br, strong, em, ul, ol, li, etc.)
   *
   * @param {string} content - The raw HTML content from the editor
   * @param {Function} onChange - The form field onChange handler
   * @returns {void}
   */
  const handleContentChange = useCallback((content, onChange) => {
    try {
      // Sanitize the HTML content to prevent XSS and other security issues
      const sanitizedContent = sanitizeHtml(content);

      // Log if sanitization removed content (for debugging)
      if (content !== sanitizedContent) {
        debugError(
          'CityArtWalks.Forms.Elements.About.ElementAbout.handleContentChange',
          'HTML content was sanitized',
          {
            originalLength: content?.length || 0,
            sanitizedLength: sanitizedContent?.length || 0,
            wasModified: true,
          }
        );
      }

      // Update the form field with sanitized content
      onChange(sanitizedContent);
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.About.ElementAbout.handleContentChange',
        'Failed to sanitize HTML content',
        {
          error: error.message,
          contentLength: content?.length || 0,
        }
      );

      // Fall back to the original content if sanitization fails
      onChange(content);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Stack spacing={1.5}>
        {/* Header with label */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{label}</Typography>
        </Box>

        {/* Editor Field */}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            // Store field reference
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
                onChange={(content) => handleContentChange(content, field.onChange)}
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
 * @memberof CityArtWalks.Forms.Elements.About
 * @prop {string} [name="about"] - The form field name for the about section. Defaults to "about".
 * @prop {string} [label="About"] - The label text for the editor. Defaults to "About".
 * @prop {string} [helperText] - Helper text to display below the editor.
 * @prop {boolean} [disabled=false] - Whether the editor is disabled. Defaults to false.
 * @prop {Object} [sx] - Additional styling props for the editor.
 */
ElementAbout.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
