import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ArrowDoubleUpIcon({ sx, ...other }) {
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
      <Iconify icon="solar:double-alt-arrow-up-bold" width="100%" height="100%" />
    </Box>
  );
}
