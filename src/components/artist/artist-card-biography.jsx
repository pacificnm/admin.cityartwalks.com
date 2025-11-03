import Link from 'next/link';
import { useState } from 'react';
import parse from 'html-react-parser';

import { useMediaQuery } from '@mui/material';

import { truncate, sanitizeHtmlContent } from 'src/utils/text-utils';
/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardBiography
 * @version 1.0.0
 * @author jaimie garner
 */

export function ArtistCardBiography({ biography }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [showFull, setShowFull] = useState(false);

  const { preview, hidden } = truncate(biography, 300, '...', true);
  const displayContent = showFull || !isSmallScreen ? biography : preview;

  return (
    <div>
      <div>{parse(sanitizeHtmlContent(displayContent))}</div>

      {isSmallScreen && hidden && (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowFull(!showFull);
          }}
          aria-label={showFull ? 'Collapse description' : 'Expand description'}
        >
          <span style={{ color: '#0070f3', textDecoration: 'none', cursor: 'pointer' }}>
            {showFull ? 'Show less' : 'Read more'}
          </span>
        </Link>
      )}
    </div>
  );
}
