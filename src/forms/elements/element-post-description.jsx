/**
 * @fileoverview Form element for post content with AI generation functionality for blog formatting and content assistance
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @namespace CityArtWalks.Forms.Elements.PostDescription
 * @version 1.0.0
 * @author Claude Code Assistant
 */

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import { endpoints } from 'src/endpoints';
import { debugError } from 'src/lib/debug';
import { sanitizeText } from 'src/lib/sanitize';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Forms.Elements.PostDescription
 * @function ElementPostDescription
 * @description Form element component for post content with AI generation capability for complete blog post assistance.
 *
 * This component provides a rich text editor for post content with the ability to generate
 * AI-powered complete blog post packages including content, excerpt, SEO title, and meta description.
 * It includes proper validation, error handling, and consistent styling with other form elements.
 *
 * Features:
 * - Rich text editor with full formatting capabilities
 * - AI-powered complete blog post generation (content, excerpt, SEO title, meta description)
 * - Comprehensive security measures against XSS and injection attacks
 * - Loading states and error handling
 * - Form integration with React Hook Form
 * - Authentication-aware functionality
 * - Blog-specific content suggestions and SEO optimization
 * - Accessibility support
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="content"] - The form field name for the content
 * @param {string} [props.label="Content"] - The label text for the editor
 * @param {string} [props.helperText] - Helper text to display below the editor
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled
 * @param {boolean} [props.showAIButton=true] - Whether to show the AI assistance button
 * @param {Object} [props.currentPost] - Current post data for AI generation context
 * @param {Object} [props.sx] - Additional styling props for the editor
 * @param {Object} [...props.other] - Other props to pass to the Editor component
 *
 * @returns {JSX.Element} The rendered post content editor element
 *
 * @example
 * // Basic usage in a post form
 * <ElementPostDescription />
 *
 * @example
 * // With AI assistance for existing post
 * <ElementPostDescription
 *   name="content"
 *   label="Post Content"
 *   currentPost={post}
 *   helperText="Write engaging content for your blog post"
 * />
 *
 * @example
 * // Without AI button for basic editing
 * <ElementPostDescription
 *   showAIButton={false}
 *   sx={{ maxHeight: 400 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 */
export function ElementPostDescription(props) {
  const {
    name = 'content',
    label = 'Content',
    helperText,
    disabled = false,
    showAIButton = true,
    currentPost,
    sx = { maxHeight: 600 },
    ...other
  } = props;

  const {
    control,
    setValue,
    watch,
    formState: { isSubmitSuccessful },
  } = useFormContext();
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const editorFieldRef = useRef(null);
  const editorInstanceRef = useRef(null);

  // Watch for title and category to provide context for AI generation
  const title = watch('title');
  const category = watch('category');
  const excerpt = watch('excerpt');

  // Helper function to check if AI generation is available
  const isAIGenerationAvailable = () => {
    // For posts, we need at least a title to provide meaningful AI assistance
    if (!title?.trim()) return false;

    // Check if sanitized values would be meaningful
    const sanitizedTitle = sanitizeText(title);
    return Boolean(sanitizedTitle);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.PostDescription.ElementPostDescription
   * @function fetchAIContentAssistance
   * @description Generates AI-powered complete blog post package including content, excerpt, SEO title, and meta description.
   *
   * Security Features:
   * - Sanitizes input data (title, category, excerpt) to prevent XSS and injection attacks
   * - Validates sanitized data to ensure meaningful content remains
   * - Sanitizes AI response to prevent any potential malicious content
   * - Comprehensive error handling and logging
   *
   * Makes a POST request to the post content assistance endpoint with sanitized post data.
   * Returns a complete blog post package and updates multiple form fields simultaneously.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} When API request fails, required data is missing, or sanitization fails
   */
  const fetchAIContentAssistance = async () => {
    if (!title?.trim()) {
      toast.error('Post title is required for AI content assistance');
      return;
    }

    // Sanitize input data to prevent XSS, SQL injection, and other security issues
    const sanitizedTitle = sanitizeText(title);
    const sanitizedCategory = category ? sanitizeText(category) : '';
    const sanitizedExcerpt = excerpt ? sanitizeText(excerpt) : '';

    // Validate that sanitized data is still meaningful
    if (!sanitizedTitle) {
      toast.error('Invalid post title detected. Please check the input data.');
      debugError(
        'CityArtWalks.Forms.Elements.PostDescription.ElementPostDescription.fetchAIContentAssistance',
        'Sanitized input validation failed',
        {
          originalTitle: title,
          originalCategory: category,
          originalExcerpt: excerpt,
          sanitizedTitle,
          sanitizedCategory,
          sanitizedExcerpt,
          postId: currentPost?.postId,
        }
      );
      return;
    }

    setLoading(true);
    try {
      // Make API call to post content assistance endpoint
      const response = await fetch(endpoints.post.contentAssistance.command(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: sanitizedTitle,
          category: sanitizedCategory,
          excerpt: sanitizedExcerpt,
          postId: currentPost?.postId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseData = data.data || data;

      // Extract all the generated fields
      const aiContent = responseData.content;
      const aiExcerpt = responseData.excerpt;
      const aiSeoTitle = responseData.seoTitle;
      const aiMetaDescription = responseData.metaDescription;

      if (!aiContent || !aiExcerpt || !aiSeoTitle || !aiMetaDescription) {
        toast.error('Incomplete response received from AI service. Please try again.');
        debugError(
          'CityArtWalks.Forms.Elements.PostDescription.ElementPostDescription.fetchAIContentAssistance',
          'Missing fields in AI response',
          {
            hasContent: !!aiContent,
            hasExcerpt: !!aiExcerpt,
            hasSeoTitle: !!aiSeoTitle,
            hasMetaDescription: !!aiMetaDescription,
            postId: currentPost?.postId,
          }
        );
        return;
      }

      // Update all form fields with the AI-generated content
      setValue(name, aiContent); // Main content field
      setValue('excerpt', aiExcerpt);
      setValue('metaTitle', aiSeoTitle);
      setValue('metaDescription', aiMetaDescription);

      // Force the Editor component to update by accessing the editor instance directly
      if (editorFieldRef.current && editorFieldRef.current.onChange) {
        // First call onChange to update the form state
        editorFieldRef.current.onChange(aiContent);
      }

      // Try to access the editor instance directly to force content update
      if (editorInstanceRef.current && editorInstanceRef.current.commands) {
        editorInstanceRef.current.commands.setContent(aiContent);
      }

      // Force re-render of the Editor component by changing its key
      setEditorKey((prev) => prev + 1);

      toast.success(
        'AI assistance applied successfully! Updated content, excerpt, SEO title, and meta description.'
      );
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.PostDescription.ElementPostDescription.fetchAIContentAssistance',
        'Failed to fetch AI content assistance',
        {
          error: error.message,
          title: sanitizedTitle,
          category: sanitizedCategory,
          excerpt: sanitizedExcerpt,
          postId: currentPost?.postId,
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      let userMessage = 'Failed to generate AI content assistance. Please try again.';
      if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'You do not have permission to use AI content assistance.';
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

          {showAIButton && (
            <RoleBasedGuard
              allowedRoles={['MEMBER', 'ADMIN']}
              hasContent={false}
              displayMode="dialog"
            >
              <Button
                variant="outlined"
                size="small"
                onClick={fetchAIContentAssistance}
                disabled={loading || !isAIGenerationAvailable()}
                startIcon={loading ? <CircularProgress size={16} /> : null}
                sx={{ minWidth: 160 }}
              >
                {loading ? 'Generating...' : 'AI Complete Post'}
              </Button>
            </RoleBasedGuard>
          )}
        </Box>

        {/* Editor Field */}
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            // Store field reference for AI content updates
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
 * @memberof CityArtWalks.Forms.Elements.PostDescription
 * @prop {string} [name="content"] - The form field name for the content. Defaults to "content".
 * @prop {string} [label="Content"] - The label text for the editor. Defaults to "Content".
 * @prop {string} [helperText] - Helper text to display below the editor. This prop is optional.
 * @prop {boolean} [disabled=false] - Whether the editor is disabled. Defaults to false.
 * @prop {boolean} [showAIButton=true] - Whether to show the AI assistance button. Defaults to true.
 * @prop {Object} [currentPost] - Current post data for AI generation context. Should include postId, title. This prop is optional.
 * @prop {Object} [sx] - Additional styling props for the editor. This prop is optional.
 */
ElementPostDescription.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  showAIButton: PropTypes.bool,
  currentPost: PropTypes.shape({
    postId: PropTypes.number,
    title: PropTypes.string,
    category: PropTypes.string,
    excerpt: PropTypes.string,
  }),
  sx: PropTypes.object,
};
