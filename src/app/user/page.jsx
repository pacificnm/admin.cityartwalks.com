import { CONFIG } from 'src/global-config';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

/**
 * User profile dashboard page.
 *
 * @fileoverview Renders the user profile view for the dashboard.
 * @returns {JSX.Element}
 */
export default function Page() {
  return <UserProfileView />;
}
