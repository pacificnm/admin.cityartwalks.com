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
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { ArtPieceMaterialTable, ArtPieceMaterialDialog } from 'src/components/art-piece-material';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @description ArtPieceMaterialsHomeView component renders the home view for art piece materials.
 * It includes functionalities for pagination, search, filtering, and CRUD operations for art piece materials.
 * Includes create dialog functionality for adding new art piece materials.
 *
 * @memberof CityArtWalks.Sections.Dashboard.ArtPieceMaterial
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <ArtPieceMaterialsHomeView />
 * )
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceMaterial-Model} - ArtPieceMaterial model documentation
 */
export function ArtPieceMaterialsHomeView() {
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
   * Handles successful material creation
   * @param {Object} result - The result from the create operation
   */
  const handleCreateSuccess = (result) => {
    debugLog('[ArtPieceMaterial.Home.View.Create success]', result);
    setCreateDialogOpen(false);
  };

  if (userLoading) return <div>Loading...</div>; // You may want to create a skeleton component
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-materials-home-view">
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
            heading="Dashboard - Art Piece - Materials"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Art Pieces', href: paths.dashboard.artPiece.home },
              { name: 'Art Pieces Materials', href: paths.dashboard.artPieceMaterial.home },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateDialogOpen}
                data-cy="create-art-piece-material-button"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                New Material
              </Button>
            }
            sx={{ mb: 3 }}
          />

          {/* ArtPieceMaterial Table Component */}
          <ArtPieceMaterialTable
            data-cy="art-piece-material-table"
            accessToken={accessToken}
            filters={{ active: 'all' }} // Initialize with 'all' to show all materials
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
        <ArtPieceMaterialDialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          onSuccess={handleCreateSuccess}
          currentArtPieceMaterial={null} // null for create mode
          title="Create New Art Piece Material"
        />
      </Box>
    </ErrorBoundary>
  );
}
