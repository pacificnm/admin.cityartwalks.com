import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { SearchIcon, VerticalFillIcon } from 'src/components/icons';

export function TableToolbar({ filters, onResetPage, filterConfig, actions = [] }) {
  const menuActions = usePopover();
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterChange = useCallback(
    (key, value) => {
      onResetPage?.();
      updateFilters((prev) => ({ ...prev, [key]: value }));
    },
    [onResetPage, updateFilters]
  );

  const renderFilterInput = (filter) => {
    const { key, label, type, options = [] } = filter;

    if (type === 'text') {
      return (
        <TextField
          key={key}
          fullWidth
          label={label}
          value={currentFilters[key] || ''}
          onChange={(e) => handleFilterChange(key, e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      );
    }

    if (type === 'multi-select') {
      return (
        <FormControl key={key} sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel>{label}</InputLabel>
          <Select
            multiple
            value={currentFilters[key] || []}
            onChange={(e) => {
              const val =
                typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
              handleFilterChange(key, val);
            }}
            input={<OutlinedInput label={label} />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={currentFilters[key]?.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (type === 'single-select') {
      return (
        <FormControl key={key} sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={currentFilters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            input={<OutlinedInput label={label} />}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (type === 'date') {
      return (
        <TextField
          key={key}
          type="date"
          label={label}
          value={currentFilters[key] || ''}
          onChange={(e) => handleFilterChange(key, e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: 1, md: 200 } }}
        />
      );
    }

    if (type === 'boolean') {
      return (
        <FormControl key={key} sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel shrink>{label}</InputLabel>
          <Select
            value={String(currentFilters[key])}
            onChange={(e) => handleFilterChange(key, e.target.value === 'true')}
            input={<OutlinedInput label={label} />}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return null;
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              action.onClick();
              menuActions.onClose();
            }}
          >
            <Iconify icon={action.icon} sx={{ mr: 1 }} />
            {action.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        {filterConfig.map((filter) => renderFilterInput(filter))}

        {actions.length > 0 && (
          <IconButton onClick={menuActions.onOpen}>
            <VerticalFillIcon />
          </IconButton>
        )}
      </Box>

      {renderMenuActions()}
    </>
  );
}

// ----------------------------------------------------------------------

TableToolbar.propTypes = {
  filters: PropTypes.shape({
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
  }).isRequired,
  onResetPage: PropTypes.func,
  filterConfig: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'multi-select', 'single-select', 'date', 'boolean'])
        .isRequired,
      options: PropTypes.array,
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};
