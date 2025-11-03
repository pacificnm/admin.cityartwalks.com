import { CONFIG } from 'src/global-config';

import { IndexNowSubmissionListView } from 'src/sections/index-now-submission/view/index-now-submission-list-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `IndexNow Submissions | Dashboard - ${CONFIG.appName}`,
  description: 'Manage IndexNow URL submissions and monitor SEO indexing status',
};

export default function Page() {
  return <IndexNowSubmissionListView />;
}
