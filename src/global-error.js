'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from 'src/theme';

import { ErrorView } from 'src/components/error/error-view';

const theme = createTheme();

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container
            maxWidth="lg"
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <ErrorView
              status={500}
              message={error?.message || 'A global error occurred'}
              error={error}
              stack={error?.stack}
            />
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
