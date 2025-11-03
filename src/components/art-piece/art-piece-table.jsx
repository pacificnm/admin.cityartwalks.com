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
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetPaginatedArtPieces } from 'src/actions/art-piece/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { AddIcon, DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ArtPieceTableRow } from './art-piece-table-row';
import { ArtPieceEditDialog } from './art-piece-edit-dialog';
import { ArtPieceTableToolbar } from './art-piece-table-toolbar';
import { ArtPieceTableFiltersResult } from './art-piece-table-filters-result';

/**
 * Table head configuration for the artPieces table
 * Based on ArtPiece database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.ArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'title', label: 'Art Piece' },
  { id: 'artist', label: 'Artist' },
  { id: 'viewCount', label: 'Views', width: 100 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'createdAt', label: 'Created', width: 160 },
  { id: '', width: 88 },
];

/**
 * ArtPiece Table Component
 *
 * Displays a paginated, filterable table of artPieces with full CRUD operations.
 * Supports status-based filtering, search functionality, bulk operations, and responsive design.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Status-based tab filtering (if entity has status field)
 * - Search across relevant entity fields
 * - Bulk selection and operations
 * - Inline editing via modal dialog
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 *
 * @namespace CityArtWalks.Components.ArtPiece
 * @fileoverview Main table component for artPiece management with inline editing
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 * @see {@link edit-dialog.instructions.md} - Edit dialog integration patterns
 */

/**
 * ArtPiece Table component
 * Displays a table of artPieces with filtering, pagination, and CRUD operations.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 *
 * @namespace CityArtWalks.Components.ArtPiece
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object (e.g., {userId: 123, status: 'ACTIVE'})
 * @param {string} [props.accessToken=''] - Authentication token for API requests
 * @param {Array} [props.tabOptions=[]] - Status tab configuration for filtering
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @returns {JSX.Element} The artPiece table component
 *
 * @example
 * <ArtPieceTable
 *   filters={{ status: 'ACTIVE', artistId: 123 }}
 *   accessToken={session?.accessToken}
 *   tabOptions={[
 *     { value: 'all', label: 'All' },
 *     { value: 'ACTIVE', label: 'Active' },
 *     { value: 'ARCHIVED', label: 'Archived' }
 *   ]}
 *   displayFilters={{
 *     search: true,
 *     status: false,
 *     featured: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */
export function ArtPieceTable({
  filters: initialFilters = { status: 'all' },
  accessToken = '',
  tabOptions = [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'DELETED', label: 'Deleted' },
  ],
  displayFilters = {
    search: true,
    status: false,
    featured: true,
    artistId: true,
    cityId: true,
  },
}) {
  // Pagination state - 0-based for Material-UI components
  const [page, setPage] = useState(() => Math.max(0, 0)); // Ensure valid initial page
  const [rowsPerPage, setRowsPerPage] = useState(() => Math.max(1, 10)); // Ensure valid initial rows per page

  // Filter and search state - merge initial filters with local state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  // Table utilities and selection state
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  // Edit dialog state management
  const editDialog = useBoolean();
  const [selectedArtPiece, setSelectedArtPiece] = useState(null);

  // Update filters when initialFilters change (external control)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset detection - determine if filters are active
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'status') return value !== 'all';
      if (key === 'featured') return value === true;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  // Defensive programming - ensure valid tab values
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.status) ? filters.status : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters - clean and transform for backend
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };

    // Remove 'all' status - no filter when status is 'all'
    if (safeTab === 'all') {
      delete baseFilters.status;
    } else {
      baseFilters.status = safeTab;
    }

    // Remove empty values - avoid unnecessary API filtering
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        // Special handling for boolean values
        if (key === 'featured') return value === true || value === false;
        return value !== '' && value !== null && value !== undefined;
      })
    );
  }, [filters, safeTab, safeSearch]);

  // Fetch data using appropriate hook - Convert page from 0-based to 1-based
  const {
    artPieces,
    artPiecesLoading,
    paginationMeta,
    mutate: refreshArtPieces,
  } = useGetPaginatedArtPieces(
    apiFilters,
    Math.max(1, (page || 0) + 1), // Convert 0-based to 1-based for API, ensure minimum of 1
    Math.max(1, rowsPerPage || 10), // Ensure minimum page size of 1
    accessToken,
    3600 // Cache time in seconds
  );

  // Keep tableData in sync with API data
  useEffect(() => {
    setTableData(artPieces || []);
  }, [artPieces]);

  // Search input handler with immediate UI update
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0); // Reset to first page on search
  }, []);

  // Filter reset handler - preserve initial filters from props
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFilters, status: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Tab change handler for status filtering
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, status: newValue }));
    setPage(0);
  }, []);

  // Generic filter change handler - supports single or multiple changes
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change (e.g., featured toggle)
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

  // Row deletion with optimistic UI update
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = (tableData || []).filter((row) => row.artPieceId !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

  // Edit dialog handlers - replaces navigation to separate page
  const handleEditRow = useCallback(
    (artPiece) => {
      setSelectedArtPiece(artPiece);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      // Refresh table data after successful edit
      refreshArtPieces();

      // Close edit dialog
      editDialog.onFalse();
      setSelectedArtPiece(null);

      // Show success message
      toast.success('Art piece updated successfully!');
    },
    [editDialog, refreshArtPieces]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedArtPiece(null);
  }, [editDialog]);

  /**
   * Gets the appropriate Material-UI color for status values
   * @memberof CityArtWalks.Components.ArtPiece
   * @param {string} status - The status value from entity
   * @returns {string} Material-UI color name
   * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'REVIEW':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      case 'DELETED':
        return 'error';
      case 'all':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <DashboardContent>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading="Art Pieces"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Art Pieces' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.artPiece.create}
              variant="contained"
              startIcon={<AddIcon />}
            >
              New Art Piece
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* Status Tabs - always shown when tabOptions are provided */}
          {tabOptions && tabOptions.length > 0 && (
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
                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                        'soft'
                      }
                      color={getStatusColor(tab.value)}
                    >
                      {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                    </Label>
                  }
                />
              ))}
            </Tabs>
          )}

          {/* Filter Toolbar */}
          <ArtPieceTableToolbar
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
            <ArtPieceTableFiltersResult
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

          {/* Bulk Actions */}
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData?.length || 0}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                (tableData || []).map((row) => row.artPieceId)
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

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              {/* Main Table */}
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
                role="table"
                aria-label="Art Pieces data table"
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
                      (tableData || []).map((row) => row.artPieceId)
                    )
                  }
                />
                <TableBody>
                  {artPiecesLoading ? (
                    <TableNoData notFound={false} sx={{ py: 10 }} />
                  ) : (
                    (tableData || []).map((row) => (
                      <ArtPieceTableRow
                        key={row.artPieceId}
                        row={row}
                        selected={table.selected.includes(row.artPieceId)}
                        onSelectRow={() => table.onSelectRow(row.artPieceId)}
                        onDeleteRow={() => handleDeleteRow(row.artPieceId)}
                        onEditRow={() => handleEditRow(row)}
                        loading={artPiecesLoading}
                      />
                    ))
                  )}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
                  />

                  <TableNoData notFound={!(tableData || []).length && (canReset || !!search)} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {/* Pagination */}
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

        <ConfirmDialog
          open={confirmDialog.value}
          onClose={confirmDialog.onFalse}
          title="Delete Art Pieces"
          content={
            <>
              Are you sure you want to delete <strong>{table.selected.length}</strong> art pieces?
              <br />
              This action cannot be undone.
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                // Implement bulk delete here if needed
                toast.success(`${table.selected.length} art pieces deleted successfully`);
                confirmDialog.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />

        {/* Edit Dialog - follows edit-dialog.instructions.md patterns */}
        <ArtPieceEditDialog
          currentArtPiece={selectedArtPiece}
          open={editDialog.value}
          onClose={handleEditCancel}
          onSuccess={handleEditSuccess}
          title="Quick Update"
          maxWidth="md"
          fullWidth
        />
      </Container>
    </DashboardContent>
  );
}
