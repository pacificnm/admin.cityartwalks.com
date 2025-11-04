import "src/global.css";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { CONFIG } from "src/global-config";
import { primary } from "src/theme/core/palette";
import { LocalizationProvider } from "src/locales";
import { detectLanguage } from "src/locales/server";
import { themeConfig, ThemeProvider } from "src/theme";
import { DashboardLayout } from "src/layouts/dashboard";
import { I18nProvider } from "src/locales/i18n-provider";

import { Snackbar } from "src/components/snackbar";
import { ProgressBar } from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { detectSettings } from "src/components/settings/server";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "src/components/settings";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: primary.main,
};

// ----------------------------------------------------------------------

export const metadata = {
  metadataBase: new URL(CONFIG.serverUrl || "http://localhost:3000"),
  icons: [
    {
      rel: "icon",
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: "en",
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [lang, settings] = await Promise.all([
      detectLanguage(),
      detectSettings(),
    ]);

    return {
      lang,
      i18nLang: lang,
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

// ----------------------------------------------------------------------

export default async function RootLayout({ children }) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

        <I18nProvider lang={appConfig.i18nLang}>
          <UserProvider>
            <SettingsProvider
              cookieSettings={appConfig.cookieSettings}
              defaultSettings={defaultSettings}
            >
              <LocalizationProvider>
                <AppRouterCacheProvider options={{ key: "css" }}>
                  <ThemeProvider
                    modeStorageKey={themeConfig.modeStorageKey}
                    defaultMode={themeConfig.defaultMode}
                  >
                    <MotionLazy>
                      <Snackbar />
                      <ProgressBar />
                      <SettingsDrawer defaultSettings={defaultSettings} />
                      <DashboardLayout>{children}</DashboardLayout>
                    </MotionLazy>
                  </ThemeProvider>
                </AppRouterCacheProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </UserProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
