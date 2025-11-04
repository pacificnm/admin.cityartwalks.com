/**
 * Dashboard Image Management Page
 * Route: /dashboard/image
 */

import { ImageHomeView } from '@/sections/image/list';

export const metadata = {
  title: 'Dashboard: Images',
};

export default function ImageDashboardPage() {
  return <ImageHomeView />;
}
