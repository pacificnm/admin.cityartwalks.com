'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { ChevronDownIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Review Filters Skeleton Component
 *
 * Skeleton loading state for review table toolbar filters.
 * Matches the layout of the accordion-based filters.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.expanded=false] - Whether accordion is expanded
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewFiltersSkeleton = React.memo(function ReviewFiltersSkeleton({
  expanded = false,
  sx,
  ...other
}) {
  return (
    <Box sx={{ ...sx }} {...other}>
      {/* Accordion Header */}
      <Accordion expanded={expanded} disabled>
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls="filters-content"
          id="filters-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2">Search & Filters</Typography>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </AccordionSummary>
        {expanded && (
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Search Field Skeleton */}
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Skeleton variant="rounded" height={40} sx={{ flexGrow: 1 }} />
                <Skeleton variant="rounded" width={40} height={40} />
              </Box>

              {/* Filter Controls Skeleton */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Skeleton variant="rounded" width={140} height={40} />
                <Skeleton variant="rounded" width={160} height={40} />
                <Skeleton variant="rounded" width={120} height={40} />
                <Skeleton variant="rounded" width={120} height={40} />
              </Box>
            </Box>
          </AccordionDetails>
        )}
      </Accordion>

      {/* Content Area Skeleton */}
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={400} />
      </Box>

      {/* Pagination Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Skeleton variant="rounded" width={40} height={32} />
          <Skeleton variant="text" width={100} height={32} />
          <Skeleton variant="rounded" width={40} height={32} />
        </Box>
      </Box>
    </Box>
  );
});

/**
 * Review Item Skeleton Component
 *
 * Skeleton for individual review items matching the layout of review-item.jsx
 *
 * @param {Object} props - Component props
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewItemSkeleton = React.memo(function ReviewItemSkeleton({ sx, ...other }) {
  return (
    <Card sx={{ mb: 2, ...sx }} {...other}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        action={
          <IconButton disabled sx={{ opacity: 0.3 }}>
            <VerticalFillIcon />
          </IconButton>
        }
        title={<Skeleton variant="text" width="40%" height={24} />}
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Rating value={0} readOnly size="small" sx={{ opacity: 0.3 }} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>
        }
      />
      <CardContent>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="75%" height={20} />

        {/* Entity info skeleton */}
        <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
      </CardContent>
    </Card>
  );
});

/**
 * Review List Skeleton Component
 *
 * Skeleton for review lists with multiple items
 *
 * @param {Object} props - Component props
 * @param {number} [props.itemCount=5] - Number of skeleton items to show
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewListSkeleton = React.memo(function ReviewListSkeleton({
  itemCount = 5,
  sx,
  ...other
}) {
  return (
    <Box sx={sx} {...other}>
      {Array.from({ length: itemCount }, (_, index) => (
        <ReviewItemSkeleton key={index} />
      ))}

      {/* Pagination skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="text" width={80} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="text" width={100} height={32} />
        </Box>
      </Box>
    </Box>
  );
});

/**
 * Review Summary Card Skeleton Component
 *
 * Skeleton for review summary cards matching review-summary-card.jsx layout
 *
 * @param {Object} props - Component props
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewSummaryCardSkeleton = React.memo(function ReviewSummaryCardSkeleton({
  sx,
  ...other
}) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={<Skeleton variant="text" width="60%" height={28} />}
        subheader={<Skeleton variant="text" width="40%" height={20} />}
      />
      <CardContent>
        {/* Average rating skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Skeleton variant="text" width={60} height={48} />
            <Rating value={0} readOnly size="large" sx={{ opacity: 0.3 }} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>

          {/* Rating distribution skeleton */}
          <Box sx={{ flexGrow: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Skeleton variant="text" width={20} height={16} />
                <Skeleton variant="rectangular" width="100%" height={8} />
                <Skeleton variant="text" width={30} height={16} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent reviews skeleton */}
        <Typography variant="h6" gutterBottom>
          <Skeleton variant="text" width="50%" height={24} />
        </Typography>

        {Array.from({ length: 3 }, (_, index) => (
          <Box key={index} sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="30%" height={16} />
              <Rating value={0} readOnly size="small" sx={{ opacity: 0.3 }} />
            </Box>
            <Skeleton variant="text" width="90%" height={16} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
});

/**
 * Review Rating Input Skeleton Component
 *
 * Skeleton for rating input components
 *
 * @param {Object} props - Component props
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewRatingInputSkeleton = React.memo(function ReviewRatingInputSkeleton({
  sx,
  ...other
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }} {...other}>
      <Skeleton variant="text" width={80} height={20} />
      <Rating value={0} readOnly size="large" sx={{ opacity: 0.3 }} />
      <Skeleton variant="text" width="60%" height={16} />
    </Box>
  );
});

/**
 * Review Table Toolbar Skeleton Component
 *
 * Skeleton for review table toolbar matching review-table-toolbar.jsx layout
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.expanded=false] - Whether the accordion should be expanded
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewTableToolbarSkeleton = React.memo(function ReviewTableToolbarSkeleton({
  expanded = false,
  sx,
  ...other
}) {
  return (
    <Box sx={sx} {...other}>
      {/* Status tabs skeleton */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          {['All', 'Active', 'Pending', 'Rejected'].map((tab, index) => (
            <Skeleton key={tab} variant="text" width={80} height={40} />
          ))}
        </Box>
      </Box>

      {/* Filters Accordion Skeleton */}
      <Accordion expanded={expanded} disabled sx={{ mb: 2, pointerEvents: 'none' }}>
        <AccordionSummary
          expandIcon={<ChevronDownIcon />}
          aria-controls="filters-content"
          id="filters-header"
          sx={{ opacity: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Search and Tool Menu Row Skeleton */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 1.5,
              }}
            >
              {/* Search Input Skeleton */}
              <TextField
                disabled
                placeholder="Search reviews by comment, reviewer, entity..."
                sx={{ flexGrow: 1 }}
                InputProps={{
                  sx: { backgroundColor: 'action.hover' },
                }}
              />

              {/* Action Menu Skeleton */}
              <IconButton disabled sx={{ opacity: 0.5 }}>
                <VerticalFillIcon />
              </IconButton>
            </Box>

            {/* Rating and Entity Type Filters Row Skeleton */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {/* Rating Filter Skeleton */}
              <Autocomplete
                disabled
                options={[]}
                sx={{ minWidth: 120 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rating"
                    placeholder="Select rating"
                    size="small"
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  />
                )}
              />

              {/* Entity Type Filter Skeleton */}
              <Autocomplete
                disabled
                options={[]}
                sx={{ minWidth: 140 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Entity Type"
                    placeholder="Select type"
                    size="small"
                    sx={{
                      '& .MuiInputBase-root': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Date Range Filters Skeleton */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                disabled
                label="Date From"
                size="small"
                sx={{
                  minWidth: 140,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
              <TextField
                disabled
                label="Date To"
                size="small"
                sx={{
                  minWidth: 140,
                  '& .MuiInputBase-root': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

/**
 * Review Table Row Skeleton Component
 *
 * Skeleton for review table rows
 *
 * @param {Object} props - Component props
 * @param {number} [props.rowCount=5] - Number of skeleton rows to show
 * @param {number} [props.cellCount=6] - Number of cells per row
 */
export const ReviewTableRowSkeleton = React.memo(function ReviewTableRowSkeleton({
  rowCount = 5,
  cellCount = 6,
  ...other
}) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr key={rowIndex} {...other}>
      {Array.from({ length: cellCount }, (__, cellIndex) => (
        <td key={cellIndex} style={{ padding: '16px' }}>
          {cellIndex === 0 ? (
            // First cell - user avatar and info
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Box>
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={80} height={14} />
              </Box>
            </Box>
          ) : cellIndex === 1 ? (
            // Rating cell
            <Rating value={0} readOnly size="small" sx={{ opacity: 0.3 }} />
          ) : cellIndex === cellCount - 1 ? (
            // Last cell - actions
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          ) : (
            // Regular content cells
            <Skeleton variant="text" width="80%" />
          )}
        </td>
      ))}
    </tr>
  ));
});

/**
 * Review Filters Result Skeleton Component
 *
 * Skeleton for active filter display
 *
 * @param {Object} props - Component props
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewFiltersResultSkeleton = React.memo(function ReviewFiltersResultSkeleton({
  sx,
  ...other
}) {
  return (
    <Box sx={{ mb: 2, ...sx }} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={80} height={16} />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* Filter chips skeleton */}
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} variant="rounded" width={80} height={32} />
        ))}

        {/* Clear button skeleton */}
        <Skeleton variant="rounded" width={60} height={32} />
      </Box>
    </Box>
  );
});

/**
 * Complete Review Section Skeleton Component
 *
 * Comprehensive skeleton for entire review sections
 *
 * @param {Object} props - Component props
 * @param {string} [props.variant='list'] - Type of skeleton ('list', 'summary', 'table')
 * @param {Object} [props.sx] - Additional styling
 */
export const ReviewSectionSkeleton = React.memo(function ReviewSectionSkeleton({
  variant = 'list',
  sx,
  ...other
}) {
  if (variant === 'summary') {
    return (
      <Box sx={sx} {...other}>
        <ReviewSummaryCardSkeleton />
      </Box>
    );
  }

  if (variant === 'table') {
    return (
      <Box sx={sx} {...other}>
        <ReviewTableToolbarSkeleton />
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <ReviewTableRowSkeleton />
          </table>
        </Box>
      </Box>
    );
  }

  // Default list variant
  return (
    <Box sx={sx} {...other}>
      <ReviewTableToolbarSkeleton />
      <ReviewListSkeleton />
    </Box>
  );
});
