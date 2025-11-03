/**
 * @namespace CityArtWalks.Components.Image.ImageCardActions
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Action buttons for image card component including view, favorite, review, flag, and delete.
 */

'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog } from 'src/lib/debug';

import { ImageDialogFlag } from 'src/components/image/image-dialog-flag';
import { ReviewFormDialog } from 'src/components/review/review-form-dialog';
import { ImageDialogDelete } from 'src/components/image/image-dialog-delete';
import { ViewIcon, ChatIcon, FlagIcon, DeleteIcon } from 'src/components/icons';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import { ImageFavoriteButton } from './image-favorite-button';

/**
 * @memberof CityArtWalks.Components.Image.ImageCardActions
 * @function ImageCardActions
 * @description Displays action buttons for image card with modals for view, flag, and review.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.imageId - The unique ID of the image.
 * @param {string} props.caption - Caption or filename for alt text.
 * @param {number} props.createdBy - The user ID who uploaded the image.
 * @param {Object} [props.viewDialog] - View dialog state object from useBoolean hook.
 * @param {Function} [props.onDelete] - Callback for delete action.
 * @param {Function} [props.onFlag] - Callback for flag action.
 * @param {Function} [props.onFavorite] - Callback for favorite action.
 * @param {Function} [props.onReview] - Callback for review action.
 * @returns {JSX.Element} The rendered ImageCardActions component.
 */
export function ImageCardActions(props) {
  const { imageId, caption, createdBy, viewDialog, onDelete, onFlag, onFavorite, onReview } = props;

  const { user } = useAuthContext();
  const flagDialog = useBoolean();
  const reviewDialog = useBoolean();
  const deleteDialog = useBoolean();

  /**
   * @memberof CityArtWalks.Components.Image.ImageCardActions
   * @function handleView
   * @description Opens the full-size image dialog for viewing.
   * @private
   */
  const handleView = () => {
    debugLog('CityArtWalks.Components.Image.ImageCardActions.handleView', 'Opening image dialog', {
      imageId,
    });
    if (viewDialog) {
      viewDialog.onTrue();
    }
  };

  /**
   * @memberof CityArtWalks.Components.Image.ImageCardActions
   * @function handleFlag
   * @description Opens the flag image dialog for reporting inappropriate content.
   * @private
   */
  const handleFlag = () => {
    debugLog('CityArtWalks.Components.Image.ImageCardActions.handleFlag', 'Opening flag dialog', {
      imageId,
    });
    flagDialog.onTrue();
  };

  /**
   * @memberof CityArtWalks.Components.Image.ImageCardActions
   * @function handleDelete
   * @description Opens the delete confirmation dialog. Only available to the image owner.
   * @private
   */
  const handleDelete = () => {
    debugLog(
      'CityArtWalks.Components.Image.ImageCardActions.handleDelete',
      'Opening delete confirmation dialog',
      { imageId }
    );
    deleteDialog.onTrue();
  };

  /**
   * @memberof CityArtWalks.Components.Image.ImageCardActions
   * @function handleReview
   * @description Opens the review form dialog for adding or editing image reviews.
   * @private
   */
  const handleReview = () => {
    debugLog(
      'CityArtWalks.Components.Image.ImageCardActions.handleReview',
      'Opening review dialog',
      { imageId }
    );
    reviewDialog.onTrue();
  };

  /**
   * @memberof CityArtWalks.Components.Image.ImageCardActions
   * @function handleReviewSuccess
   * @description Handles successful review form submission and calls parent callback.
   * @private
   * @param {Object} result - The review submission result data.
   * @param {string} action - The action performed (create, update, delete).
   */
  const handleReviewSuccess = (result, action) => {
    debugLog(
      'CityArtWalks.Components.Image.ImageCardActions.handleReviewSuccess',
      'Review submitted successfully',
      {
        imageId,
        action,
        result,
      }
    );
    if (onReview) {
      onReview(result, action);
    }
  };

  return (
    <>
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Stack direction="row" spacing={1}>
          {/* View */}
          <Tooltip title="View full size">
            <IconButton size="small" onClick={handleView}>
              <ViewIcon size={20} />
            </IconButton>
          </Tooltip>

          {/* Favorite */}
          <ImageFavoriteButton imageId={imageId} size={20} onToggle={onFavorite} />

          {/* Review */}
          <Tooltip title="Add review">
            <IconButton size="small" onClick={handleReview}>
              <ChatIcon size={20} />
            </IconButton>
          </Tooltip>

          {/* Flag */}
          {user && user.userId !== createdBy && (
            <Tooltip title="Flag image">
              <IconButton size="small" onClick={handleFlag} color="warning">
                <FlagIcon size={20} />
              </IconButton>
            </Tooltip>
          )}

          {/* Delete - Owner Only */}
          <OwnerGuard userId={createdBy}>
            <Tooltip title="Delete image">
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon size={20} />
              </IconButton>
            </Tooltip>
          </OwnerGuard>
        </Stack>
      </CardActions>

      {/* Dialogs */}
      {/* Flag Dialog */}
      <ImageDialogFlag
        open={flagDialog.value}
        onClose={flagDialog.onFalse}
        onFlag={onFlag}
        imageId={imageId}
      />

      {/* Delete Dialog */}
      <ImageDialogDelete
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        onDelete={onDelete}
        imageId={imageId}
        filename={caption}
      />

      {/* Review Dialog */}
      <ReviewFormDialog
        open={reviewDialog.value}
        onClose={reviewDialog.onFalse}
        entityType="IMAGE"
        entityId={imageId}
        entityName={caption || 'Image'}
        ownerId={createdBy}
        contextInfo="Image review"
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageCardActions
 * PropTypes validation for the ImageCardActions component
 */
ImageCardActions.propTypes = {
  imageId: PropTypes.number.isRequired,
  caption: PropTypes.string,
  createdBy: PropTypes.number.isRequired,
  viewDialog: PropTypes.object,
  onDelete: PropTypes.func,
  onFlag: PropTypes.func,
  onFavorite: PropTypes.func,
  onReview: PropTypes.func,
};
