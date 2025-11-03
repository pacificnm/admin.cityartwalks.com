/**
 * @namespace CityArtWalks.Components.Path.PathCardAvatar
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';

export function PathCardAvatar({ pathId, title, imageUrl }) {
  const theme = useTheme();
  return (
    <Link
      href={paths.path.details(pathId)}
      passHref
      data-cy="artist-card-avatar-link"
      title={title}
    >
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />
        <Avatar
          alt={title}
          src={imageUrl || '/assets/images/mock/cover/cover-1.webp'}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <Image
          src={imageUrl || '/assets/images/mock/cover/cover-1.webp'}
          alt={title}
          ratio="16/9"
          overlay={alpha(theme.palette.grey[900], 0.48)}
        />
      </Box>
    </Link>
  );
}
