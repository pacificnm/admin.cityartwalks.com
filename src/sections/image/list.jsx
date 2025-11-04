/**
 * @file list.jsx
 * @description Image list view component with table display
 * @namespace CityArtWalks.Sections.Image
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { ImageTable } from 'src/components/image';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

/**
 * @description Image List View component that displays a table of images with pagination.
 * @memberof CityArtWalks.Sections.Image
 * @function ImageHomeView
 * @returns {JSX.Element} The Image List View component.
 */
export function ImageHomeView() {
  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Images"
        links={[
          { name: 'Dashboard', href: paths.root },
          { name: 'Images' },
        ]}
        sx={{ mb: { xs: 3, md: 2 } }}
      />

      <ImageTable />
    </DashboardContent>
  );
}
