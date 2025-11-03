/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.PostProfileCover
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';

import { varAlpha, bgGradient } from 'src/theme/styles';

/**
 * @memberof CityArtWalks.Components.PostProfileCover
 * @function PostProfileCover
 * @description Renders a profile cover for a post, including the author's avatar and a background image.
 * The background gradient color changes based on the post status, and displays a status chip for owners.
 * Includes a camera button for owners to upload new cover images.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title of the post.
 * @param {string} props.authorImageUrl - The URL of the author's profile image.
 * @param {string} props.featuredImage - The URL of the post's featured image.
 * @param {string} props.status - The status of the post (PUBLISHED, DRAFT, ARCHIVED).
 * @param {string} props.createdBy - The ID of the user who created the post.
 * @param {string} props.postId - The ID of the post.
 * @returns {JSX.Element} The rendered PostProfileCover component.
 */
export function PostProfileCover({ featuredImage, status }) {
  const theme = useTheme();

  // Define colors based on status
  const getStatusColors = (statusValue) => {
    switch (statusValue?.toUpperCase()) {
      case 'ACTIVE':
        return {
          chipColor: 'success',
          bgColor: theme.vars.palette.primary.darkChannel,
        };
      case 'PENDING':
        return {
          chipColor: 'warning',
          bgColor: theme.vars.palette.warning.darkChannel,
        };
      default:
        return {
          chipColor: 'error',
          bgColor: theme.vars.palette.error.darkChannel,
        };
    }
  };

  const { bgColor } = getStatusColors(status);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(bgColor, 0.8)}, ${varAlpha(bgColor, 0.8)}`,
          imgUrl: featuredImage,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name}
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}

PostProfileCover.propTypes = {
  title: PropTypes.string.isRequired,
  authorImageUrl: PropTypes.string,
  featuredImage: PropTypes.string,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
