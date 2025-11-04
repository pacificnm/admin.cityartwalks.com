/**
 * @file create.jsx
 * @description Artist creation view component
 * @namespace CityArtWalks.Sections.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { ArtistForm } from 'src/forms/artist/artist-form';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

/**
 * @description Artist Create View component with form
 * @memberof CityArtWalks.Sections.Artist
 * @function ArtistCreateView
 * @returns {JSX.Element} The Artist Create View component.
 */
export function ArtistCreateView() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(paths.artist.home);
  };

  const handleCancel = () => {
    router.push(paths.artist.home);
  };

  return (
    <DashboardContent maxWidth={false}>
      <CustomBreadcrumbs
        heading="Create Artist"
        links={[
          { name: 'Dashboard', href: paths.root },
          { name: 'Artists', href: paths.artist.home },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 2 } }}
      />

      <ArtistForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </DashboardContent>
  );
}
