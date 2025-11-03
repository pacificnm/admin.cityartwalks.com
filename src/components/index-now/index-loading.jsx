/**
 * IndexNow Loading Component
 *
 * Displays loading state for IndexNow submissions table operations.
 * Provides consistent table skeleton loading with proper structure
 * matching the actual table layout.
 *
 * @namespace CityArtWalks.Components.IndexNow
 * @fileoverview Loading component for IndexNow submissions table
 * @author GitHub Copilot
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { Scrollbar } from 'src/components/scrollbar';
import { TableEmptyRows, TableHeadCustom } from 'src/components/table';

/**
 * Table head configuration for loading state
 * Matches the actual IndexNow submissions table structure
 *
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.IndexNow
 */
const TABLE_HEAD = [
  { id: 'indexNowSubmissionId', label: 'ID', width: 100 },
  { id: 'url', label: 'URL', width: 250 },
  { id: 'entityType', label: 'Entity', width: 120 },
  { id: 'action', label: 'Action', width: 100 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'createdAt', label: 'Created', width: 160 },
  { id: 'submittedAt', label: 'Submitted', width: 160 },
  { id: 'responseCode', label: 'Response', width: 100 },
  { id: '', width: 88 },
];

/**
 * @memberof CityArtWalks.Components.IndexNow
 * @function IndexLoading
 * @description Displays table skeleton loading for IndexNow submissions.
 *
 * Provides consistent table loading state visualization that matches
 * the actual table structure with proper skeleton rows.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.dense=false] - Whether to use dense table layout
 * @param {number} [props.rowsPerPage=25] - Number of skeleton rows to display
 * @returns {JSX.Element} The rendered table loading component
 *
 * @example
 * // Display loading state with default rows
 * <IndexLoading />
 *
 * // Display with custom row count
 * <IndexLoading rowsPerPage={10} />
 *
 * // Display with dense layout
 * <IndexLoading dense rowsPerPage={15} />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Loading} - Loading state documentation
 */
export function IndexLoading({ dense = false, rowsPerPage = 25 }) {
  return (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={0} numSelected={0} />
            <TableBody>
              {Array.from({ length: rowsPerPage }, (_, index) => (
                <TableEmptyRows key={index} height={dense ? 56 : 76} emptyRows={1} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}
