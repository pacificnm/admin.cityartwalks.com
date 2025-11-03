/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceNotFound
 * @version 1.0.0
 * @author jaimie garner
 */

import PropTypes from 'prop-types';

import { EmptyContent } from 'src/components/empty-content';

/**
 * @function ArtPieceNotFound
 * @description Renders a styled empty content message indicating that an art piece was not found.
 *
 * @param {Object} props - The component properties.
 * @param {string} [props.title='Art Piece Not Found'] - The title of the not found message.
 * @param {string} [props.description=''] - Additional description for the not found message.
 * @param {Object} [props.sx={}] - Custom styles to apply to the component.
 * @returns {JSX.Element} The rendered ArtPieceNotFound component.
 *
 * @example
 * <ArtPieceNotFound
 *   title="No Results Found"
 *   description="Try searching with different criteria."
 *   sx={{ color: 'text.secondary' }}
 * />
 */
export function ArtPieceNotFound({ title = 'Art Piece Not Found', description = '', sx = {} }) {
  return (
    <EmptyContent
      filled
      title={title}
      description={description}
      sx={{
        py: 10,
        mb: 8,
        ...sx, // Allow for custom styles if passed as props
      }}
    />
  );
}
/**
 * @prop {string} [title='Art Piece Not Found'] - The title of the not found message. This prop is optional.
 * @prop {string} [description=''] - Additional description for the not found message. This prop is optional.
 * @prop {Object} [sx={}] - Custom styles to apply to the component. This prop is optional.
 */
ArtPieceNotFound.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  sx: PropTypes.object,
};
