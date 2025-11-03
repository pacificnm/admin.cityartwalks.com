import { CONFIG } from 'src/global-config';

import { UserCommunicationView } from 'src/sections/email/user-communication-view';

// ----------------------------------------------------------------------

export const metadata = { title: `User Communication History - ${CONFIG.appName}` };

export default function Page() {
  return <UserCommunicationView />;
}
