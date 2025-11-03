'use client';

/**
 * @version 1.0.0
 * @author [Jaimie Garner]
 * @namespace CityArtWalks.Sections.Dashboard.Path.Edit.Diaglog
 */
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { PathAdminEditForm } from 'src/forms/path';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Path.Edit.Diaglog
 * @function PathEditDialog
 * @description PathEditDialog component renders a dialog for editing a path.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.currentPath - The current path data to be edited.
 * @param {boolean} props.open - A boolean indicating whether the dialog is open.
 * @param {function} props.onClose - A function to handle closing the dialog.
 * @returns {JSX.Element} The rendered PathEditDialog component.
 */
export function PathEditDialog({ currentPath, open, onClose }) {
  return (
    <Dialog fullWidth maxWidth open={open} onClose={onClose}>
      <DialogTitle> Update</DialogTitle>
      <DialogContent>
        <PathAdminEditForm currentPath={currentPath} open={open} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
