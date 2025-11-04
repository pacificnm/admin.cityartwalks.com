/**
 * @file artist-table-filter.jsx
 * @description Filter toolbar component for artist table
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

/**
 * @description Returns the color for a status chip based on the status value
 * @param {string} status - The status value
 * @returns {string} The color for the chip
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REVIEW':
      return 'info';
    case 'ARCHIVED':
      return 'default';
    case 'BANNED':
      return 'error';
    case 'DELETED':
      return 'error';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

// ----------------------------------------------------------------------

/**
 * @description Filter toolbar component for artist table with search, status, and featured filters
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistTableFilter
 * @param {Object} props - Component props
 * @param {string} props.searchName - Current search value
 * @param {Function} props.onSearchChange - Handler for search input change
 * @param {string} props.statusFilter - Current status filter value
 * @param {Function} props.onStatusChange - Handler for status filter change
 * @param {boolean} props.featuredFilter - Current featured filter value
 * @param {Function} props.onFeaturedChange - Handler for featured filter change
 * @returns {JSX.Element} The Artist Table Filter component.
 */
export function ArtistTableFilter({
  searchName,
  onSearchChange,
  statusFilter,
  onStatusChange,
  featuredFilter,
  onFeaturedChange,
}) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ p: 2.5 }}
    >
      <TextField
        fullWidth
        value={searchName}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name..."
        size="small"
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          label="Status"
          renderValue={(selected) => {
            if (!selected) return 'All';
            return (
              <Chip
                label={selected}
                color={getStatusColor(selected)}
                size="small"
                sx={{ fontWeight: 600, height: 24 }}
              />
            );
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ACTIVE">
            <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="PENDING">
            <Chip label="PENDING" color="warning" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="REVIEW">
            <Chip label="REVIEW" color="info" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="ARCHIVED">
            <Chip label="ARCHIVED" color="default" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="BANNED">
            <Chip label="BANNED" color="error" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="DELETED">
            <Chip label="DELETED" color="error" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
          <MenuItem value="REJECTED">
            <Chip label="REJECTED" color="error" size="small" sx={{ fontWeight: 600 }} />
          </MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox checked={featuredFilter} onChange={(e) => onFeaturedChange(e.target.checked)} />
        }
        label="Featured Only"
        sx={{ minWidth: 150 }}
      />
    </Stack>
  );
}
