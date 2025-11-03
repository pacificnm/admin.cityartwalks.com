/**
 * @namespace CityArtWalks.Components.Artist.ArtistEmpty
 * @version 1.0.0
 * @author jaimie garner
 */
import { EmptyContent } from 'src/components/empty-content';
/**
 * @memberof CityArtWalks.Components.Artist.ArtistEmpty
 * @function ArtistEmpty
 * @description Renders a placeholder component for when an artist is not found.
 * Displays a customizable title and description to provide context.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title to display. Defaults to "Artist Not Found" if not provided.
 * @param {string} [props.description] - The description to display. Defaults to "The artist was not found in the system." if not provided.
 * @returns {JSX.Element} The rendered ArtistEmpty component.
 *
 * @example
 * // Usage example
 * import { ArtistEmpty } from './ArtistEmpty';
 *
 * function App() {
 *   return (
 *     <ArtistEmpty
 *       title="No Artists Available"
 *       description="Currently, there are no artists available in the system."
 *     />
 *   );
 * }
 */
export function ArtistEmpty({ title, description }) {
  return (
    <EmptyContent
      filled
      title={title || 'Artist Not Found'}
      description={description || 'The artist was not found in the system.'}
      sx={{ py: 10, mb: 5 }}
    />
  );
}
