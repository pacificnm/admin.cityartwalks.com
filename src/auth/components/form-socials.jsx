import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { SocialIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function FormSocials({
  sx,
  signInWithGoogle,
  singInWithGithub,
  signInWithTwitter,
  ...other
}) {
  return (
    <Box
      sx={[
        {
          gap: 1.5,
          display: 'flex',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconButton color="inherit" onClick={signInWithGoogle}>
        <SocialIcon platform="google" width={22} />
      </IconButton>
      <IconButton color="inherit" onClick={singInWithGithub}>
        <SocialIcon platform="github" width={22} />
      </IconButton>
      <IconButton color="inherit" onClick={signInWithTwitter}>
        <SocialIcon platform="twitter" width={22} />
      </IconButton>
    </Box>
  );
}
