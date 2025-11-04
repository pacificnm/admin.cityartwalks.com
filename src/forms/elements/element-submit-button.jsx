/**
 * @namespace CityArtWalks.Forms.Elements.SubmitButton
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic submit button element for forms
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 */

import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import Button from '@mui/material/Button';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.SubmitButton
 * @function ElementSubmitButton
 * @description Generic submit button component for forms with consistent styling and behavior.
 *
 * This component provides a standardized submit button that integrates with React Hook Form
 * to handle form submission. It automatically disables during form submission and shows
 * loading state. Supports different labels for create vs edit modes.
 *
 * Features:
 * - Automatic disable during form submission
 * - Loading state indicator
 * - Consistent contained button styling
 * - Different labels for create/edit modes
 * - Accessible button controls
 * - React Hook Form integration
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.isEdit=false] - Whether the form is in edit mode
 * @param {string} [props.createLabel="Create"] - Button label for create mode
 * @param {string} [props.editLabel="Save changes"] - Button label for edit mode
 * @param {string} [props.label] - Custom label that overrides create/edit labels
 * @param {boolean} [props.disabled=false] - Additional disabled state (combined with form submission state)
 * @param {string} [props.variant="contained"] - Button variant
 * @param {string} [props.color="primary"] - Button color
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} [...props.other] - Additional props passed to the Button component
 *
 * @returns {JSX.Element} The rendered submit button element
 *
 * @example
 * // Basic usage in create mode
 * <ElementSubmitButton />
 *
 * @example
 * // Edit mode with entity name
 * <ElementSubmitButton
 *   isEdit={isEdit}
 *   createLabel="Create image"
 *   editLabel="Save changes"
 * />
 *
 * @example
 * // Custom label
 * <ElementSubmitButton
 *   label="Submit Form"
 * />
 *
 * @example
 * // Custom styling
 * <ElementSubmitButton
 *   isEdit={true}
 *   color="success"
 *   sx={{ minWidth: 150 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementSubmitButton({
  isEdit = false,
  createLabel = 'Create',
  editLabel = 'Save changes',
  label,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  sx,
  ...other
}) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  // Determine the label to display
  const displayLabel = label || (isEdit ? editLabel : createLabel);

  return (
    <ErrorBoundary>
      <Button
        type="submit"
        variant={variant}
        color={color}
        loading={isSubmitting}
        disabled={disabled || isSubmitting}
        sx={sx}
        {...other}
      >
        {displayLabel}
      </Button>
    </ErrorBoundary>
  );
}

ElementSubmitButton.propTypes = {
  isEdit: PropTypes.bool,
  createLabel: PropTypes.string,
  editLabel: PropTypes.string,
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
