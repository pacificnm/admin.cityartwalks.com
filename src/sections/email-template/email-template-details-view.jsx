'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export function EmailTemplateDetailsView() {
  const settings = useSettingsContext();

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Email Template Details
        </Typography>

        {/* TODO: Implement template details display */}
        <Typography variant="body1">Email template details will be displayed here.</Typography>
      </Container>
    </DashboardContent>
  );
}
