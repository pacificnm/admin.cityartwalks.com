/**
 * @version 1.0.0
 * @author [Jaimie Garner]
 * @namespace CityArtWalks.Sections.Dashboard.Artist.ArtistEditDialog
 */

'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { ArtistForm } from 'src/forms/artist';

import { OwnerGuard } from 'src/auth/guard';
/**
 * @memberof CityArtWalks.Sections.Dashboard.Artist.ArtistEditDialog
 * @description ArtistEditDialog component renders a dialog for creating or editing artist details.
 * When creating (currentArtist has no artistId), the form is accessible to all authenticated users.
 * When editing (currentArtist has artistId), the form is protected by OwnerGuard.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.currentArtist - The current artist data (null/empty for creation).
 * @param {boolean} props.open - Boolean indicating if the dialog is open.
 * @param {Function} [props.onSuccess] - Function to call when artist is successfully created/updated.
 * @param {Function} [props.onCancel] - Function to call when dialog is canceled/closed.
 * @param {Function} [props.onClose] - Legacy prop - used for both success and cancel if onSuccess/onCancel not provided.
 * @returns {JSX.Element} The rendered component.
 */
export function ArtistEditDialog({ currentArtist, open, onSuccess, onCancel, onClose }) {
  const isEdit = Boolean(currentArtist?.artistId);
  const dialogTitle = isEdit ? 'Edit Artist' : 'Create Artist';

  // Handle backward compatibility with onClose prop
  const handleSuccess = onSuccess || onClose;
  const handleCancel = onCancel || onClose;

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleCancel}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {isEdit ? (
          // For legacy artists without createdBy, or for proper ownership check
          currentArtist?.createdBy === null ? (
            // Legacy artist without createdBy - allow admin access
            <ArtistForm
              currentArtist={currentArtist}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : (
            // Normal ownership check for artists with createdBy field
            <OwnerGuard
              userId={currentArtist?.createdBy}
              showError={false}
              fallback={<div>Access denied or loading authentication...</div>}
            >
              <ArtistForm
                currentArtist={currentArtist}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </OwnerGuard>
          )
        ) : (
          <ArtistForm
            currentArtist={currentArtist}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
