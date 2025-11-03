import { HomeView } from '@/sections/home/home-view';

import { CONFIG } from 'src/global-config';

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <HomeView />;
}
