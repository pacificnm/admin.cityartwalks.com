/**
 * @file page.jsx
 * @description Dashboard artist creation page component with artist create form view
 * @namespace CityArtWalks.Pages.Dashboard.Artist.Create
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

import { CONFIG } from 'src/global-config';

import { ArtistCreateView } from 'src/sections/artist/artist-create-view';

/**
 * Metadata information for the artist creation page.
 *
 * @memberof CityArtWalks.Pages.Dashboard.Artist.Create
 * @type {Object}
 * @property {string} title - The title of the artist creation page, dynamically including the application name
 */
export const metadata = {
  title: `Dashboard - Artist - ${CONFIG.appName}`,
};

/**
 * The main page component for the artist creation view.
 *
 * @async
 * @function Page
 * @memberof CityArtWalks.Pages.Dashboard.Artist.Create
 * @returns {Promise<JSX.Element>} The rendered artist creation view component
 *
 * @example
 * // This page is automatically rendered by Next.js at /dashboard/artist/create
 * // <ArtistCreateView /> provides the form interface for creating new artists
 */
export default async function Page() {
  return <ArtistCreateView />;
}
