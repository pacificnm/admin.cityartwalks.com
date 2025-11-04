/**
 * @namespace CityArtWalks.Forms.Elements.FormDivider
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic form divider component for consistent section separation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 */

import PropTypes from 'prop-types';

import Divider from '@mui/material/Divider';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.FormDivider
 * @function ElementFormDivider
 * @description Generic form divider component that provides consistent spacing and styling
 * for separating form sections. Creates visual separation between different groups of form fields.
 *
 * This component ensures all forms have consistent section spacing and divider styling,
 * making forms look uniform across the entire application.
 *
 * Features:
 * - Consistent vertical margin spacing
 * - Standard Material-UI divider styling
 * - Configurable margin
 * - Flexible styling options
 *
 * @param {Object} props - Component props
 * @param {number} [props.my=3] - Vertical margin (top and bottom) in theme spacing units
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} [...props.other] - Other props to pass to the Divider component
 *
 * @returns {JSX.Element} The rendered form divider component
 *
 * @example
 * // Basic usage with default margin
 * <ElementFormDivider />
 *
 * @example
 * // Custom vertical margin
 * <ElementFormDivider my={4} />
 *
 * @example
 * // Custom styling
 * <ElementFormDivider
 *   sx={{ borderColor: 'primary.main', borderWidth: 2 }}
 * />
 *
 * @example
 * // Typical usage in a form
 * <ElementFormRow>
 *   <Field.Text name="field1" />
 * </ElementFormRow>
 * 
 * <ElementFormDivider />
 * 
 * <ElementFormRow>
 *   <Field.Text name="field2" />
 * </ElementFormRow>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementFormDivider({ my = 3, sx, ...other }) {
  return (
    <ErrorBoundary>
      <Divider
        sx={{
          my,
          ...sx,
        }}
        {...other}
      />
    </ErrorBoundary>
  );
}

ElementFormDivider.propTypes = {
  my: PropTypes.number,
  sx: PropTypes.object,
};
