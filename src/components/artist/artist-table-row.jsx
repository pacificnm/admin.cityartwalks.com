/**
 * @namespace CityArtWalks.Components.Artist.ArtistTableRow
 * @version 1.1.0
 * @author jaimie garner
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
 * Gets the appropriate Material-UI color for status values
 * @memberof CityArtWalks.Components.Artist
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'BANNED':
      return 'error';
    case 'REJECTED':
      return 'error';
    case 'ARCHIVED':
      return 'default';
    case 'REVIEW':
      return 'warning';
    case 'DELETED':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Artist Table Row Component
 *
 * Displays individual artist records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit and delete options
 * - Delete confirmation dialog
 * - Status color coding
 * - Featured artist highlighting
 * - Loading state handling
 * - Accessibility support
 *
 * @namespace CityArtWalks.Components.Artist
 * @fileoverview Table row component for artist management
 * @author jaimie garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */

/**
 * Artist Table Row component
 * Displays individual artist records within a table with actions and selection capabilities.
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - Artist data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {string} props.editHref - URL for editing the artist
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtistTableRow
 *   row={artistData}
 *   selected={table.selected.includes(artistData.artistId)}
 *   onSelectRow={() => table.onSelectRow(artistData.artistId)}
 *   onDeleteRow={() => handleDeleteRow(artistData.artistId)}
 *   editHref={paths.dashboard.artist.update(artistData.artistId)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */
export function ArtistTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  editHref,
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
   * @memberof CityArtWalks.Components.Artist
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
        <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
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
   * @memberof CityArtWalks.Components.Artist
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Artist"
      content={`Are you sure you want to delete "${row.name || 'this artist'}"? This action cannot be undone.`}
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
            id: `${row.artistId}-checkbox`,
            'aria-label': `Select ${row.name || row.artistId}`,
          },
        }}
      />
    </TableCell>
  );

  const renderArtist = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.name || 'Artist'} src={row.imageUrl || undefined}>
          {!row.imageUrl && row.name?.[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            component={RouterLink}
            href={paths.art.artist.details(row.slug)}
            color="inherit"
            sx={{ cursor: 'pointer' }}
          >
            {row.name || 'Unnamed Artist'}
          </Link>
          <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
            {row.nationality || 'No Nationality Listed'}
          </Box>
        </Stack>
      </Box>
    </TableCell>
  );

  const renderViewCount = (
    <TableCell>
      <Box sx={{ typography: 'body2' }}>{row.viewCount?.toLocaleString() || 0}</Box>
    </TableCell>
  );

  const renderStatus = (
    <TableCell>
      <Label variant="soft" color={getStatusColor(row.status)}>
        {row.status || 'UNKNOWN'}
      </Label>
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
          aria-label={`Actions for ${row.name || 'artist'}`}
        >
          <VerticalFillIcon />
        </IconButton>
      </Box>
    </TableCell>
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {renderPrimary}
        {renderArtist}
        {renderViewCount}
        {renderStatus}
        {renderDates}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
