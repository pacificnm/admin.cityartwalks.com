/* eslint-disable @next/next/no-html-link-for-pages */
/**
 * @file error-boundary.jsx
 * @description React error boundary component that catches JavaScript errors and displays fallback UI
 * @namespace CityArtWalks.Components.Error.ErrorBoundary
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { ServerErrorIllustration } from 'src/assets/illustrations';

/**
 * React Error Boundary class component that catches JavaScript errors anywhere in the child component tree.
 * Logs error information and displays a fallback UI instead of crashing the entire application.
 *
 * @class ErrorBoundary
 * @memberof CityArtWalks.Components.Error.ErrorBoundary
 * @extends React.Component
 *
 * @example
 * // Wrap components that might throw errors
 * <ErrorBoundary fallback="Custom error message">
 *   <SomeComponentThatMightThrow />
 * </ErrorBoundary>
 *
 * @see {@link https://reactjs.org/docs/error-boundaries.html} - React Error Boundaries documentation
 */
export class ErrorBoundary extends React.Component {
  /**
   * Constructor for ErrorBoundary component.
   * Initializes the error state.
   *
   * @memberof CityArtWalks.Components.Error.ErrorBoundary
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components to render
   * @param {React.ReactNode} [props.fallback] - Custom fallback message to display on error
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static method that returns state update to indicate an error has occurred.
   * This lifecycle method is called when an error is thrown during rendering.
   *
   * @static
   * @memberof CityArtWalks.Components.Error.ErrorBoundary
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object with hasError set to true
   *
   * @see {@link https://reactjs.org/docs/error-boundaries.html#static-getderivedstatefromerror} - React docs
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught by the error boundary.
   * Logs the error to the console and updates component state with error details.
   *
   * @memberof CityArtWalks.Components.Error.ErrorBoundary
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Object containing componentStack information
   * @param {string} errorInfo.componentStack - Stack trace of React components
   *
   * @example
   * // Error and errorInfo will be automatically passed by React
   * // when an error occurs in child components
   */
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * Renders the error boundary component.
   * Shows error UI if an error occurred, otherwise renders children normally.
   *
   * @memberof CityArtWalks.Components.Error.ErrorBoundary
   * @returns {React.ReactElement} Error UI or children components
   *
   * @description
   * In error state, renders:
   * - Error message with illustration
   * - Development-only debug information (error details, stack traces)
   * - Return to home button
   *
   * In normal state, renders:
   * - Child components as-is
   */
  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const { error, errorInfo } = this.state;

      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h3" gutterBottom>
            Something went wrong
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            {this.props.fallback || 'An unexpected error occurred. Please try again later.'}
          </Typography>
          <ServerErrorIllustration sx={{ height: 220, my: { xs: 4, sm: 6 }, mx: 'auto' }} />

          {/* Debug Information for Development */}
          {isDevelopment && (
            <Box sx={{ mt: 4, textAlign: 'left', maxWidth: '800px', mx: 'auto' }}>
              <Accordion>
                <AccordionSummary sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
                  <Typography variant="h6">
                    🐛 Error Boundary Debug Info (Development Only)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ p: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        React Error Boundary Caught an Error
                      </Typography>
                    </Alert>

                    {error?.message && (
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
                          {error.message}
                        </Typography>
                      </Box>
                    )}

                    {error?.stack && (
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
                          {error.stack}
                        </Typography>
                      </Box>
                    )}

                    {errorInfo?.componentStack && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="error" gutterBottom>
                          Component Stack:
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
                          {errorInfo.componentStack}
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

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        console.log('Full Error Object:', error);
                        console.log('Error Info:', errorInfo);
                      }}
                      sx={{ mr: 2 }}
                    >
                      Log to Console
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
                window.location.reload();
              }}
              style={{
                padding: '10px 24px',
                fontSize: '1rem',
                borderRadius: 8,
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Return to Home
            </a>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * PropTypes validation for ErrorBoundary component.
 *
 * @memberof CityArtWalks.Components.Error.ErrorBoundary
 * @type {Object}
 * @property {React.ReactNode} children - Required. Child components to render
 * @property {React.ReactNode} fallback - Optional. Custom fallback message for error state
 */
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;
