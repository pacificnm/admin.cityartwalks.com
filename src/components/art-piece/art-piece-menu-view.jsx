import MenuItem from '@mui/material/MenuItem';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { ViewIcon } from '../icons';

export function ArtPieceMenuView({ artistSlug, artPieceSlug, handleClose }) {
  const router = useRouter();

  return (
    <MenuItem
      onClick={() => {
        router.push(paths.artPiece.details(artistSlug, artPieceSlug));
        handleClose;
      }}
    >
      <ViewIcon />
      View
    </MenuItem>
  );
}
