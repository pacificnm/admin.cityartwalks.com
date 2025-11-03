/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplateTable
 */

'use client';

import { useState, useCallback } from 'react';

import {
  Card,
  Table,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';

import { DeleteIcon } from 'src/components/icons';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import { EmailTemplateTableRow } from './email-template-table-row';
import { EmailTemplateTableToolbar } from './email-template-table-toolbar';
import { EmailTemplateTableFiltersResult } from './email-template-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Template Name', width: 200 },
  { id: 'category', label: 'Category', width: 150 },
  { id: 'subject', label: 'Subject', width: 250 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'version', label: 'Version', width: 80 },
  { id: 'createdAt', label: 'Created', width: 150 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  category: 'all',
  status: 'all',
};

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplateTable
 * @description Email template table component with filtering, pagination and actions
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Array} props.templates - Array of email templates
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onEditRow - Edit template callback
 * @param {Function} props.onDeleteRow - Delete template callback
 * @param {Function} props.onPreviewRow - Preview template callback
 * @param {Function} props.onDuplicateRow - Duplicate template callback
 * @param {Function} props.onTestRow - Test template callback
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateTable({
  templates = [],
  loading = false,
  onEditRow,
  onDeleteRow,
  onPreviewRow,
  onDuplicateRow,
  onTestRow,
}) {
  const table = useTable();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: templates,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.name || filters.category !== 'all' || filters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      debugLog('EmailTemplateTable.handleDeleteRow', 'Deleting template', { id });
      onDeleteRow?.(id);
    },
    [onDeleteRow]
  );

  const handleEditRow = useCallback(
    (id) => {
      debugLog('EmailTemplateTable.handleEditRow', 'Editing template', { id });
      onEditRow?.(id);
    },
    [onEditRow]
  );

  const handlePreviewRow = useCallback(
    (id) => {
      debugLog('EmailTemplateTable.handlePreviewRow', 'Previewing template', { id });
      onPreviewRow?.(id);
    },
    [onPreviewRow]
  );

  const handleDuplicateRow = useCallback(
    (id) => {
      debugLog('EmailTemplateTable.handleDuplicateRow', 'Duplicating template', { id });
      onDuplicateRow?.(id);
    },
    [onDuplicateRow]
  );

  const handleTestRow = useCallback(
    (id) => {
      debugLog('EmailTemplateTable.handleTestRow', 'Testing template', { id });
      onTestRow?.(id);
    },
    [onTestRow]
  );

  const handleDeleteRows = useCallback(() => {
    const selectedIds = table.selected;
    debugLog('EmailTemplateTable.handleDeleteRows', 'Deleting multiple templates', { selectedIds });

    if (selectedIds.length > 0) {
      selectedIds.forEach((id) => {
        onDeleteRow?.(id);
      });
      table.onSelectAllRows(false, []);
    }
  }, [table, onDeleteRow]);

  return (
    <Card>
      <EmailTemplateTableToolbar
        filters={filters}
        onFilters={handleFilters}
        canReset={canReset}
        onResetFilters={handleResetFilters}
      />

      {canReset && (
        <EmailTemplateTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.templateId)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={() => handleDeleteRows()}>
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
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.templateId)
                )
              }
            />

            <TableBody>
              {dataInPage.map((row) => (
                <EmailTemplateTableRow
                  key={row.templateId}
                  row={row}
                  selected={table.selected.includes(row.templateId)}
                  onSelectRow={() => table.onSelectRow(row.templateId)}
                  onDeleteRow={() => handleDeleteRow(row.templateId)}
                  onEditRow={() => handleEditRow(row.templateId)}
                  onPreviewRow={() => handlePreviewRow(row.templateId)}
                  onDuplicateRow={() => handleDuplicateRow(row.templateId)}
                  onTestRow={() => handleTestRow(row.templateId)}
                />
              ))}

              <TableEmptyRows
                height={table.dense ? 56 : 76}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        page={table.page}
        component="div"
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  try {
    const { name, category, status } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
      inputData = inputData.filter(
        (template) =>
          template.name.toLowerCase().includes(name.toLowerCase()) ||
          template.subjectTemplate.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (category !== 'all') {
      inputData = inputData.filter((template) => template.category === category);
    }

    if (status !== 'all') {
      const isActive = status === 'active';
      inputData = inputData.filter((template) => template.isActive === isActive);
    }

    return inputData;
  } catch (error) {
    debugError('EmailTemplateTable.applyFilter', 'Failed to apply filters', error);
    return inputData;
  }
}
