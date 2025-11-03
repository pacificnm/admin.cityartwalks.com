import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomPopover } from 'src/components/custom-popover';
import { LinkIcon, ShareIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';
//----------------------------------------------------------------------

/**
 * Renders an image popover component.
 *
 * @component
 * @param {Object} data - The data object containing information about the image.
 * @returns {JSX.Element} The JSX element representing the image popover.
 */
export function ImagePopover({ data }) {
  const share = useBoolean();
  const confirm = useBoolean();
  const popover = useBoolean();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.id);
  };

  return (
    <>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <VerticalFillIcon />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <LinkIcon />
          Copy Link
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <ShareIcon />
          Share
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
