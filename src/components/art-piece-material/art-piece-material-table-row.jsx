/**
 * @namespace CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialTableRow
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
 * @memberof CityArtWalks.Components.ArtPieceMaterial
 * @param {boolean} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 */
const getActiveStatusColor = (active) => (active ? 'success' : 'default');

/**
 * ArtPieceMaterial Table Row Component
 *
 * Displays individual art piece material records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit and delete options
 * - Edit action triggers parent dialog (inline editing)
 * - Delete confirmation dialog
 * - Active status color coding
 * - Loading state handling
 * - Accessibility support
 * - Material name display with description
 *
 * @namespace CityArtWalks.Components.ArtPieceMaterial
 * @fileoverview Table row component for art piece material management
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */

/**
 * ArtPieceMaterial Table Row component
 * Displays individual art piece material records within a table with actions and selection capabilities.
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - ArtPieceMaterial data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {Function} props.onEditRow - Handler for row editing (opens edit dialog)
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @param {boolean} [props.deleting=false] - Whether this specific row is being deleted
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtPieceMaterialTableRow
 *   row={materialData}
 *   selected={table.selected.includes(materialData.artPieceMaterialId)}
 *   onSelectRow={() => table.onSelectRow(materialData.artPieceMaterialId)}
 *   onDeleteRow={() => handleDeleteRow(materialData.artPieceMaterialId)}
 *   onEditRow={() => handleEditRow(materialData)}
 *   loading={false}
 *   deleting={deletingId === materialData.artPieceMaterialId}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */
export function ArtPieceMaterialTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  loading = false,
  deleting = false,
}) {
  // Action menu popover state
  const menuActions = usePopover();

  // Delete confirmation dialog state
  const confirmDialog = useBoolean();

  // Early return for loading state
  if (loading) return <TableEmptyRows />;

  /**
   * Renders the action menu popover with edit and delete options
   * @memberof CityArtWalks.Components.ArtPieceMaterial
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
            onEditRow();
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
          disabled={deleting}
        >
          <DeleteIcon />
          {deleting ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  /**
   * Renders the delete confirmation dialog
   * @memberof CityArtWalks.Components.ArtPieceMaterial
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Material"
      content={`Are you sure you want to delete "${row.name || 'this material'}"? This action cannot be undone.`}
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );

  const renderPrimary = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={onSelectRow}
        disabled={deleting}
        slotProps={{
          input: {
            id: `${row.artPieceMaterialId}-checkbox`,
            'aria-label': `Select ${row.name || row.artPieceMaterialId}`,
          },
        }}
      />
    </TableCell>
  );

  const renderMaterial = (
    <TableCell>
      <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
        <Link
          component={RouterLink}
          href={paths.dashboard.artPieceMaterial.details(row.artPieceMaterialId)}
          color="inherit"
          sx={{ cursor: 'pointer', fontWeight: 'medium' }}
        >
          {row.name || 'Unnamed Material'}
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
          disabled={deleting}
          aria-label={`Actions for ${row.name || 'material'}`}
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
          opacity: deleting ? 0.5 : 1,
          pointerEvents: deleting ? 'none' : 'auto',
        }}
      >
        {renderPrimary}
        {renderMaterial}
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
