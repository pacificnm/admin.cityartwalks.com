'use client';

import {
  Table,
  Paper,
  TableRow,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material';

/**
 * @component TableSkeleton
 * @description Displays a loading skeleton version of the table while data is loading.
 *
 * @param {number} rows - Number of rows to render as skeletons.
 * @param {number} columns - Number of columns to display.
 * @returns {JSX.Element}
 */
export function StateHomeSkeleton({ rows = 10, columns = 7 }) {
  return (
    <TableContainer component={Paper} sx={{ mb: 10 }}>
      <Table>
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(columns)].map((__, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" width="100%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
