import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { FileThumbnail } from 'src/components/file-thumbnail';
import {
  ImageText,
  ImagePopover,
  ImageProperties,
  ImageFavoriteButton,
} from 'src/components/image';

import { ImageFollowers } from './image-followers';

// ------------------------------------------------------------

/**
 * Renders the details of an image.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data of the image.
 * @param {Object} props.sx - The style object for the component.
 * @param {Object} props.other - Additional props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export function ImageDetails({ data }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{ p: 2.5, orderRadius: 2, position: 'relative' }}
    >
      <Stack sx={{ mb: 2 }}>
        <FileThumbnail file="folder" sx={{ width: 36, height: 36 }} />
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <ImageFavoriteButton data={data} />
          <ImagePopover data={data} />
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ mb: 2 }}>
        <ImageText data={data} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ mb: 2 }}>
        <ImageProperties data={data} />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ImageFollowers
        favoriteCount={data.favoriteCount}
        viewCount={data.viewCount}
        reviewCount={data.reviewCount}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Stack>
  );
}
