/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardTitle
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import ListItemText from '@mui/material/ListItemText';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardTitle
 * @function ArtistCardTitle
 * @description Renders the title of an artist card.
 * Displays the artist's name with styled typography.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the artist to be displayed as the title.
 * @returns {JSX.Element} The rendered ArtistCardTitle component.
 *
 * @example
 * // Usage example
 * import { ArtistCardTitle } from './ArtistCardTitle';
 *
 * function App() {
 *   return <ArtistCardTitle name="Vincent van Gogh" />;
 * }
 */
export function ArtistCardTitle({ name }) {
  return (
    <ListItemText
      sx={{ mt: 7, mb: 1 }}
      primary={name}
      primaryTypographyProps={{ typography: 'subtitle1' }}
      secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
    />
  );
}

/**
 * PropTypes Validation for ArtistCardTitle Component
 *
 * @memberof CityArtWalks.Components.Artist.ArtistCardTitle
 * @name ArtistCardTitle.propTypes
 * @type {Object}
 */
ArtistCardTitle.propTypes = {
  name: PropTypes.string.isRequired,
};
