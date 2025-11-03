/**
 * @namespace CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialTable
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
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import {
  useDeleteArtPieceMaterial,
  useGetPaginatedArtPieceMaterials,
} from 'src/actions/art-piece-materials/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ArtPieceMaterialDialog } from 'src/components/art-piece-material/art-piece-material-dialog';
import { ArtPieceMaterialTableRow } from 'src/components/art-piece-material/art-piece-material-table-row';
import { ArtPieceMaterialTableToolbar } from 'src/components/art-piece-material/art-piece-material-table-toolbar';
import { ArtPieceMaterialTableFiltersResult } from 'src/components/art-piece-material/art-piece-material-table-filters-result';
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
 * Table head configuration for the art piece materials table
 * Based on database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.ArtPieceMaterial
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'name', label: 'Material' },
  { id: 'active', label: 'Status' },
  { id: 'createdBy', label: 'Created By' },
  { id: 'createdAt', label: 'Dates' },
  { id: '', width: 88 },
];

/**
 * Gets the appropriate Material-UI color for active status values
 * @memberof CityArtWalks.Components.ArtPieceMaterial
 * @param {boolean|string} active - The active status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 */
const getActiveStatusColor = (active) => {
  if (active === true || active === 'true') return 'success';
  if (active === false || active === 'false') return 'default';
  return 'default';
};

/**
 * ArtPieceMaterial Table Component
 *
 * Displays a paginated, filterable table of art piece materials with full CRUD operations.
 * Supports active status filtering, search functionality, bulk operations, and responsive design.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Active/inactive status tab filtering
 * - Search across material names and descriptions
 * - Bulk selection and operations
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 * - Active material highlighting
 *
 * @namespace CityArtWalks.Components.ArtPieceMaterial
 * @fileoverview Main table component for art piece material management
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
 * ArtPieceMaterial Table component
 * Displays a table of art piece materials with filtering, pagination, and CRUD operations.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object (e.g., {active: 'true'})
 * @param {string} [props.accessToken] - Authentication token for API requests
 * @param {Array} [props.tabOptions] - Tab options for active status filtering
 * @param {Object} [props.displayFilters] - Object defining which filters should be displayed
 * @returns {JSX.Element} The art piece material table component
 *
 * @example
 * <ArtPieceMaterialTable
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */
export function ArtPieceMaterialTable({
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
  // Hooks
  const theme = useTheme();

  // State management - pagination, filters, search, and table utilities
  const [page, setPage] = useState(() => Math.max(0, 0)); // Ensure valid initial page
  const [rowsPerPage, setRowsPerPage] = useState(() => Math.max(1, 10)); // Ensure valid initial rows per page
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState([]);

  // Table utilities and dialog states
  const table = useTable();
  const confirmDialog = useBoolean();

  // Edit dialog state management
  const editDialog = useBoolean();
  const [selectedArtPieceMaterial, setSelectedArtPieceMaterial] = useState(null);

  // Delete mutation hook
  const deleteArtPieceMaterial = useDeleteArtPieceMaterial(accessToken);
  const [deletingId, setDeletingId] = useState(null);
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
    }) || !!search;

  const notFound = !tableData.length && (canReset || !!search);

  // Defensive programming: ensure valid tab values and search string
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.active) ? filters.active : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Build filter object for the hook with proper validation-safe values
  // Only include fields that have valid values to avoid Zod validation errors
  const hookFilters = {};

  // Always include search (can be empty string)
  if (safeSearch) {
    hookFilters.search = safeSearch;
  }

  // Only add active filter if it's not 'all'
  if (safeTab !== 'all') {
    hookFilters.active = safeTab; // Will be 'true' or 'false' string
  }

  // Only add createdBy if it has a valid numeric value
  if (filters.createdBy && !isNaN(parseInt(filters.createdBy, 10))) {
    hookFilters.createdBy = filters.createdBy.toString();
  }

  // Fetch art piece materials using the new hook signature
  const {
    artPieceMaterials,
    artPieceMaterialsLoading: isLoading,
    artPieceMaterialsError,
    paginationMeta,
  } = useGetPaginatedArtPieceMaterials(
    hookFilters, // filters object as first parameter
    page + 1, // Convert 0-based to 1-based for page
    rowsPerPage, // rowsPerPage
    accessToken, // token
    600, // revalidate seconds
    null // refreshKey
  );

  // Handle errors
  useEffect(() => {
    if (artPieceMaterialsError) {
      toast.error('Failed to load art piece materials. Please try again.');
      console.error('Materials loading error:', artPieceMaterialsError);
    }
  }, [artPieceMaterialsError]);

  // Keep tableData in sync with API
  useEffect(() => {
    setTableData(artPieceMaterials || []);
  }, [artPieceMaterials]);

  // Handle single row deletion with actual API call
  const handleDeleteRow = useCallback(
    async (id) => {
      if (deletingId) return; // Prevent multiple deletes

      try {
        setDeletingId(id);

        // Call API to delete from database
        await deleteArtPieceMaterial(id);

        // Show success message
        toast.success('Material deleted successfully!');

        // SWR cache will be automatically invalidated by the hook
        // No need to manually update local state
      } catch (error) {
        console.error('Delete row error:', error);
        toast.error(error.message || 'Failed to delete material. Please try again.');
      } finally {
        setDeletingId(null);
      }
    },
    [deleteArtPieceMaterial, deletingId]
  );

  // Handle bulk deletion
  const handleDeleteRows = useCallback(async () => {
    if (bulkDeleting || table.selected.length === 0) return;

    try {
      setBulkDeleting(true);

      // Delete all selected items
      const deletePromises = table.selected.map((id) => deleteArtPieceMaterial(id));
      await Promise.all(deletePromises);

      // Show success message
      toast.success(`${table.selected.length} materials deleted successfully!`);

      // Clear selection
      table.onSelectAllRows(false, []);

      // Close confirmation dialog
      confirmDialog.onFalse();

      // SWR cache will be automatically invalidated by the hook
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error(error.message || 'Failed to delete some materials. Please try again.');
    } finally {
      setBulkDeleting(false);
    }
  }, [deleteArtPieceMaterial, bulkDeleting, table, confirmDialog]);

  // Edit dialog handlers
  const handleEditRow = useCallback(
    (artPieceMaterial) => {
      setSelectedArtPieceMaterial(artPieceMaterial);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      // Refresh table data after successful edit
      // Note: In real implementation, this would trigger a data refresh

      // Close edit dialog
      editDialog.onFalse();
      setSelectedArtPieceMaterial(null);

      // Show success message
      toast.success('Material updated successfully!');
    },
    [editDialog]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedArtPieceMaterial(null);
  }, [editDialog]);

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

  return (
    <>
      <Card
        sx={{
          backgroundImage: 'none',
          border: '1px solid transparent',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          bgcolor: 'transparent',
          borderTopColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          p: 0,
        }}
      >
        {/* Active Status Tab Filtering */}
        {(!displayFilters || displayFilters.active) && (
          <Tabs
            value={safeTab}
            onChange={handleFilterTab}
            sx={[
              (muiTheme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(muiTheme.vars.palette.grey['500Channel'], 0.08)}`,
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
        <ArtPieceMaterialTableToolbar
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
          <ArtPieceMaterialTableFiltersResult
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
              tableData.map((row) => row.artPieceMaterialId)
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
                tableData.map((row) => row.artPieceMaterialId)
              )
            }
          />
          <TableBody>
            {tableData.length > 0
              ? tableData.map((row) => (
                  <ArtPieceMaterialTableRow
                    key={row.artPieceMaterialId}
                    row={row}
                    selected={table.selected.includes(row.artPieceMaterialId)}
                    onSelectRow={() => table.onSelectRow(row.artPieceMaterialId)}
                    onDeleteRow={() => handleDeleteRow(row.artPieceMaterialId)}
                    onEditRow={() => handleEditRow(row)}
                    loading={isLoading}
                    deleting={deletingId === row.artPieceMaterialId}
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
      <ArtPieceMaterialDialog
        currentArtPieceMaterial={selectedArtPieceMaterial}
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
        title="Delete Materials"
        content={`Are you sure you want to delete ${table.selected.length} selected materials? This action cannot be undone.`}
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
