'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { UserAvatar } from 'src/components/user';
import { TextMaxLine } from 'src/components/text-max-line';
// ----------------------------------------------------------------------

/**
 * Renders an image with associated text.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing the caption and created date.
 * @returns {JSX.Element} - The rendered component.
 */
export function ImageText({ data }) {
  const { caption, created_date } = data;
  const details = useBoolean();

  return (
    <>
      <TextMaxLine persistent variant="subtitle2" onClick={details.onTrue} sx={{ width: 1, mt: 2 }}>
        {caption}
      </TextMaxLine>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ whiteSpace: 'nowrap', typography: 'caption', color: 'text.disabled' }}
      >
        <UserAvatar
          userId={data.createdBy.id}
          alt={data.createdBy.name}
          src={data.createdBy.image}
        />
        <Box
          component="span"
          sx={{ mx: 1, width: 2, height: 2, flexShrink: 0, borderRadius: '50%' }}
        />
        {fData(200)}
        <Box
          component="span"
          sx={{ mx: 1, width: 2, height: 2, flexShrink: 0, borderRadius: '50%' }}
        />
        {fDateTime(created_date)}
      </Stack>
    </>
  );
}
