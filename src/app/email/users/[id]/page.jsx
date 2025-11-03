import { CONFIG } from 'src/global-config';

import { UserEmailHistoryView } from 'src/sections/email/user-email-history-view';

// ----------------------------------------------------------------------

export const metadata = { title: `User Email History - ${CONFIG.appName}` };

export default function Page({ params }) {
  const { id } = params;

  return <UserEmailHistoryView userId={id} />;
}
