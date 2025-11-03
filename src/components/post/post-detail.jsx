'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { debugLog } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { ArrowDownIcon } from 'src/components/icons';

import { CommentList } from '../comment';
import { PostEditDialog } from './post-edit-dialog';
import { PostAdminControls } from './post-admin-controls';

/**
 * Post detail component for displaying full post content with comment integration
 *
 * @memberof CityArtWalks.Components.Post
 * @function PostDetail
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data
 * @param {boolean} props.showComments - Whether to show comment section
 * @param {boolean} props.showAdminControls - Whether to show admin controls
 * @param {React.ReactNode} props.mobileAccordionContent - Optional mobile accordion content
 * @returns {JSX.Element} Post detail component
 */
export function PostDetail({
  post,
  showComments = true,
  showAdminControls = false,
  mobileAccordionContent = null,
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleEdit = () => {
    debugLog('PostDetail.handleEdit', 'Opening edit dialog', { postId: post?.postId });
    setEditDialogOpen(true);
  };

  const handleEditSuccess = (updatedPost) => {
    debugLog('PostDetail.handleEditSuccess', 'Post updated successfully', {
      postId: updatedPost.postId,
    });
    setCurrentPost(updatedPost);
    toast.success('Post updated successfully');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Admin Controls */}
        {showAdminControls && (
          <PostAdminControls post={currentPost} onEdit={handleEdit} showAsCard />
        )}

        {/* Featured Image */}
        {currentPost.featuredImage && (
          <Box
            component="img"
            src={currentPost.featuredImage}
            alt={currentPost.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 2,
              mb: isSmallScreen && mobileAccordionContent ? 2 : 4,
            }}
          />
        )}

        {/* Mobile Accordion: Post Details (only on small screens) */}
        {isSmallScreen && mobileAccordionContent && (
          <Box sx={{ mb: 4 }}>
            <Accordion defaultExpanded={false}>
              <AccordionSummary
                expandIcon={<Iconify icon=<ArrowDownIcon /> />}
                aria-controls="post-details-content"
                id="post-details-header"
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Post Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>{mobileAccordionContent}</AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Post Content */}
        <Box sx={{ mb: 4 }}>
          <Markdown children={currentPost.content || ''} />
        </Box>

        {/* Comments Section */}
        {showComments && currentPost.postId && (
          <CommentList postId={currentPost.postId} title="Comments" showForm maxItems={10} />
        )}
      </Container>

      {/* Edit Dialog */}
      <PostEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        post={currentPost}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}

PostDetail.propTypes = {
  post: PropTypes.object.isRequired,
  showComments: PropTypes.bool,
  showAdminControls: PropTypes.bool,
  mobileAccordionContent: PropTypes.node,
};
