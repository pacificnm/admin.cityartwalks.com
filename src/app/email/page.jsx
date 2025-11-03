import { CONFIG } from 'src/global-config';

import { EmailDashboardView } from 'src/sections/email/email-dashboard-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Email Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <EmailDashboardView />;
}
