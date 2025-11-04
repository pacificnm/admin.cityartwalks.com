/**
 * @namespace CityArtWalks.Forms.Elements.CancelButton
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic cancel button element for forms
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 */

import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import Button from '@mui/material/Button';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.CancelButton
 * @function ElementCancelButton
 * @description Generic cancel button component for forms with consistent styling and behavior.
 *
 * This component provides a standardized cancel button that integrates with React Hook Form
 * to handle form cancellation. It automatically disables during form submission and can
 * execute custom cancel handlers.
 *
 * Features:
 * - Automatic disable during form submission
 * - Consistent outlined button styling
 * - Custom onClick handler support
 * - Accessible button controls
 * - Configurable label and appearance
 * - React Hook Form integration
 *
 * @param {Object} props - Component props
 * @param {Function} [props.onClick] - Custom click handler for cancel action
 * @param {string} [props.label="Cancel"] - Button label text
 * @param {boolean} [props.disabled=false] - Additional disabled state (combined with form submission state)
 * @param {string} [props.variant="outlined"] - Button variant (outlined, contained, text)
 * @param {string} [props.color="inherit"] - Button color
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} [...props.other] - Additional props passed to the Button component
 *
 * @returns {JSX.Element} The rendered cancel button element
 *
 * @example
 * // Basic usage
 * <ElementCancelButton onClick={handleCancel} />
 *
 * @example
 * // Custom label
 * <ElementCancelButton
 *   onClick={handleCancel}
 *   label="Go Back"
 * />
 *
 * @example
 * // Custom styling
 * <ElementCancelButton
 *   onClick={handleCancel}
 *   variant="text"
 *   color="error"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementCancelButton({
  onClick,
  label = 'Cancel',
  disabled = false,
  variant = 'outlined',
  color = 'inherit',
  sx,
  ...other
}) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <ErrorBoundary>
      <Button
        variant={variant}
        color={color}
        onClick={onClick}
        disabled={disabled || isSubmitting}
        sx={sx}
        {...other}
      >
        {label}
      </Button>
    </ErrorBoundary>
  );
}

ElementCancelButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
  ]),
  sx: PropTypes.object,
};
