import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/global-config';
import { varAlpha, bgGradient } from 'src/theme/styles';

// ----------------------------------------------------------------------

export function ComponentHero({ children, sx, ...other }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 5,
        minHeight: 240,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      {children}

      <Box
        sx={{
          ...bgGradient({
            color: `0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.9)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.9)}`,
            imgUrl: `${CONFIG.assetsDir}/assets/images/about/hero.webp`,
          }),
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          zIndex: -1,
          position: 'absolute',
          transform: 'scaleX(-1)',
        }}
      />
    </Box>
  );
}
