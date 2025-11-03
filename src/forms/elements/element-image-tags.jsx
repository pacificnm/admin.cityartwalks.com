/**
 * @namespace CityArtWalks.Forms.Elements.ImageTags
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for image tags input with chip display
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

import { PlusIcon } from 'src/components/icons';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ImageTags
 * @function ElementImageTags
 * @description Form element component for entering image tags with chip display.
 *
 * This component provides a text input field for entering tags with visual chip representation
 * of each tag. Users can add tags by typing and pressing Enter, or by clicking the add button.
 * Tags can be removed by clicking the delete icon on each chip.
 *
 * Features:
 * - Text input for tag entry
 * - Visual chip display for each tag
 * - Add tags with Enter key or button click
 * - Remove tags by clicking chip delete icon
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="tags"] - The name of the form field
 * @param {string} [props.label="Image Tags"] - Label text for the input field
 * @param {string} [props.placeholder="Enter tags and press Enter"] - Placeholder text
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {number} [props.maxTags] - Maximum number of tags allowed
 * @param {string} [props.separator=","] - Character to split tags on (in addition to Enter)
 * @param {boolean} [props.allowDuplicates=false] - Whether to allow duplicate tags
 * @param {Function} [props.tagValidator] - Custom validation function for tags
 * @param {Object} [...props.other] - Other props to pass to the FormControl component
 *
 * @returns {JSX.Element} The rendered image tags input element with chip display
 *
 * @example
 * // Basic usage
 * <ElementImageTags />
 *
 * @example
 * // With custom configuration
 * <ElementImageTags
 *   name="imageTags"
 *   label="Add Tags"
 *   required
 *   maxTags={10}
 *   placeholder="Enter tags separated by comma or press Enter"
 *   helperText="Use descriptive tags to help categorize your image"
 * />
 *
 * @example
 * // With custom validation
 * <ElementImageTags
 *   name="tags"
 *   label="Image Tags"
 *   tagValidator={(tag) => tag.length >= 2 && tag.length <= 20}
 *   allowDuplicates={false}
 * />
 */
export function ElementImageTags(props) {
  const {
    name = 'tags',
    label = 'Image Tags',
    placeholder = 'Enter tags and press Enter',
    required = false,
    disabled = false,
    helperText,
    maxTags,
    separator = ',',
    allowDuplicates = false,
    tagValidator,
    ...other
  } = props;

  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageTags.ElementImageTags
   * @function validateTag
   * @description Validates a tag before adding it to the list.
   * @param {string} tag - The tag to validate
   * @param {Array} existingTags - Current list of tags
   * @returns {string|null} Error message if invalid, null if valid
   */
  const validateTag = (tag, existingTags) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return 'Tag cannot be empty';
    if (trimmedTag.length < 2) return 'Tag must be at least 2 characters';
    if (trimmedTag.length > 50) return 'Tag must be less than 50 characters';

    if (!allowDuplicates && existingTags.includes(trimmedTag)) {
      return 'Tag already exists';
    }

    if (maxTags && existingTags.length >= maxTags) {
      return `Maximum ${maxTags} tags allowed`;
    }

    if (tagValidator && !tagValidator(trimmedTag)) {
      return 'Invalid tag format';
    }

    return null;
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageTags.ElementImageTags
   * @function addTag
   * @description Adds a new tag to the list if valid.
   * @param {string} tagText - The tag text to add
   * @param {Array} currentTags - Current list of tags
   * @param {Function} onChange - Form field onChange function
   * @returns {string|null} Error message if failed to add, null if successful
   */
  const addTag = (tagText, currentTags, onChange) => {
    const tags = tagText.includes(separator)
      ? tagText
          .split(separator)
          .map((t) => t.trim())
          .filter((t) => t)
      : [tagText.trim()];

    const newTags = [...currentTags];
    let error = null;

    for (const tag of tags) {
      const validationError = validateTag(tag, newTags);
      if (validationError) {
        error = validationError;
        break;
      }
      newTags.push(tag);
    }

    if (!error) {
      onChange(newTags);
      setInputValue('');
    }

    return error;
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageTags.ElementImageTags
   * @function removeTag
   * @description Removes a tag from the list.
   * @param {number} indexToRemove - Index of tag to remove
   * @param {Array} currentTags - Current list of tags
   * @param {Function} onChange - Form field onChange function
   */
  const removeTag = (indexToRemove, currentTags, onChange) => {
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageTags.ElementImageTags
   * @function handleKeyPress
   * @description Handles key press events for tag input.
   * @param {KeyboardEvent} event - The keyboard event
   * @param {Array} currentTags - Current list of tags
   * @param {Function} onChange - Form field onChange function
   */
  const handleKeyPress = (event, currentTags, onChange) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue, currentTags, onChange);
      }
    }
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageTags.ElementImageTags
   * @function handleAddClick
   * @description Handles add button click.
   * @param {Array} currentTags - Current list of tags
   * @param {Function} onChange - Form field onChange function
   */
  const handleAddClick = (currentTags, onChange) => {
    if (inputValue.trim()) {
      addTag(inputValue, currentTags, onChange);
    }
  };

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value = [] }, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} {...other}>
            <FormLabel component="legend" required={required}>
              {label}
            </FormLabel>

            {/* Tags Display */}
            {value.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {value.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={disabled ? undefined : () => removeTag(index, value, onChange)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Box>
            )}

            {/* Tag Input */}
            <TextField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, value, onChange)}
              placeholder={placeholder}
              disabled={disabled}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleAddClick(value, onChange)}
                      disabled={disabled || !inputValue.trim()}
                      size="small"
                    >
                      <PlusIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Helper Text / Error */}
            <FormHelperText>
              {error ? error.message : helperText}
              {maxTags && ` (${value.length}/${maxTags})`}
            </FormHelperText>
          </FormControl>
        )}
      />
    </ErrorBoundary>
  );
}

ElementImageTags.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  maxTags: PropTypes.number,
  separator: PropTypes.string,
  allowDuplicates: PropTypes.bool,
  tagValidator: PropTypes.func,
};
