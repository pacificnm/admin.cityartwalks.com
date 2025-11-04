/**
 * @file page.jsx
 * @description Dashboard artist management page component with artist home view
 * @namespace CityArtWalks.Pages.Dashboard.Artist
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

import { CONFIG } from 'src/global-config';

import { ArtistListPage } from 'src/sections/artist/list';

/**
 * Metadata information for the artist dashboard page.
 *
 * @memberof CityArtWalks.Pages.Dashboard.Artist
 * @type {Object}
 * @property {string} title - The title of the artist dashboard page, dynamically including the application name
 */
export const metadata = {
  title: `Dashboard - Artist - ${CONFIG.appName}`,
};

/**
 * The main page component for the artist dashboard view.
 *
 * @function Page
 * @memberof CityArtWalks.Pages.Dashboard.Artist
 * @returns {JSX.Element} The rendered artist list view component
 *
 * @example
 * // This page is automatically rendered by Next.js at /artist
 * // <ArtistListPage /> provides the artist list interface
 */
export default function Page() {
  return <ArtistListPage />;
}
