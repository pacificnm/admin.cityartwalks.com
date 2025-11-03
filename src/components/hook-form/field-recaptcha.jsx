/**
 * ReCAPTCHA field component for React Hook Form integration
 *
 * This component provides a reCAPTCHA field that integrates seamlessly with React Hook Form
 * for form validation and submission. Handles both reCAPTCHA v2 (checkbox) and provides
 * proper error handling and validation feedback.
 *
 * @namespace CityArtWalks.Components.HookForm
 * @fileoverview ReCAPTCHA field component for form security validation
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires react-google-recaptcha - Google reCAPTCHA React component
 * @requires react-hook-form - Form state management and validation
 * @requires @mui/material - Material-UI components for styling
 *
 * @see {@link https://developers.google.com/recaptcha/docs/display} - Google reCAPTCHA documentation
 * @see {@link https://github.com/dozoisch/react-google-recaptcha} - React Google reCAPTCHA library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Security} - Security documentation
 */

'use client';

import { useRef, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useController } from 'react-hook-form';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

import { CONFIG } from 'src/global-config';

/**
 * ReCAPTCHA field component with React Hook Form integration
 *
 * Provides a Google reCAPTCHA widget that integrates with React Hook Form for
 * validation and error handling. Supports both light and dark themes and
 * provides proper accessibility features.
 *
 * @memberof CityArtWalks.Components.HookForm
 * @function FieldReCaptcha
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for React Hook Form registration
 * @param {string} [props.helperText] - Optional helper text to display below the field
 * @param {Object} [props.sx] - Material-UI sx prop for custom styling
 * @param {string} [props.size='normal'] - Size of the reCAPTCHA widget ('compact' or 'normal')
 * @param {string} [props.theme='light'] - Theme for the reCAPTCHA widget ('light' or 'dark')
 * @param {Function} [props.onVerify] - Optional callback when reCAPTCHA is verified
 * @param {Function} [props.onExpired] - Optional callback when reCAPTCHA expires
 * @param {Function} [props.onError] - Optional callback when reCAPTCHA encounters an error
 * @param {Object} [props...other] - Additional props passed to the reCAPTCHA component
 * @returns {JSX.Element} The rendered ReCAPTCHA field component
 *
 * @example
 * // Basic usage in a form
 * <Form methods={methods} onSubmit={onSubmit}>
 *   <FieldReCaptcha
 *     name="captchaToken"
 *     helperText="Please verify you're not a robot"
 *   />
 * </Form>
 *
 * @example
 * // With custom callbacks
 * <FieldReCaptcha
 *   name="captchaToken"
 *   onVerify={(token) => console.log('Verified:', token)}
 *   onExpired={() => console.log('Expired')}
 *   onError={(error) => console.error('Error:', error)}
 * />
 *
 * @see {@link https://developers.google.com/recaptcha/docs/display} - reCAPTCHA display documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Security} - Security implementation guide
 */
export const FieldReCaptcha = forwardRef(
  (
    {
      name,
      helperText,
      sx,
      size = 'normal',
      theme: recaptchaTheme,
      onVerify,
      onExpired,
      onError,
      ...other
    },
    ref
  ) => {
    const muiTheme = useTheme();
    const internalRef = useRef(null);

    // Use Material-UI theme to determine reCAPTCHA theme if not specified
    const effectiveTheme = recaptchaTheme || (muiTheme.palette.mode === 'dark' ? 'dark' : 'light');

    // Get reCAPTCHA site key from global configuration
    const siteKey = CONFIG.recaptcha.siteKey;

    const {
      field,
      fieldState: { error },
    } = useController({ name });

    // Note: Removed useEffect that was clearing token - this interfered with captcha functionality

    /**
     * Handles reCAPTCHA verification completion
     * @param {string|null} token - The reCAPTCHA token or null if verification failed
     */
    const handleVerify = (token) => {
      console.log('ReCAPTCHA token received:', token ? 'Token generated' : 'No token');
      field.onChange(token);
      if (onVerify && typeof onVerify === 'function') {
        onVerify(token);
      }
    };

    /**
     * Handles reCAPTCHA expiration
     */
    const handleExpired = () => {
      console.log('ReCAPTCHA expired - clearing token');
      field.onChange('');
      if (onExpired && typeof onExpired === 'function') {
        onExpired();
      }
    };

    /**
     * Handles reCAPTCHA errors
     */
    const handleError = () => {
      console.log('ReCAPTCHA error - clearing token');
      field.onChange('');
      if (onError && typeof onError === 'function') {
        onError();
      }
    };

    // Show error if site key is not configured
    if (!siteKey) {
      return (
        <Box sx={sx}>
          <FormHelperText
            error
            sx={{
              color: 'error.main',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            reCAPTCHA is not configured. Please contact support.
          </FormHelperText>
        </Box>
      );
    }

    return (
      <Box sx={sx}>
        <ReCAPTCHA
          ref={ref || internalRef}
          sitekey={siteKey}
          size={size}
          theme={effectiveTheme}
          onChange={handleVerify}
          onExpired={handleExpired}
          onErrored={handleError}
          {...other}
        />

        {/* Helper text or error message */}
        {(helperText || error) && (
          <FormHelperText
            error={Boolean(error)}
            sx={{
              mt: 1,
              mx: 0,
              fontSize: '0.75rem',
              ...(error && {
                color: 'error.main',
                fontWeight: 500,
              }),
            }}
          >
            {error ? error.message : helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

FieldReCaptcha.displayName = 'FieldReCaptcha';
