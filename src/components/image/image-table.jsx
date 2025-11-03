'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useDebounce } from 'src/hooks/use-debounce';

import { useDeleteImage, useUpdateImage, useGetPaginatedImages } from 'src/actions/image/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { ImageTableRow } from 'src/components/image/image-table-row';
import { ImageViewDialog } from 'src/components/image/image-view-dialog';
import { ImageUpdateDialog } from 'src/components/image/image-update-dialog';
import { ImageTableToolbarSimple } from 'src/components/image/image-table-toolbar-simple';
import { ImageTableFiltersResult } from 'src/components/image/image-table-filters-result';
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
 * Table head configuration for the images table
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'image', label: 'Image' },
  { id: 'status', label: 'Status' },
  { id: 'featured', label: 'Featured' },
  { id: 'relations', label: 'Relations' },
  { id: 'createdBy', label: 'Created By' },
  { id: '', width: 88 },
];

/**
 * Image Table component
 * Displays a table of images with filtering, pagination, and CRUD operations.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Filter state object (e.g., {createdBy: 123, status: 'ACTIVE'})
 * @param {string} props.accessToken - Authentication token
 * @param {Array} props.tabOptions - Tab options for status filtering
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @returns {JSX.Element} The image table component
 */
export function ImageTable({
  filters: initialFilters = { status: 'all' },
  accessToken = '',
  tabOptions = [],
  displayFilters = {
    search: true,
    featured: false,
    createdBy: false,
    status: true,
    artistId: true,
    artPieceId: true,
    pathId: true,
  },
}) {
  // set pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // set up filters and search - merge initial filters with local state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms debounce delay

  // set up table data and hooks
  const table = useTable();
  const confirmDialog = useBoolean();
  const viewDialog = useBoolean();
  const editDialog = useBoolean();
  const [tableData, setTableData] = useState([]);
  const [viewImageId, setViewImageId] = useState(null);
  const [editImageId, setEditImageId] = useState(null);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Determine if we can reset based on any non-default filter values
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'status') return value !== 'all';
      if (key === 'featured') return value === true; // Featured filter is active when explicitly set to true
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  const notFound = !tableData.length && (canReset || !!search);

  // Defensive: always ensure filters.status is a valid tab value
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.status) ? filters.status : 'all';
  const safeSearch = typeof search === 'string' ? search : '';
  const safeDebouncedSearch = typeof debouncedSearch === 'string' ? debouncedSearch : '';

  // Prepare API filters - filter out 'all' status and empty values
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeDebouncedSearch,
    };

    // Remove 'all' status - when status is 'all', we don't send any status filter
    if (safeTab === 'all') {
      delete baseFilters.status;
    } else {
      baseFilters.status = safeTab;
    }

    // Convert featured boolean to string for API compatibility
    if (baseFilters.featured === true || baseFilters.featured === false) {
      baseFilters.featured = baseFilters.featured.toString();
    }

    // Convert minFileSize to string for API compatibility (0 means no filter)
    if (baseFilters.minFileSize !== undefined && baseFilters.minFileSize !== 0) {
      baseFilters.minFileSize = baseFilters.minFileSize.toString();
    } else if (baseFilters.minFileSize === 0) {
      delete baseFilters.minFileSize; // Remove if 0 (no filter)
    }

    // Remove empty string values to avoid unnecessary filtering
    // Special handling for boolean values like 'featured' which can be false
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        if (key === 'featured') return value === 'true' || value === 'false'; // Keep boolean string values
        if (key === 'minFileSize') return value && value !== '0'; // Keep non-zero file size values
        return value !== '' && value !== null && value !== undefined;
      })
    );
  }, [filters, safeTab, safeDebouncedSearch]);

  // Fetch images - Convert page from 0-based to 1-based for API
  const { images, imagesLoading, paginationMeta, mutate } = useGetPaginatedImages(
    apiFilters,
    page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    accessToken,
    3600
  );

  // Delete hook
  const deleteImage = useDeleteImage(accessToken);

  // Update hook for featured toggle
  const updateImage = useUpdateImage(accessToken);

  // Keep tableData in sync with API
  useEffect(() => {
    setTableData(images || []);
  }, [images]);

  // Handle single Delete Row
  const handleDeleteRow = useCallback(
    async (imageId) => {
      try {
        await deleteImage(imageId);
        toast.success('Image deleted successfully!');

        // Refresh the data
        await mutate();

        // Update pagination if needed
        const newTableData = tableData.filter((row) => row.imageId !== imageId);
        table.onUpdatePageDeleteRow(newTableData.length);
      } catch (error) {
        toast.error('Failed to delete image');
        console.error('Delete error:', error);
      }
    },
    [deleteImage, mutate, table, tableData]
  );

  // Handle view image
  const handleViewRow = useCallback(
    (imageId) => {
      setViewImageId(imageId);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  const handleCloseViewDialog = useCallback(() => {
    setViewImageId(null);
    viewDialog.onFalse();
  }, [viewDialog]);

  // Handle edit image
  const handleEditRow = useCallback(
    (imageId) => {
      setEditImageId(imageId);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleCloseEditDialog = useCallback(() => {
    setEditImageId(null);
    editDialog.onFalse();
  }, [editDialog]);

  const handleEditSuccess = useCallback(async () => {
    // Refresh the table data after successful edit
    await mutate();
    toast.success('Table data refreshed');
  }, [mutate]);

  // Handle toggle featured
  const handleToggleFeatured = useCallback(
    async (imageId, newFeaturedState) => {
      try {
        await updateImage(imageId, { featured: newFeaturedState });

        // Refresh the data
        await mutate();

        toast.success(`Image ${newFeaturedState ? 'featured' : 'unfeatured'} successfully`);
      } catch (error) {
        toast.error('Failed to update featured status');
        console.error('Toggle featured error:', error);
      }
    },
    [updateImage, mutate]
  );

  // Reset page when debounced search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // Handler for search input
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    // Page reset will happen when debouncedSearch changes
  }, []);

  // Handler for clearing filters and search
  const handleClearFilters = useCallback(() => {
    // Reset to default values, preserving any base filters from props
    const defaultFilters = { ...initialFilters, status: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Handler for changing tab value
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, status: newValue }));
    setPage(0);
  }, []);

  // Handler for filter changes from toolbar
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change (e.g., from featured slider)
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
    <Card>
      {(!displayFilters || displayFilters.status) && (
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
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'ACTIVE' && 'success') ||
                    (tab.value === 'PENDING' && 'warning') ||
                    (tab.value === 'BANNED' && 'error') ||
                    (tab.value === 'REJECTED' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                </Label>
              }
            />
          ))}
        </Tabs>
      )}

      <ImageTableToolbarSimple
        filters={filters}
        onResetPage={() => setPage(0)}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        search={safeSearch}
        onClearFilters={handleClearFilters}
        displayFilters={displayFilters}
        accessToken={accessToken}
      />

      {(canReset || !!safeSearch) && (
        <ImageTableFiltersResult
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

      <TableSelectedAction
        dense={table.dense}
        numSelected={table.selected.length}
        rowCount={tableData.length}
        onSelectAllRows={(checked) =>
          table.onSelectAllRows(
            checked,
            tableData.map((row) => row.imageId)
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

      <TableContainer sx={{ overflow: 'auto' }}>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                tableData.map((row) => row.imageId)
              )
            }
          />
          <TableBody>
            {tableData.map((row) => (
              <ImageTableRow
                key={row.imageId}
                row={row}
                selected={table.selected.includes(row.imageId)}
                onSelectRow={() => table.onSelectRow(row.imageId)}
                onDeleteRow={() => handleDeleteRow(row.imageId)}
                onViewRow={() => handleViewRow(row.imageId)}
                onEditRow={() => handleEditRow(row.imageId)}
                onToggleFeatured={handleToggleFeatured}
                loading={imagesLoading}
              />
            ))}
            <TableEmptyRows
              height={table.dense ? 56 : 56 + 20}
              emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
            />
            <TableNoData notFound={notFound} />
          </TableBody>
        </Table>
      </TableContainer>

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

      {/* View Dialog */}
      <ImageViewDialog
        open={viewDialog.value}
        onClose={handleCloseViewDialog}
        imageId={viewImageId}
      />

      {/* Edit Dialog */}
      <ImageUpdateDialog
        open={editDialog.value}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
        imageId={editImageId}
      />
    </Card>
  );
}
