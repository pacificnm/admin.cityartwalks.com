/**
 * @file page.jsx
 * @description Dashboard artist details page component with artist detail view
 * @namespace CityArtWalks.Pages.Dashboard.Artist.Details
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist documentation
 */

import { CONFIG } from 'src/global-config';

import { ArtistDetailView } from 'src/sections/artist/details';

/**
 * Metadata information for the artist details page.
 *
 * @memberof CityArtWalks.Pages.Dashboard.Artist.Details
 * @type {Object}
 * @property {string} title - The title of the artist details page, dynamically including the application name
 */
export const metadata = {
  title: `Artist Details - ${CONFIG.appName}`,
};

/**
 * The main page component for the artist details view.
 *
 * @async
 * @function Page
 * @memberof CityArtWalks.Pages.Dashboard.Artist.Details
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters from Next.js
 * @param {string} props.params.id - The artist ID from the URL
 * @returns {Promise<JSX.Element>} The rendered artist details view component
 *
 * @example
 * // This page is automatically rendered by Next.js at /artist/[id]
 * // <ArtistDetailView id={params.id} /> provides the detail view for the specified artist
 */
export default async function Page({ params }) {
  const { id } = await params;

  return <ArtistDetailView id={id} />;
}
