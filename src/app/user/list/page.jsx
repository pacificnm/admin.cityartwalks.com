/**
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.App.Dashboard.User.List.Page
 */
import { CONFIG } from 'src/global-config';

import { UserListView } from 'src/sections/user/view';

/**
 * @description Metadata object containing the title for the User List page in the Dashboard.
 * The title is dynamically generated using the application name from the global configuration.
 * @memberof CityArtWalks.App.Dashboard.User.List.Page
 * @constant
 * @type {{ title: string }}
 */
export const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

/**
 * @description Renders the User List page within the Dashboard.
 * This component displays the list of users by rendering the UserListView component.
 * @memberof CityArtWalks.App.Dashboard.User.List.Page
 * @function Page
 * @returns {JSX.Element} The rendered UserListView component for the dashboard user list page.
 * @memberof CityArtWalks.App.Dashboard.User.List.Page
 */
export default async function Page() {
  return <UserListView />;
}
