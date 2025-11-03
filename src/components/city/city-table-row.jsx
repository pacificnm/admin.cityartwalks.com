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

import { debugError } from 'src/lib/debug';

import { Label } from 'src/components/label';
import { TableEmptyRows } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Gets the appropriate Material-UI color for City active status values
 * @memberof CityArtWalks.Components.City
 * @param {boolean} active - The active status from City entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 */
const getStatusColor = (active) => (active ? 'success' : 'default');

/**
 * City Table Row Component
 *
 * Displays individual city records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 * Uses edit dialog integration instead of navigation to separate edit pages.
 *
 * Specifically handles City entity display including:
 * - Name as primary display field
 * - Slug as secondary identifier
 * - Geographic location hierarchy (Country → State → City)
 * - Coordinate information when available
 * - State and Country relationship display
 * - Active/inactive status with color coding
 * - Creation and update timestamps
 * - Art piece and artist counts
 * - Path count metrics
 * - Geographic map integration via coordinates
 * - Enhanced action menu with City-specific actions
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit (via dialog) and delete options
 * - Enhanced delete confirmation dialog with City context
 * - Status color coding for active/inactive states
 * - Loading state handling
 * - Accessibility support with proper ARIA labels
 * - Geographic information display with coordinate tooltips
 * - Date display for creation and system timestamps
 * - Related entity count display
 * - Edit dialog integration
 * - Centralized error logging
 *
 * @namespace CityArtWalks.Components.City
 * @fileoverview Table row component for city management with edit dialog integration
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * City Table Row component
 * Displays individual city records within a table with actions and selection capabilities.
 * Uses edit callback for inline editing instead of navigation to separate pages.
 *
 * @memberof CityArtWalks.Components.City
 * @function CityTableRow
 * @param {Object} props - Component props
 * @param {Object} props.row - City data object from database
 * @param {number} props.row.cityId - Unique identifier for the city
 * @param {string} props.row.name - Primary display name of the city
 * @param {string} [props.row.slug] - URL-friendly identifier
 * @param {boolean} [props.row.active] - Whether the city is active/enabled
 * @param {string} [props.row.imageUrl] - City image URL
 * @param {number} [props.row.latitude] - Geographic latitude coordinate
 * @param {number} [props.row.longitude] - Geographic longitude coordinate
 * @param {number} [props.row.stateId] - Foreign key to state
 * @param {number} [props.row.countryId] - Foreign key to country
 * @param {Object} [props.row.State] - State relationship object
 * @param {string} [props.row.State.name] - State name
 * @param {string} [props.row.State.abbreviation] - State abbreviation
 * @param {Object} [props.row.Country] - Country relationship object
 * @param {string} [props.row.Country.name] - Country name
 * @param {string} [props.row.Country.code] - Country code
 * @param {Array} [props.row.ArtPiece] - Related art pieces array
 * @param {Array} [props.row.Artist] - Related artists array
 * @param {Array} [props.row.Path] - Related paths array
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
 * <CityTableRow
 *   row={cityData}
 *   selected={table.selected.includes(cityData.cityId)}
 *   onSelectRow={() => table.onSelectRow(cityData.cityId)}
 *   onEditRow={() => handleEditRow(cityData)}
 *   onDeleteRow={() => handleDeleteRow(cityData.cityId)}
 *   loading={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */
export function CityTableRow({
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
   * Renders location information with hierarchical display for City
   * @memberof CityArtWalks.Components.City
   * @returns {string|null} Formatted location string or null if no location data
   */
  const renderLocation = () => {
    try {
      const parts = [];

      // Build hierarchy: State → Country
      if (row.State?.name) {
        parts.push(row.State.name);
        if (row.State.abbreviation) {
          parts[parts.length - 1] = `${row.State.name} (${row.State.abbreviation})`;
        }
      }
      if (row.Country?.name) parts.push(row.Country.name);

      return parts.length > 0 ? parts.join(', ') : null;
    } catch (error) {
      debugError('CityTableRow: renderLocation failed', error);
      return null;
    }
  };

  /**
   * Renders entity counts for City relationships
   * @memberof CityArtWalks.Components.City
   * @returns {JSX.Element|null} Count display component or null
   */
  const renderEntityCounts = () => {
    try {
      const artPieceCount = row.ArtPiece?.length || 0;
      const artistCount = row.Artist?.length || 0;
      const pathCount = row.Path?.length || 0;

      if (artPieceCount === 0 && artistCount === 0 && pathCount === 0) {
        return null;
      }

      return (
        <Box sx={{ color: 'text.disabled', typography: 'caption' }}>
          {artPieceCount > 0 && `${artPieceCount} art piece${artPieceCount !== 1 ? 's' : ''}`}
          {artistCount > 0 &&
            (artPieceCount > 0 ? ', ' : '') +
              `${artistCount} artist${artistCount !== 1 ? 's' : ''}`}
          {pathCount > 0 &&
            (artPieceCount > 0 || artistCount > 0 ? ', ' : '') +
              `${pathCount} path${pathCount !== 1 ? 's' : ''}`}
        </Box>
      );
    } catch (error) {
      debugError('CityTableRow: renderEntityCounts failed', error);
      return null;
    }
  };

  /**
   * Renders the enhanced action menu popover with City-specific actions
   * Uses edit callback instead of navigation link
   * @memberof CityArtWalks.Components.City
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
   * Renders the enhanced delete confirmation dialog with City context
   * @memberof CityArtWalks.Components.City
   * @returns {JSX.Element} Confirmation dialog component
   */
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete City"
      content={
        <Box>
          <div>Are you sure you want to delete this city?</div>
          <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <strong>Name:</strong> {row.name}
            <br />
            <strong>Location:</strong> {renderLocation() || 'Not specified'}
            <br />
            <strong>Status:</strong> {row.active ? 'Active' : 'Inactive'}
            <br />
            {(row.ArtPiece?.length > 0 || row.Artist?.length > 0 || row.Path?.length > 0) && (
              <Box sx={{ color: 'warning.main', mt: 1 }}>
                <strong>⚠️ This city has related content:</strong>
                <br />
                {renderEntityCounts()}
              </Box>
            )}
          </Box>
          <div style={{ marginTop: 8 }}>This action cannot be undone.</div>
        </Box>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            try {
              onDeleteRow();
            } catch (error) {
              debugError('CityTableRow: Delete confirmation action failed', error);
            }
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderPrimary = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={() => {
          try {
            onSelectRow();
          } catch (error) {
            debugError('CityTableRow: Select row action failed', error);
          }
        }}
        slotProps={{
          input: {
            id: `${row.cityId}-checkbox`,
            'aria-label': `Select ${row.name}`,
          },
        }}
      />
    </TableCell>
  );

  const renderCity = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.name} src={row.imageUrl || undefined}>
          {!row.imageUrl && row.name?.[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            component={RouterLink}
            href={paths.dashboard.location.cityDetails(row.cityId)}
            color="inherit"
            sx={{ cursor: 'pointer' }}
          >
            {row.name}
          </Link>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.slug || 'No Slug'}
          </Box>
        </Stack>
      </Box>
    </TableCell>
  );

  const renderState = <TableCell>{row.State?.name || 'Not assigned'}</TableCell>;

  const renderCountry = <TableCell>{row.Country?.name || 'Not assigned'}</TableCell>;

  const renderStatus = (
    <TableCell>
      <Label variant="soft" color={getStatusColor(row.active)}>
        {row.active ? 'Active' : 'Inactive'}
      </Label>
    </TableCell>
  );

  const renderCreatedAt = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        Created: {row.createdAt ? fTime(row.createdAt, formatStr.dateTime) : 'Unknown'}
        <br />
        Updated: {row.updatedAt ? fTime(row.updatedAt, formatStr.dateTime) : 'Unknown'}
      </Box>
    </TableCell>
  );

  const renderActions = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color={menuActions.open ? 'inherit' : 'default'}
          onClick={menuActions.onOpen}
          aria-label={`Open action menu for ${row.name}`}
          aria-expanded={menuActions.open}
          aria-haspopup="true"
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
        {renderCity}
        {renderState}
        {renderCountry}
        {renderStatus}
        {renderCreatedAt}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
