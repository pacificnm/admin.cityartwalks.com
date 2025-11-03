/**
 * @namespace CityArtWalks.Components.Artist.ArtistTable
 * @version 1.1.0
 * @author jaimie garner
 */

'use client';

import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { ArtistTableRow } from 'src/components/artist/artist-table-row';
import { ArtistTableToolbar } from 'src/components/artist/artist-table-toolbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

/**
 * Table head configuration for the artists table
 * Based on database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.Artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'viewCount', label: 'View Count' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', width: 88 },
];

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
 * Artist Table Component
 *
 * Uses ArtistTableToolbar for all state management, filtering, and pagination.
 * This component only handles the table display and row interactions.
 *
 * @param {Object} props - Component props
 * @param {string} [props.viewType='explore'] - The view type for filter configuration
 * @param {Object} [props.initialFilters] - Initial filter state object
 * @param {Array} [props.tabOptions] - Tab options for status filtering
 * @returns {JSX.Element} The artist table component
 */
export function ArtistTable({
  viewType = 'explore',
  initialFilters = { status: 'ACTIVE' },
  tabOptions = [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'REVIEW', label: 'Under Review' },
    { value: 'DELETED', label: 'Deleted' },
  ],
}) {
  // Table utilities and dialog states
  const table = useTable();
  const confirmDialog = useBoolean();

  // Handle single row deletion with optimistic UI update
  const handleDeleteRow = useCallback((id) => {
    try {
      toast.success('Artist deleted successfully!');
      // TODO: Implement actual deletion API call
      console.log('Delete artist:', id);
    } catch (error) {
      toast.error('Failed to delete artist. Please try again.');
      console.error('Delete row error:', error);
    }
  }, []);

  return (
    <ArtistTableToolbar viewType={viewType} initialFilters={initialFilters}>
      {({ artists, loading, error, paginationMeta }) => {
        const notFound = !artists.length && !loading;

        if (error) {
          return (
            <Card>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
                Error loading artists: {error.message}
              </Box>
            </Card>
          );
        }

        return (
          <Card>
            {/* Status Tab Filtering */}
            <Tabs
              value="all" // This will be handled by the toolbar's internal state
              sx={[
                (theme) => ({
                  px: 2.5,
                  boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                }),
              ]}
            >
              {tabOptions.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label variant="filled" color={getStatusColor(tab.value)}>
                      {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            {/* Bulk Selection Actions */}
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={artists.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  artists.map((row) => row.artistId)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              }
            />

            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={artists.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    artists.map((row) => row.artistId)
                  )
                }
              />
              <TableBody>
                {artists.length > 0
                  ? artists.map((row) => (
                      <ArtistTableRow
                        key={row.artistId}
                        row={row}
                        selected={table.selected.includes(row.artistId)}
                        onSelectRow={() => table.onSelectRow(row.artistId)}
                        onDeleteRow={() => handleDeleteRow(row.artistId)}
                        editHref={paths.art.artist.update(row.slug)}
                        loading={loading}
                      />
                    ))
                  : null}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(0, 10, paginationMeta?.total || 0)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>

            <Divider sx={{ borderStyle: 'dashed' }} />
          </Card>
        );
      }}
    </ArtistTableToolbar>
  );
}
