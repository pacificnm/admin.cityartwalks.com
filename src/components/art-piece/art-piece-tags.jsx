'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog, debugError } from 'src/lib/debug';
import { useUpdateArtPiece } from 'src/actions/art-piece/hooks';
import { updateArtPieceSchema } from 'src/validators/art-piece';
import { ElementArtPieceTags } from 'src/forms/elements/element-art-piece-tags';
import { ElementArtPieceMaterials } from 'src/forms/elements/element-art-piece-materials';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { EditIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceTags
 * @version 1.0.0
 * @author jaimie garner
 */

/**
 * Enhanced art piece tags and materials component with edit functionality and improved UI.
 *
 * @param {Object} props - The component properties.
 * @param {string[]} props.tags - Array of tags for the art piece.
 * @param {string[]} props.materials - Array of materials for the art piece.
 * @param {string|number} props.artPieceId - The ID of the art piece.
 * @param {string|number} props.createdBy - The ID of the user who created the art piece.
 * @returns {JSX.Element} The rendered component.
 */
export function ArtPieceTags(props) {
  const { tags = [], materials = [], artPieceId, createdBy } = props;
  const { accessToken } = useAuthContext();
  const updateArtPiece = useUpdateArtPiece(accessToken);

  const tagsDialog = useBoolean();
  const materialsDialog = useBoolean();

  // Form methods for tags
  const tagsMethods = useForm({
    defaultValues: {
      artPieceTag: tags || [], // Fixed: ensure array is never null
    },
  });

  // Form methods for materials
  const materialsMethods = useForm({
    defaultValues: {
      artPieceMaterial: materials || [], // Fixed: ensure array is never null
    },
  });

  /**
   * Handle saving tags
   */
  const handleSaveTags = async (data) => {
    try {
      debugLog('CityArtWalks.Components.ArtPiece.ArtPieceTags.handleSaveTags', 'Saving tags', {
        tags: data.artPieceTag,
        artPieceId,
      });

      const updateData = updateArtPieceSchema.parse({
        artPieceId, // Use artPieceId instead of id
        artPieceTag: data.artPieceTag || [], // Use artPieceTag instead of tags
      });

      await updateArtPiece(artPieceId, updateData);
      toast.success('Tags updated successfully!');
      tagsDialog.onFalse();
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPiece.ArtPieceTags.handleSaveTags',
        'Failed to save tags',
        {
          error: error.message,
          artPieceId,
        }
      );
      toast.error(`Failed to update tags: ${error.message}`);
    }
  };

  /**
   * Handle saving materials
   */
  const handleSaveMaterials = async (data) => {
    try {
      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceTags.handleSaveMaterials',
        'Saving materials',
        {
          materials: data.artPieceMaterial,
          artPieceId,
        }
      );

      const updateData = updateArtPieceSchema.parse({
        artPieceId, // Use artPieceId instead of id
        artPieceMaterial: data.artPieceMaterial || [], // Use artPieceMaterial instead of materials
      });

      await updateArtPiece(artPieceId, updateData);
      toast.success('Materials updated successfully!');
      materialsDialog.onFalse();
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPiece.ArtPieceTags.handleSaveMaterials',
        'Failed to save materials',
        {
          error: error.message,
          artPieceId,
        }
      );
      toast.error(`Failed to update materials: ${error.message}`);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={4}>
        {/* Tags Section */}
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify
                icon="solar:tag-bold"
                width={20}
                height={20}
                sx={{ color: 'success.main' }}
              />
              <Typography variant="h6">Tags</Typography>
            </Stack>
            <OwnerGuard userId={createdBy}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon width={16} height={16} />}
                onClick={tagsDialog.onTrue}
              >
                {tags && tags.length > 0 ? 'Edit Tags' : 'Add Tags'}
              </Button>
            </OwnerGuard>
          </Stack>

          {tags && tags.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={typeof tag === 'string' ? tag : tag.name || tag}
                  size="small"
                  color="info"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Iconify icon="solar:tag-outline" width={32} height={32} />
                <Typography variant="body2" color="text.secondary">
                  No tags added yet
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Materials Section */}
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify
                icon="solar:palette-bold"
                width={20}
                height={20}
                sx={{ color: 'warning.main' }}
              />
              <Typography variant="h6">Materials</Typography>
            </Stack>
            <OwnerGuard userId={createdBy}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon width={16} height={16} />}
                onClick={materialsDialog.onTrue}
              >
                {materials && materials.length > 0 ? 'Edit Materials' : 'Add Materials'}
              </Button>
            </OwnerGuard>
          </Stack>

          {materials && materials.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {materials.map((material, index) => (
                <Chip
                  key={index}
                  label={typeof material === 'string' ? material : material.name || material}
                  size="small"
                  color="info"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Iconify icon="solar:palette-outline" width={32} height={32} />
                <Typography variant="body2" color="text.secondary">
                  No materials added yet
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Tags Edit Dialog */}
        <Dialog open={tagsDialog.value} onClose={tagsDialog.onFalse} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:tag-bold" width={24} height={24} />
              <Typography variant="h6">Edit Tags</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Form methods={tagsMethods} onSubmit={tagsMethods.handleSubmit(handleSaveTags)}>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <ElementArtPieceTags name="artPieceTag" label="Tags" />
              </Stack>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={tagsDialog.onFalse}>Cancel</Button>
            <Button
              variant="contained"
              onClick={tagsMethods.handleSubmit(handleSaveTags)}
              disabled={tagsMethods.formState.isSubmitting}
            >
              {tagsMethods.formState.isSubmitting ? 'Saving...' : 'Save Tags'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Materials Edit Dialog */}
        <Dialog
          open={materialsDialog.value}
          onClose={materialsDialog.onFalse}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:palette-bold" width={24} height={24} />
              <Typography variant="h6">Edit Materials</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Form
              methods={materialsMethods}
              onSubmit={materialsMethods.handleSubmit(handleSaveMaterials)}
            >
              <Stack spacing={3} sx={{ pt: 1 }}>
                <ElementArtPieceMaterials name="artPieceMaterial" label="Materials" />
              </Stack>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={materialsDialog.onFalse}>Cancel</Button>
            <Button
              variant="contained"
              onClick={materialsMethods.handleSubmit(handleSaveMaterials)}
              disabled={materialsMethods.formState.isSubmitting}
            >
              {materialsMethods.formState.isSubmitting ? 'Saving...' : 'Save Materials'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Card>
  );
}

ArtPieceTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  materials: PropTypes.arrayOf(PropTypes.string),
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
