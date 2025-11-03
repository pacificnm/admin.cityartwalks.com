import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

export function ImageProperties({ data }) {
  const properties = useBoolean(true);

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify icon={properties.value ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} />
        </IconButton>
      </Stack>

      {properties.value && (
        <Stack spacing={1}>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Artist
            </Box>
            {data.artist?.name}
          </Stack>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Art Piece
            </Box>
            {data.piece?.title}
          </Stack>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Created By
            </Box>
            {data.createdBy?.name}
          </Stack>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Created On
            </Box>
            {data.created_date}
          </Stack>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              View Count
            </Box>
            {data.viewCount}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
