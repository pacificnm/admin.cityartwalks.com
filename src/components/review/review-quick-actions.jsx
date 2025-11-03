/**
 * @file review-quick-actions.jsx
 * @description Quick actions component for individual review management
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.ReviewQuickActions
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { VerticalFillIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';

/**
 * @memberof CityArtWalks.Components.Review.ReviewQuickActions
 * @description Quick action definitions
 * @constant {Array<Object>} QUICK_ACTIONS
 */
const QUICK_ACTIONS = [
  {
    key: 'flag',
    label: 'Flag for Review',
    icon: 'solar:flag-bold-duotone',
    color: 'warning',
    description: 'Flag this review for admin moderation',
    confirmTitle: 'Flag Review',
    confirmContent: 'Are you sure you want to flag this review for moderation?',
  },
  {
    key: 'highlight',
    label: 'Highlight Review',
    icon: 'solar:star-bold-duotone',
    color: 'info',
    description: 'Mark as featured review',
    confirmTitle: 'Highlight Review',
    confirmContent: 'Mark this review as a featured/highlighted review?',
  },
  {
    key: 'respond',
    label: 'Respond to Review',
    icon: 'solar:chat-round-bold-duotone',
    color: 'primary',
    description: 'Write a response to this review',
    disabled: true, // Future enhancement
  },
  {
    key: 'share',
    label: 'Share Review',
    icon: 'solar:share-bold-duotone',
    color: 'success',
    description: 'Share this review',
  },
];

/**
 * @memberof CityArtWalks.Components.Review.ReviewQuickActions
 * @description Flag reason options
 * @constant {Array<Object>} FLAG_REASONS
 */
const FLAG_REASONS = [
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'OFF_TOPIC', label: 'Off Topic' },
  { value: 'FAKE_REVIEW', label: 'Fake Review' },
  { value: 'PERSONAL_ATTACK', label: 'Personal Attack' },
  { value: 'OTHER', label: 'Other' },
];

/**
 * @memberof CityArtWalks.Components.Review.ReviewQuickActions
 * @description Quick actions menu component
 * @function ReviewQuickActionsMenu
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @param {Element} props.anchorEl - Menu anchor element
 * @param {boolean} props.open - Menu open state
 * @param {Function} props.onClose - Menu close handler
 * @param {Function} props.onAction - Action handler
 * @returns {JSX.Element} Quick actions menu
 */
function ReviewQuickActionsMenu({ review, anchorEl, open, onClose, onAction }) {
  const handleActionClick = useCallback(
    (action) => {
      debugLog(
        'CityArtWalks.Components.Review.ReviewQuickActions.handleActionClick',
        `Action: ${action.key}`
      );
      onAction(action, review);
      onClose();
    },
    [onAction, review, onClose]
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { minWidth: 200 },
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Review #{review.reviewId}
        </Typography>
      </Box>
      <Divider />

      {QUICK_ACTIONS.map((action) => (
        <MenuItem
          key={action.key}
          onClick={() => handleActionClick(action)}
          disabled={action.disabled}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <Iconify
              icon={action.icon}
              sx={{ color: action.disabled ? 'text.disabled' : `${action.color}.main` }}
            />
          </ListItemIcon>
          <ListItemText
            primary={action.label}
            secondary={action.description}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
          {action.disabled && <Chip size="small" label="Soon" color="default" variant="outlined" />}
        </MenuItem>
      ))}
    </Menu>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewQuickActions
 * @description Flag confirmation dialog
 * @function FlagConfirmDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Dialog close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @returns {JSX.Element} Flag confirmation dialog
 */
function FlagConfirmDialog({ open, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('');

  const handleConfirm = useCallback(() => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason('');
      onClose();
    }
  }, [selectedReason, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setSelectedReason('');
    onClose();
  }, [onClose]);

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Flag Review for Moderation"
      content={
        <Box>
          <Typography variant="body2" gutterBottom>
            Please select a reason for flagging this review:
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            {FLAG_REASONS.map((reason) => (
              <Box
                key={reason.value}
                onClick={() => setSelectedReason(reason.value)}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: selectedReason === reason.value ? 'primary.main' : 'divider',
                  bgcolor: selectedReason === reason.value ? 'primary.lighter' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="body2">{reason.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      }
      action={
        <Stack direction="row" spacing={1}>
          <button onClick={handleClose}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason}
            style={{
              backgroundColor: !selectedReason ? '#ccc' : '#f57c00',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: !selectedReason ? 'not-allowed' : 'pointer',
            }}
          >
            Flag Review
          </button>
        </Stack>
      }
    />
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewQuickActions
 * @description Main quick actions component for individual reviews
 * @function ReviewQuickActions
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @param {Function} [props.onFlag] - Flag action handler
 * @param {Function} [props.onHighlight] - Highlight action handler
 * @param {Function} [props.onRespond] - Respond action handler
 * @param {Function} [props.onShare] - Share action handler
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.size] - Button size
 * @returns {JSX.Element} Review quick actions component
 */
export function ReviewQuickActions({
  review,
  onFlag,
  onHighlight,
  onRespond,
  onShare,
  disabled = false,
  size = 'small',
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const flagDialog = useBoolean();
  const highlightDialog = useBoolean();

  // Handle menu open
  const handleMenuOpen = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  // Handle menu close
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Handle action selection
  const handleAction = useCallback(
    (action, reviewData) => {
      debugLog(
        'CityArtWalks.Components.Review.ReviewQuickActions.handleAction',
        `Action: ${action.key} for review: ${reviewData.reviewId}`
      );

      switch (action.key) {
        case 'flag':
          flagDialog.onTrue();
          break;
        case 'highlight':
          highlightDialog.onTrue();
          break;
        case 'respond':
          if (onRespond) onRespond(reviewData);
          break;
        case 'share':
          if (onShare) onShare(reviewData);
          break;
        default:
          debugLog('Unknown action:', action.key);
      }
    },
    [flagDialog, highlightDialog, onRespond, onShare]
  );

  // Handle flag confirmation
  const handleFlagConfirm = useCallback(
    (reason) => {
      debugLog(
        'CityArtWalks.Components.Review.ReviewQuickActions.handleFlagConfirm',
        `Flagging review with reason: ${reason}`
      );
      if (onFlag) {
        onFlag(review, reason);
      }
    },
    [review, onFlag]
  );

  // Handle highlight confirmation
  const handleHighlightConfirm = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Review.ReviewQuickActions.handleHighlightConfirm',
      `Highlighting review: ${review.reviewId}`
    );
    if (onHighlight) {
      onHighlight(review);
    }
    highlightDialog.onFalse();
  }, [review, onHighlight, highlightDialog]);

  return (
    <>
      {/* Quick Actions Button */}
      <Tooltip title="Quick Actions">
        <IconButton
          size={size}
          onClick={handleMenuOpen}
          disabled={disabled}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <VerticalFillIcon />
        </IconButton>
      </Tooltip>

      {/* Quick Actions Menu */}
      <ReviewQuickActionsMenu
        review={review}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onAction={handleAction}
      />

      {/* Flag Confirmation Dialog */}
      <FlagConfirmDialog
        open={flagDialog.value}
        onClose={flagDialog.onFalse}
        onConfirm={handleFlagConfirm}
      />

      {/* Highlight Confirmation Dialog */}
      <ConfirmDialog
        open={highlightDialog.value}
        onClose={highlightDialog.onFalse}
        title="Highlight Review"
        content="Mark this review as a featured/highlighted review? This will make it more prominent to other users."
        action={
          <button
            onClick={handleHighlightConfirm}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Highlight Review
          </button>
        }
      />
    </>
  );
}

export default ReviewQuickActions;
