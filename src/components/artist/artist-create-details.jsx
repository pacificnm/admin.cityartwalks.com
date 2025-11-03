/**
 * @namespace CityArtWalks.Components.Artist.ArtistCreateDetails
 * @version 1.0.0
 * @author jaimie garner
 * @todo update the userID to pull the user avatar link
 */

'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { fDateTime } from 'src/utils/format-time';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCreateDetails
 * @function ArtistCreateDetails
 * @description Renders a card displaying details about the creation and updates of an artist profile.
 * Includes the city, state, creation date, last update date, and the user who created the profile.
 *
 * @param {Object} props - The component props.
 * @param {string} props.city - The city where the artist is located.
 * @param {string} props.state - The state where the artist is located.
 * @param {string} props.createdDate - The ISO 8601 formatted date when the profile was created.
 * @param {string} props.lastUpdate - The ISO 8601 formatted date of the last update to the profile.
 * @param {string} props.userId - The ID of the user who created the artist profile.
 * @returns {JSX.Element} The rendered ArtistCreateDetails component.
 *
 * @example
 * // Usage example
 * import { ArtistCreateDetails } from './ArtistCreateDetails';
 *
 * function App() {
 *   return (
 *     <ArtistCreateDetails
 *       city="Portland"
 *       state="Oregon"
 *       createdDate="2024-01-01T12:00:00Z"
 *       lastUpdate="2024-01-15T15:30:00Z"
 *       userId="user123"
 *     />
 *   );
 * }
 */
export function ArtistCreateDetails({ city, state, createdDate, lastUpdate, userId }) {
  return (
    <Card>
      <Stack spacing={2} sx={{ ml: 2, mt: 2, mr: 2 }}>
        <Box sx={{ typography: 'body2' }}>
          {city}, {state}
        </Box>
        <Box sx={{ typography: 'body2' }}>Created By: {userId}</Box>
        <Box sx={{ typography: 'body2' }}>Created On: {fDateTime(createdDate)}</Box>
        <Box sx={{ typography: 'body2' }}>Last Updated: {fDateTime(lastUpdate)}</Box>
      </Stack>
    </Card>
  );
}
