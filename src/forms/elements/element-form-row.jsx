/**
 * @namespace CityArtWalks.Forms.Elements.FormRow
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic form row component for consistent grid layout
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 */

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.FormRow
 * @function ElementFormRow
 * @description Generic form row component that provides consistent grid layout for form fields.
 * Creates a responsive grid that adapts to different screen sizes.
 *
 * This component ensures all forms have consistent field spacing and responsive behavior,
 * making forms look uniform across the entire application.
 *
 * Features:
 * - Responsive grid layout (stacks on mobile, columns on larger screens)
 * - Configurable column count for different screen sizes
 * - Consistent row and column gaps
 * - Flexible grid system
 * - Accepts children as form fields
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form fields to render in the grid
 * @param {number} [props.columns=2] - Number of columns on small screens and up (sm breakpoint)
 * @param {number} [props.columnsXs=1] - Number of columns on extra small screens (xs breakpoint)
 * @param {number} [props.columnsMd] - Number of columns on medium screens (md breakpoint)
 * @param {number} [props.columnsLg] - Number of columns on large screens (lg breakpoint)
 * @param {number} [props.rowGap=3] - Gap between rows (in theme spacing units)
 * @param {number} [props.columnGap=2] - Gap between columns (in theme spacing units)
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} [...props.other] - Other props to pass to the Box component
 *
 * @returns {JSX.Element} The rendered form row component
 *
 * @example
 * // Basic 2-column layout (default)
 * <ElementFormRow>
 *   <Field.Text name="firstName" label="First Name" />
 *   <Field.Text name="lastName" label="Last Name" />
 * </ElementFormRow>
 *
 * @example
 * // Single column layout
 * <ElementFormRow columns={1}>
 *   <Field.Text name="description" label="Description" multiline rows={4} />
 * </ElementFormRow>
 *
 * @example
 * // Three columns on medium screens and up
 * <ElementFormRow columns={2} columnsMd={3}>
 *   <Field.Text name="field1" />
 *   <Field.Text name="field2" />
 *   <Field.Text name="field3" />
 * </ElementFormRow>
 *
 * @example
 * // Custom gaps
 * <ElementFormRow rowGap={4} columnGap={3}>
 *   <Field.Text name="field1" />
 *   <Field.Text name="field2" />
 * </ElementFormRow>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementFormRow({
  children,
  columns = 2,
  columnsXs = 1,
  columnsMd,
  columnsLg,
  rowGap = 3,
  columnGap = 2,
  sx,
  ...other
}) {
  // Build gridTemplateColumns object based on provided props
  const gridTemplateColumns = {
    xs: `repeat(${columnsXs}, 1fr)`,
    sm: `repeat(${columns}, 1fr)`,
  };

  if (columnsMd !== undefined) {
    gridTemplateColumns.md = `repeat(${columnsMd}, 1fr)`;
  }

  if (columnsLg !== undefined) {
    gridTemplateColumns.lg = `repeat(${columnsLg}, 1fr)`;
  }

  return (
    <ErrorBoundary>
      <Box
        sx={{
          rowGap,
          columnGap,
          display: 'grid',
          gridTemplateColumns,
          ...sx,
        }}
        {...other}
      >
        {children}
      </Box>
    </ErrorBoundary>
  );
}

ElementFormRow.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number,
  columnsXs: PropTypes.number,
  columnsMd: PropTypes.number,
  columnsLg: PropTypes.number,
  rowGap: PropTypes.number,
  columnGap: PropTypes.number,
  sx: PropTypes.object,
};
