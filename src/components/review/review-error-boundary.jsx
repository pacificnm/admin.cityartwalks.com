/**
 * @namespace CityArtWalks.Components.Review.ReviewErrorBoundary
 * @version 1.0.0
 * @author Jaimie Garner
 * @description Specialized error boundary for review components with review-specific fallbacks
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { debugError } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { RefreshIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.ReviewErrorBoundary
 * @class ReviewErrorBoundary
 * @description Specialized error boundary for review system components.
 * Provides review-specific fallback UI and error tracking.
 *
 * @extends React.Component
 */
export class ReviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    debugError('ReviewErrorBoundary.componentDidCatch', 'Review component error caught', {
      error: error.message,
      componentStack: errorInfo?.componentStack,
      errorBoundaryName: this.props.name || 'Unknown',
    });

    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    debugError('ReviewErrorBoundary', 'Component error caught', {
      error: error.message,
      componentName: this.props.name || 'ReviewComponent',
      context: this.props.context || 'unknown',
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional retry callback
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      const {
        fallback,
        variant = 'card',
        showRetry = true,
        title,
        description,
        icon = 'solar:danger-triangle-bold',
      } = this.props;

      // If custom fallback provided, use it
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback(this.state.error, this.handleRetry)
          : fallback;
      }

      // Default fallback based on variant
      const errorContent = (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Iconify
            icon={icon}
            sx={{
              fontSize: 48,
              color: 'error.main',
              mb: 2,
              display: 'block',
              mx: 'auto',
            }}
          />

          <Typography variant="h6" color="error.main" gutterBottom>
            {title || 'Review Error'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description || 'There was an error loading this review component. Please try again.'}
          </Typography>

          {showRetry && (
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleRetry}
              startIcon={<RefreshIcon />}
              size="small"
            >
              Try Again
            </Button>
          )}

          {/* Development mode error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="caption" component="div">
                <strong>Error:</strong> {this.state.error.message}
              </Typography>
              {this.props.name && (
                <Typography variant="caption" component="div">
                  <strong>Component:</strong> {this.props.name}
                </Typography>
              )}
            </Alert>
          )}
        </Box>
      );

      // Wrap in card if variant is 'card'
      if (variant === 'card') {
        return (
          <Card>
            <CardContent>{errorContent}</CardContent>
          </Card>
        );
      }

      // Return bare content for 'inline' variant
      return errorContent;
    }

    return this.props.children;
  }
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewErrorBoundary
 * @prop {React.ReactNode} children - Child components to wrap. Required.
 * @prop {string} [name] - Name of the component for error tracking. Optional.
 * @prop {string} [context] - Context of user action for error tracking. Optional.
 * @prop {React.ReactNode|Function} [fallback] - Custom fallback UI or function. Optional.
 * @prop {string} [variant='card'] - Display variant ('card' or 'inline'). Optional.
 * @prop {boolean} [showRetry=true] - Whether to show retry button. Optional.
 * @prop {Function} [onRetry] - Callback when retry is clicked. Optional.
 * @prop {string} [title] - Custom error title. Optional.
 * @prop {string} [description] - Custom error description. Optional.
 * @prop {string} [icon] - Custom error icon. Optional.
 */
ReviewErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
  context: PropTypes.string,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  variant: PropTypes.oneOf(['card', 'inline']),
  showRetry: PropTypes.bool,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
};

/**
 * @memberof CityArtWalks.Components.Review.ReviewErrorBoundary
 * @function withReviewErrorBoundary
 * @description Higher-order component to wrap components with ReviewErrorBoundary
 *
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} [boundaryProps] - Props to pass to error boundary
 * @returns {React.Component} Wrapped component with error boundary
 */
export function withReviewErrorBoundary(WrappedComponent, boundaryProps = {}) {
  const WithErrorBoundary = React.forwardRef((props, ref) => (
    <ReviewErrorBoundary
      name={WrappedComponent.displayName || WrappedComponent.name}
      {...boundaryProps}
    >
      <WrappedComponent ref={ref} {...props} />
    </ReviewErrorBoundary>
  ));

  WithErrorBoundary.displayName = `withReviewErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundary;
}

export default ReviewErrorBoundary;
