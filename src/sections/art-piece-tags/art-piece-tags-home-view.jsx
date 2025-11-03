'use client';

import { useState } from 'react';

import { Box, Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { debugLog } from 'src/lib/debug';

import { AddIcon } from 'src/components/icons';
import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ArtPieceTagTable, ArtPieceTagDialog } from 'src/components/art-piece-tag';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceTagsHomeSkeleton } from './art-piece-tags-home-skeleton';
/**
 * @description ArtPieceTagsHomeView component renders the home view for art piece tags.
 * It includes functionalities for pagination, search, quick edit of art piece tags,
 * and the ability to create new art piece tags via a dialog.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <ArtPieceTagsHomeView />
 * )
 */
export function ArtPieceTagsHomeView() {
  const { userLoading, error: userError, accessToken } = useAuthContext();
  const pageProgress = useScrollProgress();

  // Create dialog state management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  /**
   * Handles opening the create dialog
   */
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  /**
   * Handles closing the create dialog
   */
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  /**
   * Handles successful tag creation
   * @param {Object} result - The result from the create operation
   */
  const handleCreateSuccess = (result) => {
    debugLog('[ArtPieceTag.Home.View.Create success]', result);
    createDialogOpen.onFalse();
  };

  // Loading and error states
  if (userLoading) return <ArtPieceTagsHomeSkeleton />;
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-tags-home-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          <CustomBreadcrumbs
            data-cy="breadcrumbs"
            heading="Dashboard - Art Piece - Tags"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Art Pieces', href: paths.dashboard.artPiece.home },
              { name: 'Art Pieces Tags', href: paths.dashboard.artPieceTags.home },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDialogOpen}
                data-cy="create-art-piece-tag-button"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                New Tag
              </Button>
            }
            sx={{ mb: 3 }}
          />
          <ArtPieceTagTable
            data-cy="art-piece-tag-table"
            accessToken={accessToken}
            filters={{ active: 'all' }} // Initialize with 'all' to show all tags
            tabOptions={[
              { value: 'all', label: 'All' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            displayFilters={{
              search: true,
              active: true,
              toolMenu: true,
            }}
          />
        </Container>

        {/* Create Dialog */}
        <ArtPieceTagDialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          onSuccess={handleCreateSuccess}
          currentArtPieceTag={null} // null for create mode
          title="Create New Art Piece Tag"
        />
      </Box>
    </ErrorBoundary>
  );
}
