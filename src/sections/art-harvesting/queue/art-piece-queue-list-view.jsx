'use client';

import { useState } from 'react';

import { paths } from 'src/routes/paths';

import { debugLog } from 'src/lib/debug';

import { ErrorView } from 'src/components/error';
import { PageDashboard } from 'src/components/page/page-dashboard';
import {
  ArtPieceQueueTable,
  ArtPieceQueueDialog,
  ArtPieceQueueButton,
} from 'src/components/art-harvesting/queue';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @description ArtPieceQueueListView component renders the queue view for art piece harvesting.
 * It includes functionalities for pagination, search, filtering, and CRUD operations for queue items.
 * Includes create dialog functionality for adding new queue items.
 *
 * @memberof CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <ArtPieceQueueListView />
 * )
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue-Model} - ArtPieceQueue model documentation
 */
export function ArtPieceQueueListView() {
  const { userLoading, error: userError, accessToken } = useAuthContext();

  // Create dialog state management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  /**
   * Handles opening the create dialog
   */
  const handleCreateDialogOpen = () => {
    debugLog('[ArtPieceQueue.Home.View.handleCreateDialogOpen]', 'Opening create dialog');
    setCreateDialogOpen(true);
  };

  /**
   * Handles closing the create dialog
   */
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  /**
   * Handles successful queue item creation
   * @param {Object} result - The result from the create operation
   */
  const handleCreateSuccess = (result) => {
    debugLog('[ArtPieceQueue.Home.View.Create success]', result);
    setCreateDialogOpen(false);
  };

  if (userLoading) return <div>Loading...</div>; // You may want to create a skeleton component
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <PageDashboard
      heading="Dashboard - Art Piece - Queue"
      links={[
        { name: 'Home', href: paths.home },
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Art Pieces', href: paths.dashboard.artPiece.home },
        { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
        { name: 'Queue', href: paths.dashboard.artPiece.harvestingQueue },
      ]}
      action={<ArtPieceQueueButton onClick={handleCreateDialogOpen} />}
      dataCy="art-piece-queue-list-view"
    >
      {/* ArtPieceQueue Table Component */}
      <ArtPieceQueueTable
        data-cy="art-piece-queue-table"
        accessToken={accessToken}
        filters={{ status: 'all' }} // Initialize with 'all' to show all queue items
        tabOptions={[
          { value: 'all', label: 'All' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'PROCESSING', label: 'Processing' },
          { value: 'REVIEWING', label: 'Reviewing' },
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
          { value: 'PUBLISHED', label: 'Published' },
          { value: 'ERROR', label: 'Error' },
        ]}
        displayFilters={{
          search: true,
          status: true,
          toolMenu: true,
        }}
      />

      {/* Create Dialog */}
      <ArtPieceQueueDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        onSuccess={handleCreateSuccess}
        currentArtPieceQueue={null} // null for create mode
        title="Add New Harvest URL"
      />
    </PageDashboard>
  );
}
