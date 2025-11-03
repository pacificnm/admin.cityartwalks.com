/**
 * @namespace CityArtWalks.Form.Element.ArtPiece.Materials
 * @version 1.0.0.0
 * @author [Jaimie Garner]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import { Box, Chip, CircularProgress } from '@mui/material';

import { useGetPaginatedArtPieceMaterials } from 'src/actions/art-piece-materials/hooks';

import { Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Form.Element.ArtPiece.Materials
 * @description ElementArtPieceMaterials component renders an autocomplete field for selecting art piece materials.
 * It uses the useGetPaginatedArtPieceMaterials hook for data fetching and provides an autocomplete
 * field with chip rendering for material selection. Also includes a button to create new materials
 * via a dialog interface.
 *
 * Key Features:
 * - Fetches art piece materials using proper hooks architecture
 * - Provides autocomplete functionality with freeSolo option
 * - Displays selected materials as chips
 * - Includes create new material functionality
 * - Handles authentication and loading states
 * - Error boundary wrapped for robustness
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.name='artPieceMaterial'] - The form field name
 * @param {string} [props.label='Material'] - The field label
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @example
 * // Used within a React Hook Form
 * <ElementArtPieceMaterials name="artPieceMaterial" label="Materials" disabled={false} />
 *
 * @returns {JSX.Element} The rendered component.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */
export function ElementArtPieceMaterials({
  name = 'artPieceMaterial',
  label = 'Material',
  disabled = false,
}) {
  const [localOptions, setLocalOptions] = useState([]); // Local state for options

  const { user, loading: userIsLoading, authenticated } = useAuthContext();

  // Get art piece materials using the proper hook
  const { artPieceMaterials, artPieceMaterialsLoading, artPieceMaterialsError } =
    useGetPaginatedArtPieceMaterials({}, 1, 1000, user?.token || ''); // Get many materials for autocomplete

  // Update local options when artPieceTags changes
  useEffect(() => {
    if (artPieceMaterials && artPieceMaterials.length > 0) {
      setLocalOptions(artPieceMaterials.map((tag) => tag.name));
    }
  }, [artPieceMaterials]);

  // Handle loading and error states
  if (artPieceMaterialsLoading || userIsLoading) {
    return (
      <TextField
        fullWidth
        label={label}
        disabled
        InputProps={{
          endAdornment: <CircularProgress size={20} />,
        }}
      />
    );
  }

  if (artPieceMaterialsError || !authenticated) {
    return (
      <TextField fullWidth label={label} disabled helperText={`Error loading ${label}.`} error />
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
        <Field.Autocomplete
          name={name}
          label={label}
          placeholder={`+ ${label.slice(0, -1)}`} // Remove 's' from 'Tags' to make '+ Tag'
          multiple
          freeSolo
          disableCloseOnSelect
          disabled={disabled}
          options={localOptions}
          getOptionLabel={(option) => {
            // Handle both string and object options
            if (typeof option === 'string') return option;
            if (typeof option === 'object' && option?.name) return option.name;
            return String(option);
          }}
          renderOption={(props, option, { index }) => {
            const displayName =
              typeof option === 'string' ? option : option?.name || String(option);
            return (
              <li
                {...props}
                key={typeof option === 'string' ? option : option?.name || `option-${index}`}
              >
                {displayName}
              </li>
            );
          }}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => {
              const displayName =
                typeof option === 'string' ? option : option?.name || String(option);
              const key = typeof option === 'string' ? option : option?.name || `tag-${index}`;
              return (
                <Chip
                  {...getTagProps({ index })}
                  key={key}
                  label={displayName}
                  size="small"
                  color="info"
                  variant="soft"
                />
              );
            })
          }
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </ErrorBoundary>
  );
}

ElementArtPieceMaterials.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
