import { CONFIG } from 'src/global-config';

import { CityDetailsView } from 'src/sections/city/city-details-view';

export const metadata = { title: `City details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = await params;

  return <CityDetailsView cityId={id} />;
}
