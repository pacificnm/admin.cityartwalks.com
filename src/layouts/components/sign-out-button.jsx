import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

// Since we're only using Auth0, no fallback signOut function needed
// Auth0 sign-out is handled by the useAuth0 hook in the component below

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }) {
  const handleLogoutAuth0 = useCallback(async () => {
    try {
      // With Auth0 Next.js SDK, redirect to logout API route
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, []);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogoutAuth0}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
