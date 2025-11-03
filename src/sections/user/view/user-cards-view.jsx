'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AddIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCardList } from '../user-card-list';

// ----------------------------------------------------------------------

export function UserCardsView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User cards"
        links={[
          { name: 'Dashboard', href: paths.root },
          { name: 'User', href: paths.user.root },
          { name: 'Cards' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.user.root}
            variant="contained"
            startIcon={<AddIcon />}
          >
            New user
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCardList users={_userCards} />
    </DashboardContent>
  );
}
