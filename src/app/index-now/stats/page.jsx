import { CONFIG } from 'src/global-config';

import { IndexNowStatsView } from 'src/sections/index-now-submission/view/index-now-stats-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `IndexNow Statistics | Dashboard - ${CONFIG.appName}`,
  description: 'View IndexNow submission statistics and monitoring dashboard',
};

export default function Page() {
  return <IndexNowStatsView />;
}
