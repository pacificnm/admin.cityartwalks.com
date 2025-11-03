'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ElementLatitude, ElementLongitude } from 'src/forms/elements';

import { Form, Field } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export function UserAdminAnalyticsQuickEdit({ currentAnalytics, open, onClose, mutate }) {
  const methods = useForm({
    mode: 'all',
    defaultValues: currentAnalytics || {},
    values: currentAnalytics || {}, // Ensures values update if currentAnalytics changes
  });

  const { handleSubmit, reset } = methods;

  // Keep form values in sync with currentAnalytics
  useEffect(() => {
    if (currentAnalytics) {
      reset(currentAnalytics);
    }
  }, [currentAnalytics, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Submitted data:', data);
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Analytics Event</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ mb: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              alignItems: 'start',
              alignContent: 'start',
              pt: 3,
            }}
          >
            <Field.Text
              name="timestamp"
              label="Timestamp"
              disabled
              value={
                currentAnalytics?.timestamp
                  ? new Date(currentAnalytics.timestamp).toLocaleString()
                  : ''
              }
            />
            <Field.Text name="analyticsId" label="Analytics ID" disabled />
            <Field.Text name="type" label="Analytics Type" disabled />
            <Field.Text name="event" label="Analytics Event" disabled />
          </Box>
          <Divider sx={{ pb: 3 }} />
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              alignItems: 'start',
              alignContent: 'start',
              pt: 3,
            }}
          >
            <Field.Text name="visitorId" label="Visitor ID" disabled />
            <Field.Text name="sessionId" label="Session ID" disabled />
            <Field.Text name="path" label="Analytics Path" disabled />
            <Field.Text name="userAgent" label="User Agent" disabled />
          </Box>
          <Divider sx={{ pb: 3 }} />

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              alignItems: 'start',
              alignContent: 'start',
              pt: 3,
            }}
          >
            <Field.Text name="userId" label="User ID" disabled />
            <Field.Text name="ip" label="IP Address" disabled />
          </Box>
          <Divider sx={{ pb: 3 }} />
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              alignItems: 'start',
              alignContent: 'start',
              pt: 3,
            }}
          >
            <Field.Text
              name="data"
              label="Analytics Data"
              multiline
              rows={6}
              disabled
              value={currentAnalytics?.data ? JSON.stringify(currentAnalytics.data, null, 2) : ''}
            />
          </Box>
          <Divider sx={{ pb: 3 }} />
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              alignItems: 'start',
              alignContent: 'start',
              pt: 3,
            }}
          >
            <Field.Text name="country" label="Country" disabled />
            <Field.Text name="region" label="Region" disabled />
            <Field.Text name="city" label="City" disabled />
            <Field.Text name="postalCode" label="Postal Code" disabled />
            <ElementLatitude disabled />
            <ElementLongitude disabled />
            <Field.Text name="timezone" label="Timezone" disabled />
            <Field.Text name="isp" label="ISP" disabled />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
