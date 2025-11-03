/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Layouts.Components.SignInButton
 */

'use client';

import { useCallback } from 'react';
import { track } from '@vercel/analytics';

import Button from '@mui/material/Button';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

/**
 * SignInButton component renders a Material-UI Button that triggers Auth0 login with redirect.
 *
 * @function
 * @param {object} props - Component props.
 * @param {object} [props.sx] - The system prop for styling the button.
 * @param {any} [props.other] - Additional props passed to the Button component.
 * @returns {JSX.Element} The rendered SignInButton component.
 *
 * @example
 * <SignInButton sx={{ mt: 2 }} />
 *
 * @namespace CityArtWalks.Layouts.Components.SignInButton
 */
export function SignInButton({ sx, ...other }) {
  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const handleSignInWithRedirect = useCallback(async () => {
    track('sign_in_button', {
      action: 'sign_in_click',
      returnTo: returnTo || CONFIG.auth.redirectPath,
      source: 'layout_header',
    });

    try {
      // With Auth0 Next.js SDK, redirect to login API route
      const loginUrl = new URL('/api/auth/login', window.location.origin);
      if (returnTo) {
        loginUrl.searchParams.set('returnTo', returnTo);
      }
      window.location.href = loginUrl.toString();
    } catch (error) {
      console.error(error);
    }
  }, [returnTo]);

  return (
    <Button onClick={handleSignInWithRedirect} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
