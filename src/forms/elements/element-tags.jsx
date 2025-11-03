/**
 * @namespace CityArtWalks.Forms.Elements.Tags
 * @version 1.0.0
 * @author Claude Code Assistant
 * @fileoverview Reusable form element for tag input with validation and autocomplete
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import ErrorBoundary from 'src/components/error/error-boundary';

// Common post tag suggestions
const DEFAULT_POST_TAGS = [
  'art',
  'culture',
  'community',
  'artist',
  'exhibition',
  'gallery',
  'street-art',
  'public-art',
  'sculpture',
  'mural',
  'photography',
  'painting',
  'installation',
  'creative',
  'inspiration',
  'local',
  'history',
  'education',
  'review',
  'interview',
  'technique',
  'tutorial',
  'behind-the-scenes',
  'news',
  'update',
  'announcement',
  'event',
  'workshop',
  'featured',
];

/**
 * @memberof CityArtWalks.Forms.Elements.Tags
 * @function ElementTags
 * @description Reusable form element component for tag input with autocomplete and validation.
 *
 * This component provides a flexible tag input field designed for various content types,
 * with integrated form validation and error handling through React Hook Form.
 *
 * Features:
 * - Multiple tag selection with autocomplete
 * - Predefined tag suggestions
 * - Free-form tag creation (freeSolo)
 * - Chip-based tag display
 * - React Hook Form integration
 * - Error state handling
 * - Configurable options and validation
 * - Accessible form controls
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="tags"] - The name of the form field
 * @param {string} [props.label="Tags"] - Label text for the input field
 * @param {string} [props.placeholder="Add tags..."] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Array<string>} [props.options=DEFAULT_POST_TAGS] - Array of suggested tag options
 * @param {number} [props.maxTags=20] - Maximum number of tags allowed
 * @param {string} [props.helperText="Add relevant tags to help categorize your content"] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [...props.other] - Other props to pass to the Autocomplete component
 *
 * @returns {JSX.Element} The rendered tags input element
 *
 * @example
 * // Basic usage
 * <ElementTags />
 *
 * @example
 * // For post tags
 * <ElementTags
 *   name="tags"
 *   label="Post Tags"
 *   placeholder="Add relevant tags..."
 *   helperText="Use tags to help readers find your content"
 * />
 *
 * @example
 * // With custom options and validation
 * <ElementTags
 *   name="categories"
 *   label="Categories"
 *   options={['art', 'culture', 'news']}
 *   maxTags={5}
 *   required
 *   helperText="Choose up to 5 categories"
 * />
 *
 * @example
 * // Disabled state
 * <ElementTags
 *   name="tags"
 *   label="Tags"
 *   disabled
 *   helperText="Tags cannot be edited at this time"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementTags(props) {
  const {
    name = 'tags',
    label = 'Tags',
    placeholder = 'Add tags...',
    required = false,
    disabled = false,
    options = DEFAULT_POST_TAGS,
    maxTags = 20,
    helperText = 'Add relevant tags to help categorize your content',
    slotProps,
    ...other
  } = props;

  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...field}
            multiple
            freeSolo
            disableCloseOnSelect
            options={options}
            value={field.value || []}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              // Limit the number of tags
              const limitedValue = newValue.slice(0, maxTags);

              // Clean up tags: trim whitespace, convert to lowercase, remove duplicates
              const cleanTags = limitedValue
                .map((tag) => (typeof tag === 'string' ? tag.trim().toLowerCase() : tag))
                .filter((tag, index, arr) => tag && arr.indexOf(tag) === index);

              field.onChange(cleanTags);
              setInputValue('');
            }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
            renderOption={(optionProps, option) => (
              <li {...optionProps} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={`${option}-${index}`}
                  label={option}
                  size="small"
                  color="primary"
                  variant="outlined"
                  disabled={disabled}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={
                  field.value?.length ? placeholder : `${placeholder} (press Enter to add)`
                }
                required={required}
                disabled={disabled}
                error={!!error}
                helperText={
                  error ? error.message : `${helperText}${maxTags ? ` (max ${maxTags} tags)` : ''}`
                }
                slotProps={{
                  ...slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    ...slotProps?.htmlInput,
                    autoComplete: 'new-password', // Disable autocomplete
                  },
                }}
              />
            )}
            disabled={disabled}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementTags.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  maxTags: PropTypes.number,
  helperText: PropTypes.string,
  slotProps: PropTypes.object,
};
