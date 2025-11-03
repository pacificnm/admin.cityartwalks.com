/**
 * @file owner-review-filters.jsx
 * @description Advanced filtering component for owner review management
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerReviewFilters
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { debugLog } from 'src/lib/debug';

import { CloseIcon, SearchIcon, FilterIcon, DownloadIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewFilters
 * @description Review status options for filtering
 * @constant {Array<Object>} REVIEW_STATUS_OPTIONS
 */
const REVIEW_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: 'ACTIVE', label: 'Active', color: 'success' },
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'REJECTED', label: 'Rejected', color: 'error' },
  { value: 'REVIEW', label: 'Under Review', color: 'info' },
  { value: 'BANNED', label: 'Banned', color: 'error' },
  { value: 'DELETED', label: 'Deleted', color: 'default' },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewFilters
 * @description Rating filter options
 * @constant {Array<Object>} RATING_OPTIONS
 */
const RATING_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewFilters
 * @description Sort options for reviews
 * @constant {Array<Object>} SORT_OPTIONS
 */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', field: 'createdAt', direction: 'desc' },
  { value: 'oldest', label: 'Oldest First', field: 'createdAt', direction: 'asc' },
  { value: 'highest_rating', label: 'Highest Rating', field: 'rating', direction: 'desc' },
  { value: 'lowest_rating', label: 'Lowest Rating', field: 'rating', direction: 'asc' },
  { value: 'status', label: 'By Status', field: 'status', direction: 'asc' },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewFilters
 * @description Advanced filtering component for owner review management
 * @function OwnerReviewFilters
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFiltersChange - Filter change handler
 * @param {Function} [props.onExport] - Export handler
 * @param {boolean} [props.loading] - Loading state
 * @returns {JSX.Element} Advanced review filters component
 */
export function OwnerReviewFilters({ filters = {}, onFiltersChange, onExport, loading = false }) {
  const showAdvanced = useBoolean(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Handle individual filter changes
  const handleFilterChange = useCallback(
    (field, value) => {
      debugLog(
        'CityArtWalks.Components.Review.OwnerReviewFilters.handleFilterChange',
        `${field}: ${value}`
      );

      const newFilters = { ...tempFilters, [field]: value };
      setTempFilters(newFilters);

      // Apply filters immediately for basic filters
      if (['search', 'status', 'rating', 'sort'].includes(field)) {
        onFiltersChange(newFilters);
      }
    },
    [tempFilters, onFiltersChange]
  );

  // Handle date range changes (need both dates before applying)
  const handleDateChange = useCallback(
    (field, date) => {
      debugLog(
        'CityArtWalks.Components.Review.OwnerReviewFilters.handleDateChange',
        `${field}: ${date}`
      );

      const newFilters = { ...tempFilters, [field]: date };
      setTempFilters(newFilters);
    },
    [tempFilters]
  );

  // Apply advanced filters (dates)
  const handleApplyAdvanced = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerReviewFilters.handleApplyAdvanced',
      'Applying advanced filters'
    );
    onFiltersChange(tempFilters);
    showAdvanced.onFalse();
  }, [tempFilters, onFiltersChange, showAdvanced]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerReviewFilters.handleClearFilters',
      'Clearing all filters'
    );

    const clearedFilters = {
      search: '',
      status: '',
      rating: '',
      minRating: '',
      maxRating: '',
      startDate: null,
      endDate: null,
      sort: 'newest',
    };

    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    showAdvanced.onFalse();
  }, [onFiltersChange, showAdvanced]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.rating) count++;
    if (filters.minRating) count++;
    if (filters.maxRating) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  }, [filters]);

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        {/* Basic Filters Row */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search reviews..."
            value={tempFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 240 }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={tempFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              {REVIEW_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {option.value && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: `${option.color}.main`,
                        }}
                      />
                    )}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rating Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={tempFilters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              label="Rating"
            >
              {RATING_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {option.value && (
                      <Rating value={parseInt(option.value)} readOnly size="small" />
                    )}
                    {!option.value && option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={tempFilters.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              label="Sort By"
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Advanced Toggle */}
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<FilterIcon />}
            onClick={showAdvanced.onToggle}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Advanced
          </Button>

          {/* Export Button */}
          {onExport && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              startIcon={<DownloadIcon />}
              onClick={onExport}
              disabled={loading}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Export CSV
            </Button>
          )}
        </Stack>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="caption" color="text.secondary">
                Active filters ({activeFilterCount}):
              </Typography>

              {filters.search && (
                <Chip
                  size="small"
                  label={`Search: "${filters.search}"`}
                  onDelete={() => handleFilterChange('search', '')}
                />
              )}

              {filters.status && (
                <Chip
                  size="small"
                  label={`Status: ${REVIEW_STATUS_OPTIONS.find((opt) => opt.value === filters.status)?.label}`}
                  onDelete={() => handleFilterChange('status', '')}
                />
              )}

              {filters.rating && (
                <Chip
                  size="small"
                  label={`Rating: ${filters.rating} stars`}
                  onDelete={() => handleFilterChange('rating', '')}
                />
              )}

              {filters.startDate && (
                <Chip
                  size="small"
                  label={`From: ${new Date(filters.startDate).toLocaleDateString()}`}
                  onDelete={() => handleDateChange('startDate', null)}
                />
              )}

              {filters.endDate && (
                <Chip
                  size="small"
                  label={`To: ${new Date(filters.endDate).toLocaleDateString()}`}
                  onDelete={() => handleDateChange('endDate', null)}
                />
              )}

              <Button
                size="small"
                color="inherit"
                onClick={handleClearFilters}
                startIcon={<CloseIcon />}
              >
                Clear All
              </Button>
            </Stack>
          </Box>
        )}

        {/* Advanced Filters */}
        <Collapse in={showAdvanced.value}>
          <Box sx={{ pt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {/* Date Range */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Date Range:
                </Typography>

                <TextField
                  type="date"
                  size="small"
                  label="Start Date"
                  value={tempFilters.startDate || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 160 }}
                />

                <Typography variant="body2" color="text.secondary">
                  to
                </Typography>

                <TextField
                  type="date"
                  size="small"
                  label="End Date"
                  value={tempFilters.endDate || ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 160 }}
                />
              </Stack>

              {/* Rating Range */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                  Rating Range:
                </Typography>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Min Rating</InputLabel>
                  <Select
                    value={tempFilters.minRating || ''}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    label="Min Rating"
                  >
                    <MenuItem value="">Any</MenuItem>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="body2" color="text.secondary">
                  to
                </Typography>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Max Rating</InputLabel>
                  <Select
                    value={tempFilters.maxRating || ''}
                    onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                    label="Max Rating"
                  >
                    <MenuItem value="">Any</MenuItem>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            {/* Advanced Filter Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button size="small" color="inherit" onClick={showAdvanced.onFalse}>
                Cancel
              </Button>
              <Button size="small" variant="contained" onClick={handleApplyAdvanced}>
                Apply Filters
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Stack>
    </Card>
  );
}

export default OwnerReviewFilters;
