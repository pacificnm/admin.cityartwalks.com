import { CONFIG } from 'src/global-config';

import { EmailTemplateHomeView } from 'src/sections/email-template/email-template-home-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Email Templates | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <EmailTemplateHomeView />;
}
