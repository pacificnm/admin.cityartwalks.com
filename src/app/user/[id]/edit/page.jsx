/**
 * @author Jaimie Garner
 * @version 1.0.1
 * @namespace CityArtWalks.App.Dashboard.User.Id.Page
 */
import { CONFIG } from 'src/global-config';

import { UseAdminView } from 'src/sections/user/view';

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = await params;
  return <UseAdminView userId={id} />;
}
