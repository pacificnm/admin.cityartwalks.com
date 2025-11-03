/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Pages.Dashboard.State
 */

import { CONFIG } from 'src/global-config';

import { CityHomeView } from 'src/sections/city/city-home-view';

/**
 * @memberof CityArtWalks.Pages.Dashboard.City
 * @description Metadata information for the Home page.
 *
 * @constant {Object} metadata
 * @property {string} title - The title of the Home page, dynamically including the application name.
 * @property {string} description - A brief description of the Home page, highlighting its purpose and features.
 */
export const metadata = {
  title: `Dashboard - Location - City - ${CONFIG.appName}`,
};

/**
 * @memberof CityArtWalks.Pages.Dashboard.City
 * @function Page
 * The main page component for the Dashboard view.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard view component.
 */
export default async function Page() {
  return <CityHomeView />;
}
