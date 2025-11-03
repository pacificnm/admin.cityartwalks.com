/**
 * @file art-piece-queue-artist.jsx
 * @description Artist information component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import { debugLog, debugError } from 'src/lib/debug';
import { useUpdateArtPieceQueue } from 'src/actions/art-piece-queue/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ViewIcon, CheckCircleIcon } from 'src/components/icons';

import { ArtPieceQueueArtistDialog } from './art-piece-queue-artist-dialog';

/**
 * ArtPieceQueueArtist component
 * Displays artist information for art piece queue items or provides creation option
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.artist - Artist object if found
 * @param {string} props.artistName - Extracted artist name from AI
 * @param {string} props.accessToken - Access token for API calls
 * @param {Function} props.onArtistCreated - Callback when artist is created
 * @param {Object} props.artPieceQueue - The art piece queue object to update
 * @param {Function} props.onQueueUpdated - Callback when queue is updated
 * @returns {JSX.Element} The artist component
 */
export function ArtPieceQueueArtist({
  artist,
  artistName,
  accessToken,
  onArtistCreated,
  artPieceQueue,
  onQueueUpdated,
}) {
  debugLog('ArtPieceQueueArtist render:', {
    artist,
    artistName,
    hasArtistId: !!artPieceQueue?.artistId,
    queueArtistId: artPieceQueue?.artistId,
    queueArtist: artPieceQueue?.Artist,
    fullQueue: artPieceQueue,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use the hook for proper cache invalidation
  const updateArtPieceQueue = useUpdateArtPieceQueue(accessToken);

  const handleCreateArtist = async () => {
    setDialogOpen(true);
  };

  const handleArtistCreated = async (result) => {
    setDialogOpen(false);

    try {
      const newArtist = result.artistData || result.result?.data || result.result;

      if (!newArtist || !newArtist.artistId) {
        debugError(
          'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueArtist.handleArtistCreated',
          'No artist data returned from creation',
          { result }
        );
        toast.error('Artist created but unable to link to queue item');
        return;
      }

      toast.success('Artist created successfully!');

      // Update the art piece queue with the new artist
      if (artPieceQueue?.artPieceQueueId && accessToken) {
        try {
          const updateData = {
            artistId: newArtist.artistId,
          };

          const updateResult = await updateArtPieceQueue(artPieceQueue.artPieceQueueId, updateData);

          debugLog(
            'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueArtist.handleArtistCreated',
            'Update result',
            { updateResult }
          );

          if (updateResult) {
            toast.success('Queue item updated with new artist!');

            // Call parent callbacks immediately
            if (onArtistCreated) {
              onArtistCreated(newArtist);
            }
            if (onQueueUpdated) {
              onQueueUpdated(updateResult);
            }

            // Also trigger a delayed refresh to ensure cache sync
            setTimeout(() => {
              if (onQueueUpdated) {
                onQueueUpdated(updateResult);
              }
            }, 100);
          } else {
            debugError(
              'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueArtist.handleArtistCreated',
              'Failed to update queue item with artist',
              { updateResult }
            );
            toast.warning('Artist created but failed to update queue item');
          }
        } catch (updateError) {
          debugError(
            'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueArtist.handleArtistCreated',
            'Error updating queue item with artist',
            { updateError: updateError.message, stack: updateError.stack }
          );
          toast.error('Artist created but failed to link to queue item');
        }
      } else {
        // Still call the callback even if we can't update the queue
        if (onArtistCreated) {
          onArtistCreated(newArtist);
        }
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueArtist.handleArtistCreated',
        'Error handling artist creation',
        { error: error.message, stack: error.stack }
      );
      toast.error('Failed to process artist creation');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // No toast message for simple close/cancel
  };

  return (
    <Card>
      <CardHeader title="Artist Information" sx={{ pb: 2 }} />

      <Box sx={{ p: 3 }}>
        {artist ? (
          // Display existing artist information
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={artist.imageUrl} alt={artist.name} sx={{ width: 56, height: 56 }}>
                {artist.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {artist.name}
                </Typography>
                {artist.nationality && (
                  <Typography variant="body2" color="text.secondary">
                    {artist.nationality}
                  </Typography>
                )}
              </Box>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {artist.website && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Iconify icon="solar:link-bold" />}
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                href={paths.art.artist.details(artist.slug)}
              >
                View Profile
              </Button>
            </Stack>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Artist found and linked successfully
              </Typography>
            </Box>
          </Stack>
        ) : (
          // No artist found - show creation option
          <Stack spacing={2}>
            {artistName ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Extracted Artist Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  {artistName}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No artist name was extracted from the source content.
              </Typography>
            )}

            <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark" gutterBottom>
                <Iconify icon="solar:info-circle-bold" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Artist not found in database
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {artistName
                  ? 'The extracted artist name does not match any existing artists in the database.'
                  : 'No artist information could be extracted from the source content.'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:user-plus-bold" />}
              onClick={handleCreateArtist}
              sx={{ alignSelf: 'flex-start' }}
            >
              {artistName ? 'Create New Artist' : 'Artist not found in database'}
            </Button>
          </Stack>
        )}
      </Box>

      {/* Artist Creation Dialog */}
      <ArtPieceQueueArtistDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleArtistCreated}
        onCancel={handleDialogClose}
        artPieceQueue={artPieceQueue}
        initialArtistName={artistName}
      />
    </Card>
  );
}
