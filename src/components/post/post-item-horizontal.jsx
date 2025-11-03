import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { UserBadge } from 'src/components/user';
import { ChatIcon, ViewIcon, ShareIcon, PopoverIcon } from 'src/components/icons';

import { PostPopover } from './post-popover';

// ----------------------------------------------------------------------

export function PostItemHorizontal({ sx, post, editHref, detailsHref, onDelete, ...other }) {
  const menuActions = usePopover();

  return (
    <>
      <Card sx={[{ display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <Stack
          spacing={1}
          sx={[
            (theme) => ({
              flexGrow: 1,
              p: theme.spacing(3, 3, 2, 3),
            }),
          ]}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Label variant="soft" color={(post.status === 'PUBLISHED' && 'info') || 'default'}>
              {post.status}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(post.createdAt)}
            </Box>
          </Box>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              href={detailsHref}
              color="inherit"
              variant="subtitle2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                }),
              ]}
            >
              {post.title}
            </Link>

            <Typography
              variant="body2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: 'text.secondary',
                }),
              ]}
            >
              {post.excerpt}
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <PopoverIcon />
            </IconButton>

            <Box
              sx={{
                gap: 1.5,
                flexGrow: 1,
                display: 'flex',
                flexWrap: 'wrap',
                typography: 'caption',
                color: 'text.disabled',
                justifyContent: 'flex-end',
              }}
            >
              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <ChatIcon width={16} />
                {fShortenNumber(post._count?.comments || 0)}
              </Box>

              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <ViewIcon width={16} />
                {fShortenNumber(post.viewCount || 0)}
              </Box>

              {post.totalShares && (
                <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                  <ShareIcon width={16} />
                  {fShortenNumber(post.totalShares)}
                </Box>
              )}
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
            }}
          >
            <UserBadge
              userId={post.createdBy}
              size="small"
              compact
              sx={{ backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9) }}
            />
          </Box>
          <Image alt={post.title} src={post.featuredImage} sx={{ height: 1, borderRadius: 1.5 }} />
        </Box>
      </Card>

      <PostPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        detailsHref={detailsHref}
        editHref={editHref}
        onDelete={onDelete}
        post={post}
      />
    </>
  );
}
