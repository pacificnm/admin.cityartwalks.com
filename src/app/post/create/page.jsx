/**
 * Dashboard Post Creation Page - Content Creation Interface
 *
 * This page provides a comprehensive interface for creating new blog posts and content
 * within the dashboard environment. It features a rich text editor, SEO optimization
 * tools, media management, content scheduling, and draft management capabilities.
 * The interface supports markdown editing, real-time preview, auto-save functionality,
 * and comprehensive validation for professional content creation workflows.
 *
 * @fileoverview Dashboard post creation page component with content authoring features
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.App.Dashboard.Post.Create
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Content-Management|Content Management}
 */

import { generateDefaultMetadata } from 'src/utils/metadata';

import { debugLog, debugError } from 'src/lib/debug';

import { PostCreateView } from 'src/sections/post';

// ----------------------------------------------------------------------

/**
 * Metadata configuration for the Dashboard Post Creation page
 *
 * Provides optimized metadata for the content creation interface within the dashboard.
 * Uses default metadata with admin-specific settings to prevent search engine indexing
 * of administrative interfaces while maintaining proper page identification.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Create
 * @type {Metadata}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation}
 */
export const metadata = generateDefaultMetadata({
  title: 'Create New Post | Dashboard - City Art Walks',
  description:
    'Create and publish new blog posts, articles, and content with comprehensive editing tools, SEO optimization, and publishing controls in the City Art Walks dashboard.',
  noIndex: true, // Don't index admin/dashboard pages
});

/**
 * ISR configuration for dashboard post creation page
 *
 * Enables Incremental Static Regeneration with shorter cache time for creation forms
 * to ensure content creators always have access to the latest editor features and
 * validation rules in the dashboard environment.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Create
 * @type {number}
 */
export const revalidate = 300; // 5 minutes for dashboard pages

// ----------------------------------------------------------------------

/**
 * Dashboard Post Creation Page Component
 *
 * Renders the comprehensive post creation interface for content administrators with
 * advanced editing capabilities, SEO tools, and publishing controls. Provides seamless
 * content authoring experience with real-time validation, auto-save, and preview features.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Create
 * @function PostCreatePage
 * @returns {JSX.Element} The rendered dashboard post creation page component
 * @throws {Error} When component fails to render - handled by error boundary
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Error-Handling|Error Handling}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @example
 * // Route: /dashboard/post/create
 * // Renders: Complete post creation interface with rich text editor and publishing tools
 *
 * @example
 * // Features provided:
 * // - Rich text editor with markdown support
 * // - SEO optimization tools (meta titles, descriptions, keywords)
 * // - Media management and image uploading
 * // - Content scheduling and draft management
 * // - Real-time preview and validation
 * // - Auto-save functionality
 * // - Category and tag management
 * // - Publishing workflow controls
 *
 * @example
 * // Content creation workflow:
 * // 1. Initialize editor with default post template
 * // 2. Provide real-time validation and SEO guidance
 * // 3. Enable auto-save for draft protection
 * // 4. Support media uploads and content formatting
 * // 5. Validate content before publishing
 * // 6. Handle publishing, scheduling, or draft saving
 *
 * @example
 * // Error handling:
 * try {
 *   return <PostCreatePage />;
 * } catch (error) {
 *   console.error('Failed to render post creation page:', error);
 *   return <DashboardErrorFallback />;
 * }
 */
export default function PostCreatePage() {
  try {
    debugLog('PostCreatePage', 'Rendering dashboard post creation page', {
      component: 'PostCreatePage',
      action: 'page_render',
      context: 'dashboard',
      pageType: 'create',
    });

    return <PostCreateView />;
  } catch (error) {
    debugError('PostCreatePage', 'Failed to render dashboard post creation page', error, {
      component: 'PostCreatePage',
      action: 'page_render',
      context: 'dashboard',
      pageType: 'create',
    });

    // Re-throw to be handled by error boundary
    throw error;
  }
}
