import { CONFIG } from 'src/global-config';

import { StateDetailsView } from 'src/sections/state/state-details-view';

export const metadata = { title: `State details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = await params;

  return <StateDetailsView stateId={id} />;
}
