/**
 * Dashboard Post List Page - Content Management Interface
 *
 * This page provides a comprehensive interface for managing blog posts and content
 * within the dashboard environment. It displays a filterable, searchable list of
 * all posts with bulk operations, status management, and publishing controls.
 * The interface supports content moderation, SEO optimization, and performance
 * analytics for the content management workflow.
 *
 * @fileoverview Dashboard post list page component with content management features
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.App.Dashboard.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Content-Management|Content Management}
 */

import { generateBrowseMetadata } from 'src/utils/metadata';

import { debugLog, debugError } from 'src/lib/debug';

import { PostListView } from 'src/sections/post';

// ----------------------------------------------------------------------

/**
 * Metadata configuration for the Dashboard Post List page
 *
 * Provides optimized metadata for SEO, dashboard navigation, and admin interface.
 * Uses the browse metadata template for collection pages within the dashboard context.
 *
 * @memberof CityArtWalks.App.Dashboard.Post
 * @type {Metadata}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation}
 */
export const metadata = generateBrowseMetadata({
  title: 'Post Management | Dashboard - City Art Walks',
  description:
    'Manage blog posts, articles, and content with comprehensive editing tools, publishing controls, and analytics in the City Art Walks dashboard.',
  category: 'Dashboard Posts',
  noIndex: true, // Don't index admin/dashboard pages
});

/**
 * ISR configuration for dashboard post list page
 *
 * Enables Incremental Static Regeneration with shorter cache time for dashboard pages
 * to ensure admins always have access to the latest content and management features.
 *
 * @memberof CityArtWalks.App.Dashboard.Post
 * @type {number}
 */
export const revalidate = 300; // 5 minutes for dashboard pages

// ----------------------------------------------------------------------

/**
 * Dashboard Post List Page Component
 *
 * Renders the post management interface for content administrators with comprehensive
 * error handling, debug logging, and performance optimization. Provides access to
 * all post management features including creation, editing, publishing, and analytics.
 *
 * @memberof CityArtWalks.App.Dashboard.Post
 * @function PostListPage
 * @returns {JSX.Element} The rendered dashboard post list page component
 * @throws {Error} When component fails to render - handled by error boundary
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Components|Dashboard Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Error-Handling|Error Handling}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model|Post Model Documentation}
 * @example
 * // Route: /dashboard/post
 * // Renders: Complete post management interface with filtering, search, and bulk operations
 *
 * @example
 * // Features provided:
 * // - Post listing with pagination and filtering
 * // - Bulk operations (publish, unpublish, delete)
 * // - Content status management
 * // - SEO optimization tools
 * // - Analytics and performance metrics
 * // - Draft management and scheduling
 *
 * @example
 * // Error handling:
 * try {
 *   return <PostListPage />;
 * } catch (error) {
 *   console.error('Failed to render post list page:', error);
 *   return <DashboardErrorFallback />;
 * }
 */
export default function PostListPage() {
  try {
    debugLog('PostListPage', 'Rendering dashboard post list page', {
      component: 'PostListPage',
      action: 'page_render',
      context: 'dashboard',
    });

    return <PostListView />;
  } catch (error) {
    debugError('PostListPage', 'Failed to render dashboard post list page', error, {
      component: 'PostListPage',
      action: 'page_render',
      context: 'dashboard',
    });

    // Re-throw to be handled by error boundary
    throw error;
  }
}
