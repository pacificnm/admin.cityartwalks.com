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
import { ArtPieceTypeTable, ArtPieceTypeDialog } from 'src/components/art-piece-type';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceTypeHomeSkeleton } from './art-piece-type-home-skeleton';

/**
 * @description ArtPieceTypeHomeView component renders the home view for art piece types.
 * It includes functionalities for pagination, search, filtering, and CRUD operations for art piece types.
 * Includes create dialog functionality for adding new art piece types.
 *
 * @memberof CityArtWalks.Sections.Dashboard.ArtPieceType
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <ArtPieceTypeHomeView />
 * )
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 */
export function ArtPieceTypeHomeView() {
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
   * Handles successful type creation
   * @param {Object} result - The result from the create operation
   */
  const handleCreateSuccess = (result) => {
    debugLog('[ArtPieceType.Home.View.Create success]', result);
    setCreateDialogOpen(false);
  };

  if (userLoading) return <ArtPieceTypeHomeSkeleton />;
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-type-home-view">
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
            heading="Dashboard - Art Piece - Types"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Art Pieces', href: paths.dashboard.artPiece.home },
              { name: 'Art Piece Types', href: paths.dashboard.artPieceType.home },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDialogOpen}
                data-cy="create-art-piece-type-button"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                New Type
              </Button>
            }
            sx={{ mb: 3 }}
          />

          {/* ArtPieceType Table Component */}
          <ArtPieceTypeTable
            data-cy="art-piece-type-table"
            accessToken={accessToken}
            filters={{ active: 'all' }} // Initialize with 'all' to show all types
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
        <ArtPieceTypeDialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          onSuccess={handleCreateSuccess}
          currentArtPieceType={null} // null for create mode
          title="Create New Art Piece Type"
        />
      </Box>
    </ErrorBoundary>
  );
}
