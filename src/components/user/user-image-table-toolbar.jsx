import { useState, useEffect } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { PrintIcon, SearchIcon, VerticalFillIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function UserImageTableToolbar({
  filters,
  options,
  onResetPage,
  onRoleChange,
  onStatusChange,
  onSearchChange,
  search = '',
  onClearFilters,
  onDateRangeChange, // <-- add this prop
}) {
  const menuActions = usePopover();

  // Always use filters.state/setState for consistency
  const currentFilters = filters?.state || filters || { dateRange: [null, null] };
  const updateFilters = filters?.setState || (() => {});

  // Debounced search state
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== search) {
        onSearchChange && onSearchChange({ target: { value: searchValue } });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, onSearchChange, search]);

  // Date range change handlers: use onDateRangeChange if provided, else fallback
  const handleStartDateChange = (newStart) => {
    onResetPage && onResetPage();
    if (onDateRangeChange) {
      const prevRange = Array.isArray(currentFilters.dateRange)
        ? currentFilters.dateRange
        : [null, null];
      onDateRangeChange([newStart, prevRange[1]]);
    } else {
      updateFilters((prev) => {
        const prevRange = Array.isArray(prev.dateRange) ? prev.dateRange : [null, null];
        return {
          ...prev,
          dateRange: [newStart, prevRange[1]],
        };
      });
    }
  };

  const handleEndDateChange = (newEnd) => {
    onResetPage && onResetPage();
    if (onDateRangeChange) {
      const prevRange = Array.isArray(currentFilters.dateRange)
        ? currentFilters.dateRange
        : [null, null];
      onDateRangeChange([prevRange[0], newEnd]);
    } else {
      updateFilters((prev) => {
        const prevRange = Array.isArray(prev.dateRange) ? prev.dateRange : [null, null];
        return {
          ...prev,
          dateRange: [prevRange[0], newEnd],
        };
      });
    }
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <PrintIcon />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
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
        {/* Date Range Picker replaces Role Dropdown */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0,
            width: { xs: 1, md: 420 },
          }}
        >
          <DatePicker
            label="Start"
            value={currentFilters.dateRange ? currentFilters.dateRange[0] : null}
            onChange={handleStartDateChange}
            slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
          />
          <Box component="span" sx={{ mx: 0.5, color: 'text.secondary', fontSize: 18 }}>
            –
          </Box>
          <DatePicker
            label="End"
            value={currentFilters.dateRange ? currentFilters.dateRange[1] : null}
            onChange={handleEndDateChange}
            slotProps={{ textField: { size: 'small', sx: { width: 180 } } }}
          />
        </Box>

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Path Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={menuActions.onOpen}>
            <VerticalFillIcon />
          </IconButton>
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}
