import { CONFIG } from 'src/global-config';

import { EmailManagementView } from 'src/sections/email/email-management-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Email Management - ${CONFIG.appName}` };

export default function Page() {
  return <EmailManagementView />;
}
