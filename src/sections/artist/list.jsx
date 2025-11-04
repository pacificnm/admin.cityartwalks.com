/**
 * @file list.jsx
 * @description Artist list view component with table display
 * @namespace CityArtWalks.Sections.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { AddIcon } from 'src/components/icons';
import { ArtistTable } from 'src/components/artist';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

/**
 * @description Artist List View component that displays a table of artists with pagination.
 * @memberof CityArtWalks.Sections.Artist
 * @function ArtistListPage
 * @returns {JSX.Element} The Artist List View component.
 */
export function ArtistListPage() {
  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Artists"
        links={[
          { name: 'Dashboard', href: paths.root },
          { name: 'Artists' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.artist.create}
            variant="contained"
            startIcon={<AddIcon />}
          >
            New Artist
          </Button>
        }
        sx={{ mb: { xs: 3, md: 2 } }}
      />

      <ArtistTable />
    </DashboardContent>
  );
}
