import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { RouterLink } from 'src/routes/components';

import { CustomPopover } from 'src/components/custom-popover';
import { ViewIcon, EditIcon, DeleteIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function PostPopover({
  open,
  anchorEl,
  onClose,
  detailsHref,
  editHref,
  onDelete,
  post,
  ...other
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    onClose(); // Close the popover
  };

  const handleDeleteConfirm = async () => {
    if (onDelete) {
      await onDelete(post.postId);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
        {...other}
      >
        <MenuList>
          <li>
            <MenuItem component={RouterLink} href={detailsHref} onClick={onClose}>
              <ViewIcon />
              View
            </MenuItem>
          </li>

          <li>
            <MenuItem component={RouterLink} href={editHref} onClick={onClose}>
              <EditIcon />
              Edit
            </MenuItem>
          </li>

          {onDelete && (
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <DeleteIcon />
              Delete
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &ldquo;{post?.title}&rdquo;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
