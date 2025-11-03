'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Fab, Divider, Typography, useMediaQuery } from '@mui/material';

import { ChevronDownIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Art Piece Filters Skeleton Component
 *
 * Provides a skeleton interface that matches the exact layout of the ExploreHomeView
 * to prevent layout shift while filters are loading from IndexedDB or initializing.
 * Matches the Grid-based map/list layout structure.
 *
 * @param {Object} props
 * @param {boolean} props.expanded - Whether the accordion should be expanded
 */
export const ArtPieceFiltersSkeleton = React.memo(function ArtPieceFiltersSkeleton({
  expanded = false,
}) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
                  placeholder="Search art pieces by title, artist, location..."
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

              {/* Location Filters and Featured Filter Row Skeleton */}
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
                {/* Location Filters Skeleton (Country, State, City) */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Country Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 140 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        placeholder="Select country"
                        size="small"
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    )}
                  />

                  {/* State Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 120 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="State"
                        placeholder="Select state"
                        size="small"
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    )}
                  />

                  {/* City Filter Skeleton */}
                  <Autocomplete
                    disabled
                    options={[]}
                    sx={{ minWidth: 120 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        placeholder="Select city"
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

              {/* Artist Filter Skeleton */}
              <Autocomplete
                disabled
                options={[]}
                sx={{ minWidth: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Artist"
                    placeholder="Search artists..."
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

      {/* Main Content Skeleton - Match ExploreHomeView Grid Layout */}
      <Grid container spacing={3}>
        {isSmallScreen ? (
          // Mobile Layout: Single column with map placeholder
          <Grid size={12}>
            <Box
              sx={{
                height: '60vh',
                borderRadius: 2,
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          </Grid>
        ) : (
          // Desktop Layout: List (4 cols) + Map (8 cols)
          <>
            <Grid size={4}>
              <Box
                sx={{
                  height: '99vh',
                  overflowY: 'hidden',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {/* List skeleton */}
                <Box sx={{ p: 2 }}>
                  {Array.from({ length: 6 }, (_, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Skeleton variant="rectangular" height={120} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" height={16} width="70%" />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={8}>
              <Box
                sx={{
                  height: '99vh',
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Skeleton variant="text" width={100} height={24} />
              </Box>
            </Grid>
          </>
        )}

        {/* Explore Other Cities Section Skeleton */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1, mt: 3 }}>
            <Skeleton variant="text" width={200} height={36} />
          </Typography>
          <Divider />
          <Box sx={{ width: '100%', mt: 3 }}>
            {/* HierarchicalDisplay skeleton */}
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={16} width="60%" />
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Mobile Fab Button Skeleton */}
      {isSmallScreen && (
        <Fab
          disabled
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            opacity: 0.5,
          }}
        >
          <Skeleton variant="text" width={40} height={16} />
        </Fab>
      )}
    </>
  );
});
