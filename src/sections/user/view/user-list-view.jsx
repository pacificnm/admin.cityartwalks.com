/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.User.UserListView
 */

'use client';

import { useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUserFilters } from 'src/actions/user/filters';
import { createFilterOptions } from 'src/actions/user/filter-options';

import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TabsFilter,
  SearchFilter,
  SelectFilter,
  BooleanFilter,
  LocationFilter,
} from 'src/components/filters';
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

import { UserTableRow } from '../user-table-row';
import { UserTableFiltersResult } from '../user-table-filters-result';

/**
 * @memberof CityArtWalks.Sections.User.UserListView
 * @description Table head configuration for the user list view.
 * @constant
 * @type {Array<{ id: string, label: string, width: number }>}
 */
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'phoneNumber', label: 'Phone number', width: 180 },
  { id: 'company', label: 'Company', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

/**
 * @description User List View component that displays a list of users with filtering and pagination capabilities.
 * @memberof CityArtWalks.Sections.User.UserListView
 * @function UserListView
 * @returns {JSX.Element} The User List View component.
 */
export function UserListView() {
  const { accessToken } = useAuthContext();

  // Get filter configuration for admin view
  const { displayFilters, tabOptions, getStatusColor, roleOptions } = createFilterOptions({
    viewType: 'admin',
  });

  // Use the centralized user filters hook
  const {
    users,
    usersLoading,
    usersError,
    paginationMeta,
    filters,
    page,
    rowsPerPage,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
    hasFilters,
    safeSearch,
    mutate,
  } = useUserFilters({
    initialFilters: {
      status: 'all',
    },
    defaultRowsPerPage: 25,
    accessToken: accessToken ?? '',
    viewType: 'admin',
    persistFilters: true,
  });

  const table = useTable();
  const confirmDialog = useBoolean();

  // Use users data directly from the hook
  const tableData = users || [];
  const notFound = !tableData.length && hasFilters;

  const handleDeleteRow = useCallback(() => {
    // TODO: Implement actual delete API call
    toast.success('Delete success!');
    table.onUpdatePageDeleteRow(tableData.length - 1);
  }, [table, tableData.length]);

  const handleDeleteRows = useCallback(() => {
    // TODO: Implement actual bulk delete API call
    toast.success('Delete success!');
    const remainingRows = tableData.length - table.selected.length;
    table.onUpdatePageDeleteRows(remainingRows, remainingRows);
  }, [table, tableData.length]);

  // Handler for status tab changes
  const handleTabChange = useCallback(
    (_event, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  // Handler for role filter changes
  const handleRoleChange = useCallback(
    (value) => {
      handleFilterChange('role', value);
    },
    [handleFilterChange]
  );

  // Handler for geographic filter changes
  const handleGeographicFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === 'countryId') {
        handleFilterChange('countryId', value);
        handleFilterChange('stateId', '');
        handleFilterChange('cityId', '');
      } else if (filterType === 'stateId') {
        handleFilterChange('stateId', value);
        handleFilterChange('cityId', '');
      } else if (filterType === 'cityId') {
        handleFilterChange('cityId', value);
      }
    },
    [handleFilterChange]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  // Show loading state
  if (usersLoading && (!users || users.length === 0)) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Loading users...</Box>
      </DashboardContent>
    );
  }

  // Show error state
  if (usersError) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
          Error loading users: {usersError.message}
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.root },
            { name: 'User', href: paths.user.root },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* Status Tabs */}
          <TabsFilter
            value={filters.status || 'all'}
            onChange={handleTabChange}
            tabOptions={tabOptions}
            getStatusColor={getStatusColor}
            totalCount={paginationMeta?.total || 0}
            sx={{ px: 2.5 }}
          />

          {/* Search and Filters */}
          <Box sx={{ p: 2.5, pb: 0 }}>
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {/* Search Input */}
              <SearchFilter
                value={safeSearch || ''}
                onChange={handleSearchChange}
                placeholder="Search users by name, email, company..."
                sx={{ flexGrow: 1, minWidth: 240 }}
              />

              {/* Role Filter */}
              <SelectFilter
                value={filters.role || ''}
                onChange={handleRoleChange}
                options={roleOptions}
                label="Role"
                placeholder="All roles"
                multiple
                sx={{ minWidth: 120 }}
              />

              {/* Email Allowed Filter */}
              {displayFilters.emailAllowed && (
                <BooleanFilter
                  value={filters.emailAllowed || false}
                  onChange={(checked) => handleFilterChange('emailAllowed', checked)}
                  label="Email Allowed"
                  color="info"
                />
              )}

              {/* Location Filters */}
              <LocationFilter
                filters={filters}
                onFilterChange={handleGeographicFilterChange}
                displayFilters={displayFilters}
                accessToken={accessToken ?? ''}
              />
            </Box>
          </Box>

          {/* Active Filters Display */}
          {hasFilters && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={paginationMeta?.total || 0}
              onClearFilters={handleClearFilters}
              onFilterChange={handleFilterChange}
              search={safeSearch}
              displayFilters={displayFilters}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.userId)
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

            <Scrollbar>
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
                      tableData.map((row) => row.userId)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => (
                    <UserTableRow
                      key={row.userId}
                      row={row}
                      selected={table.selected.includes(row.userId)}
                      onSelectRow={() => table.onSelectRow(row.userId)}
                      onDeleteRow={handleDeleteRow}
                      editHref={paths.user.edit(row.userId)}
                      mutate={mutate}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 2, textAlign: 'right' }}>
              <TablePaginationCustom
                count={paginationMeta?.total || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Box>
          </Box>
        </Card>
      </DashboardContent>
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------
