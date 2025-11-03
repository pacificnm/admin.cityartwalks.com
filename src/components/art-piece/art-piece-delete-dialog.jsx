/**
 * @version 1.0.0
 * @author [Jaimie Garner]
 * @namespace CityArtWalks.Component.ArtPiece.ArtPieceDeleteDialog
 */

'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { deleteArtPiece } from 'src/actions/art-piece';

import { toast } from 'src/components/snackbar';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Component.ArtPiece.ArtPieceDeleteDialog
 * @description ArtPieceDeleteDialog component renders a dialog for deleteing art piece details.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.currentArtPiece - The current art piece data.
 * @param {boolean} props.open - Boolean indicating if the dialog is open.
 * @param {Function} props.onClose - Function to call when the dialog is closed.
 * @returns {JSX.Element} The rendered component.
 */
export function ArtPieceDeleteDialog({ currentArtPiece, open, onClose }) {
  const { loading: userIsLoading } = useAuthContext();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteArtPiece(currentArtPiece.artPieceId);

      if (response.status === 201) {
        toast.success('The art piece was deleted');

        router.push(paths.art.artist.details(currentArtPiece.artist.slug));
      } else {
        toast.error('failed to delete the art piece');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (userIsLoading) return <ArtPieceDeleteDialogSkeleton />;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>Delete Art Piece</DialogTitle>
      <DialogContent sx={{ typography: 'body2' }}>
        Are you sure want to delete <strong> {currentArtPiece.title} </strong>?
      </DialogContent>
      <DialogActions>
        <OwnerGuard userId={currentArtPiece?.createdBy}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
        </OwnerGuard>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Component.ArtPiece.ArtPieceDeleteDialog
 * @description Displays a skeleton dialog intended for deleting an art piece.
 *
 * @function ArtPieceDeleteDialogSkeleton
 * @returns {JSX.Element} The JSX for the delete dialog skeleton.
 */
export function ArtPieceDeleteDialogSkeleton() {
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogTitle sx={{ pb: 2 }}>Delete Art Piece</DialogTitle>
      <DialogContent sx={{ typography: 'body2' }}>
        Are you sure want to delete <strong> </strong>?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
