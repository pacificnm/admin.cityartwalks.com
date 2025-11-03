/**
 * @file user-filter.jsx
 * @description User filter component for tables and search interfaces
 * @namespace CityArtWalks.Components.Filters.UserFilter
 * @version 1.0.0
 * @memberof CityArtWalks.Components.Filters
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetPaginatedUsers } from 'src/actions/user/hooks';

/**
 * @memberof CityArtWalks.Components.Filters.UserFilter
 * @function UserFilter
 * @description A compact user filter component for use in table toolbars and filter panels.
 * Displays selected user as a chip with avatar.
 *
 * @param {Object} props - Component props
 * @param {Object} props.value - Selected user object or user ID
 * @param {Function} props.onChange - Handler when user selection changes
 * @param {Function} [props.onClear] - Handler for clearing the filter
 * @param {string} [props.label='User'] - Input field label
 * @param {string} [props.placeholder='Filter by user...'] - Input placeholder
 * @param {boolean} [props.disabled=false] - Whether field is disabled
 * @param {string} [props.size='small'] - Field size
 * @param {string} [props.accessToken=''] - Auth token for API requests
 * @param {Object} [props.sx] - Additional MUI sx props
 *
 * @returns {JSX.Element} The UserFilter component
 *
 * @example
 * // In a table toolbar
 * <UserFilter
 *   value={filters.createdBy}
 *   onChange={(user) => handleFilterChange('createdBy', user?.userId)}
 *   onClear={() => handleFilterChange('createdBy', null)}
 *   accessToken={token}
 * />
 */
export function UserFilter({
  value = null,
  onChange,
  onClear,
  label = 'User',
  placeholder = 'Filter by user...',
  disabled = false,
  size = 'small',
  accessToken = '',
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
      rowsPerPage: 10,
      search: debouncedSearch,
      status: 'ACTIVE',
    },
    accessToken
  );

  // Convert value (might be just an ID) to user object
  const selectedUser = useMemo(() => {
    if (!value) return null;

    // If value is already an object with userId, use it
    if (typeof value === 'object' && value.userId) {
      return value;
    }

    // If value is a number (userId), try to find the user
    if (typeof value === 'number' && users) {
      return users.find((u) => u.userId === value) || null;
    }

    return null;
  }, [value, users]);

  // Memoize options
  const options = useMemo(() => {
    if (!users) return [];

    // If there's a selected user that's not in the current options, include it
    if (selectedUser && !users.find((u) => u.userId === selectedUser.userId)) {
      return [selectedUser, ...users];
    }

    return users;
  }, [users, selectedUser]);

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
          gap: 1,
          py: 0.5,
        }}
      >
        <Avatar
          src={option.profilePicture || option.picture}
          alt={option.name}
          sx={{ width: 24, height: 24 }}
        >
          {option.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Typography variant="body2" noWrap>
            {option.name}
          </Typography>
        </Box>
      </Box>
    );
  }, []);

  // Render selected user as chip
  const renderTags = useCallback(
    (tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          {...getTagProps({ index })}
          key={option.userId}
          size="small"
          avatar={
            <Avatar
              src={option.profilePicture || option.picture}
              alt={option.name}
              sx={{ width: 20, height: 20 }}
            >
              {option.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          }
          label={option.name}
          onDelete={onClear ? () => onClear() : undefined}
        />
      )),
    [onClear]
  );

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
      size={size}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedUser}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={usersLoading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      renderTags={renderTags}
      sx={{
        minWidth: 200,
        ...sx,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          size={size}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {usersLoading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

UserFilter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  accessToken: PropTypes.string,
  sx: PropTypes.object,
};
