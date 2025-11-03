/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.App.Dashboard.Moderation.Page
 */
import { CONFIG } from 'src/global-config';

import { ModerationView } from 'src/sections/moderation/view';

export const metadata = { title: `Review Moderation | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ModerationView />;
}
