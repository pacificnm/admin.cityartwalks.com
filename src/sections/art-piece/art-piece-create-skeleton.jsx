/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Form.ArtPiece.ArtPieceFormSkeleton
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Skeleton } from '@mui/material';
import Divider from '@mui/material/Divider';

export function ArtPieceCreateSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Divider sx={{ mt: 3, mb: 3 }} />
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
          </Stack>
          <Divider sx={{ mt: 3, mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Stack>
          <Divider sx={{ pt: 3 }} />
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 3 }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Divider sx={{ pt: 3 }} />
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 3 }}
          >
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
          </Box>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Stack>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Stack>
      </Grid>
    </Grid>
  );
}
