import PropTypes from 'prop-types';

import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { TableNoData } from 'src/components/table';
import { Scrollbar } from 'src/components/scrollbar';

/**
 * @memberof CityArtWalks.Components.Table.TableDefault
 * @function TableDefault
 * @description TableDefault Component
 *
 * A reusable and fully integrated table component with pagination.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.data - Data to display in the table.
 * @param {Array} props.columns - Configuration for table columns.
 * @param {Object} props.pagination - Pagination metadata and handlers.
 * @param {Function} [props.actions] - Function to render row-level actions.
 * @param {boolean} [props.isDense=false] - Table density option.
 * @param {Object} [props.sx] - Additional styles for the container.
 */
export function TableDefault({ data, columns, pagination, actions, isDense = false, sx }) {
  const noData = !Array.isArray(data) || data.length === 0;
  if (noData && !pagination) {
    return <TableNoData notFound={noData} />;
  }
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      <Scrollbar>
        <TableContainer>
          <Table size={isDense ? 'small' : 'medium'}>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={col.sx || {}}>
                    {col.label}
                  </TableCell>
                ))}
                {actions && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.render ? col.render(row[col.field], row) : row[col.field]}
                    </TableCell>
                  ))}
                  {actions && <TableCell align="right">{actions(row)}</TableCell>}
                </TableRow>
              ))}

              <TableNoData notFound={noData} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.count} // Total number of rows from paginationMeta
          page={pagination.page} // Zero-based index for MUI
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        />
      )}
    </Paper>
  );
}

TableDefault.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      sx: PropTypes.object,
    })
  ).isRequired,
  pagination: PropTypes.shape({
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func.isRequired,
  }).isRequired,
  actions: PropTypes.func,
  isDense: PropTypes.bool,
  sx: PropTypes.object,
};
