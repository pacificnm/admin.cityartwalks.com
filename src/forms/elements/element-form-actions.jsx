/**
 * @namespace CityArtWalks.Forms.Elements.FormActions
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic form actions wrapper for consistent button layout
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 */

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import ErrorBoundary from 'src/components/error/error-boundary';

import { ElementCancelButton } from './element-cancel-button';
import { ElementSubmitButton } from './element-submit-button';

/**
 * @memberof CityArtWalks.Forms.Elements.FormActions
 * @function ElementFormActions
 * @description Generic form actions component that provides consistent button layout and behavior
 * across all forms. Includes cancel and submit buttons with proper spacing and alignment.
 *
 * This component ensures all forms have the same action button layout, spacing, and behavior,
 * creating a consistent user experience throughout the application.
 *
 * Features:
 * - Consistent button layout and spacing
 * - Right-aligned buttons (standard form pattern)
 * - Optional cancel button (shown when onCancel is provided)
 * - Configurable submit button labels for create/edit modes
 * - Responsive spacing
 * - Integrated with ElementCancelButton and ElementSubmitButton
 *
 * @param {Object} props - Component props
 * @param {Function} [props.onCancel] - Cancel handler function. If provided, shows cancel button
 * @param {boolean} [props.isEdit=false] - Whether the form is in edit mode (affects submit button label)
 * @param {string} [props.createLabel="Create"] - Submit button label for create mode
 * @param {string} [props.editLabel="Save changes"] - Submit button label for edit mode
 * @param {string} [props.submitLabel] - Custom submit button label that overrides create/edit labels
 * @param {number} [props.spacing=2] - Spacing between buttons
 * @param {Object} [props.sx] - Additional Material-UI sx styling props for the Stack container
 * @param {Object} [props.cancelButtonProps] - Additional props to pass to ElementCancelButton
 * @param {Object} [props.submitButtonProps] - Additional props to pass to ElementSubmitButton
 *
 * @returns {JSX.Element} The rendered form actions component
 *
 * @example
 * // Basic usage with cancel
 * <ElementFormActions
 *   onCancel={handleCancel}
 *   isEdit={isEdit}
 *   createLabel="Create image"
 * />
 *
 * @example
 * // Create mode only (no cancel)
 * <ElementFormActions
 *   createLabel="Create artist"
 * />
 *
 * @example
 * // Edit mode with custom labels
 * <ElementFormActions
 *   onCancel={handleCancel}
 *   isEdit={true}
 *   editLabel="Update profile"
 * />
 *
 * @example
 * // Custom styling
 * <ElementFormActions
 *   onCancel={handleCancel}
 *   isEdit={isEdit}
 *   createLabel="Create post"
 *   spacing={3}
 *   sx={{ mt: 4 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementFormActions({
  onCancel,
  isEdit = false,
  createLabel = 'Create',
  editLabel = 'Save changes',
  submitLabel,
  spacing = 2,
  sx,
  cancelButtonProps,
  submitButtonProps,
  ...other
}) {
  return (
    <ErrorBoundary>
      <Stack
        direction="row"
        spacing={spacing}
        sx={{
          mt: 3,
          justifyContent: 'flex-end',
          ...sx,
        }}
        {...other}
      >
        {onCancel && <ElementCancelButton onClick={onCancel} {...cancelButtonProps} />}
        <ElementSubmitButton
          isEdit={isEdit}
          createLabel={createLabel}
          editLabel={editLabel}
          label={submitLabel}
          {...submitButtonProps}
        />
      </Stack>
    </ErrorBoundary>
  );
}

ElementFormActions.propTypes = {
  onCancel: PropTypes.func,
  isEdit: PropTypes.bool,
  createLabel: PropTypes.string,
  editLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  spacing: PropTypes.number,
  sx: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  submitButtonProps: PropTypes.object,
};
