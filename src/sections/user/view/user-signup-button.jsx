/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Layouts.Components.SignUpButton
 */

'use client';

import { useCallback } from 'react';
import { track } from '@vercel/analytics';

import Button from '@mui/material/Button';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

/**
 * SignUpButton component renders a Material-UI Button that links to Auth0 Universal Login
 * in sign-up mode using screen_hint=signup.
 *
 * @function
 * @param {object} props - Component props.
 * @param {object} [props.sx] - The system prop for styling the button.
 * @param {any} [props.other] - Additional props passed to the Button component.
 * @returns {JSX.Element} The rendered SignUpButton component.
 *
 * @example
 * <UserSignUpButton sx={{ mt: 2 }} />
 *
 * @namespace CityArtWalks.Layouts.Components.SignUpButton
 */
export function UserSignUpButton({ sx, ...other }) {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth0.callbackUrl;

  const handleSignUpRedirect = useCallback(() => {
    track('user_signup_button', {
      action: 'signup_click',
      returnTo,
      source: 'signup_dialog',
    });

    try {
      const signupUrl =
        `${CONFIG.auth0.domain}/authorize?` +
        `response_type=code&client_id=${CONFIG.auth0.clientId}&redirect_uri=${encodeURIComponent(returnTo)}` +
        `&scope=openid%20profile%20email&screen_hint=signup`;

      window.location.href = signupUrl;
    } catch (error) {
      console.error(error);
    }
  }, [returnTo]);

  return (
    <Button
      onClick={handleSignUpRedirect}
      variant="contained"
      size="large"
      fullWidth
      startIcon={<Iconify icon="solar:user-plus-bold" />}
      sx={{
        py: 1.5,
        fontSize: '1.1rem',
        fontWeight: 'bold',
      }}
      {...other}
    >
      Sign Up Free
    </Button>
  );
}
