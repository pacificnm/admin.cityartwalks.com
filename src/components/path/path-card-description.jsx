/**
 * @namespace CityArtWalks.Components.Path.PathCardDescription
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Stack from '@mui/material/Stack';

import { stripHtmlTags } from 'src/utils/change-case';

import { TextMaxLine } from 'src/components/text-max-line';

export function PathCardDescription({ description }) {
  // Handle cases where the description might be missing or empty
  const displayDescription = description ? stripHtmlTags(description) : 'No description available.';

  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={{ p: 1 }}>
      <TextMaxLine line={8} variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {displayDescription}
      </TextMaxLine>
    </Stack>
  );
}
