'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import { ErrorBoundary } from 'src/components/error/error-boundary';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/auth0';

// ----------------------------------------------------------------------

export default function AuthLayout({ children }) {
  return (
    <I18nProvider lang="en">
      <AuthProvider>
        <ErrorBoundary>
          <SettingsProvider defaultSettings={defaultSettings}>
            <LocalizationProvider>
              <AppRouterCacheProvider options={{ key: 'css' }}>
                <ThemeProvider
                  modeStorageKey={themeConfig.modeStorageKey}
                  defaultMode={themeConfig.defaultMode}
                >
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  {children}
                </ThemeProvider>
              </AppRouterCacheProvider>
            </LocalizationProvider>
          </SettingsProvider>
        </ErrorBoundary>
      </AuthProvider>
    </I18nProvider>
  );
}