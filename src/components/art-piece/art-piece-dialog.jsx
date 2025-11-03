/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceDialog
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { ArtPieceTabDetail } from 'src/components/art-piece/art-piece-tab-detail';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceDialog
 * @function ArtPieceDialog
 * @description Renders a dialog to display detailed information about an art piece.
 * Includes the title, artist name, and a detailed view using `ArtPieceTabDetail`.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artPieceId - The unique ID of the art piece.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.artistName - The name of the artist who created the art piece.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Callback function triggered when the dialog is closed.
 * @param {Object} props.other - Additional props to pass to the `Dialog` component.
 * @returns {JSX.Element} The rendered ArtPieceDialog component.
 *
 * @example
 * // Usage example
 * import { ArtPieceDialog } from './ArtPieceDialog';
 *
 * function App() {
 *   const [open, setOpen] = useState(false);
 *
 *   const handleOpen = () => setOpen(true);
 *   const handleClose = () => setOpen(false);
 *
 *   return (
 *     <>
 *       <button onClick={handleOpen}>View Art Piece</button>
 *       <ArtPieceDialog
 *         artPieceId="123"
 *         title="Starry Night"
 *         artistName="Vincent van Gogh"
 *         open={open}
 *         onClose={handleClose}
 *       />
 *     </>
 *   );
 * }
 */
export function ArtPieceDialog({ artPieceId, title, artistName, open, onClose, ...other }) {
  return (
    <Dialog
      fullWidth
      maxWidth="lg" // Adjust this value based on your requirements
      open={open}
      onClose={onClose}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>
        {title} by {artistName}
      </DialogTitle>
      <DialogContent>
        <ArtPieceTabDetail artPieceId={artPieceId} />
      </DialogContent>
    </Dialog>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceDialog
 * @prop {string} artPieceId - The unique ID of the art piece. This prop is required.
 * @prop {string} title - The title of the art piece. This prop is required.
 * @prop {string} artistName - The name of the artist who created the art piece. This prop is required.
 * @prop {boolean} open - Whether the dialog is open. This prop is required.
 * @prop {Function} onClose - Callback function triggered when the dialog is closed. This prop is required.
 * @prop {Object} other - Additional props to pass to the `Dialog` component. This prop is optional.
 */
ArtPieceDialog.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  other: PropTypes.object,
};
