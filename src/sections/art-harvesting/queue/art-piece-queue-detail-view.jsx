/**
 * @file art-piece-queue-detail-view.jsx
 * @description Art Piece Queue Detail View component for viewing and managing individual queue items
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { convertQueueToArtPiece } from 'src/utils/art-piece-data-converter';

import { debugLog, debugError } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import { createArtPiece } from 'src/actions/art-piece/requests';
import { ArtPieceQueueForm } from 'src/forms/art-piece-queue/art-piece-queue-form';
import { useUpdateArtPieceQueue, useGetArtPieceQueueById } from 'src/actions/art-piece-queue/hooks';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ArtPieceQueueDialog } from 'src/components/art-harvesting/queue';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { ArtPieceQueueError } from 'src/components/art-harvesting/queue/art-piece-queue-error';
import { ArtPieceQueueEmpty } from 'src/components/art-harvesting/queue/art-piece-queue-empty';
import { ArtPieceQueueImage } from 'src/components/art-harvesting/queue/art-piece-queue-image';
import { ArtPieceQueueArtist } from 'src/components/art-harvesting/queue/art-piece-queue-artist';
import { ArtPieceQueueLoading } from 'src/components/art-harvesting/queue/art-piece-queue-loading';
import { ArtPieceQueueHistoryTab } from 'src/components/art-harvesting/queue/art-piece-queue-history-tab';
import { ArtPieceQueueStatusCard } from 'src/components/art-harvesting/queue/art-piece-queue-status-card';
import { ArtPieceQueueActionsCard } from 'src/components/art-harvesting/queue/art-piece-queue-actions-card';
import { ArtPieceQueueTabNavigation } from 'src/components/art-harvesting/queue/art-piece-queue-tab-navigation';
import { ArtPieceQueueVerificationTab } from 'src/components/art-harvesting/queue/art-piece-queue-verification-tab';
import { ArtPieceQueueInformationCard } from 'src/components/art-harvesting/queue/art-piece-queue-information-card';
import { ArtPieceQueueAiExtractionSection } from 'src/components/art-harvesting/queue/art-piece-queue-ai-extraction-section';

import { useAuthContext } from 'src/auth/hooks';

// TODO: Import additional queue components when implemented
// import {
//   VerificationPanel,
//   VerificationHistory
// } from 'src/components/art-harvesting';

/**
 * Art Piece Queue Detail View component
 * Displays detailed information about a specific art piece in the queue,
 * including verification controls and history.
 *
 * @param {Object} props - Component props
 * @param {string} props.id - The queue item ID
 * @returns {JSX.Element} The queue detail view component
 */

/**
 * Internal content component that handles the queue detail display logic.
 */
function ArtPieceQueueDetailContent({ id }) {
  // fetch the user context
  const { user, loading: userLoading, accessToken } = useAuthContext();

  // scroll progress
  const pageProgress = useScrollProgress();

  // View state
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'verification', 'history'
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch queue item data
  const {
    artPieceQueue,
    artPieceQueueLoading,
    artPieceQueueError,
    mutate: mutateQueueItem,
  } = useGetArtPieceQueueById(id, accessToken);

  // Update hook for verification actions
  const updateArtPieceQueue = useUpdateArtPieceQueue(accessToken);

  // Event handlers
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleVerificationAction = async (action, comments) => {
    try {
      // Prepare the update data with the new status and verification notes
      const updateData = {
        status: action,
        verificationNotes: comments || '',
        updatedBy: user?.userId || 1, // Use actual user ID from auth context, fallback to 1
      };

      // Update the art piece queue item
      await updateArtPieceQueue(id, updateData);

      // If approving, create the actual ArtPiece record
      if (action === 'APPROVED' && artPieceQueue) {
        try {
          const artPieceData = convertQueueToArtPiece(artPieceQueue, user?.userId || 1);
          await createArtPiece(artPieceData, accessToken);
          debugLog(
            'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.ArtPieceCreated',
            'ArtPiece created successfully from approved queue item'
          );
        } catch (artPieceError) {
          debugError(
            'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.ArtPieceCreationFailed',
            'Failed to create ArtPiece from approved queue item:',
            artPieceError
          );
          // Note: We still update the queue status even if ArtPiece creation fails
          // This allows for manual intervention or retry
        }
      }

      // Refresh the data to show updated status
      mutateQueueItem();

      debugLog(
        'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.VerificationCompleted',
        'Verification action completed:',
        action,
        comments
      );
    } catch (error) {
      debugError(
        'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.UpdateFailed',
        'Failed to update art piece queue:',
        error
      );
      // TODO: Add proper error handling/notification
    }
  };

  // Conditional rendering based on auth and loading state
  if (userLoading) return null;

  return (
    <DashboardContent>
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <Container maxWidth sx={{ mb: 4 }}>
        <CustomBreadcrumbs
          data-cy="breadcrumbs"
          heading={
            artPieceQueue ? `Queue Item: ${artPieceQueue.title || 'Untitled'}` : 'Loading...'
          }
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Queue', href: '#' },
            { name: id, href: '#' },
          ]}
          action
          sx={{ mb: 2 }}
        />

        <ErrorBoundary>
          {artPieceQueueLoading ? (
            <ArtPieceQueueLoading />
          ) : artPieceQueueError ? (
            <ArtPieceQueueError error={artPieceQueueError} id={id} />
          ) : !artPieceQueue ? (
            <ArtPieceQueueEmpty id={id} />
          ) : (
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Main Content Area */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ mb: 3 }}>
                  {/* Tab Navigation */}
                  <ArtPieceQueueTabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

                  {/* Tab Content */}
                  <Box sx={{ p: 3 }}>
                    {activeTab === 'details' && (
                      <Stack spacing={3}>
                        {/* Art Piece Queue Form */}
                        <ArtPieceQueueForm
                          currentArtPieceQueue={artPieceQueue}
                          onSuccess={(result) => {
                            // Refresh the queue item data
                            if (mutateQueueItem) {
                              mutateQueueItem();
                            }
                          }}
                        />

                        {/* AI Data Extraction Section */}
                        <ArtPieceQueueAiExtractionSection
                          artPieceQueue={artPieceQueue}
                          accessToken={accessToken}
                        />
                      </Stack>
                    )}

                    {activeTab === 'verification' && (
                      <ArtPieceQueueVerificationTab
                        artPieceQueue={artPieceQueue}
                        onQueueUpdated={(updatedQueue) => {
                          // Optimistic update: immediately update local data
                          if (mutateQueueItem && updatedQueue) {
                            mutateQueueItem(updatedQueue, { revalidate: true });
                          }
                        }}
                        onArtPieceCreated={(result) => {
                          debugLog(
                            'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.ArtPieceCreatedFromQueue',
                            'ArtPiece created from queue:',
                            result
                          );
                          // Refresh the queue item data
                          if (mutateQueueItem) {
                            mutateQueueItem();
                          }
                        }}
                      />
                    )}

                    {activeTab === 'history' && (
                      <ArtPieceQueueHistoryTab artPieceQueue={artPieceQueue} />
                    )}
                  </Box>
                </Card>
              </Box>

              {/* Sidebar */}
              <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
                {/* Status Card */}
                <ArtPieceQueueStatusCard artPieceQueue={artPieceQueue} />

                {/* Quick Actions */}
                <ArtPieceQueueActionsCard
                  artPieceQueue={artPieceQueue}
                  onVerificationAction={handleVerificationAction}
                />

                {/* Related Information */}
                <ArtPieceQueueInformationCard artPieceQueue={artPieceQueue} />

                {/* Image Section */}
                <ArtPieceQueueImage
                  artPieceQueue={artPieceQueue}
                  allowAddImages
                  accessToken={accessToken}
                  onImageAdded={(result) => {
                    debugLog(
                      'CityArtWalks.Sections.Dashboard.ArtHarvesting.Queue.ImageAdded',
                      'Image added successfully:',
                      result
                    );
                    // Refresh the queue item data to get updated images
                    if (mutateQueueItem) {
                      mutateQueueItem();
                    }
                  }}
                />

                {/* Artist Section */}
                <ArtPieceQueueArtist
                  artist={artPieceQueue?.Artist || null}
                  artistName={artPieceQueue?.artistName || ''}
                  accessToken={accessToken}
                  artPieceQueue={artPieceQueue}
                  onArtistCreated={(newArtist) => {
                    // Refresh the queue item data to get updated artist info
                    if (mutateQueueItem) {
                      mutateQueueItem();
                    }
                  }}
                  onQueueUpdated={(updatedQueue) => {
                    // Optimistic update: immediately update local data
                    if (mutateQueueItem && updatedQueue) {
                      mutateQueueItem(updatedQueue, { revalidate: true });
                    }
                  }}
                />
              </Box>
            </Box>
          )}
        </ErrorBoundary>
      </Container>

      {/* Edit Modal */}
      {showEditModal && artPieceQueue && (
        <ArtPieceQueueDialog
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          artPieceQueue={artPieceQueue}
        />
      )}
    </DashboardContent>
  );
}

/**
 * Main ArtPieceQueueDetailView component
 * @param {Object} props - Component props
 * @param {string} props.id - The queue item ID
 * @returns {JSX.Element} The queue detail view
 */
export function ArtPieceQueueDetailView({ id }) {
  return <ArtPieceQueueDetailContent id={id} />;
}
