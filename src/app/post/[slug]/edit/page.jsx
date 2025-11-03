/**
 * Dashboard Post Edit Page - Content Update Interface
 *
 * This page provides a comprehensive interface for editing existing blog posts and content
 * within the dashboard environment. It features dynamic routing based on post slug,
 * rich text editing capabilities, SEO optimization tools, version control, and publishing
 * workflow management. The interface supports content updates, draft management, revision
 * history, and comprehensive validation for professional content editing workflows.
 *
 * @fileoverview Dashboard post edit page component with dynamic routing and content editing features
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.App.Dashboard.Post.Slug.Edit
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Content-Management|Content Management}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dynamic-Routing|Dynamic Routing}
 */

import { generateDefaultMetadata } from 'src/utils/metadata';

import { debugLog, debugError } from 'src/lib/debug';

import { PostEditView } from 'src/sections/post';

// ----------------------------------------------------------------------

/**
 * Metadata configuration for the Dashboard Post Edit page
 *
 * Provides optimized metadata for the content editing interface within the dashboard.
 * Uses default metadata with admin-specific settings to prevent search engine indexing
 * of administrative interfaces while maintaining proper page identification.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Slug.Edit
 * @type {Metadata}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation}
 */
export const metadata = generateDefaultMetadata({
  title: 'Edit Post | Dashboard - City Art Walks',
  description:
    'Edit and update existing blog posts, articles, and content with comprehensive editing tools, version control, and publishing controls in the City Art Walks dashboard.',
  noIndex: true, // Don't index admin/dashboard pages
});

/**
 * ISR configuration for dashboard post edit page
 *
 * Enables Incremental Static Regeneration with optimized cache time for edit forms
 * to ensure content editors always have access to the latest editing features while
 * maintaining reasonable performance for dynamic content updates.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Slug.Edit
 * @type {number}
 */
export const revalidate = 3600; // 1 hour for edit pages

/**
 * Dynamic parameter configuration for post edit pages
 *
 * Enables dynamic parameter handling for post slugs not generated at build time.
 * This allows the page to handle editing of posts created after deployment.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Slug.Edit
 * @type {boolean}
 */
export const dynamicParams = true;

// ----------------------------------------------------------------------

/**
 * Dashboard Post Edit Page Component
 *
 * Renders the comprehensive post editing interface for content administrators with
 * dynamic routing, advanced editing capabilities, version control, and publishing
 * workflow management. Provides seamless content editing experience with real-time
 * validation, auto-save, preview features, and revision history tracking.
 *
 * @memberof CityArtWalks.App.Dashboard.Post.Slug.Edit
 * @async
 * @function PostEditPage
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - Post slug identifier
 * @returns {Promise<JSX.Element>} The rendered dashboard post edit page component
 * @throws {Error} When parameters are invalid, post data fails to load, or component fails to render
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Error-Handling|Error Handling}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dynamic-Routing|Dynamic Routing}
 * @example
 * // Route: /dashboard/post/my-blog-post/edit
 * // Renders: Complete post editing interface for "my-blog-post"
 *
 * @example
 * // Features provided:
 * // - Rich text editor with markdown support and formatting tools
 * // - SEO optimization tools (meta titles, descriptions, keywords)
 * // - Media management and image editing capabilities
 * // - Content versioning and revision history tracking
 * // - Real-time preview and validation feedback
 * // - Auto-save functionality for draft protection
 * // - Category and tag management interface
 * // - Publishing workflow and status controls
 * // - Content scheduling and publication management
 *
 * @example
 * // Content editing workflow:
 * // 1. Load existing post data by slug
 * // 2. Initialize editor with current content
 * // 3. Provide real-time validation and SEO guidance
 * // 4. Enable auto-save for change protection
 * // 5. Support media updates and content formatting
 * // 6. Track revisions and version history
 * // 7. Validate content before publishing updates
 * // 8. Handle publishing, scheduling, or draft saving
 *
 * @example
 * // Error handling:
 * try {
 *   const page = await PostEditPage({ params: { slug: 'my-post' } });
 *   return page;
 * } catch (error) {
 *   console.error('Failed to render post edit page:', error);
 *   return <DashboardErrorFallback />;
 * }
 */
export default async function PostEditPage({ params }) {
  try {
    debugLog('PostEditPage', 'Rendering dashboard post edit page', { params });

    // Safely await params to handle Promise-based parameter objects
    const awaitedParams = await params;
    const { slug } = awaitedParams;

    debugLog('PostEditPage', 'Successfully extracted parameters', {
      slug,
      paramsType: typeof awaitedParams,
      component: 'PostEditPage',
      action: 'parameter_extraction',
      context: 'dashboard',
      pageType: 'edit',
    });

    debugLog('PostEditPage', 'Rendering PostEditView component', {
      slug,
      component: 'PostEditPage',
      action: 'render_view',
      context: 'dashboard',
      pageType: 'edit',
    });

    return <PostEditView slug={slug} />;
  } catch (error) {
    debugError('PostEditPage', 'Failed to render dashboard post edit page', error, {
      params,
      component: 'PostEditPage',
      action: 'page_render',
      context: 'dashboard',
      pageType: 'edit',
    });

    // Re-throw to be handled by error boundary
    throw error;
  }
}
