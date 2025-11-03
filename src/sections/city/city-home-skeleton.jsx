'use client';

import PropTypes from 'prop-types';

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
export function CityHomeSkeleton(props) {
  const { rows = 10, columns = 7 } = props;
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
CityHomeSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
};
