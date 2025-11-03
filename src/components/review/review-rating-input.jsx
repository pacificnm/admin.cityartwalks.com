/**
 * @namespace CityArtWalks.Components.Review.ReviewRatingInput
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StarIcon, StarOutlineIcon } from 'src/components/icons';

import ReviewErrorBoundary from './review-error-boundary';

/**
 * Rating labels for different star values
 */
const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

/**
 * @memberof CityArtWalks.Components.Review.ReviewRatingInput
 * @function ReviewRatingInput
 * @description Interactive rating input component with hover effects and labels.
 * Provides visual feedback and accessibility features for rating selection.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.value=0] - The current rating value.
 * @param {Function} props.onChange - Callback when rating changes.
 * @param {Function} [props.onHover] - Callback when hovering over stars.
 * @param {boolean} [props.readOnly=false] - Whether the rating is read-only.
 * @param {boolean} [props.disabled=false] - Whether the rating is disabled.
 * @param {string} [props.size='medium'] - Size of the rating stars.
 * @param {boolean} [props.showLabel=true] - Whether to show the rating label.
 * @param {boolean} [props.showValue=false] - Whether to show the numeric value.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.helperText] - Helper text to display.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The rendered ReviewRatingInput component.
 */
export function ReviewRatingInput({
  value = 0,
  onChange,
  onHover,
  readOnly = false,
  disabled = false,
  size = 'medium',
  showLabel = true,
  showValue = false,
  error,
  helperText,
  sx,
  ...other
}) {
  const [hover, setHover] = useState(-1);

  const handleChange = (_, newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleHover = (_, newHover) => {
    setHover(newHover);
    if (onHover) {
      onHover(newHover);
    }
  };

  const handleHoverLeave = () => {
    setHover(-1);
    if (onHover) {
      onHover(-1);
    }
  };

  // Determine which rating to show for label (hover takes precedence)
  const displayRating = hover !== -1 ? hover : value;
  const displayLabel = RATING_LABELS[displayRating] || '';

  // Size configurations
  const sizeConfig = {
    small: { fontSize: 20, spacing: 0.5 },
    medium: { fontSize: 24, spacing: 1 },
    large: { fontSize: 32, spacing: 1.5 },
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;

  return (
    <ReviewErrorBoundary
      name="ReviewRatingInput"
      context="rating_input"
      variant="inline"
      title="Rating Input Error"
      description="Unable to load the rating input. Please try refreshing the page."
    >
      <Box sx={{ ...sx }} {...other}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: currentSize.spacing }}>
          <Rating
            value={value}
            onChange={handleChange}
            onChangeActive={handleHover}
            onMouseLeave={handleHoverLeave}
            readOnly={readOnly}
            disabled={disabled}
            size={size}
            precision={1}
            icon={
              <StarIcon
                size={currentSize.fontSize}
                sx={{
                  color: error ? 'error.main' : 'warning.main',
                }}
              />
            }
            emptyIcon={
              <StarOutlineIcon
                size={currentSize.fontSize}
                sx={{
                  color: error ? 'error.light' : 'grey.300',
                }}
              />
            }
            sx={{
              '& .MuiRating-iconFilled': {
                color: error ? 'error.main' : 'warning.main',
              },
              '& .MuiRating-iconHover': {
                color: error ? 'error.dark' : 'warning.dark',
              },
              '& .MuiRating-iconEmpty': {
                color: error ? alpha('error.main', 0.3) : 'grey.300',
              },
              ...(disabled && {
                opacity: 0.6,
                pointerEvents: 'none',
              }),
            }}
          />

          {showValue && (
            <Typography
              variant="body2"
              color={error ? 'error.main' : 'text.secondary'}
              sx={{ minWidth: 24, fontWeight: 'medium' }}
            >
              {value > 0 ? `${value}/5` : '0/5'}
            </Typography>
          )}
        </Box>

        {/* Rating Label */}
        {showLabel && (
          <Box sx={{ mt: 1, minHeight: 20 }}>
            {displayLabel && (
              <Typography
                variant="body2"
                color={error ? 'error.main' : 'text.secondary'}
                sx={{
                  fontWeight: 'medium',
                  transition: 'all 0.2s ease-in-out',
                  opacity: displayRating > 0 ? 1 : 0,
                }}
              >
                {displayLabel}
              </Typography>
            )}
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
            {error}
          </Typography>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {helperText}
          </Typography>
        )}
      </Box>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewRatingInput
 * @prop {number} [value=0] - The current rating value. Optional.
 * @prop {Function} onChange - Callback when rating changes. Required.
 * @prop {Function} [onHover] - Callback when hovering over stars. Optional.
 * @prop {boolean} [readOnly=false] - Whether the rating is read-only. Optional.
 * @prop {boolean} [disabled=false] - Whether the rating is disabled. Optional.
 * @prop {string} [size='medium'] - Size of the rating stars. Optional.
 * @prop {boolean} [showLabel=true] - Whether to show the rating label. Optional.
 * @prop {boolean} [showValue=false] - Whether to show the numeric value. Optional.
 * @prop {string} [error] - Error message to display. Optional.
 * @prop {string} [helperText] - Helper text to display. Optional.
 * @prop {Object} [sx] - Additional styling props. Optional.
 */
ReviewRatingInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
  showValue: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  sx: PropTypes.object,
};
