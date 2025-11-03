/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceFullScreen
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import * as React from 'react';
import PropTypes from 'prop-types';

import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { MapViewportProvider } from 'src/hooks/use-map-viewport';

import { CloseIcon } from 'src/components/icons';
import ErrorBoundary from 'src/components/error/error-boundary';

import { ArtPieceMap } from './art-piece-map';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFullScreen
 * @function ArtPieceFullScreen
 * @desc ArtPieceFullScreen component renders a full-screen dialog to display art pieces on a map.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title of the dialog.
 * @param {Array} props.artPieces - An array of art pieces to display on the map.
 * @param {Object} props.location - The location data for the map.
 * @param {Object} props.fullScreenDialog - An object managing the dialog state.
 * @param {boolean} props.fullScreenDialog.value - Indicates whether the dialog is open.
 * @param {Function} props.fullScreenDialog.onFalse - Callback function to close the dialog.
 * @returns {JSX.Element} The rendered ArtPieceFullScreen component.
 *
 * @example
 * const mockArtPieces = [
 *   { id: 1, title: 'Mural 1', location: { lat: 45.52, lng: -122.68 } },
 *   { id: 2, title: 'Sculpture 2', location: { lat: 45.52, lng: -122.67 } },
 * ];
 *
 * <ArtPieceFullScreen
 *   title="Art Pieces"
 *   artPieces={mockArtPieces}
 *   location={{ lat: 45.52, lng: -122.68 }}
 *   fullScreenDialog={{ value: true, onFalse: () => console.log('Dialog closed') }}
 * />
 */
export function ArtPieceFullScreen({ title, artPieces, loction, open, onClose }) {
  return (
    <ErrorBoundary>
      <Dialog
        fullScreen
        maxWidth
        open={open}
        onClose={onClose}
        scroll="paper"
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon size={24} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent style={{ maxHeight: '100vh', overflow: 'auto' }}>
          <MapViewportProvider>
            <ArtPieceMap artPieces={artPieces} location={loction} height={800} />
          </MapViewportProvider>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFullScreen
 * @prop {string} title - The title of the dialog. This prop is required.
 * @prop {Array} artPieces - An array of art pieces to display on the map. This prop is required.
 * @prop {Object} location - The location data for the map. This prop is required.
 * @prop {Object} fullScreenDialog - An object managing the dialog state. This prop is required.
 * @prop {boolean} fullScreenDialog.value - Indicates whether the dialog is open. This prop is required.
 * @prop {Function} fullScreenDialog.onFalse - Callback function to close the dialog. This prop is required.
 */
ArtPieceFullScreen.propTypes = {
  title: PropTypes.string.isRequired,
  artPieces: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  fullScreenDialog: PropTypes.shape({
    value: PropTypes.bool.isRequired,
    onFalse: PropTypes.func.isRequired,
  }).isRequired,
};
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFullScreen
 * @description Transition component for the dialog slide-up effect.
 * @constant Transition
 * @param {Object} props - Transition props.
 * @param {React.Ref} ref - Reference for the transition.
 * @returns {JSX.Element} Slide transition component.
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
