'use client';

import { useState, useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { UserBadge } from 'src/components/user';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, ViewIcon, StarIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard';

/**
 * Image Table Row component
 * Displays a single image row with all relevant information
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - Image data object
 * @param {boolean} props.selected - Whether row is selected
 * @param {Function} props.onSelectRow - Handler for row selection
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {Function} props.onEditRow - Handler for row editing
 * @param {Function} props.onViewRow - Handler for row viewing
 * @param {Function} props.onToggleFeatured - Handler for toggling featured status
 * @returns {JSX.Element} The image table row component
 */
export function ImageTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onToggleFeatured,
}) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const [loading, setLoading] = useState(false);

  const handleToggleFeatured = useCallback(async () => {
    try {
      setLoading(true);
      await onToggleFeatured(row.imageId, !row.featured);
    } catch (error) {
      console.error('Error toggling featured status:', error);
    } finally {
      setLoading(false);
    }
  }, [row.imageId, row.featured, onToggleFeatured]);

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      await onDeleteRow(row.imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
      confirmDialog.onFalse();
    }
  }, [row.imageId, onDeleteRow, confirmDialog]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            onViewRow(row.imageId);
            menuActions.onClose();
          }}
        >
          <ViewIcon />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow(row.imageId);
            menuActions.onClose();
          }}
        >
          <EditIcon />
          Edit
        </MenuItem>

        <RoleBasedGuard allowedRoles={['ADMIN']} displayMode="hidden" protecting="ImageTableRow">
          <MenuItem
            onClick={() => {
              handleToggleFeatured();
              menuActions.onClose();
            }}
            disabled={loading}
          >
            <Iconify icon={row.featured ? 'solar:star-bold' : 'solar:star-outline'} />
            {row.featured ? 'Remove Featured' : 'Make Featured'}
          </MenuItem>
        </RoleBasedGuard>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Image"
      content="Are you sure you want to delete this image? This action cannot be undone."
      action={
        <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
          Delete
        </Button>
      }
    />
  );

  const renderPrimary = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={onSelectRow}
        disabled={loading}
        inputProps={{ id: `row-checkbox-${row.imageId}` }}
      />
    </TableCell>
  );

  const renderImage = (
    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src={row.url}
        alt={row.caption || 'Image'}
        sx={{
          width: 48,
          height: 48,
          mr: 2,
          borderRadius: 1,
          objectFit: 'cover',
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" noWrap>
          {row.caption || 'No caption'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {row.filename || 'No filename'}
        </Typography>
      </Stack>
    </TableCell>
  );

  const renderStatus = (
    <TableCell>
      <Label
        variant="soft"
        color={
          (row.status === 'active' && 'success') ||
          (row.status === 'inactive' && 'error') ||
          'default'
        }
      >
        {row.status}
      </Label>
    </TableCell>
  );

  const renderFeatured = (
    <TableCell>
      <Chip
        size="small"
        label={row.featured ? 'Featured' : 'Regular'}
        color={row.featured ? 'warning' : 'default'}
        variant={row.featured ? 'filled' : 'outlined'}
        icon={row.featured ? <StarIcon width={12} /> : undefined}
      />
    </TableCell>
  );

  const renderRelations = (
    <TableCell>
      <Stack spacing={0.5}>
        {row.Artist && (
          <Typography variant="body2" color="text.secondary">
            Artist:{' '}
            <Link
              href={paths.art.artist.details(row.Artist.slug)}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 'medium' }}
            >
              {row.Artist.name}
            </Link>
          </Typography>
        )}
        {row.ArtPiece && (
          <Typography variant="body2" color="text.secondary">
            Art Piece:{' '}
            <Link
              href={paths.art.artist.artwork.details(row.ArtPiece.Artist.slug, row.ArtPiece.slug)}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 'medium' }}
            >
              {row.ArtPiece.title}
            </Link>
          </Typography>
        )}
        {row.Path && (
          <Typography variant="body2" color="text.secondary">
            Path:{' '}
            <Link
              href={paths.dashboard.paths.details(row.Path.pathId)}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 'medium' }}
            >
              {row.Path.name}
            </Link>
          </Typography>
        )}
        {!row.Artist && !row.ArtPiece && !row.Path && row.User && (
          <Typography variant="body2" color="text.secondary">
            Created by:{' '}
            <Link
              href={paths.dashboard.user.edit(row.User.userId)}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 'medium' }}
            >
              {row.User.name}
            </Link>
          </Typography>
        )}
        {!row.Artist && !row.ArtPiece && !row.Path && !row.User && (
          <Typography variant="body2" color="text.disabled">
            No relations
          </Typography>
        )}
      </Stack>
    </TableCell>
  );

  const renderCreatedBy = (
    <TableCell>
      {row.createdBy ? (
        <UserBadge userId={row.createdBy} size="small" showMemberSince={false} />
      ) : (
        <Typography variant="body2" color="text.disabled">
          Unknown
        </Typography>
      )}
    </TableCell>
  );

  const renderActions = (
    <TableCell align="right">
      <IconButton
        color={menuActions.open ? 'inherit' : 'default'}
        onClick={menuActions.onOpen}
        disabled={loading}
      >
        <VerticalFillIcon />
      </IconButton>
    </TableCell>
  );

  return (
    <>
      <TableRow hover selected={selected} sx={{ opacity: loading ? 0.6 : 1 }}>
        {renderPrimary}
        {renderImage}
        {renderStatus}
        {renderFeatured}
        {renderRelations}
        {renderCreatedBy}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
