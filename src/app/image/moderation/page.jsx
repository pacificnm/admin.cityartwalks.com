/**
 * Dashboard Image Moderation Page
 * Route: /dashboard/image/moderation
 * Restricted to ADMIN users only
 */

import { ImageModerationView } from 'src/sections/image/image-moderation-view';

export const metadata = {
  title: 'Dashboard: Image Moderation',
  description: 'Review and moderate flagged images',
};

export default function ImageModerationPage() {
  return <ImageModerationView />;
}
