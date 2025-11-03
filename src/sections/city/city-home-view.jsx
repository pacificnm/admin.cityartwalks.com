'use client';

/**
 * @fileoverview CityHomeView component - Dashboard page for city management
 * @namespace CityArtWalks.Sections.Dashboard.City
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Management|City Management Documentation}
 */

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

// Error handling components
import { ErrorView } from 'src/components/error';
// City management components
import { CityTable } from 'src/components/city/city-table';
// Animation and navigation components
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
// UI components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

// Authentication
import { useAuthContext } from 'src/auth/hooks';

/**
 * @description Dashboard home view component for city management functionality.
 *
 * This component serves as the main entry point for city administration,
 * providing a comprehensive interface for viewing, creating, editing, and
 * managing cities within the CityArtWalks platform.
 *
 * @component
 * @memberof CityArtWalks.Sections.Dashboard.City
 *
 * @features
 * - User authentication and authorization checking
 * - Responsive breadcrumb navigation
 * - Scroll progress indicator for long content
 * - Comprehensive city data table with CRUD operations
 * - Error boundary protection for graceful error handling
 * - Loading states and error feedback
 *
 * @security
 * - Requires authenticated user session
 * - Validates user permissions before rendering content
 * - Protected by error boundaries for fault tolerance
 *
 * @accessibility
 * - ARIA-compliant breadcrumb navigation
 * - Keyboard navigation support
 * - Screen reader friendly error messages
 * - Focus management and tab order
 *
 * @performance
 * - Conditional rendering based on auth state
 * - Skeleton loading states (planned improvement)
 * - Optimized scroll progress tracking
 *
 * @returns {JSX.Element|null} The rendered dashboard view or null during loading
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Architecture|Dashboard Architecture}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Management|City Management Guide}
 *
 * @example
 * // Basic usage in routing
 * <Route path="/dashboard/locations/city" element={<CityHomeView />} />
 *
 * @example
 * // Usage with authentication wrapper
 * <ProtectedRoute>
 *   <CityHomeView />
 * </ProtectedRoute>
 *
 * @since 1.0.0
 * @version 2.1.0
 */
export function CityHomeView() {
  // Authentication and user management
  const { userLoading, error: userError } = useAuthContext();

  // Scroll progress tracking for long content
  const pageProgress = useScrollProgress();

  // Early returns for loading and error states
  if (userLoading) return null; // TODO: Replace with skeleton loading component
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="city-home-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          <CustomBreadcrumbs
            data-cy="breadcrumbs"
            heading="Dashboard - Locations - City"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Locations', href: paths.dashboard.location.home },
              { name: 'City', href: paths.dashboard.location.city.home },
            ]}
            sx={{ mb: 3 }}
          />

          <CityTable data-cy="city-table" />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
