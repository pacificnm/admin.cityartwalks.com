/**
 * @fileoverview Form element for art piece featured switch with descriptive labels
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */

import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceFeatured
 * @function ElementArtPieceFeatured
 * @description Form element for art piece featured status with descriptive labels.
 *
 * Features:
 * - Switch control for featured status
 * - Descriptive labels explaining the feature
 * - Integration with React Hook Form
 * - Error handling and validation support
 * - Customizable styling and placement
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="featured"] - The form field name for the featured status
 * @param {string} [props.title="Featured Art Piece"] - The main title for the switch
 * @param {string} [props.description="Featured Art Pieces display on main pages."] - The description text
 * @param {string} [props.labelPlacement="start"] - Placement of the label relative to switch
 * @param {boolean} [props.disabled=false] - Whether the switch is disabled
 * @param {Object} [props.sx] - Additional styling props for the switch
 * @param {Object} [...props.other] - Other props to pass to the Field.Switch component
 *
 * @returns {JSX.Element} The rendered art piece featured switch element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceFeatured />
 *
 * @example
 * // With custom labels
 * <ElementArtPieceFeatured
 *   name="featured"
 *   title="Featured Content"
 *   description="Mark this art piece as featured content."
 * />
 *
 * @example
 * // With custom styling
 * <ElementArtPieceFeatured
 *   sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
 *   disabled={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceFeatured(props) {
  const {
    name = 'featured',
    title = 'Featured Art Piece',
    description = 'Featured Art Pieces display on main pages.',
    labelPlacement = 'start',
    disabled = false,
    sx = { mx: 0, width: 1, justifyContent: 'space-between' },
    ...other
  } = props;

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Field.Switch
            {...field}
            name={name}
            labelPlacement={labelPlacement}
            disabled={disabled}
            helperText={error?.message}
            label={
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {description}
                </Typography>
              </>
            }
            sx={sx}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementArtPieceFeatured.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  labelPlacement: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
