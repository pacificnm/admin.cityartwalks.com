import Box from '@mui/material/Box';

import { RestartIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function RestoreIcon({ sx, ...other }) {
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
      <RestartIcon width="100%" height="100%" />
    </Box>
  );
}
