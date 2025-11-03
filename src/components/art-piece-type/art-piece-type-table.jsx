'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

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

import { debugError } from 'src/lib/debug';
import {
  useDeleteArtPieceType,
  useGetPaginatedArtPieceTypes,
} from 'src/actions/art-piece-type/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ArtPieceTypeDialog } from 'src/components/art-piece-type/art-piece-type-dialog';
import { ArtPieceTypeTableRow } from 'src/components/art-piece-type/art-piece-type-table-row';
import { ArtPieceTypeTableToolbar } from 'src/components/art-piece-type/art-piece-type-table-toolbar';
import { ArtPieceTypeTableFiltersResult } from 'src/components/art-piece-type/art-piece-type-table-filters-result';
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
 * Table head configuration for the art piece types table
 * Based on database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.ArtPieceType
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'name', label: 'Type' },
  { id: 'active', label: 'Status' },
  { id: 'createdBy', label: 'Created By' },
  { id: 'createdAt', label: 'Dates' },
  { id: '', width: 88 },
];

/**
 * Gets the appropriate Material-UI color for active status values
 * @memberof CityArtWalks.Components.ArtPieceType
 * @param {boolean|string} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
const getActiveStatusColor = (active) => {
  if (active === true || active === 'true') return 'success';
  if (active === false || active === 'false') return 'default';
  return 'default';
};

/**
 * ArtPieceType Table Component
 *
 * Displays a paginated, filterable table of art piece types with full CRUD operations.
 * Supports active status filtering, search functionality, bulk operations, and responsive design.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Active status tab filtering
 * - Search across art piece type names
 * - Bulk selection and operations
 * - Inline editing via modal dialog
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 * - Edit dialog integration
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Main table component for art piece type management with inline editing
 * @author Jaimie Garner
 * @version 1.1.0
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
 * ArtPieceType Table component
 * Displays a table of art piece types with filtering, pagination, and CRUD operations.
 *
 * @memberof CityArtWalks.Components.ArtPieceType
 * @function ArtPieceTypeTable
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object (e.g., {active: 'true'})
 * @param {string} [props.accessToken=''] - Authentication token for API requests
 * @param {Array} [props.tabOptions] - Tab options for active status filtering
 * @param {Object} [props.displayFilters] - Object defining which filters should be displayed
 * @returns {JSX.Element} The art piece type table component
 *
 * @example
 * <ArtPieceTypeTable
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 */
export function ArtPieceTypeTable({
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
  // Pagination state - 0-based for Material-UI components
  const [page, setPage] = useState(() => Math.max(0, 0)); // Ensure valid initial page
  const [rowsPerPage, setRowsPerPage] = useState(() => Math.max(1, 10)); // Ensure valid initial rows per page

  // Filter and search state - initialize with memoized initial filters
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [search, setSearch] = useState('');

  // Table utilities and selection state
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  // Edit dialog state management
  const editDialog = useBoolean();
  const [selectedArtPieceType, setSelectedArtPieceType] = useState(null);

  // Delete mutation hook
  const deleteArtPieceType = useDeleteArtPieceType(accessToken);

  // Bulk delete state
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Update filters when initialFilters change (external control)
  useEffect(() => {
    setFilters({ ...initialFilters });
  }, [initialFilters]);

  // Reset detection - determine if filters are active
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'active') return value !== 'all';
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  // Defensive programming - ensure valid tab values
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.active) ? filters.active : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters - clean and transform for backend
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };

    // Remove 'all' status - no filter when status is 'all'
    if (safeTab === 'all') {
      delete baseFilters.active;
    } else {
      baseFilters.active = safeTab === 'true';
    }

    // Remove empty values - avoid unnecessary API filtering
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        // Special handling for boolean values
        if (key === 'active') return value === true || value === false;
        return value !== '' && value !== null && value !== undefined;
      })
    );
  }, [filters, safeTab, safeSearch]);

  // Fetch data using appropriate hook - Convert page from 0-based to 1-based
  const {
    artPieceTypes,
    artPieceTypesLoading,
    paginationMeta,
    mutate: refreshArtPieceTypes,
  } = useGetPaginatedArtPieceTypes(
    apiFilters,
    Math.max(1, (page || 0) + 1), // Convert 0-based to 1-based for API, ensure minimum of 1
    Math.max(1, rowsPerPage || 10), // Ensure minimum page size of 1
    accessToken,
    3600 // Cache time in seconds
  );

  // Keep tableData in sync with API data
  useEffect(() => {
    setTableData(artPieceTypes || []);
  }, [artPieceTypes]);

  // Search input handler with immediate UI update
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0); // Reset to first page on search
  }, []);

  // Filter reset handler - preserve initial filters from props
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFilters, active: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Tab change handler for status filtering
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, active: newValue }));
    setPage(0);
  }, []);

  // Generic filter change handler - supports single or multiple changes
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change (e.g., active toggle)
      setFilters((prev) => ({ ...prev, [filterKeyOrObject]: filterValue }));
    } else {
      // Multiple filter changes (object merge)
      setFilters((prev) => ({ ...prev, ...filterKeyOrObject }));
    }
    setPage(0);
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((event, newPage) => {
    const safePage = Math.max(0, parseInt(newPage, 10) || 0);
    setPage(safePage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const safeRowsPerPage = Math.max(1, parseInt(event.target.value, 10) || 10);
    setRowsPerPage(safeRowsPerPage);
    setPage(0);
  }, []);

  // Row deletion with API call and optimistic UI update
  const handleDeleteRow = useCallback(
    async (id) => {
      // Store original data for potential rollback
      const originalData = tableData;

      try {
        // Optimistic UI update - remove from table immediately
        const optimisticData = (tableData || []).filter((row) => row.artPieceTypeId !== id);
        setTableData(optimisticData);

        // Call API to delete the item
        await deleteArtPieceType(id);

        // Show success message
        toast.success('Art piece type deleted successfully!');

        // Update table pagination if needed
        table.onUpdatePageDeleteRow(optimisticData.length);

        // Refresh data to ensure consistency
        refreshArtPieceTypes();
      } catch (error) {
        // Revert optimistic update on error
        setTableData(originalData);

        // Show error message
        toast.error('Failed to delete art piece type. Please try again.');
        debugError('[ArtPieceType.Table.Delete]', error);
      }
    },
    [deleteArtPieceType, table, tableData, refreshArtPieceTypes]
  );

  // Handle bulk deletion
  const handleDeleteRows = useCallback(async () => {
    if (bulkDeleting || table.selected.length === 0) return;

    // Store original data for potential rollback
    const originalData = tableData;

    try {
      setBulkDeleting(true);

      // Show loading state (optimistic UI update first)
      const optimisticData = (tableData || []).filter(
        (row) => !table.selected.includes(row.artPieceTypeId)
      );
      setTableData(optimisticData);

      // Delete all selected items
      const deletePromises = table.selected.map((id) => deleteArtPieceType(id));
      await Promise.all(deletePromises);

      // Show success message
      toast.success(`${table.selected.length} art piece types deleted successfully!`);

      // Clear selection
      table.onSelectAllRows(false, []);

      // Close confirmation dialog
      confirmDialog.onFalse();

      // Update table pagination if needed
      table.onUpdatePageDeleteRow(optimisticData.length);

      // Refresh data to ensure consistency
      refreshArtPieceTypes();
    } catch (error) {
      // Revert optimistic update on error
      setTableData(originalData);

      debugError('[ArtPieceType.Table.BulkDelete]', error);
      toast.error('Failed to delete some art piece types. Please try again.');
    } finally {
      setBulkDeleting(false);
    }
  }, [deleteArtPieceType, bulkDeleting, table, tableData, confirmDialog, refreshArtPieceTypes]);

  // Edit dialog handlers - replaces navigation to separate page
  const handleEditRow = useCallback(
    (artPieceType) => {
      setSelectedArtPieceType(artPieceType);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      // Refresh table data after successful edit
      refreshArtPieceTypes();

      // Close edit dialog
      editDialog.onFalse();
      setSelectedArtPieceType(null);

      // Show success message
      toast.success('Art piece type updated successfully!');
    },
    [editDialog, refreshArtPieceTypes]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedArtPieceType(null);
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
        <ArtPieceTypeTableToolbar
          filters={filters}
          onResetPage={() => setPage(0)}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          search={safeSearch}
          onClearFilters={handleClearFilters}
          displayFilters={displayFilters}
        />
        {/* Active Filters Display */}
        {(canReset || !!safeSearch) && (
          <ArtPieceTypeTableFiltersResult
            filters={filters}
            totalResults={paginationMeta?.total || (tableData || []).length}
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
          rowCount={tableData?.length || 0}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              (tableData || []).map((row) => row.artPieceTypeId)
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
        <Table
          size={table.dense ? 'small' : 'medium'}
          sx={{ minWidth: 960 }}
          role="table"
          aria-label="Art piece types data table"
        >
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headCells={TABLE_HEAD}
            rowCount={tableData?.length || 0}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                (tableData || []).map((row) => row.artPieceTypeId)
              )
            }
          />
          <TableBody>
            {artPieceTypesLoading ? (
              <TableNoData notFound={false} sx={{ py: 10 }} />
            ) : (
              (tableData || []).map((row) => (
                <ArtPieceTypeTableRow
                  key={row.artPieceTypeId}
                  row={row}
                  selected={table.selected.includes(row.artPieceTypeId)}
                  onSelectRow={() => table.onSelectRow(row.artPieceTypeId)}
                  onEditRow={() => handleEditRow(row)}
                  onDeleteRow={() => handleDeleteRow(row.artPieceTypeId)}
                  loading={artPieceTypesLoading}
                />
              ))
            )}
            <TableEmptyRows
              height={table.dense ? 56 : 56 + 20}
              emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
            />
            <TableNoData notFound={!(tableData || []).length && (canReset || !!search)} />
          </TableBody>
        </Table>{' '}
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

      {/* Edit Dialog - follows edit-dialog.instructions.md patterns */}
      <ArtPieceTypeDialog
        currentArtPieceType={selectedArtPieceType}
        open={editDialog.value}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
        title="Quick Update"
        maxWidth="md"
        fullWidth
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete Art Piece Types"
        content={`Are you sure you want to delete ${table.selected.length} selected art piece types? This action cannot be undone.`}
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
