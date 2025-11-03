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
import { Iconify } from 'src/components/iconify';
import { TableEmptyRows } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, ViewIcon, StarIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Gets the appropriate Material-UI color for ArtPiece status values
 * @memberof CityArtWalks.Components.ArtPiece
 * @param {string} status - The status value from ArtPiece entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'ARCHIVED':
      return 'default';
    case 'DELETED':
      return 'error';
    case 'REVIEW':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Art Piece Table Row Component
 *
 * Displays individual art piece records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 * Uses edit dialog integration instead of navigation to separate edit pages.
 *
 * Specifically handles ArtPiece entity display including:
 * - Title as primary display field with featured indicator
 * - Slug as secondary identifier
 * - Geographic location with hierarchical display
 * - Coordinate information when available
 * - Artist relationship display
 * - ArtPiece-specific status values (ACTIVE, ARCHIVED, DELETED, REVIEW)
 * - Creation and installation dates
 * - View count metrics
 * - Featured item highlighting
 * - Static map integration as image fallback
 * - Enhanced action menu with ArtPiece-specific actions
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with view, edit (via dialog), feature toggle, map, and delete options
 * - Enhanced delete confirmation dialog with ArtPiece context
 * - Status color coding with correct ArtPiece enum values
 * - Featured item highlighting with star indicator
 * - Loading state handling
 * - Accessibility support with proper ARIA labels
 * - Geographic information display with coordinate tooltips
 * - Date display for creation, installation, and system timestamps
 * - Edit dialog integration
 *
 * @namespace CityArtWalks.Components.ArtPiece
 * @fileoverview Table row component for art piece management
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * Art Piece Table Row component
 * Displays individual art piece records within a table with actions and selection capabilities.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceTableRow
 * @param {Object} props - Component props
 * @param {Object} props.row - ArtPiece data object from database
 * @param {string} props.row.artPieceId - Unique identifier for the art piece
 * @param {string} props.row.title - Primary display title of the art piece
 * @param {string} [props.row.slug] - URL-friendly identifier
 * @param {boolean} [props.row.featured] - Whether the art piece is featured
 * @param {string} [props.row.status] - Current status (ACTIVE, ARCHIVED, DELETED, REVIEW)
 * @param {string} [props.row.imageUrl] - Primary image URL
 * @param {string} [props.row.staticMapUrl] - Static map image URL
 * @param {number} [props.row.latitude] - Geographic latitude coordinate
 * @param {number} [props.row.longitude] - Geographic longitude coordinate
 * @param {string} [props.row.city] - Direct city field
 * @param {string} [props.row.state] - Direct state field
 * @param {string} [props.row.country] - Direct country field
 * @param {Object} [props.row.City] - City relationship object
 * @param {Object} [props.row.State] - State relationship object
 * @param {Object} [props.row.Country] - Country relationship object
 * @param {Object} [props.row.Artist] - Artist relationship object
 * @param {Date} [props.row.creationDate] - Art piece creation date
 * @param {Date} [props.row.installationDate] - Installation date
 * @param {number} [props.row.viewCount] - View count metrics
 * @param {Date} props.row.createdAt - System creation timestamp
 * @param {Date} props.row.updatedAt - System update timestamp
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {Function} [props.onToggleFeatured] - Handler for featured status toggle
 * @param {Function} props.onEditRow - Handler for edit action (opens edit dialog)
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtPieceTableRow
 *   row={artPieceData}
 *   selected={table.selected.includes(artPieceData.artPieceId)}
 *   onSelectRow={() => table.onSelectRow(artPieceData.artPieceId)}
 *   onDeleteRow={() => handleDeleteRow(artPieceData.artPieceId)}
 *   onToggleFeatured={(id, featured) => handleToggleFeatured(id, featured)}
 *   onEditRow={() => handleEditRow(artPieceData)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */
export function ArtPieceTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onToggleFeatured,
  onEditRow,
  loading = false,
}) {
  // Action menu popover state
  const menuActions = usePopover();

  // Delete confirmation dialog state
  const confirmDialog = useBoolean();

  // Early return for loading state
  if (loading) return <TableEmptyRows />;

  /**
   * Renders location information with fallbacks for ArtPiece
   * @memberof CityArtWalks.Components.ArtPiece
   * @returns {string|null} Formatted location string or null if no location data
   */
  const renderLocation = () => {
    const parts = [];

    // Use direct fields first
    if (row.city) parts.push(row.city);
    if (row.state) parts.push(row.state);
    if (row.country) parts.push(row.country);

    // Fallback to relationship data
    if (parts.length === 0) {
      if (row.City?.name) parts.push(row.City.name);
      if (row.State?.name) parts.push(row.State.name);
      if (row.Country?.name) parts.push(row.Country.name);
    }

    return parts.length > 0 ? parts.join(', ') : null;
  };

  /**
   * Renders the enhanced action menu popover with ArtPiece-specific actions
   * Uses edit callback instead of navigation link
   * @memberof CityArtWalks.Components.ArtPiece
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
          component={RouterLink}
          href={paths.dashboard.artPiece.details(row.artPieceId)}
          onClick={() => menuActions.onClose()}
        >
          <ViewIcon />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow(row);
            menuActions.onClose();
          }}
        >
          <EditIcon />
          Edit
        </MenuItem>

        {onToggleFeatured && (
          <MenuItem
            onClick={() => {
              onToggleFeatured(row.artPieceId, !row.featured);
              menuActions.onClose();
            }}
          >
            <Iconify icon={row.featured ? 'solar:star-bold' : 'solar:star-outline'} />
            {row.featured ? 'Unfeature' : 'Feature'}
          </MenuItem>
        )}

        {row.staticMapUrl && (
          <MenuItem
            onClick={() => {
              window.open(row.staticMapUrl, '_blank');
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:map-point-bold" />
            View Map
          </MenuItem>
        )}

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
   * Renders the enhanced delete confirmation dialog with ArtPiece context
   * @memberof CityArtWalks.Components.ArtPiece
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Art Piece"
      content={
        <Box>
          <div>Are you sure you want to delete this art piece?</div>
          <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <strong>Title:</strong> {row.title || 'Untitled'}
            <br />
            <strong>Artist:</strong> {row.Artist?.name || 'Unknown'}
            <br />
            <strong>Location:</strong> {renderLocation() || 'Not specified'}
            <br />
            {row.featured && <strong>⭐ This is a featured item</strong>}
          </Box>
          <div style={{ marginTop: 8 }}>This action cannot be undone.</div>
        </Box>
      }
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
            id: `${row.artPieceId}-checkbox`,
            'aria-label': `Select ${row.title || row.artPieceId}`,
          },
        }}
      />
    </TableCell>
  );

  const renderArtPiece = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={row.title || 'Art Piece'}
          src={row.imageUrl || row.staticMapUrl || undefined}
          sx={{
            ...(row.staticMapUrl &&
              !row.imageUrl && {
                backgroundColor: 'info.lighter',
              }),
          }}
        >
          {!row.imageUrl && !row.staticMapUrl && row.title?.[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Link
              component={RouterLink}
              href={paths.dashboard.artPiece.details(row.artPieceId)}
              color="inherit"
              sx={{ cursor: 'pointer' }}
            >
              {row.title || 'Untitled'}
            </Link>
            {row.featured && <StarIcon sx={{ color: 'warning.main' }} width={16} />}
          </Box>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.slug || 'No Slug'}
          </Box>
          {renderLocation() && (
            <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
              📍 {renderLocation()}
            </Box>
          )}
          {row.latitude && row.longitude && (
            <Box
              component="span"
              sx={{ color: 'text.disabled', typography: 'caption', fontStyle: 'italic' }}
              title={`Coordinates: ${row.latitude}, ${row.longitude}`}
            >
              {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
            </Box>
          )}
        </Stack>
      </Box>
    </TableCell>
  );

  const renderArtist = <TableCell>{row.Artist?.name || 'Not assigned'}</TableCell>;

  const renderViewCount = <TableCell>{row.viewCount || 0}</TableCell>;

  const renderStatus = (
    <TableCell>
      <Label variant="soft" color={getStatusColor(row.status)}>
        {row.status}
      </Label>
    </TableCell>
  );

  const renderDates = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        {row.creationDate && (
          <>
            Created: {fTime(row.creationDate, formatStr.date)}
            <br />
          </>
        )}
        {row.installationDate && (
          <>
            Installed: {fTime(row.installationDate, formatStr.date)}
            <br />
          </>
        )}
        <Box sx={{ color: 'text.disabled', mt: 0.5 }}>
          System: {row.createdAt ? fTime(row.createdAt, formatStr.dateTime) : 'Unknown'}
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
          aria-label="Open action menu"
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
        role="row"
        sx={{
          // Featured item highlighting
          ...(row.featured && {
            backgroundColor: 'info.lighter',
            '&:hover': {
              backgroundColor: 'info.light',
            },
          }),
        }}
      >
        {renderPrimary}
        {renderArtPiece}
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
