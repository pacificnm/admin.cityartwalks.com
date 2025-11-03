/**
 * @file post-filters-skeleton.jsx
 * @description Post Filters Skeleton Component
 * @namespace CityArtWalks.Components.Post.PostFiltersSkeleton
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ChevronDownIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Post Filters Skeleton Component
 *
 * Provides a skeleton interface that matches the exact layout of the post filters
 * to prevent layout shift while filters are loading from IndexedDB or initializing.
 * All form elements are disabled and show skeleton loading states.
 *
 * @param {Object} props
 * @param {boolean} props.expanded - Whether the accordion should be expanded
 */
export const PostFiltersSkeleton = React.memo(function PostFiltersSkeleton({ expanded = false }) {
  return (
    <>
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
            {/* Skeleton Filter Content */}
            <Box
              sx={{
                gap: 1.5,
                flexGrow: 1,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
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
                  placeholder="Search posts by title, content, category..."
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

              {/* Category Filters and Featured Filter Row Skeleton */}
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
                {/* Category and Status Filters Skeleton */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Category Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 140 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        placeholder="Select category"
                        size="small"
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    )}
                  />

                  {/* Status Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 120 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        placeholder="Select status"
                        size="small"
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    )}
                  />

                  {/* Tags Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 120 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select tags"
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

                {/* Featured Filter Skeleton */}
                <FormControlLabel
                  control={<Checkbox disabled sx={{ opacity: 0.5 }} />}
                  label="Featured"
                  sx={{ opacity: 0.7 }}
                />
              </Box>

              {/* Author Filter Skeleton */}
              <Autocomplete
                disabled
                options={[]}
                sx={{ minWidth: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Author"
                    placeholder="Search authors..."
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
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Post Cards Skeleton */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          mb: 2,
        }}
      >
        {/* Create 6 skeleton cards to match typical initial load */}
        {Array.from({ length: 6 }, (_, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Card image skeleton */}
            <Skeleton variant="rectangular" height={180} sx={{ bgcolor: 'action.hover' }} />

            {/* Card content skeleton */}
            <Box sx={{ p: 2 }}>
              {/* Title skeleton */}
              <Skeleton variant="text" height={28} sx={{ mb: 1 }} />

              {/* Excerpt skeleton */}
              <Skeleton variant="text" height={20} width="85%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />

              {/* Meta info row skeleton */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" height={16} width={80} />
                <Skeleton variant="text" height={16} width={60} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Pagination Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="text" width={80} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="text" width={100} height={32} />
        </Box>
      </Box>
    </>
  );
});
