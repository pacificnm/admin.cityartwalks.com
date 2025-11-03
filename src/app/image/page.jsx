/**
 * Dashboard Image Management Page
 * Route: /dashboard/image
 */

import { ImageHomeView } from 'src/sections/image/image-home-view';

export const metadata = {
  title: 'Dashboard: Images',
};

export default function ImageDashboardPage() {
  return <ImageHomeView />;
}
