/**
 * @namespace CityArtWalks.Components.Artist.ArtistPaths
 * @version 1.0.0
 * @author jaimie garner
 */
import { EmptyContent } from 'src/components/empty-content';
/**
 * @memberof CityArtWalks.Components.Artist.ArtistPaths
 * @function ArtistPaths
 * @description Renders an empty state component for when no art paths are found.
 * Displays a message indicating the absence of art paths.
 *
 * @returns {JSX.Element} The rendered ArtistPaths component.
 *
 * @example
 * // Usage example
 * import { ArtistPaths } from './ArtistPaths';
 *
 * function App() {
 *   return <ArtistPaths />;
 * }
 */
export function ArtistPaths() {
  return (
    <EmptyContent
      filled
      title="No Art Paths Found"
      sx={{
        py: 10,
        mb: 8,
      }}
    />
  );
}
