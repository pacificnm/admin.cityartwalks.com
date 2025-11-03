/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCreatedBy
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { CONFIG } from 'src/global-config';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCreatedBy
 * @function renderRow
 * @description Renders a row with a label and corresponding value in a two-column layout.
 * Typically used for displaying key-value pairs in a structured format.
 *
 * @param {string} label - The label to display in the first column. Usually a descriptive title.
 * @param {React.ReactNode} value - The value to display in the second column. Can be text or any JSX content.
 * @returns {JSX.Element} The rendered row component.
 *
 * @example
 * // Usage example
 * import { renderRow } from './RenderRow';
 *
 * function App() {
 *   return (
 *     <div>
 *       {renderRow('Artist', 'Vincent van Gogh')}
 *       {renderRow('Year', 1889)}
 *     </div>
 *   );
 * }
 */
const renderRow = (label, value) => (
  <Stack direction="row" sx={{ mb: 1 }}>
    <Stack width={1}>
      <b>{label}</b>
    </Stack>
    <Stack width={1}>{value}</Stack>
  </Stack>
);
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCreatedBy
 * @function ArtPieceCreatedBy
 * @description Displays detailed information about an art piece, including its status, creator, creation date, location, and more.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.status] - The status of the art piece (e.g., "Active", "Archived").
 * @param {string} [props.createdBy] - The name of the person who created the art piece. Defaults to "Unknown".
 * @param {string} [props.createdDate] - The ISO 8601 formatted date when the art piece was created.
 * @param {string} [props.lastUpdate] - The ISO 8601 formatted date of the last modification to the art piece.
 * @param {boolean} [props.featured] - Whether the art piece is featured. Displays "Yes" or "No".
 * @param {string} [props.pieceType] - The type of the art piece (e.g., "Sculpture", "Painting").
 * @param {number} [props.latitude] - The latitude of the art piece's location.
 * @param {number} [props.longitude] - The longitude of the art piece's location.
 * @param {string} [props.state] - The state where the art piece is located.
 * @param {string} [props.city] - The city where the art piece is located.
 * @returns {JSX.Element} The rendered ArtPieceCreatedBy component.
 *
 * @example
 * // Usage example
 * import { ArtPieceCreatedBy } from './ArtPieceCreatedBy';
 *
 * function App() {
 *   return (
 *     <ArtPieceCreatedBy
 *       status="Active"
 *       createdBy="Vincent van Gogh"
 *       createdDate="2023-12-25T08:00:00Z"
 *       lastUpdate="2024-01-01T12:00:00Z"
 *       featured={true}
 *       pieceType="Painting"
 *       latitude={45.523064}
 *       longitude={-122.676483}
 *       state="Oregon"
 *       city="Portland"
 *     />
 *   );
 * }
 */
export function ArtPieceCreatedBy({
  status,
  createdBy,
  createdDate,
  lastUpdate,
  featured,
  pieceType,
  latitude,
  longitude,
  state,
  city,
}) {
  return (
    <Card>
      <Box sx={{ typography: 'body2', ml: 2, mr: 2, mb: 2 }}>
        {renderRow('Status', status ?? 'N/A')}
        {renderRow('Name', createdBy ?? 'Unknown')}
        {renderRow(
          'Created',
          createdDate ? dayjs(createdDate).format(CONFIG.dateFormatLong) : 'N/A'
        )}
        {renderRow(
          'Last Modified',
          lastUpdate ? dayjs(lastUpdate).format(CONFIG.dateFormatLong) : 'N/A'
        )}
        {renderRow('Featured', featured ? 'Yes' : 'No')}
        {renderRow('Type', pieceType ?? 'Unknown')}
        {renderRow('Latitude', latitude ?? 'N/A')}
        {renderRow('Longitude', longitude ? `${latitude}, ${longitude}` : 'N/A')}
        {renderRow('State', state ?? 'N/A')}
        {renderRow('City', city ?? 'N/A')}
      </Box>
    </Card>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCreatedBy
 * @prop {string} [status] - The status of the art piece (e.g., "Active", "Archived"). This prop is optional.
 * @prop {string} [createdBy] - The name of the person who created the art piece. Defaults to "Unknown". This prop is optional.
 * @prop {string} [createdDate] - The ISO 8601 formatted date when the art piece was created. This prop is optional.
 * @prop {string} [lastUpdate] - The ISO 8601 formatted date of the last modification to the art piece. This prop is optional.
 * @prop {boolean} [featured] - Whether the art piece is featured. Displays "Yes" or "No". This prop is optional.
 * @prop {string} [pieceType] - The type of the art piece (e.g., "Sculpture", "Painting"). This prop is optional.
 * @prop {number} [latitude] - The latitude of the art piece's location. This prop is optional.
 * @prop {number} [longitude] - The longitude of the art piece's location. This prop is optional.
 * @prop {string} [state] - The state where the art piece is located. This prop is optional.
 * @prop {string} [city] - The city where the art piece is located. This prop is optional.
 */
ArtPieceCreatedBy.propTypes = {
  status: PropTypes.string,
  createdBy: PropTypes.string,
  createdDate: PropTypes.string,
  lastUpdate: PropTypes.string,
  featured: PropTypes.bool,
  pieceType: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  state: PropTypes.string,
  city: PropTypes.string,
};
