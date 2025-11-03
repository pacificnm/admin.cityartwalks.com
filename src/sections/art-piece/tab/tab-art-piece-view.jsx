'use client';

import { useMemo, useState } from 'react';

import { Box, Chip, Link, Avatar, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { EditIcon } from 'src/components/icons';
import { TableDefault, TableToolbar } from 'src/components/table';
import { ArtPieceEditDialog } from 'src/components/art-piece/art-piece-edit-dialog';

export function TabArtPieceView({ artPieces }) {
  const quickEdit = useBoolean();
  const [editRow, setEditRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    status: 'all',
  });

  // Memoize filtered data to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    const keyword = filters.name?.toLowerCase() || '';
    return artPieces.filter((piece) => {
      const matchesKeyword = [piece.title, piece.artist?.name, piece.slug].some((field) =>
        field?.toLowerCase().includes(keyword)
      );

      const matchesStatus = filters.status === 'all' || piece.status === filters.status;

      return matchesKeyword && matchesStatus;
    });
  }, [artPieces, filters]);

  // Memoize paginated data to avoid unnecessary recalculations
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  // Define pagination object
  const pagination = {
    count: filteredData.length,
    page,
    rowsPerPage,
    onPageChange: (_, newPage) => setPage(newPage),
    onRowsPerPageChange: (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
  };

  // Reset page to 0 when filters change
  const handleResetPage = () => setPage(0);

  // Handle row edit action
  const handleEditRow = (row) => {
    setEditRow(row);
    quickEdit.onTrue();
  };

  // Render actions for each row
  const renderActions = (row) => (
    <Tooltip title="Quick Edit" placement="top" arrow>
      <IconButton onClick={() => handleEditRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      <TableToolbar
        filters={{ state: filters, setState: setFilters }}
        onResetPage={handleResetPage}
        filterConfig={[
          { key: 'name', label: 'Search', type: 'text' },
          {
            key: 'status',
            label: 'Status',
            type: 'single-select',
            options: ['all', 'ACTIVE', 'ARCHIVED', 'DELETED'],
          },
        ]}
        actions={[
          {
            label: 'Print',
            icon: 'solar:printer-minimalistic-bold',
            onClick: () => {
              /* console.log('Print') */
            },
          },
          {
            label: 'Export',
            icon: 'solar:export-bold',
            onClick: () => {
              /* console.log('Export') */
            },
          },
        ]}
      />
      <TableDefault
        data={paginatedData}
        columns={columns}
        pagination={pagination}
        isLoading={false}
        isDense
        actions={renderActions}
        sx={{ mb: 10 }}
      />
      <ArtPieceEditDialog
        currentArtPiece={editRow}
        open={quickEdit.value}
        onClose={() => {
          quickEdit.onFalse();
          setEditRow(null);
        }}
      />
    </Box>
  );
}

const columns = [
  {
    field: 'imageUrl',
    label: 'Image',
    render: (value, row) => (
      <Link href={paths.dashboard.location?.stateDetails?.(row.id) || '#'}>
        <Avatar alt={row.name} src={value} sx={{ width: 64, height: 64 }} />
      </Link>
    ),
  },
  { field: 'title', label: 'Title', render: (_, row) => row?.title || 'Unknown' },
  { field: 'name', label: 'Artist', render: (_, row) => row?.artist?.name || 'Unknown' },
  { field: 'slug', label: 'Slug', render: (_, row) => row?.slug || 'Unknown' },
  { field: 'latitude', label: 'Latitude', render: (_, row) => row?.latitude || 'Unknown' },
  { field: 'longitude', label: 'Longitude', render: (_, row) => row?.longitude || 'Unknown' },
  { field: 'status', label: 'Status', render: (value) => <Chip label={value} color="primary" /> },
  { field: 'last_update', label: 'Last Update' },
];
