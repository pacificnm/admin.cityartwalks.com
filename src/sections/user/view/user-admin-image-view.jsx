'use client';

import { Box, Card, CardMedia, Typography } from '@mui/material';

import { ImageTableToolbar } from 'src/components/image';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Simple ImageCardList component for displaying images in a grid
 */
function ImageCardList({ images, gridTemplateColumns }) {
  if (!images || images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No images found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: gridTemplateColumns || {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {images.map((image) => (
        <Card key={image.imageId} sx={{ borderRadius: 2 }}>
          <CardMedia
            component="img"
            height={200}
            image={image.url || '/placeholder-image.jpg'}
            alt={image.alt || 'Image'}
            sx={{ objectFit: 'cover' }}
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {image.filename || 'Untitled'}
            </Typography>
            {image.type && (
              <Typography variant="caption" color="text.secondary">
                {image.type}
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

export function UserAdminImageView({ userId }) {
  const { loading, authenticated, accessToken } = useAuthContext();

  // Handle loading state
  if (loading) return null;

  // Handle unauthorized access
  if (!authenticated || !accessToken) return <View403 />;

  return (
    <ImageTableToolbar
      viewType="admin"
      initialFilters={{
        createdBy: userId,
        status: 'all',
      }}
    >
      {({ images }) => (
        <ImageCardList
          images={images}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(6, 1fr)',
          }}
        />
      )}
    </ImageTableToolbar>
  );
}
