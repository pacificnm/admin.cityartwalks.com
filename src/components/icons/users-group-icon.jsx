import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UsersGroupIcon({ sx, ...other }) {
  return (
    <Box
      component="span"
      className="component-iconify"
      sx={{
        width: 20,
        height: 20,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="solar:users-group-two-rounded-bold" width="100%" height="100%" />
    </Box>
  );
}
