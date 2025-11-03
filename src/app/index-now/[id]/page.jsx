import { CONFIG } from 'src/global-config';

import { IndexNowSubmissionDetailView } from 'src/sections/index-now-submission/view/index-now-submission-detail-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `IndexNow Submission Details | Dashboard - ${CONFIG.appName}`,
  description: 'View detailed information about a specific IndexNow submission',
};

export default async function Page({ params }) {
  const { id } = await params;

  return <IndexNowSubmissionDetailView submissionId={id} />;
}
