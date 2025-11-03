/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Pages.Dashboard.Artist
 */

import { CONFIG } from 'src/global-config';

import { ArtPieceCreateView } from 'src/sections/art-piece/art-piece-create-view';

/**
 * @memberof CityArtWalks.Pages.Dashboard.ArtPiece
 * @description Metadata information for the Home page.
 *
 * @constant {Object} metadata
 * @property {string} title - The title of the Home page, dynamically including the application name.
 * @property {string} description - A brief description of the Home page, highlighting its purpose and features.
 */
export const metadata = {
  title: `Dashboard - Art Piece - Create - ${CONFIG.appName}`,
};

/**
 * @memberof CityArtWalks.Pages.Dashboard.ArtPiece
 * @function Page
 * The main page component for the Dashboard view.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard view component.
 */
export default async function Page() {
  return <ArtPieceCreateView />;
}
