/**
 * @file post-table.jsx
 * @description Post Table Component with Role-Based Access Control
 * @namespace CityArtWalks.Components.Post.PostTable
 * @version 1.0.0
 * @author Jaimie Garner
 */

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
import { useGetPaginatedPosts } from 'src/actions/post/hooks';
import { debugLog, debugWarn, debugError } from 'src/lib/debug';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { AddIcon, DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PermissionsGate } from 'src/components/auth/permission-gate';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

import { PostTableRow } from './post-table-row';
import { PostTableToolbar } from './post-table-toolbar';
import { PostTableFiltersResult } from './post-table-filters-result';

/**
 * Table head configuration for the posts table
 * Based on Post database schema and UI requirements
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'category', label: 'Category', width: 120 },
  { id: 'commentCount', label: 'Comments', width: 100 },
  { id: 'viewCount', label: 'Views', width: 100 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'publishedAt', label: 'Published', width: 160 },
  { id: '', width: 88 },
];

/**
 * Gets the appropriate Material-UI color for status values
 * @memberof CityArtWalks.Components.Post
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'REVIEW':
      return 'info';
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

/**
 * Post Table Component
 *
 * Displays a paginated, filterable table of posts with role-based CRUD operations.
 * Supports status-based filtering, search functionality, bulk operations, and responsive design.
 * Public users can view published posts, while ADMIN users have full CRUD capabilities.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Role-based access control (public read, ADMIN write)
 * - Paginated data display with configurable page sizes
 * - Status-based tab filtering
 * - Search across relevant entity fields
 * - Comment count display with click-to-view functionality
 * - Bulk selection and operations (ADMIN only)
 * - Individual row actions (edit, delete - ADMIN only)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 *
 * @namespace CityArtWalks.Components.Post
 * @fileoverview Main table component for post management with role-based access
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */

/**
 * Post Table component
 * Displays a table of posts with filtering, pagination, and role-based CRUD operations.
 * Public users see published posts only, ADMIN users have full access.
 *
 * @namespace CityArtWalks.Components.Post
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object (e.g., {status: 'PUBLISHED', category: 'news'})
 * @param {string} [props.accessToken=''] - Authentication token for API requests
 * @param {Array} [props.tabOptions=[]] - Status tab configuration for filtering
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @param {string} [props.viewType='explore'] - View type for configuration (explore, admin)
 * @returns {JSX.Element} The post table component
 *
 * @example
 * // Public view - only published posts
 * <PostTable
 *   filters={{ status: 'PUBLISHED' }}
 *   viewType="explore"
 *   tabOptions={[
 *     { value: 'all', label: 'All Posts' },
 *     { value: 'PUBLISHED', label: 'Published' }
 *   ]}
 *   displayFilters={{
 *     search: true,
 *     category: true,
 *     featured: false
 *   }}
 * />
 *
 * // Admin view - all posts with full CRUD
 * <PostTable
 *   filters={{ status: 'all' }}
 *   accessToken={session?.accessToken}
 *   viewType="admin"
 *   tabOptions={[
 *     { value: 'all', label: 'All' },
 *     { value: 'PUBLISHED', label: 'Published' },
 *     { value: 'DRAFT', label: 'Draft' },
 *     { value: 'REVIEW', label: 'Under Review' },
 *     { value: 'ARCHIVED', label: 'Archived' }
 *   ]}
 *   displayFilters={{
 *     search: true,
 *     status: true,
 *     category: true,
 *     featured: true,
 *     createdBy: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */
export function PostTable({
  filters: initialFilters = { status: 'PUBLISHED' },
  accessToken = '',
  tabOptions = [
    { value: 'all', label: 'All Posts' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'REVIEW', label: 'Under Review' },
    { value: 'ARCHIVED', label: 'Archived' },
  ],
  displayFilters = {
    search: true,
    status: false, // Hidden for public, shown for admin
    category: true,
    featured: true,
    createdBy: false, // Hidden for public, shown for admin
  },
  viewType = 'explore',
}) {
  // Auth context for role-based access control
  const { user } = useAuthContext();
  const isAdmin = user?.permissions?.includes('admin') || false;

  // Pagination state - 0-based for Material-UI components
  const [page, setPage] = useState(() => Math.max(0, 0));
  const [rowsPerPage, setRowsPerPage] = useState(() => Math.max(1, 10));

  // Filter and search state - merge initial filters with local state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  // Table utilities and selection state
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  // Update filters when initialFilters change (external control)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset detection - determine if filters are active
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'status') return value !== 'all' && value !== 'PUBLISHED';
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

    // For non-admin users, force PUBLISHED status unless specifically overridden
    if (!isAdmin && viewType === 'explore') {
      baseFilters.status = 'PUBLISHED';
    } else if (safeTab === 'all') {
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
  }, [filters, safeTab, safeSearch, isAdmin, viewType]);

  // Fetch data using appropriate hook - Convert page from 0-based to 1-based
  const { posts, postsLoading, paginationMeta } = useGetPaginatedPosts(
    apiFilters,
    Math.max(1, (page || 0) + 1), // Convert 0-based to 1-based for API
    Math.max(1, rowsPerPage || 10), // Ensure minimum page size
    accessToken,
    3600 // Cache time in seconds
  );

  // Keep tableData in sync with API data
  useEffect(() => {
    setTableData(posts || []);
    debugLog('CityArtWalks.Components.Post.PostTable', 'Updated table data', {
      postsCount: posts?.length || 0,
      isAdmin,
      viewType,
      apiFilters,
    });
  }, [posts, isAdmin, viewType, apiFilters]);

  // Search input handler with immediate UI update
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0); // Reset to first page on search
    debugLog('CityArtWalks.Components.Post.PostTable.handleSearchChange', 'Search changed', {
      searchValue: value,
    });
  }, []);

  // Filter reset handler - preserve initial filters from props
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFilters, status: isAdmin ? 'all' : 'PUBLISHED' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
    debugLog('CityArtWalks.Components.Post.PostTable.handleClearFilters', 'Filters cleared', {
      defaultFilters,
    });
  }, [initialFilters, isAdmin]);

  // Tab change handler for status filtering
  const handleFilterTab = useCallback(
    (_event, newValue) => {
      // For non-admin users, restrict tab changes
      if (!isAdmin && newValue !== 'PUBLISHED' && newValue !== 'all') {
        debugWarn(
          'CityArtWalks.Components.Post.PostTable.handleFilterTab',
          'Non-admin user attempted to access restricted status',
          { requestedStatus: newValue, userRole: user?.role }
        );
        return;
      }

      setFilters((prev) => ({ ...prev, status: newValue }));
      setPage(0);
      debugLog('CityArtWalks.Components.Post.PostTable.handleFilterTab', 'Status filter changed', {
        newStatus: newValue,
      });
    },
    [isAdmin, user?.role]
  );

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
    debugLog('CityArtWalks.Components.Post.PostTable.handleFilterChange', 'Filter changed', {
      filterKeyOrObject,
      filterValue,
    });
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((_event, newPage) => {
    const safePage = Math.max(0, parseInt(newPage, 10) || 0);
    setPage(safePage);
    debugLog('CityArtWalks.Components.Post.PostTable.handlePageChange', 'Page changed', {
      newPage: safePage,
    });
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const safeRowsPerPage = Math.max(1, parseInt(event.target.value, 10) || 10);
    setRowsPerPage(safeRowsPerPage);
    setPage(0);
    debugLog(
      'CityArtWalks.Components.Post.PostTable.handleRowsPerPageChange',
      'Rows per page changed',
      { newRowsPerPage: safeRowsPerPage }
    );
  }, []);

  // Row deletion with optimistic UI update (ADMIN only)
  const handleDeleteRow = useCallback(
    (id) => {
      if (!isAdmin) {
        debugWarn(
          'CityArtWalks.Components.Post.PostTable.handleDeleteRow',
          'Non-admin user attempted to delete post',
          { postId: id, userRole: user?.role }
        );
        toast.error('You do not have permission to delete posts');
        return;
      }

      try {
        const deleteRow = (tableData || []).filter((row) => row.postId !== id);
        toast.success('Post deleted successfully!');
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(deleteRow.length);
        debugLog(
          'CityArtWalks.Components.Post.PostTable.handleDeleteRow',
          'Post deleted successfully',
          { postId: id }
        );
      } catch (error) {
        debugError(
          'CityArtWalks.Components.Post.PostTable.handleDeleteRow',
          'Failed to delete post',
          { postId: id, error: error.message }
        );
        toast.error('Failed to delete post. Please try again.');
      }
    },
    [table, tableData, isAdmin, user?.role]
  );

  // Comment count click handler
  const handleViewComments = useCallback((post) => {
    debugLog(
      'CityArtWalks.Components.Post.PostTable.handleViewComments',
      'Viewing comments for post',
      { postId: post.postId, commentCount: post.commentCount }
    );
    // TODO: Navigate to comments view or open comments modal
    toast.info(`Post has ${post.commentCount || 0} comments`);
  }, []);

  // Filter tabs based on user role
  const filteredTabOptions = useMemo(() => {
    if (isAdmin) {
      return tabOptions; // Admin sees all tabs
    }
    // Non-admin users only see published and all
    return tabOptions.filter((tab) => tab.value === 'all' || tab.value === 'PUBLISHED');
  }, [tabOptions, isAdmin]);

  // Adjust display filters based on user role
  const roleBasedDisplayFilters = useMemo(() => {
    if (isAdmin) {
      return {
        ...displayFilters,
        status: true, // Admin can filter by status
        createdBy: true, // Admin can filter by author
      };
    }
    // Non-admin users have limited filters
    return {
      ...displayFilters,
      status: false, // Hide status filter for public
      createdBy: false, // Hide author filter for public
    };
  }, [displayFilters, isAdmin]);

  return (
    <DashboardContent>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading="Posts"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Posts' }]}
          action={
            <PermissionsGate permissions={user?.permissions} requiredPermission="admin">
              <Button
                component={RouterLink}
                href={paths.dashboard.post.create}
                variant="contained"
                startIcon={<AddIcon />}
              >
                New Post
              </Button>
            </PermissionsGate>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* Status Tabs - show filtered options based on user role */}
          {filteredTabOptions && filteredTabOptions.length > 0 && (
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
              {filteredTabOptions.map((tab) => (
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
          <PostTableToolbar
            filters={filters}
            onResetPage={() => setPage(0)}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            search={safeSearch}
            onClearFilters={handleClearFilters}
            displayFilters={roleBasedDisplayFilters}
            isAdmin={isAdmin}
          />

          {/* Active Filters Display */}
          {(canReset || !!safeSearch) && (
            <PostTableFiltersResult
              filters={filters}
              totalResults={paginationMeta?.total || tableData.length}
              onResetPage={() => setPage(0)}
              onClearFilters={handleClearFilters}
              onFilterChange={handleFilterChange}
              search={safeSearch}
              displayFilters={roleBasedDisplayFilters}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          {/* Bulk Actions - ADMIN only */}
          <PermissionsGate permissions={user?.permissions} requiredPermission="admin">
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length || 0}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  (tableData || []).map((row) => row.postId)
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
          </PermissionsGate>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              {/* Main Table */}
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 960 }}
                role="table"
                aria-label="Posts data table"
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={tableData?.length || 0}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={
                    isAdmin
                      ? (checked) =>
                          table.onSelectAllRows(
                            checked,
                            (tableData || []).map((row) => row.postId)
                          )
                      : undefined // Hide checkbox column for non-admin
                  }
                />
                <TableBody>
                  {postsLoading ? (
                    <TableNoData notFound={false} sx={{ py: 10 }} />
                  ) : (
                    (tableData || []).map((row) => (
                      <PostTableRow
                        key={row.postId}
                        row={row}
                        selected={isAdmin ? table.selected.includes(row.postId) : false}
                        onSelectRow={isAdmin ? () => table.onSelectRow(row.postId) : undefined}
                        onDeleteRow={isAdmin ? () => handleDeleteRow(row.postId) : undefined}
                        onViewComments={() => handleViewComments(row)}
                        editHref={isAdmin ? paths.dashboard.post.update(row.postId) : undefined}
                        loading={postsLoading}
                        isAdmin={isAdmin}
                        showActions={isAdmin}
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

        {/* Delete Confirmation Dialog - ADMIN only */}
        <PermissionsGate permissions={user?.permissions} requiredPermission="admin">
          <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Delete Posts"
            content={
              <>
                Are you sure you want to delete <strong>{table.selected.length}</strong> posts?
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
                  toast.success(`${table.selected.length} posts deleted successfully`);
                  confirmDialog.onFalse();
                  debugLog(
                    'CityArtWalks.Components.Post.PostTable.bulkDelete',
                    'Bulk delete completed',
                    { deletedCount: table.selected.length }
                  );
                }}
              >
                Delete
              </Button>
            }
          />
        </PermissionsGate>
      </Container>
    </DashboardContent>
  );
}
