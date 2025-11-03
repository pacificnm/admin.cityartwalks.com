/**
 * Art Piece Queue Management Page - Queue Administration Interface
 *
 * This page provides comprehensive management of the art piece queue for the harvesting pipeline.
 * Features filtering, searching, bulk operations, and detailed review of extracted art data.
 * Enables administrators to review AI-extracted data and approve items for publication.
 *
 * @fileoverview Art piece queue management page with filtering, review, and approval capabilities
 * @version 1.0.0
 * @namespace CityArtWalks.App.Dashboard.ArtPiece.Harvesting.Queue
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Page-Component-Standards|Page Component Standards}
 */

import { ArtPieceQueueListView } from 'src/sections/art-harvesting/queue/art-piece-queue-list-view';

/**
 * Static metadata for the Art Piece Queue Management page.
 *
 * @memberof CityArtWalks.App.Dashboard.ArtPiece.Harvesting.Queue
 * @constant {Object} metadata
 */
export const metadata = {
  title: 'Art Piece Queue Management - City Art Walks',
  description:
    'Review, edit, and approve AI-extracted art pieces in the harvesting queue. Manage queue items with filtering, searching, and bulk operations.',
}; // Temporary metadata for scaffolding

// Performance optimization for queue data
export const revalidate = 300; // 5 minutes - frequent updates for queue management
export const dynamicParams = true;

/**
 * Art Piece Queue Management Page Component
 *
 * Renders the queue management interface for reviewing AI-extracted art pieces.
 * Features comprehensive CRUD operations, filtering, and approval workflow:
 * - Paginated queue item listing with advanced filters
 * - Status-based filtering (PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
 * - Search across title, artist name, and location
 * - Bulk operations for multiple items
 * - Individual item review and editing
 * - Approval/rejection workflow with notes
 * - Export functionality for queue data
 *
 * @memberof CityArtWalks.App.Dashboard.ArtPiece.Harvesting.Queue
 * @async
 * @function Page
 * @returns {Promise<JSX.Element>} The rendered queue management page
 *
 * @example
 * // Queue management renders at /dashboard/art-piece/harvesting/queue
 * // Displays filterable table of queue items with action buttons
 */
export default async function Page() {
  return <ArtPieceQueueListView />;
}

// TODO: When implementing the actual component:
// return <ArtPieceQueueListView />;
