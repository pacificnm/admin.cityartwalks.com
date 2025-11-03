/**
 * @fileoverview DashboardPage Component
 *
 * Reusable dashboard page wrapper that provides common dashboard layout
 * structure including scroll progress, back to top, breadcrumbs, and
 * content container. This component serves as the standard layout for
 * all dashboard pages in the application.
 *
 * @namespace CityArtWalks.Components.Page
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for UI structure
 * @requires src/layouts/dashboard - Dashboard layout components
 * @requires src/components/animate - Animation components
 * @requires src/components/custom-breadcrumbs - Breadcrumb navigation
 * @requires src/components/error - Error handling components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Dashboard-Layout} - Dashboard Layout Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components Documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Container } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * PageDashboard Component
 *
 * Provides standardized dashboard page layout with:
 * - Error boundary for error handling
 * - Scroll progress indicator
 * - Back to top functionality
 * - Breadcrumb navigation
 * - Content container with proper spacing
 * - Action button support in breadcrumbs
 *
 * @memberof CityArtWalks.Components.Page
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {string} props.heading - Page heading text for breadcrumbs
 * @param {Array<Object>} props.links - Breadcrumb navigation links
 * @param {React.ReactNode} [props.action] - Optional action component (usually a button)
 * @param {boolean} [props.maxWidth=false] - Whether to limit container max width
 * @param {Object} [props.sx] - Additional styles for the container
 * @param {string} [props.dataCy] - Cypress test identifier
 *
 * @returns {JSX.Element} The rendered dashboard page component
 *
 * @example
 * <DashboardPage
 *   heading="Art Piece Queue"
 *   links={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Dashboard', href: '/dashboard' },
 *     { name: 'Queue', href: '/dashboard/queue' },
 *   ]}
 *   action={<Button>Add New</Button>}
 * >
 *   <YourPageContent />
 * </DashboardPage>
 */
export function PageDashboard({
  children,
  heading,
  links,
  action,
  maxWidth = false,
  sx,
  dataCy = 'dashboard-page',
  ...other
}) {
  const pageProgress = useScrollProgress();

  return (
    <ErrorBoundary>
      <DashboardContent>
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={maxWidth} sx={{ mb: 4, ...sx }} data-cy={dataCy} {...other}>
          {heading && links && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading={heading}
              links={links}
              action={action}
              sx={{ mb: 3 }}
            />
          )}

          {children}
        </Container>
      </DashboardContent>
    </ErrorBoundary>
  );
}

PageDashboard.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
  action: PropTypes.node,
  maxWidth: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  sx: PropTypes.object,
  dataCy: PropTypes.string,
};
