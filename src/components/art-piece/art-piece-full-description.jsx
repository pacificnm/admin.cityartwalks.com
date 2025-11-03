/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceFullDescription
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import { Button, useMediaQuery } from '@mui/material';

import { truncate, sanitizeHtmlContent } from 'src/utils/text-utils';

/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceFullDescription
 * @version 1.0.1
 * @author Jaimie Garner
 */
export function ArtPieceFullDescription({ description }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [showFull, setShowFull] = useState(false);
  const { preview, hidden } = truncate(description, 300, '...', true);
  const displayContent = showFull || !isSmallScreen ? description : preview;

  return (
    <div>
      <div>{parse(sanitizeHtmlContent(displayContent))}</div>

      {isSmallScreen && hidden && (
        <Button
          variant="text"
          size="small"
          onClick={() => setShowFull(!showFull)}
          aria-label={showFull ? 'Collapse description' : 'Expand description'}
          sx={{
            textTransform: 'none',
            p: 0.5,
            minWidth: 'auto',
            mt: 1,
          }}
        >
          {showFull ? 'Show less' : 'Read more'}
        </Button>
      )}
    </div>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFullDescription
 * @prop {string} [description] - The HTML or plain text description of the art piece. This prop is optional.
 */
ArtPieceFullDescription.propTypes = {
  description: PropTypes.string,
};
