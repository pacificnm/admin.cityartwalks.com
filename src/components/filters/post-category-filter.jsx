/**
 * @file post-category-filter.jsx
 * @description Post Category Filter Component
 * @namespace CityArtWalks.Components.Filters.PostCategoryFilter
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import React from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

/**
 * Default category options for posts
 */
const DEFAULT_CATEGORY_OPTIONS = [
  'News & Updates',
  'Artists',
  'Art Pieces',
  'Walking Paths',
  'Art History',
  'Local Culture',
  'Exhibition Reviews',
  'Street Art',
  'Public Art',
  'Gallery Features',
  'Artist Interviews',
  'Art Education',
  'Community Stories',
  'Behind the Scenes',
];

/**
 * Post Category Filter Component
 *
 * A select dropdown filter specifically for post categories with predefined options.
 * Provides a clean interface for filtering posts by their category field.
 *
 * @param {Object} props
 * @param {string} props.value - Current selected category value
 * @param {Function} props.onChange - Handler for category selection changes
 * @param {string} [props.label='Category'] - Label for the filter
 * @param {string} [props.placeholder='All Categories'] - Placeholder text for no selection
 * @param {Array<string>} [props.options] - Custom category options (uses defaults if not provided)
 * @param {Object} [props.sx] - Additional styling
 * @param {string} [props.ariaLabel] - Accessibility label
 * @param {boolean} [props.disabled=false] - Whether the filter is disabled
 * @param {string} [props.size='small'] - Size of the form control
 */
export const PostCategoryFilter = React.memo(function PostCategoryFilter({
  value = '',
  onChange,
  label = 'Category',
  placeholder = 'All Categories',
  options = DEFAULT_CATEGORY_OPTIONS,
  sx,
  ariaLabel,
  disabled = false,
  size = 'small',
}) {
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <FormControl size={size} sx={{ minWidth: 180, ...sx }} disabled={disabled}>
      <InputLabel id="post-category-filter-label">{label}</InputLabel>
      <Select
        labelId="post-category-filter-label"
        value={value}
        onChange={handleChange}
        label={label}
        aria-label={ariaLabel || `Filter by ${label.toLowerCase()}`}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
