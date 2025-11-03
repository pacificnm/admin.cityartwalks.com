/**
 * @namespace CityArtWalks.Forms.Elements.ArtPieceType
 * @version 2.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for selecting art piece types with create functionality
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, MenuItem, TextField, CircularProgress } from '@mui/material';

import { debugError } from 'src/lib/debug';
import { useGetPaginatedArtPieceTypes } from 'src/actions/art-piece-type/hooks';

import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceType
 * @function ElementArtPieceType
 * @description Form element component for selecting art piece types with inline creation capability.
 *
 * This component provides a dropdown select for art piece types with the ability to create new types
 * through an integrated dialog. Uses proper hooks for data fetching and state management.
 *
 * Features:
 * - Dropdown selection of existing art piece types
 * - Inline creation of new types via dialog
 * - Loading and error state handling
 * - Authentication-aware functionality
 * - Form validation integration
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.native=false] - Whether to use native HTML select element
 * @param {Object} [props.slotProps] - Additional props to pass to the Menu component
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.inputProps] - Additional props to pass to the input element
 * @param {Object} [props.InputLabelProps] - Additional props to pass to the InputLabel component
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered art piece type selection element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceType />
 *
 * @example
 * // With additional props
 * <ElementArtPieceType
 *   helperText="Select the type of art piece"
 *   native={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 */
export function ElementArtPieceType(props) {
  const { native, slotProps, helperText, inputProps, InputLabelProps, ...other } = props;

  const { control } = useFormContext();
  const { accessToken, userIsLoading } = useAuthContext();

  const labelId = `art-piece-type-select-label`;

  // Use the proper hook for fetching art piece types
  // Using a large page size to get all types for the dropdown
  const { artPieceTypes, artPieceTypesLoading, artPieceTypesError } = useGetPaginatedArtPieceTypes(
    {},
    1,
    100,
    '',
    600
  ); // Use empty token for public endpoint

  // Extract the data array from the paginated response
  const data = artPieceTypes || [];

  if (artPieceTypesLoading || userIsLoading) {
    return (
      <TextField
        fullWidth
        label="Type"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (artPieceTypesError) {
    if (artPieceTypesError) {
      debugError(
        'CityArtWalks.Forms.Elements.ArtPieceType.ElementArtPieceType',
        'Failed to fetch art piece types',
        {
          error: artPieceTypesError.message || artPieceTypesError,
          hasAccessToken: !!accessToken,
        }
      );
    }

    return (
      <TextField
        fullWidth
        label="Type"
        disabled
        helperText="Error loading art piece types."
        error
      />
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
        <Controller
          name="artPieceType"
          control={control}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              value={field.value || ''}
              select
              fullWidth
              label="Type"
              slotProps={{
                select: {
                  native,
                  MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
                  sx: { textTransform: 'capitalize' },
                },
                inputLabel: { htmlFor: labelId, ...InputLabelProps },
                input: { id: labelId, ...inputProps },
              }}
              error={!!fieldError}
              helperText={fieldError ? fieldError.message : helperText}
              {...other}
            >
              <MenuItem value="">
                <em>SELECT TYPE</em>
              </MenuItem>
              {Array.isArray(data) &&
                data.map((type) => (
                  <MenuItem key={type.artPieceTypeId} value={type.name.toUpperCase()}>
                    {type.name}
                  </MenuItem>
                ))}
            </TextField>
          )}
        />
      </Box>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceType
 * @prop {boolean} [native=false] - Whether to use native HTML select element. This prop is optional.
 * @prop {Object} [slotProps] - Additional props to pass to the Menu component. This prop is optional.
 * @prop {string} [helperText] - Helper text to display below the input field. This prop is optional.
 * @prop {Object} [inputProps] - Additional props to pass to the input element. This prop is optional.
 * @prop {Object} [InputLabelProps] - Additional props to pass to the InputLabel component. This prop is optional.
 */
ElementArtPieceType.propTypes = {
  native: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
