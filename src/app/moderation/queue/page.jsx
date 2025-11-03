/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.App.Dashboard.Moderation.Queue.Page
 */
import { CONFIG } from 'src/global-config';

import { ModerationQueueView } from 'src/sections/moderation/view';

export const metadata = { title: `Moderation Queue | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ModerationQueueView />;
}
