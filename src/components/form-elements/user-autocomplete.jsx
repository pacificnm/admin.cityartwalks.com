/**
 * @file user-autocomplete.jsx
 * @description Reusable user autocomplete component with search and avatar display
 * @namespace CityArtWalks.Components.FormElements.UserAutocomplete
 * @version 1.0.0
 * @memberof CityArtWalks.Components.FormElements
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetPaginatedUsers } from 'src/actions/user/hooks';

import { UserIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.FormElements.UserAutocomplete
 * @function UserAutocomplete
 * @description A reusable autocomplete component for searching and selecting users.
 * Features debounced search, user avatars, and customizable display.
 *
 * @param {Object} props - Component props
 * @param {Object} props.value - Selected user object
 * @param {Function} props.onChange - Handler when user selection changes
 * @param {string} [props.label='Select User'] - Input field label
 * @param {string} [props.placeholder='Search by name or email...'] - Input placeholder
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {string} [props.error=''] - Error message to display
 * @param {string} [props.helperText=''] - Helper text to display
 * @param {string} [props.size='medium'] - Field size (small, medium, large)
 * @param {boolean} [props.multiple=false] - Allow multiple selections
 * @param {string} [props.variant='outlined'] - TextField variant
 * @param {boolean} [props.fullWidth=true] - Whether to take full width
 * @param {string} [props.accessToken=''] - Auth token for API requests
 * @param {Function} [props.filterOptions] - Custom filter function for options
 * @param {Object} [props.sx] - Additional MUI sx props
 *
 * @returns {JSX.Element} The UserAutocomplete component
 *
 * @example
 * // Basic usage
 * <UserAutocomplete
 *   value={selectedUser}
 *   onChange={(user) => setSelectedUser(user)}
 *   label="Assign to User"
 *   accessToken={token}
 * />
 *
 * @example
 * // With validation and helper text
 * <UserAutocomplete
 *   value={formData.assignedUser}
 *   onChange={(user) => updateFormData({ assignedUser: user })}
 *   label="Project Owner"
 *   required
 *   error={errors.assignedUser}
 *   helperText="Select the user responsible for this project"
 *   accessToken={token}
 * />
 */
export function UserAutocomplete({
  value = null,
  onChange,
  label = 'Select User',
  placeholder = 'Search by name or email...',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  size = 'medium',
  multiple = false,
  variant = 'outlined',
  fullWidth = true,
  accessToken = '',
  filterOptions,
  sx,
  ...other
}) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Debounce the search input
  const debouncedSearch = useDebounce(inputValue, 300);

  // Fetch users based on search
  const { users, usersLoading } = useGetPaginatedUsers(
    {
      page: 1,
      rowsPerPage: 20,
      search: debouncedSearch,
      status: 'ACTIVE', // Only show active users
    },
    accessToken
  );

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => {
    if (!users) return [];

    // If there's a value that's not in the current options, include it
    if (value && !users.find((u) => u.userId === value.userId)) {
      return [value, ...users];
    }

    return users;
  }, [users, value]);

  // Handle input change
  const handleInputChange = useCallback((event, newInputValue) => {
    setInputValue(newInputValue);
  }, []);

  // Handle value change
  const handleChange = useCallback(
    (event, newValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  // Render user option
  const renderOption = useCallback((props, option) => {
    // Extract key from props to avoid React warning about spreading key
    const { ...otherProps } = props;

    return (
      <Box
        component="li"
        key={option.userId} // Use userId as key for uniqueness
        {...otherProps}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1,
          px: 2,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Avatar
          src={option.profilePicture || option.picture}
          alt={option.name}
          sx={{ width: 32, height: 32 }}
        >
          {option.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {option.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {option.email}
          </Typography>
        </Box>
        {option.role && (
          <Typography variant="caption" color="primary">
            {option.role}
          </Typography>
        )}
      </Box>
    );
  }, []);

  // Get option label
  const getOptionLabel = useCallback((option) => {
    if (!option) return '';
    return option.name || option.email || '';
  }, []);

  // Check if options are equal
  const isOptionEqualToValue = useCallback((option, val) => {
    if (!option || !val) return false;
    return option.userId === val.userId;
  }, []);

  return (
    <Autocomplete
      {...other}
      multiple={multiple}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={usersLoading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      filterOptions={filterOptions}
      fullWidth={fullWidth}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={!!error}
          helperText={error || helperText}
          variant={variant}
          size={size}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <UserIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {usersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

UserAutocomplete.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  multiple: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  fullWidth: PropTypes.bool,
  accessToken: PropTypes.string,
  filterOptions: PropTypes.func,
  sx: PropTypes.object,
};
