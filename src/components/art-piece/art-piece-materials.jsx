/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMaterails
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMaterails
 * @function ArtPieceMaterails
 * @description Renders a list of materials as styled chips. Each material is displayed as a separate chip.
 *
 * @param {Object} props - The component properties.
 * @param {Array} props.material - An array of materials to display, where each material is a string.
 * @returns {JSX.Element|null} A list of material chips or null if no materials are provided.
 *
 * @example
 * const materials = ['Wood', 'Metal', 'Glass'];
 * <ArtPieceMaterails material={materials} />
 */
export default function ArtPieceMaterails({ material }) {
  if (material === undefined || !material) return null;

  return (
    <>
      {material.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          color="info"
          variant="soft"
          sx={{ mr: 1, mb: 1 }}
        />
      ))}
    </>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMaterails
 * @prop {Array<string>} material - An array of materials to display, where each material is a string. This prop is required.
 */
ArtPieceMaterails.propTypes = {
  material: PropTypes.arrayOf(PropTypes.string).isRequired,
};
