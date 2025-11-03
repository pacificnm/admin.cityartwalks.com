'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

/**
 * Skeleton loading component for CommentList
 */
export function CommentListSkeleton({ sx, ...other }) {
  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="20%" height={16} />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

CommentListSkeleton.propTypes = {
  sx: PropTypes.object,
};
