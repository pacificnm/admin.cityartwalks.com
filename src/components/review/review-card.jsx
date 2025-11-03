/**
 * @namespace CityArtWalks.Components.Review.ReviewCard
 * @version 1.0.0
 * @author Jaimie Garner
 * @description Individual review card component extracted from ReviewCardList
 */

'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
/* dialog and accordion imports moved to review-edit-dialog */

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { EditIcon } from 'src/components/icons/edit-icon';
import { ViewIcon } from 'src/components/icons/view-icon';
import { CustomPopover } from 'src/components/custom-popover';
import { VerticalFillIcon } from 'src/components/icons/vertical-fill-icon';

import { ReviewEditDialog } from './review-edit-dialog';

/**
 * Individual Review Card component
 */
export default function ReviewCard({ review, getEditHref, showAIFeedback = false, onRefresh }) {
  const popover = usePopover();
  const editDialog = useBoolean();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      case 'FLAGGED':
        return 'error';
      case 'DELETED':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Header with rating and status */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Rating value={review.rating || 0} readOnly size="small" />
            <Label variant="soft" color={getStatusColor(review.status)}>
              {review.status || 'Unknown'}
            </Label>
          </Stack>

          {/* Art Piece Info */}
          {(review.artPiece || review.ArtPiece) && (
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Avatar
                src={review.artPiece?.imageUrl || review.ArtPiece?.imageUrl}
                alt={review.artPiece?.title || review.ArtPiece?.title}
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {review.artPiece?.title || review.ArtPiece?.title || 'Unknown Art Piece'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  by{' '}
                  {review.artPiece?.Artist?.name ||
                    review.ArtPiece?.Artist?.name ||
                    'Unknown Artist'}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Comment */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {review.comment || 'No comment provided'}
          </Typography>

          {/* Moderator Feedback for rejected reviews */}
          {showAIFeedback && review.status === 'REJECTED' && review.aiModerationReason && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                Moderator Feedback:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {review.aiModerationReason}
              </Typography>
              {review.aiModerationSuggestions && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  <strong>Suggestions:</strong>{' '}
                  {Array.isArray(review.aiModerationSuggestions)
                    ? review.aiModerationSuggestions.join(', ')
                    : review.aiModerationSuggestions}
                </Typography>
              )}
            </Alert>
          )}

          {/* Date */}
          <Typography variant="caption" color="text.secondary">
            {fDate(review.createdAt)}
          </Typography>
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
          <Button size="small" startIcon={<EditIcon size={16} />} onClick={editDialog.onTrue}>
            Edit
          </Button>

          <IconButton
            size="small"
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <VerticalFillIcon size={20} />
          </IconButton>
        </CardActions>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              editDialog.onTrue();
              popover.onClose();
            }}
          >
            <EditIcon size={16} />
            Edit Review
          </MenuItem>

          <MenuItem
            onClick={() => {
              // Add view functionality here if needed
              popover.onClose();
            }}
            sx={{ color: 'text.secondary' }}
          >
            <ViewIcon size={16} />
            View Details
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ReviewEditDialog
        currentReview={review}
        open={editDialog.value}
        onClose={editDialog.onFalse}
        showAIFeedback={showAIFeedback}
        onUpdateSuccess={() => {
          // Refresh the review data when update is successful
          if (onRefresh) {
            onRefresh();
          }
        }}
      />
    </>
  );
}
