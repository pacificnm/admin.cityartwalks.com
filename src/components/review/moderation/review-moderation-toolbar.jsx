/**
 * Review Moderation Toolbar Component
 *
 * Enhanced filtering and search toolbar for review moderation queue.
 * Includes search, filters, status buttons, and active filter display.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewModerationToolbar
 * @fileoverview Filtering toolbar for review moderation interface
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import PropTypes from 'prop-types';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Chip,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { StarIcon, RestartIcon, CheckCircleIcon } from 'src/components/icons';

/**
 * Status configuration for review moderation
 * @constant {Object} STATUS_CONFIG
 */
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    color: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  REVIEW: {
    label: 'Flagged',
    color: 'error',
    icon: 'solar:danger-triangle-bold',
  },
  ACTIVE: {
    label: 'Approved',
    color: 'success',
    icon: 'solar:check-circle-bold',
  },
  DELETED: {
    label: 'Rejected',
    color: 'default',
    icon: 'solar:close-circle-bold',
  },
};

/**
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewModerationToolbar
 * @function ReviewModerationToolbar
 * @description Enhanced filtering toolbar with search, filters, and active filter display
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.filters - Current filter values
 * @param {string} props.filterStatus - Current status filter
 * @param {boolean} props.canReset - Whether filters can be reset
 * @param {number} props.totalCount - Total number of reviews
 * @param {number} props.filteredCount - Number of filtered reviews
 * @param {Function} props.onFilterChange - Function to handle filter changes
 * @param {Function} props.onStatusChange - Function to handle status filter changes
 * @param {Function} props.onClearFilters - Function to clear all filters
 * @returns {JSX.Element} The rendered moderation toolbar component
 *
 * @example
 * <ReviewModerationToolbar
 *   filters={filters}
 *   filterStatus={filterStatus}
 *   canReset={canReset}
 *   totalCount={totalCount}
 *   filteredCount={dataFiltered.length}
 *   onFilterChange={handleFilterChange}
 *   onStatusChange={setFilterStatus}
 *   onClearFilters={handleClearFilters}
 * />
 */
export function ReviewModerationToolbar({
  filters,
  filterStatus,
  canReset,
  totalCount,
  filteredCount,
  onFilterChange,
  onStatusChange,
  onClearFilters,
}) {
  return (
    <Stack spacing={2} sx={{ px: 3, pb: 2 }}>
      {/* Search Bar and Quick Filters */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search reviews, users, reasons..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <Iconify icon="solar:magnifer-bold" sx={{ mr: 1, color: 'text.disabled' }} />
            ),
          }}
          sx={{ minWidth: 280 }}
        />

        {/* AI Decision Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>AI Decision</InputLabel>
          <Select
            value={filters.aiDecision}
            label="AI Decision"
            onChange={(e) => onFilterChange('aiDecision', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="approved">
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon sx={{ color: 'success.main' }} />
                <span>Approved</span>
              </Stack>
            </MenuItem>
            <MenuItem value="rejected">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
                <span>Rejected</span>
              </Stack>
            </MenuItem>
            <MenuItem value="none">No Decision</MenuItem>
          </Select>
        </FormControl>

        {/* Rating Filter */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filters.rating}
            label="Rating"
            onChange={(e) => onFilterChange('rating', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <MenuItem key={rating} value={rating}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <StarIcon sx={{ color: 'warning.main' }} />
                  <span>{rating}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Override Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Override</InputLabel>
          <Select
            value={filters.hasOverride}
            label="Override"
            onChange={(e) => onFilterChange('hasOverride', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="yes">Has Override</MenuItem>
            <MenuItem value="no">No Override</MenuItem>
          </Select>
        </FormControl>

        {/* Flagged Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Flagged</InputLabel>
          <Select
            value={filters.flagged}
            label="Flagged"
            onChange={(e) => onFilterChange('flagged', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="yes">Flagged</MenuItem>
            <MenuItem value="no">Not Flagged</MenuItem>
          </Select>
        </FormControl>

        {/* Date Range */}
        <DatePicker
          label="From Date"
          value={filters.dateFrom}
          onChange={(date) => onFilterChange('dateFrom', date)}
          slotProps={{ textField: { size: 'small', sx: { width: 140 } } }}
        />

        <DatePicker
          label="To Date"
          value={filters.dateTo}
          onChange={(date) => onFilterChange('dateTo', date)}
          slotProps={{ textField: { size: 'small', sx: { width: 140 } } }}
        />

        {/* Clear Filters Button */}
        {canReset && (
          <Button size="small" onClick={onClearFilters} startIcon={<RestartIcon />}>
            Clear Filters
          </Button>
        )}
      </Stack>

      {/* Status Filter Buttons */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Status:
        </Typography>
        <Button
          size="small"
          variant={filterStatus === 'all' ? 'contained' : 'outlined'}
          onClick={() => onStatusChange('all')}
        >
          All
        </Button>

        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <Button
            key={status}
            size="small"
            variant={filterStatus === status ? 'contained' : 'outlined'}
            color={config.color}
            startIcon={<Iconify icon={config.icon} />}
            onClick={() => onStatusChange(status)}
          >
            {config.label}
          </Button>
        ))}
      </Stack>

      {/* Active Filters Display */}
      {canReset && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            Active filters:
          </Typography>
          {filterStatus !== 'all' && (
            <Chip
              size="small"
              label={`Status: ${STATUS_CONFIG[filterStatus]?.label || filterStatus}`}
              onDelete={() => onStatusChange('all')}
            />
          )}
          {filters.search && (
            <Chip
              size="small"
              label={`Search: ${filters.search}`}
              onDelete={() => onFilterChange('search', '')}
            />
          )}
          {filters.aiDecision !== 'all' && (
            <Chip
              size="small"
              label={`AI: ${filters.aiDecision}`}
              onDelete={() => onFilterChange('aiDecision', 'all')}
            />
          )}
          {filters.rating !== 'all' && (
            <Chip
              size="small"
              label={`Rating: ${filters.rating}`}
              onDelete={() => onFilterChange('rating', 'all')}
            />
          )}
          {filters.hasOverride !== 'all' && (
            <Chip
              size="small"
              label={`Override: ${filters.hasOverride}`}
              onDelete={() => onFilterChange('hasOverride', 'all')}
            />
          )}
          {filters.flagged !== 'all' && (
            <Chip
              size="small"
              label={`Flagged: ${filters.flagged}`}
              onDelete={() => onFilterChange('flagged', 'all')}
            />
          )}
          {filters.dateFrom && (
            <Chip
              size="small"
              label={`From: ${filters.dateFrom.toLocaleDateString()}`}
              onDelete={() => onFilterChange('dateFrom', null)}
            />
          )}
          {filters.dateTo && (
            <Chip
              size="small"
              label={`To: ${filters.dateTo.toLocaleDateString()}`}
              onDelete={() => onFilterChange('dateTo', null)}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            ({filteredCount} of {totalCount} reviews)
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

ReviewModerationToolbar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    aiDecision: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasOverride: PropTypes.string,
    flagged: PropTypes.string,
    dateFrom: PropTypes.object,
    dateTo: PropTypes.object,
  }).isRequired,
  filterStatus: PropTypes.string.isRequired,
  canReset: PropTypes.bool.isRequired,
  totalCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};
