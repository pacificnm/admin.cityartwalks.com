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
 * @memberof CityArtWalks.Components.ArtPieceType
 * @param {boolean} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
const getActiveStatusColor = (active) => (active ? 'success' : 'default');

/**
 * ArtPieceType Table Row Component
 *
 * Displays individual art piece type records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 * Uses edit dialog integration instead of navigation to separate edit pages.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit (via dialog) and delete options
 * - Delete confirmation dialog
 * - Active status color coding
 * - Type name with description display
 * - Loading state handling
 * - Accessibility support
 * - User tracking information display
 * - Edit dialog integration
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Table row component for art piece type management with edit dialog integration
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * ArtPieceType Table Row component
 * Displays individual art piece type records within a table with actions and selection capabilities.
 * Uses edit dialog integration instead of navigation to separate pages.
 *
 * @memberof CityArtWalks.Components.ArtPieceType
 * @function ArtPieceTypeTableRow
 * @param {Object} props - Component props
 * @param {Object} props.row - ArtPieceType data object from database
 * @param {string} props.row.artPieceTypeId - Unique identifier for the art piece type
 * @param {string} props.row.name - Name of the art piece type
 * @param {string} [props.row.description] - Description of the art piece type
 * @param {boolean} props.row.active - Whether the art piece type is active
 * @param {string} [props.row.createdBy] - User ID who created the type
 * @param {Date} props.row.createdAt - System creation timestamp
 * @param {Date} props.row.updatedAt - System update timestamp
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onEditRow - Handler for edit action (opens edit dialog)
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtPieceTypeTableRow
 *   row={typeData}
 *   selected={table.selected.includes(typeData.artPieceTypeId)}
 *   onSelectRow={() => table.onSelectRow(typeData.artPieceTypeId)}
 *   onEditRow={() => handleEditRow(typeData)}
 *   onDeleteRow={() => handleDeleteRow(typeData.artPieceTypeId)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */
export function ArtPieceTypeTableRow({
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
   * @memberof CityArtWalks.Components.ArtPieceType
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
   * @memberof CityArtWalks.Components.ArtPieceType
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Art Piece Type"
      content={`Are you sure you want to delete "${row.name || 'this art piece type'}"? This action cannot be undone and may affect related art pieces.`}
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
            id: `${row.artPieceTypeId}-checkbox`,
            'aria-label': `Select ${row.name || row.artPieceTypeId}`,
          },
        }}
      />
    </TableCell>
  );

  const renderArtPieceType = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            component={RouterLink}
            href={paths.dashboard.artPieceType.home}
            color="inherit"
            sx={{ cursor: 'pointer', fontWeight: 'medium' }}
          >
            {row.name || 'Unnamed Type'}
          </Link>
          <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
            {row.description || 'No description available'}
          </Box>
        </Stack>
      </Box>
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
        {row.createdBy ? (
          <Box component="span">Created by User ID: {row.createdBy}</Box>
        ) : (
          <Box component="span" sx={{ fontStyle: 'italic' }}>
            System Created
          </Box>
        )}
      </Box>
    </TableCell>
  );

  const renderDates = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        <Box component="div" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: 'medium' }}>
            Created:
          </Box>{' '}
          {fTime(row.createdAt, formatStr.dateTime)}
        </Box>
        <Box component="div">
          <Box component="span" sx={{ fontWeight: 'medium' }}>
            Updated:
          </Box>{' '}
          {fTime(row.updatedAt, formatStr.dateTime)}
        </Box>
      </Box>
    </TableCell>
  );

  const renderActions = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color={menuActions.open ? 'inherit' : 'default'}
          onClick={menuActions.onOpen}
          aria-label={`Actions for ${row.name || 'art piece type'}`}
        >
          <VerticalFillIcon />
        </IconButton>
      </Box>
    </TableCell>
  );

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{
          // Subtle highlighting for active art piece types
          ...(row.active && {
            '&:hover': {
              backgroundColor: 'success.lighter',
            },
          }),
          // Slightly muted styling for inactive types
          ...(!row.active && {
            opacity: 0.7,
            '&:hover': {
              backgroundColor: 'grey.50',
            },
          }),
        }}
      >
        {renderPrimary}
        {renderArtPieceType}
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
