/**
 * @file error-view.jsx
 * @description Error view component that renders different error states based on HTTP status codes
 * @namespace CityArtWalks.Components.Error.ErrorView
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import {
  ForbiddenIllustration,
  ServerErrorIllustration,
  PageNotFoundIllustration,
} from 'src/assets/illustrations';

/**
 * ErrorView component renders specific error views based on HTTP status codes.
 * Displays appropriate illustrations and messages for different error types (404, 403, 500, etc.).
 * Includes development-only debug information for troubleshooting.
 *
 * @function ErrorView
 * @memberof CityArtWalks.Components.Error.ErrorView
 * @param {Object} props - The component properties
 * @param {string} [props.message] - Custom error message to display
 * @param {number} [props.status] - HTTP status code (404, 403, 500, etc.)
 * @param {Error} [props.error] - Error object for debugging purposes
 * @param {string} [props.stack] - Stack trace for debugging
 * @returns {JSX.Element} The rendered error view with appropriate illustration and message
 *
 * @example
 * // Basic 404 error
 * <ErrorView status={404} message="Page not found" />
 *
 * @example
 * // Server error with debug info
 * <ErrorView
 *   status={500}
 *   message="Internal server error"
 *   error={errorObject}
 *   stack={errorStack}
 * />
 *
 * @description Supported status codes:
 * - 404: Page Not Found with PageNotFoundIllustration
 * - 403: Forbidden with ForbiddenIllustration
 * - 500: Server Error with ServerErrorIllustration
 * - Default: Generic error with ServerErrorIllustration
 */
export function ErrorView({ message, status, error, stack }) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  console.error('ErrorView:', { status, message, error, stack });

  /**
   * DebugInfo component that displays development-only debugging information.
   * Shows error details, stack traces, and environment information in an accordion.
   * Only rendered in development mode for security and performance reasons.
   *
   * @function DebugInfo
   * @memberof CityArtWalks.Components.Error.ErrorView
   * @returns {JSX.Element|null} Debug information accordion or null in production
   *
   * @description Debug information includes:
   * - HTTP status code
   * - Error message
   * - Full error object (serialized)
   * - Stack trace
   * - Environment details (URL, User Agent, timestamp)
   */
  const DebugInfo = () => {
    if (!isDevelopment) return null;

    return (
      <Box sx={{ mt: 4, textAlign: 'left', maxWidth: '800px', mx: 'auto' }}>
        <Accordion>
          <AccordionSummary sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
            <Typography variant="h6">🐛 Debug Information (Development Only)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  This debug information is only shown in development mode
                </Typography>
              </Alert>

              {status && (
                <Box sx={{ mb: 2 }}>
                  <Chip label={`Status: ${status}`} color="error" variant="outlined" />
                </Box>
              )}

              {message && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Error Message:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message}
                  </Typography>
                </Box>
              )}

              {error && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Error Object:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.75rem',
                    }}
                  >
                    {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
                  </Typography>
                </Box>
              )}

              {(stack || error?.stack) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Stack Trace:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      fontSize: '0.75rem',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                  >
                    {stack || error?.stack}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Environment Info:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                  }}
                >
                  {`URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}\n`}
                  {`User Agent: ${typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}\n`}
                  {`Timestamp: ${new Date().toISOString()}\n`}
                  {`Node ENV: ${process.env.NODE_ENV}`}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  if (status === 500) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Server Error
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          {message || '500 Internal server error'}
        </Typography>
        <ServerErrorIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
        <DebugInfo />
      </Box>
    );
  }

  if (status === 404) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Page Not Found
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {message ||
            "Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be sure to check your spelling."}
        </Typography>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
        <DebugInfo />
      </Box>
    );
  }

  if (status === 403) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Forbidden
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {message || 'You do not have the necessary permissions to access this page.'}
        </Typography>
        <ForbiddenIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
        <DebugInfo />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        {message || 'There was an unknown Error'}
      </Typography>
      <ServerErrorIllustration
        sx={{
          height: 260,
          my: { xs: 5, sm: 10 },
        }}
      />
      <DebugInfo />
    </Box>
  );
}

/**
 * PropTypes for ErrorView component
 * @memberof CityArtWalks.Components.Error.ErrorView
 */
ErrorView.propTypes = {
  /**
   * Custom error message to display
   */
  message: PropTypes.string,

  /**
   * HTTP status code (404, 403, 500, etc.)
   */
  status: PropTypes.number,

  /**
   * Error object for debugging purposes
   */
  error: PropTypes.instanceOf(Error),

  /**
   * Stack trace for debugging
   */
  stack: PropTypes.string,
};
