'use client';

import {
  Box,
  Card,
  Table,
  TableRow,
  Skeleton,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
} from '@mui/material';

/**
 * @component ArtPieceTypeHomeSkeleton
 * @description Displays a loading skeleton version of the ArtPieceTypeHomeView while data is loading.
 * Matches the layout structure of the actual component including breadcrumbs, tabs, toolbar, and table.
 *
 * @param {Object} props - Component props
 * @param {number} [props.rows=10] - Number of table rows to render as skeletons
 * @param {number} [props.columns=5] - Number of table columns to display
 * @returns {JSX.Element} The skeleton loading component
 *
 * @namespace CityArtWalks.Sections.Dashboard.ArtPieceType.ArtPieceTypeHomeSkeleton
 * @memberof CityArtWalks.Sections.Dashboard.ArtPieceType
 * @author jaimie garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Loading-States} - Loading state patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 */
export function ArtPieceTypeHomeSkeleton({ rows = 10, columns = 5 }) {
  return (
    <Box data-cy="art-piece-type-home-skeleton">
      {/* Scroll Progress Bar Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={4}
        sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1300 }}
        data-cy="scroll-progress-skeleton"
      />

      <Container maxWidth={false} sx={{ mb: 4 }}>
        {/* Breadcrumbs Skeleton */}
        <Box sx={{ mb: 3 }} data-cy="breadcrumbs-skeleton">
          {/* Breadcrumb navigation skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Skeleton variant="text" width={60} height={20} />
            <Skeleton variant="text" width={20} height={20} />
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={20} height={20} />
            <Skeleton variant="text" width={90} height={20} />
            <Skeleton variant="text" width={20} height={20} />
            <Skeleton variant="text" width={120} height={20} />
          </Box>

          {/* Heading and Create Button Skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width={280} height={32} />
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{ borderRadius: 1 }}
              data-cy="create-button-skeleton"
            />
          </Box>
        </Box>

        <Card data-cy="table-card-skeleton">
          {/* Tab Navigation Skeleton */}
          <Box sx={{ px: 2.5, py: 1 }} data-cy="tabs-skeleton">
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>

          {/* Toolbar Skeleton */}
          <Box
            sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
            data-cy="toolbar-skeleton"
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Search bar skeleton */}
              <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 1 }} />

              {/* Toolbar actions skeleton */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>

          {/* Table Skeleton */}
          <TableContainer data-cy="table-skeleton">
            <Table sx={{ minWidth: 800 }}>
              {/* Table Header Skeleton */}
              <TableHead>
                <TableRow>
                  {/* Checkbox column */}
                  <TableCell sx={{ width: 40 }}>
                    <Skeleton variant="rectangular" width={18} height={18} />
                  </TableCell>
                  {/* Data columns */}
                  {Array.from({ length: columns }, (_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" width="80%" height={20} />
                    </TableCell>
                  ))}
                  {/* Actions column */}
                  <TableCell sx={{ width: 88 }}>
                    <Skeleton variant="text" width={50} height={20} />
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Table Body Skeleton */}
              <TableBody>
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {/* Checkbox column */}
                    <TableCell>
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>

                    {/* Type name column */}
                    <TableCell>
                      <Skeleton variant="text" width="90%" height={24} />
                    </TableCell>

                    {/* Status column */}
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={22}
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>

                    {/* Created By column */}
                    <TableCell>
                      <Skeleton variant="text" width="70%" height={20} />
                    </TableCell>

                    {/* Dates column */}
                    <TableCell>
                      <Box>
                        <Skeleton variant="text" width="60%" height={16} />
                        <Skeleton variant="text" width="50%" height={14} />
                      </Box>
                    </TableCell>

                    {/* Actions column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Skeleton
                          variant="rectangular"
                          width={32}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={32}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Skeleton */}
          <Box
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            data-cy="pagination-skeleton"
          >
            {/* Rows per page dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="text" width={80} height={20} />
              <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Page info and navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="text" width={100} height={20} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
