/**
 * @namespace CityArtWalks.Sections.Artist.Blocks.ArtistCardListBlock
 * @version 1.0.0
 * @author Jaimie Garner
 */

import { ArtistCardList } from 'src/components/artist';
/**
 * @memberof CityArtWalks.Sections.Artist.Blocks.ArtistCardListBlock
 * @function ArtistCardListBlock
 * @description ErrorView component renders a specific error view based on the provided status code and message.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} [props.message] - A custom error message to display.
 * @param {number} [props.status] - The HTTP status code indicating the type of error (e.g., 404, 403, 500).
 * @returns {JSX.Element} The rendered error view corresponding to the provided status.
 *
 * @example
 * // Example usage for a 404 error
 * <ErrorView status={404} message="The requested page was not found." />
 *
 * // Example usage for a 500 error
 * <ErrorView status={500} message="An unexpected server error occurred." />
 *
 * // Example usage for a 403 error
 * <ErrorView status={403} message="Access to this resource is forbidden." />
 *
 * // Example usage for an unknown error
 * <ErrorView message="An unknown error occurred." />
 */

export function ArtistCardListBlock({ artists, ...other }) {
  return <ArtistCardList artists={artists} {...other} />;
}
