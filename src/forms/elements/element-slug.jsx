/**
 * @namespace CityArtWalks.Forms.Elements.Slug
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for slug input with auto-generation from any source field
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Slugs} - Slug handling documentation
 */

import slugify from 'slugify';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Slug
 * @function ElementSlug
 * @description Generic form element component for slugs with auto-generation from any source field.
 *
 * This component provides a text input field specifically designed for URL slugs,
 * with integrated form validation and auto-generation from any specified source field using slugify.
 * The slug is automatically generated when the source field changes and can be manually edited if needed.
 *
 * Features:
 * - Text input with slug-specific validation
 * - Auto-generation from any source field using slugify library
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Manual editing capability
 * - URL-safe slug generation
 * - Configurable source field and label
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="slug"] - The name of the form field
 * @param {string} [props.sourceField="name"] - The source field to generate slug from
 * @param {string} [props.label="Slug"] - Label text for the input field
 * @param {string} [props.placeholder="auto-generated-from-source"] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.autoGenerate=true] - Whether to auto-generate slug from source field
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.inputProps] - Deprecated - use slotProps.input instead
 * @param {Object} [props.InputLabelProps] - Deprecated - use slotProps.inputLabel instead
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered slug input element
 *
 * @example
 * // Basic usage with auto-generation from name field
 * <ElementSlug />
 *
 * @example
 * // Generate from title field for articles/posts
 * <ElementSlug
 *   sourceField="title"
 *   label="Article Slug"
 *   placeholder="auto-generated-from-title"
 * />
 *
 * @example
 * // Generate from artist name
 * <ElementSlug
 *   sourceField="name"
 *   label="Artist Slug"
 *   helperText="URL-friendly identifier for the artist"
 * />
 *
 * @example
 * // Disabled field (for display only)
 * <ElementSlug
 *   disabled
 *   helperText="Auto-generated URL identifier"
 * />
 *
 * @example
 * // Manual editing without auto-generation
 * <ElementSlug
 *   autoGenerate={false}
 *   placeholder="enter-custom-slug"
 * />
 */
export function ElementSlug(props) {
  const {
    name = 'slug',
    sourceField = 'name',
    label = 'Slug',
    placeholder = '',
    required = false,
    disabled = false,
    autoGenerate = true,
    helperText,
    slotProps,
    inputProps, // Deprecated
    InputLabelProps, // Deprecated
    ...other
  } = props;

  const { control, watch, setValue } = useFormContext();
  const labelId = `${name}-input-label`;

  // Watch the source field for auto-generation
  const sourceValue = watch(sourceField);

  // Auto-generate slug from source field
  useEffect(() => {
    if (autoGenerate && sourceValue && typeof sourceValue === 'string' && sourceValue.trim()) {
      const generatedSlug = slugify(sourceValue.trim(), {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g, // Remove special characters that might cause issues
      });
      setValue(name, generatedSlug, { shouldValidate: false });
    }
  }, [sourceValue, setValue, name, autoGenerate]);

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            slotProps={{
              ...slotProps,
              inputLabel: {
                htmlFor: labelId,
                ...InputLabelProps, // Deprecated fallback
                ...slotProps?.inputLabel,
              },
              input: {
                id: labelId,
                ...inputProps, // Deprecated fallback
                ...slotProps?.input,
              },
            }}
            error={!!fieldError}
            helperText={fieldError ? fieldError.message : helperText}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementSlug.propTypes = {
  name: PropTypes.string,
  sourceField: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoGenerate: PropTypes.bool,
  helperText: PropTypes.string,
  slotProps: PropTypes.object,
  inputProps: PropTypes.object, // Deprecated
  InputLabelProps: PropTypes.object, // Deprecated
};
