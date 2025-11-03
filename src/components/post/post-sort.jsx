import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { CustomPopover } from 'src/components/custom-popover';
import { ArrowUpIcon, ArrowDownIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function PostSort({ sort, sortOptions, onSort }) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
    >
      <MenuList>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sort === option.value}
            onClick={() => {
              menuActions.onClose();
              onSort(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={menuActions.onOpen}
        endIcon={menuActions.open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
      >
        Sort by:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {sort}
        </Box>
      </Button>

      {renderMenuActions()}
    </>
  );
}
