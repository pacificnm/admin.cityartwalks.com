/**
 * @namespace CityArtWalks.Components.Path.PathFiltersSkeleton
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { ChevronDownIcon } from 'src/components/icons';

/**
 * Path Filters Skeleton Component
 *
 * Displays skeleton loading state for path filters while data is being loaded
 * from IndexedDB or during initial API fetch.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.expanded=false] - Whether the accordion should be expanded
 * @returns {JSX.Element} The skeleton component
 */
export function PathFiltersSkeleton({ expanded = false }) {
  return (
    <Accordion expanded={expanded} sx={{ mb: 2 }}>
      <AccordionSummary
        expandIcon={<ChevronDownIcon />}
        aria-controls="filters-content"
        id="filters-header"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="circular" width={20} height={20} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Search and Tool Menu Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: 1.5,
            }}
          >
            <Skeleton variant="rectangular" height={56} sx={{ flexGrow: 1, borderRadius: 1 }} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>

          {/* Filter Controls Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={160} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
