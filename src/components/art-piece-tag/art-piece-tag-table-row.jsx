/**
 * @namespace CityArtWalks.Components.ArtPieceTag.ArtPieceTagTableRow
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fTime, formatStr } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { TableEmptyRows } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Gets the appropriate Material-UI color for active status values
 * @memberof CityArtWalks.Components.ArtPieceTag
 * @param {boolean} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 */
const getActiveStatusColor = (active) => (active ? 'success' : 'default');

/**
 * ArtPieceTag Table Row Component
 *
 * Displays individual art piece tag records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 * Uses edit dialog integration instead of navigation to separate edit pages.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit (via dialog) and delete options
 * - Delete confirmation dialog
 * - Active status color coding
 * - Tag name with description display
 * - Loading state handling
 * - Accessibility support
 * - Edit dialog integration
 *
 * @namespace CityArtWalks.Components.ArtPieceTag
 * @fileoverview Table row component for art piece tag management with edit dialog integration
 * @author jaimie garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag-Model} - ArtPieceTag model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * ArtPieceTag Table Row component
 * Displays individual art piece tag records within a table with actions and selection capabilities.
 * Uses edit callback for inline editing instead of navigation to separate pages.
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - ArtPieceTag data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onEditRow - Handler for edit action (opens edit dialog)
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtPieceTagTableRow
 *   row={tagData}
 *   selected={table.selected.includes(tagData.artPieceTagId)}
 *   onSelectRow={() => table.onSelectRow(tagData.artPieceTagId)}
 *   onEditRow={() => handleEditRow(tagData)}
 *   onDeleteRow={() => handleDeleteRow(tagData.artPieceTagId)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag-Model} - ArtPieceTag model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */
export function ArtPieceTagTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  loading = false,
}) {
  // Action menu popover state
  const menuActions = usePopover();

  // Delete confirmation dialog state
  const confirmDialog = useBoolean();

  // Early return for loading state
  if (loading) return <TableEmptyRows />;

  /**
   * Renders the action menu popover with edit and delete options
   * Uses edit callback instead of navigation link
   * @memberof CityArtWalks.Components.ArtPieceTag
   * @returns {JSX.Element} Action menu popover component
   */
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
            onEditRow(row);
            menuActions.onClose();
          }}
        >
          <EditIcon />
          Edit
        </MenuItem>

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

  /**
   * Renders the delete confirmation dialog
   * @memberof CityArtWalks.Components.ArtPieceTag
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Art Piece Tag"
      content={`Are you sure you want to delete "${row.name || 'this art piece tag'}"? This action cannot be undone and may affect related art pieces.`}
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
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
        slotProps={{
          input: {
            id: `${row.artPieceTagId}-checkbox`,
            'aria-label': `Select ${row.name || row.artPieceTagId}`,
          },
        }}
      />
    </TableCell>
  );

  const renderArtPieceTag = (
    <TableCell>
      <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
        <Link
          component={RouterLink}
          href={paths.dashboard.artPieceTags.home}
          color="inherit"
          sx={{ cursor: 'pointer', fontWeight: 'medium' }}
        >
          {row.name || 'Unnamed Tag'}
        </Link>
        <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
          {row.description || 'No description available'}
        </Box>
      </Stack>
    </TableCell>
  );

  const renderActiveStatus = (
    <TableCell>
      <Label variant="soft" color={getActiveStatusColor(row.active)}>
        {row.active ? 'Active' : 'Inactive'}
      </Label>
    </TableCell>
  );

  const renderCreatedBy = (
    <TableCell>
      <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
        {row.createdBy ? `User ID: ${row.createdBy}` : 'System'}
      </Box>
    </TableCell>
  );

  const renderDates = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        <Box component="div">Created: {fTime(row.createdAt, formatStr.dateTime)}</Box>
        <Box component="div">Updated: {fTime(row.updatedAt, formatStr.dateTime)}</Box>
      </Box>
    </TableCell>
  );

  const renderActions = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color={menuActions.open ? 'inherit' : 'default'}
          onClick={menuActions.onOpen}
          aria-label={`Actions for ${row.name || 'art piece tag'}`}
        >
          <VerticalFillIcon />
        </IconButton>
      </Box>
    </TableCell>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1} role="row">
        {renderPrimary}
        {renderArtPieceTag}
        {renderActiveStatus}
        {renderCreatedBy}
        {renderDates}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
