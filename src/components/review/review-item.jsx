/**
 * @namespace CityArtWalks.Components.Review.ReviewItem
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { CheckCircleIcon } from 'src/components/icons';
import { EditIcon } from 'src/components/icons/edit-icon';
import { FlagIcon } from 'src/components/icons/flag-icon';
import { UserBadge } from 'src/components/user/user-badge';
import { CloseIcon } from 'src/components/icons/close-icon';
import { DeleteIcon } from 'src/components/icons/delete-icon';
import { VerticalFillIcon } from 'src/components/icons/vertical-fill-icon';

import { useAuthContext } from 'src/auth/hooks';

import ReviewErrorBoundary from './review-error-boundary';

/**
 * @memberof CityArtWalks.Components.Review.ReviewItem
 * @function ReviewItem
 * @description Displays an individual review with user information, rating, comment,
 * and action buttons. Shows owner badge when reviewer is content owner. Supports
 * owner flagging and admin moderation controls.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.review - The review data object.
 * @param {boolean} [props.showActions=true] - Whether to show action buttons.
 * @param {boolean} [props.showStatus=false] - Whether to show review status.
 * @param {boolean} [props.compact=false] - Whether to use compact layout.
 * @param {Function} [props.onEdit] - Callback when edit is clicked.
 * @param {Function} [props.onDelete] - Callback when delete is clicked.
 * @param {Function} [props.onFlag] - Callback when flag is clicked.
 * @param {Function} [props.onModerate] - Callback when moderate is clicked.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The rendered ReviewItem component.
 */
export function ReviewItem({
  review,
  ownerId,
  showActions = true,
  showStatus = false,
  compact = false,
  onEdit,
  onDelete,
  onFlag,
  onModerate,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);

  // Check permissions
  const isReviewOwner = user && review.createdBy === user.userId;
  const isContentOwner = user && ownerId && user.userId === ownerId;
  const isReviewByOwner = ownerId && review.createdBy === ownerId; // Review author is content owner
  const isAdmin = user && ['MODERATOR', 'ADMIN'].includes(user.role);
  const canEdit = isReviewOwner && review.status === 'ACTIVE';
  const canDelete = isReviewOwner || isAdmin;
  const canFlag = user && !isReviewOwner && isContentOwner; // Only content owners can flag
  const canModerate = isAdmin && ['PENDING', 'REVIEW'].includes(review.status);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) {
      onDelete(review);
    }
  };

  const handleFlag = () => {
    handleMenuClose();
    if (onFlag) {
      onFlag(review);
    }
  };

  const handleModerate = (action) => {
    handleMenuClose();
    if (onModerate) {
      onModerate(review, action);
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REVIEW':
        return 'info';
      case 'REJECTED':
        return 'error';
      case 'BANNED':
        return 'error';
      case 'DELETED':
        return 'default';
      default:
        return 'default';
    }
  };

  // Show any action menus
  const hasActions = showActions && (canEdit || canDelete || canFlag || canModerate);

  return (
    <ReviewErrorBoundary
      name="ReviewItem"
      context="displaying_review"
      variant="card"
      title="Review Display Error"
      description="Unable to display this review. The review data may be corrupted or unavailable."
    >
      <Card
        sx={{
          mb: 2,
          ...(compact && { boxShadow: 1 }),
          ...sx,
        }}
        {...other}
      >
        <CardContent sx={{ pb: compact ? 2 : 3 }}>
          {/* Header with user info and rating */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flex: 1,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  }}
                >
                  <UserBadge
                    userId={review.createdBy}
                    size={compact ? 'small' : 'medium'}
                    showMemberSince={false}
                    compact
                  />
                  <Typography
                    variant={compact ? 'body2' : 'subtitle2'}
                    sx={{
                      fontWeight: 'medium',
                      fontSize: { xs: '0.875rem', sm: compact ? '0.875rem' : '1rem' },
                    }}
                  >
                    {review.User?.name || 'Anonymous'}
                  </Typography>
                  {isReviewByOwner && (
                    <Chip
                      label="Owner"
                      size="small"
                      color="warning"
                      variant="filled"
                      icon={<Iconify icon="solar:crown-bold" width={14} />}
                      sx={{
                        height: { xs: 20, sm: 22 },
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        '& .MuiChip-icon': {
                          fontSize: { xs: 12, sm: 14 },
                          ml: 0.5,
                        },
                      }}
                    />
                  )}

                  {isContentOwner && (
                    <Chip
                      label="Content Owner"
                      size="small"
                      color="primary"
                      variant="filled"
                      icon={<Iconify icon="solar:verified-check-bold" width={14} />}
                      sx={{
                        height: { xs: 20, sm: 22 },
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        '& .MuiChip-icon': {
                          fontSize: { xs: 12, sm: 14 },
                          ml: 0.5,
                        },
                      }}
                    />
                  )}

                  {showStatus && review.status && (
                    <Chip
                      label={review.status}
                      size="small"
                      color={getStatusColor(review.status)}
                      variant="outlined"
                      sx={{
                        height: { xs: 18, sm: 20 },
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        textTransform: 'capitalize',
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <Rating
                    value={review.rating || 0}
                    readOnly
                    size={compact || isMobile ? 'small' : 'medium'}
                    precision={1}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    {fDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Actions Menu */}
            {hasActions && (
              <IconButton
                size={isMobile ? 'small' : 'medium'}
                onClick={handleMenuOpen}
                sx={{
                  ml: { xs: 0, sm: 1 },
                  mt: { xs: 1, sm: 0 },
                  alignSelf: { xs: 'flex-end', sm: 'flex-start' },
                }}
              >
                <VerticalFillIcon size={20} />
              </IconButton>
            )}
          </Box>

          {/* Review Comment */}
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              px: { xs: 0, sm: 0 },
              mt: { xs: 1, sm: 0 },
            }}
          >
            {review.comment}
          </Typography>

          {/* Admin Moderation Actions */}
          {canModerate && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                '& .MuiButton-root': {
                  minWidth: { xs: '100%', sm: 'auto' },
                },
              }}
            >
              <Button
                size={isMobile ? 'medium' : 'small'}
                variant="outlined"
                color="success"
                onClick={() => handleModerate('APPROVE')}
                startIcon={<CheckCircleIcon />}
                fullWidth={isMobile}
              >
                Approve
              </Button>
              <Button
                size={isMobile ? 'medium' : 'small'}
                variant="outlined"
                color="error"
                onClick={() => handleModerate('REJECT')}
                startIcon={<CloseIcon />}
                fullWidth={isMobile}
              >
                Reject
              </Button>
            </Box>
          )}
        </CardContent>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {canEdit && (
            <MenuItem onClick={handleEdit}>
              <EditIcon size={16} sx={{ mr: 1 }} />
              Edit Review
            </MenuItem>
          )}

          {canFlag && (
            <MenuItem onClick={handleFlag}>
              <FlagIcon size={16} sx={{ mr: 1 }} />
              Flag Review
            </MenuItem>
          )}

          {canDelete && (
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon size={16} sx={{ mr: 1 }} />
              Delete Review
            </MenuItem>
          )}

          {canModerate && (
            <>
              <MenuItem onClick={() => handleModerate('APPROVE')} sx={{ color: 'success.main' }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                Approve
              </MenuItem>
              <MenuItem onClick={() => handleModerate('REJECT')} sx={{ color: 'error.main' }}>
                <CloseIcon size={16} sx={{ mr: 1 }} />
                Reject
              </MenuItem>
            </>
          )}
        </Menu>
      </Card>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewItem
 * @prop {Object} review - The review data object. Required.
 * @prop {string|number} [ownerId] - ID of the content owner. Optional.
 * @prop {boolean} [showActions=true] - Whether to show action buttons. Optional.
 * @prop {boolean} [showStatus=false] - Whether to show review status. Optional.
 * @prop {boolean} [compact=false] - Whether to use compact layout. Optional.
 * @prop {Function} [onEdit] - Callback when edit is clicked. Optional.
 * @prop {Function} [onDelete] - Callback when delete is clicked. Optional.
 * @prop {Function} [onFlag] - Callback when flag is clicked. Optional.
 * @prop {Function} [onModerate] - Callback when moderate is clicked. Optional.
 * @prop {Object} [sx] - Additional styling props. Optional.
 */
ReviewItem.propTypes = {
  review: PropTypes.shape({
    reviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rating: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    status: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
    }),
  }).isRequired,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showActions: PropTypes.bool,
  showStatus: PropTypes.bool,
  compact: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onFlag: PropTypes.func,
  onModerate: PropTypes.func,
  sx: PropTypes.object,
};
