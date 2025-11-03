import { useTheme } from '@mui/material/styles';
import { Box, Stack, Avatar, ListItemText } from '@mui/material';

import { varAlpha, bgGradient } from 'src/theme/styles';

export function ProfileHeader({ headerImage, avatarImage, avatarName }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(theme.vars.palette.primary.darkChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkChannel, 0.8)}`,
          imgUrl: headerImage,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          alt={avatarName}
          src={avatarImage}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        >
          {avatarName?.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={avatarName}
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
