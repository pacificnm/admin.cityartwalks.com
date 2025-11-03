import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { StarIcon, EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function PaymentCardItem({ card, sx, ...other }) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        <MenuItem onClick={menuActions.onClose}>
          <StarIcon />
          Set as primary
        </MenuItem>

        <MenuItem onClick={menuActions.onClose}>
          <EditIcon />
          Edit
        </MenuItem>

        <MenuItem onClick={menuActions.onClose} sx={{ color: 'error.main' }}>
          <DeleteIcon />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={[{ p: 2.5, width: 1, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <Box
          sx={{
            mb: 1,
            gap: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {card.cardType === 'visa' && <Iconify icon="payments:visa" width={40} height="auto" />}
          {card.cardType === 'mastercard' && (
            <Iconify icon="payments:mastercard" width={40} height="auto" />
          )}
          {card.primary && <Label color="info">Default</Label>}
        </Box>

        <Typography variant="subtitle2">{card.cardNumber}</Typography>

        <IconButton onClick={menuActions.onOpen} sx={{ top: 8, right: 8, position: 'absolute' }}>
          <VerticalFillIcon />
        </IconButton>
      </Paper>

      {renderMenuActions()}
    </>
  );
}
