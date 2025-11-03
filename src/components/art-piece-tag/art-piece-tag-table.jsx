/**
 * @namespace CityArtWalks.Components.ArtPieceTag.ArtPieceTagTable
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { debugLog, debugError } from 'src/lib/debug';
import { useDeleteArtPieceTag, useGetPaginatedArtPieceTags } from 'src/actions/art-piece-tag/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ArtPieceTagDialog } from 'src/components/art-piece-tag/art-piece-tag-dialog';
import { ArtPieceTagTableRow } from 'src/components/art-piece-tag/art-piece-tag-table-row';
import { ArtPieceTagTableToolbar } from 'src/components/art-piece-tag/art-piece-tag-table-toolbar';
import { ArtPieceTagTableFiltersResult } from 'src/components/art-piece-tag/art-piece-tag-table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
/**
 * Table head configuration for the art piece tags table
 * Based on database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.ArtPieceTag
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'name', label: 'Tag' },
  { id: 'active', label: 'Status' },
  { id: 'createdBy', label: 'Created By' },
  { id: 'createdAt', label: 'Dates' },
  { id: '', width: 88 },
];

/**
 * Gets the appropriate Material-UI color for active status values
 * @memberof CityArtWalks.Components.ArtPieceTag
 * @param {boolean|string} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 */
const getActiveStatusColor = (active) => {
  if (active === true || active === 'true') return 'success';
  if (active === false || active === 'false') return 'default';
  return 'default';
};

/**
 * ArtPieceTag Table Component
 *
 * Displays a paginated, filterable table of art piece tags with full CRUD operations.
 * Supports active status filtering, search functionality, bulk operations, and responsive design.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Active/inactive status tab filtering
 * - Search across tag names and descriptions
 * - Bulk selection and operations
 * - Inline editing via modal dialog
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 * - Active tag highlighting
 * - Edit dialog integration
 *
 * @namespace CityArtWalks.Components.ArtPieceTag
 * @fileoverview Main table component for art piece tag management with edit dialog integration
 * @author jaimie garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag-Model} - ArtPieceTag model documentation
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * ArtPieceTag Table component
 * Displays a table of art piece tags with filtering, pagination, and CRUD operations.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object (e.g., {active: 'true'})
 * @param {string} [props.accessToken] - Authentication token for API requests
 * @param {Array} [props.tabOptions] - Tab options for active status filtering
 * @param {Object} [props.displayFilters] - Object defining which filters should be displayed
 * @returns {JSX.Element} The art piece tag table component
 *
 * @example
 * <ArtPieceTagTable
 *   filters={{ active: 'true' }}
 *   accessToken={user.accessToken}
 *   tabOptions={[
 *     { value: 'all', label: 'All' },
 *     { value: 'true', label: 'Active' },
 *     { value: 'false', label: 'Inactive' }
 *   ]}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     toolMenu: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag-Model} - ArtPieceTag model documentation
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */
export function ArtPieceTagTable({
  filters: initialFilters = { active: 'all' },
  accessToken = '',
  tabOptions = [
    { value: 'all', label: 'All' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ],
  displayFilters = {
    search: true,
    active: true,
    toolMenu: true,
  },
}) {
  // State management - pagination, filters, search, and table utilities
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState([]);

  // Table utilities and dialog states
  const table = useTable();
  const confirmDialog = useBoolean();

  // Edit dialog state management
  const editDialog = useBoolean();
  const [selectedArtPieceTag, setSelectedArtPieceTag] = useState(null);

  // Delete hook for actual API calls
  const deleteArtPieceTag = useDeleteArtPieceTag(accessToken);

  // Bulk delete state
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Sync filters when initial filters change from parent
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Compute derived state for reset capability and safe values
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'active') return value !== 'all';
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || Boolean(search);

  const notFound = !tableData.length && (canReset || Boolean(search));

  // Defensive programming: ensure valid tab values and search string
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.active) ? filters.active : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Fetch art piece tags - Convert page from 0-based to 1-based for API
  // Build clean filters object, excluding 'all' values and active field specifically
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      if (key === 'active') return false; // Never include active from filters object
      return value !== '' && value !== null && value !== undefined && value !== 'all';
    })
  );

  const {
    artPieceTags,
    artPieceTagsLoading: isLoading,
    paginationMeta,
  } = useGetPaginatedArtPieceTags(
    {
      search: safeSearch,
      // Only include active filter if it's not 'all'
      ...(safeTab !== 'all' && { active: safeTab }),
      ...cleanFilters,
    }, // filters object
    page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    accessToken, // token
    600, // revalidate
    null // refreshKey
  );

  // Keep tableData in sync with API
  useEffect(() => {
    setTableData(artPieceTags || []);
  }, [artPieceTags]);

  // Auto-reset page if it exceeds available pages
  useEffect(() => {
    if (paginationMeta && paginationMeta.totalPages > 0) {
      const maxPage = paginationMeta.totalPages - 1; // Convert to 0-based
      if (page > maxPage) {
        debugLog(`Page ${page} exceeds max page ${maxPage}, resetting to 0`);
        setPage(0);
      }
    }
  }, [paginationMeta, page]);

  // Handle single row deletion with actual API call
  const handleDeleteRow = useCallback(
    async (id) => {
      // Store original data for potential rollback
      const originalData = tableData;

      try {
        // Show loading state (optimistic UI update first)
        const optimisticData = tableData.filter((row) => row.artPieceTagId !== id);
        setTableData(optimisticData);

        // Make actual API call to delete the item
        await deleteArtPieceTag(id);

        // Show success message
        toast.success('Art piece tag deleted successfully!');

        // Update table pagination if needed
        table.onUpdatePageDeleteRow(optimisticData.length);
      } catch (error) {
        // Revert optimistic update on error
        setTableData(originalData);

        // Show error message
        toast.error('Failed to delete art piece tag. Please try again.');
        debugError('[ArtPieceTag.Table.Delete]', error);
      }
    },
    [deleteArtPieceTag, table, tableData]
  );

  // Handle bulk deletion
  const handleDeleteRows = useCallback(async () => {
    if (bulkDeleting || table.selected.length === 0) return;

    // Store original data for potential rollback
    const originalData = tableData;

    try {
      setBulkDeleting(true);

      // Show loading state (optimistic UI update first)
      const optimisticData = tableData.filter((row) => !table.selected.includes(row.artPieceTagId));
      setTableData(optimisticData);

      // Delete all selected items
      const deletePromises = table.selected.map((id) => deleteArtPieceTag(id));
      await Promise.all(deletePromises);

      // Show success message
      toast.success(`${table.selected.length} art piece tags deleted successfully!`);

      // Clear selection
      table.onSelectAllRows(false, []);

      // Close confirmation dialog
      confirmDialog.onFalse();

      // Update table pagination if needed
      table.onUpdatePageDeleteRow(optimisticData.length);
    } catch (error) {
      // Revert optimistic update on error
      setTableData(originalData);

      console.error('Bulk delete error:', error);
      toast.error('Failed to delete some art piece tags. Please try again.');
      debugError('[ArtPieceTag.Table.BulkDelete]', error);
    } finally {
      setBulkDeleting(false);
    }
  }, [deleteArtPieceTag, bulkDeleting, table, tableData, confirmDialog]);

  // Handler for search input
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0);
  }, []);

  // Handler for clearing filters and search
  const handleClearFilters = useCallback(() => {
    // Reset to default values, preserving any base filters from props
    const defaultFilters = { ...initialFilters, active: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Handler for changing tab value
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, active: newValue }));
    setPage(0);
  }, []);

  // Handler for filter changes from toolbar
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change
      setFilters((prev) => ({ ...prev, [filterKeyOrObject]: filterValue }));
    } else {
      // Multiple filter changes (object)
      setFilters((prev) => ({ ...prev, ...filterKeyOrObject }));
    }
    setPage(0);
  }, []);

  // Handler for pagination changes
  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Edit dialog handlers - replaces navigation to separate page
  const handleEditRow = useCallback(
    (artPieceTag) => {
      setSelectedArtPieceTag(artPieceTag);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      // Refresh table data after successful edit
      // Note: The hook should automatically revalidate data

      // Close edit dialog
      editDialog.onFalse();
      setSelectedArtPieceTag(null);

      // Show success message
      toast.success('Art piece tag updated successfully!');
    },
    [editDialog]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedArtPieceTag(null);
  }, [editDialog]);

  return (
    <>
      <Card>
        {/* Active Status Tab Filtering */}
        {(!displayFilters || displayFilters.active) && (
          <Tabs
            value={safeTab}
            onChange={handleFilterTab}
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
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.active) && 'filled') || 'soft'
                    }
                    color={getActiveStatusColor(tab.value)}
                  >
                    {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                  </Label>
                }
              />
            ))}
          </Tabs>
        )}

        {/* Search and Filter Toolbar */}
        <ArtPieceTagTableToolbar
          filters={filters}
          onResetPage={() => setPage(0)}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          search={safeSearch}
          onClearFilters={handleClearFilters}
          displayFilters={displayFilters}
        />

        {/* Active Filters Display */}
        {(canReset || Boolean(safeSearch)) && (
          <ArtPieceTagTableFiltersResult
            filters={filters}
            totalResults={paginationMeta?.total || tableData.length}
            onResetPage={() => setPage(0)}
            onClearFilters={handleClearFilters}
            onFilterChange={handleFilterChange}
            search={safeSearch}
            displayFilters={displayFilters}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {/* Bulk Selection Actions */}
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.artPieceTagId)
            )
          }
          action={
            <Tooltip title="Delete Selected">
              <IconButton color="primary" onClick={confirmDialog.onTrue} disabled={bulkDeleting}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          }
        />

        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD}
            rowCount={tableData.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.artPieceTagId)
              )
            }
          />
          <TableBody>
            {tableData.length > 0
              ? tableData.map((row) => (
                  <ArtPieceTagTableRow
                    key={row.artPieceTagId}
                    row={row}
                    selected={table.selected.includes(row.artPieceTagId)}
                    onSelectRow={() => table.onSelectRow(row.artPieceTagId)}
                    onEditRow={() => handleEditRow(row)}
                    onDeleteRow={() => handleDeleteRow(row.artPieceTagId)}
                    loading={isLoading}
                  />
                ))
              : null}

            <TableEmptyRows
              height={table.dense ? 56 : 56 + 20}
              emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
            />

            <TableNoData notFound={notFound} />
          </TableBody>
        </Table>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <TablePaginationCustom
            count={paginationMeta?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Box>
      </Card>

      {/* Edit Dialog */}
      <ArtPieceTagDialog
        open={editDialog.value}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
        currentArtPieceTag={selectedArtPieceTag}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete Art Piece Tags"
        content={`Are you sure you want to delete ${table.selected.length} selected art piece tags? This action cannot be undone.`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRows}
            disabled={bulkDeleting}
          >
            {bulkDeleting ? 'Deleting...' : 'Delete All'}
          </Button>
        }
      />
    </>
  );
}
