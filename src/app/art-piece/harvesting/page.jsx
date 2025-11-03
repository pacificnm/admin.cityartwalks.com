/**
 * Art Harvesting Dashboard Page - Main Dashboard Interface
 *
 * This page provides the central dashboard for managing the art harvesting pipeline.
 * Features overview widgets, recent activity, batch management, and quick actions.
 * Serves as the main entry point for harvest administrators and moderators.
 *
 * @fileoverview Art harvesting main dashboard page component with overview widgets and controls
 * @version 1.0.0
 * @namespace CityArtWalks.App.Dashboard.ArtPiece.Harvesting
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation}
 */

import { ArtHarvestingDashboardView } from 'src/sections/art-harvesting/art-harvesting-dashboard-view';

/**
 * Static metadata for the Art Harvesting Dashboard page.
 * Optimized for admin interface SEO and provides context for harvesting operations.
 *
 * @memberof CityArtWalks.App.Dashboard.ArtPiece.Harvesting
 * @constant {Object} metadata
 * @property {string} title - Page title for SEO and browser tab
 * @property {string} description - Meta description for search engines and social sharing
 * @property {string} category - Page category for navigation and breadcrumbs
 * @property {string} subtitle - Subtitle for Open Graph images
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SEO-Metadata-Generation|SEO Metadata Generation}
 */
// TODO: Implement metadata using generateBrowseMetadata
// export const metadata = generateBrowseMetadata({
//   title: 'Art Harvesting Dashboard - City Art Walks',
//   description: 'Manage art piece harvesting pipeline, review queued items, monitor batch processing, and publish approved artworks to the live gallery.',
//   category: 'Art Harvesting Dashboard',
//   subtitle: 'Harvest Management Console',
// });

export const metadata = {
  title: 'Art Harvesting Dashboard - City Art Walks',
  description:
    'Manage art piece harvesting pipeline, review queued items, monitor batch processing, and publish approved artworks to the live gallery.',
}; // Temporary metadata for scaffolding

// Performance optimization for dashboard data
export const revalidate = 300; // 5 minutes - frequent updates for dashboard
export const dynamicParams = true;

/**
 * Art Harvesting Dashboard Page Component
 *
 * Renders the main dashboard interface for the art harvesting pipeline. Provides
 * comprehensive overview of harvesting operations including:
 * - Real-time statistics and metrics
 * - Recent batch activity and progress
 * - Queue management summary
 * - Quick action buttons for common tasks
 * - System health and performance indicators
 * - AI service usage and quotas
 *
 * The dashboard automatically refreshes every 5 minutes to provide up-to-date
 * information for administrators and moderators managing the harvesting process.
 *
 * @memberof CityArtWalks.App.Dashboard.ArtPiece.Harvesting
 * @async
 * @function Page
 * @returns {Promise<JSX.Element>} The rendered dashboard page component
 *
 * @example
 * // Dashboard renders at /dashboard/art-piece/harvesting
 * // Displays overview widgets, batch status, queue metrics
 *
 * @see {@link ArtHarvestingDashboardView} - Main dashboard view component
 */
export default async function Page() {
  return <ArtHarvestingDashboardView />;
}
