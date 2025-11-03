import { CONFIG } from 'src/global-config';

import { IndexNowProcessView } from 'src/sections/index-now-submission/view/index-now-process-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `IndexNow Processing | Dashboard - ${CONFIG.appName}`,
  description: 'Manually process IndexNow submissions and manage URL queue',
};

export default function Page() {
  return <IndexNowProcessView />;
}
