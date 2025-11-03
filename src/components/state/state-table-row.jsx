/**
 * State Table Row Component
 *
 * Displays individual State records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit (via dialog) and delete options
 * - Delete confirmation dialog
 * - Active status color coding
 * - Featured item highlighting
 * - Loading state handling
 * - Accessibility support
 * - Edit dialog integration (no navigation)
 *
 * @namespace CityArtWalks.Components.State
 * @fileoverview Table row component for State management with edit dialog integration
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Edit-Dialog} - Edit dialog integration patterns
 */

'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
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
 * Gets the appropriate Material-UI color for active status
 * @memberof CityArtWalks.Components.State
 * @param {boolean} active - The active value from State
 * @returns {string} Material-UI color name
 */
const getActiveColor = (active) => (active ? 'success' : 'default');

/**
 * State Table Row component
 * Displays individual State records within a table with actions and selection capabilities.
 * Uses edit callback for inline editing instead of navigation to separate pages.
 *
 * @memberof CityArtWalks.Components.State
 * @param {Object} props - Component props
 * @param {Object} props.row - State data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onEditRow - Handler for edit action (opens edit dialog)
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <StateTableRow
 *   row={stateData}
 *   selected={table.selected.includes(stateData.stateId)}
 *   onSelectRow={() => table.onSelectRow(stateData.stateId)}
 *   onEditRow={() => handleEditRow(stateData)}
 *   onDeleteRow={() => handleDeleteRow(stateData.stateId)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Edit-Dialog}
 */
export function StateTableRow({
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

  // Handle loading state early
  if (loading) return <TableEmptyRows />;

  // Render action menu popover
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

  // Render delete confirmation dialog
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete State"
      content={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  // Primary selection cell
  const renderPrimary = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={onSelectRow}
        slotProps={{
          input: {
            id: `${row.stateId}-checkbox`,
            'aria-label': `${row.name || row.stateId} checkbox`,
          },
        }}
      />
    </TableCell>
  );

  // Main State cell (with image/avatar)
  const renderState = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.name || 'No Name'} src={row.imageUrl || undefined}>
          {!row.imageUrl && row.name?.[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            component={RouterLink}
            href={paths.dashboard.location.stateDetails(row.stateId)}
            color="inherit"
            sx={{ cursor: 'pointer' }}
          >
            {row.name}
          </Link>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.abbreviation}
          </Box>
        </Stack>
      </Box>
    </TableCell>
  );

  // Country relationship cell
  const renderCountry = (
    <TableCell>{row.Country?.name || `Country ID: ${row.countryId}` || 'N/A'}</TableCell>
  );

  // Active status cell
  const renderActive = (
    <TableCell>
      <Label variant="soft" color={getActiveColor(row.active)}>
        {row.active ? 'Active' : 'Inactive'}
      </Label>
    </TableCell>
  );

  // Latitude/Longitude cell
  const renderLatLong = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        {row.latitude ?? '—'}, {row.longitude ?? '—'}
      </Box>
    </TableCell>
  );

  // Created/Updated date cell
  const renderDates = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        Created: {row.createdAt ? fTime(row.createdAt, formatStr.dateTime) : 'Unknown'}
        <br />
        Updated: {row.updatedAt ? fTime(row.updatedAt, formatStr.dateTime) : 'Unknown'}
      </Box>
    </TableCell>
  );

  // Actions cell
  const renderActions = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color={menuActions.open ? 'inherit' : 'default'}
          onClick={menuActions.onOpen}
          aria-label="Open actions menu"
        >
          <VerticalFillIcon />
        </IconButton>
      </Box>
    </TableCell>
  );

  // Featured item highlighting
  const rowHighlight = row.featured
    ? {
        backgroundColor: 'info.lighter',
        '&:hover': {
          backgroundColor: 'info.light',
        },
      }
    : {};

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        role="row"
        sx={rowHighlight}
      >
        {renderPrimary}
        {renderState}
        {renderCountry}
        {renderActive}
        {renderLatLong}
        {renderDates}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
