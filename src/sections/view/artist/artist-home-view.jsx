'use client';

import { useState, useEffect } from 'react';
/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Dashboard.Artist.ArtistHomeView
 */
import { useUser } from '@auth0/nextjs-auth0/client';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Box, Chip, Link, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetPaginatedArtists } from 'src/actions/artist/hooks';

import { EditIcon } from 'src/components/icons';
import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableDefault, TableSearchFilter } from 'src/components/table';
import { ArtistEditDialog } from 'src/components/artist/artist-edit-dialog';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Artist.ArtistHomeView
 * @description ArtistHomeView component renders the artist home view with a table of artists,
 * search filter, pagination, and quick edit functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <ArtistHomeView />
 * @function
 * @name ArtistHomeView
 */
export function ArtistHomeView() {
  const pageProgress = useScrollProgress();
  const quickEdit = useBoolean();
  const [editRow, setEditRow] = useState({});
  const [artists, setArtists] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, page: 0, rowsPerPage: 10 });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  // Add a state variable to trigger data refresh
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    artists: fetchedArtists,
    paginationMeta: fetchedPaginationMeta,
    isLoading,
    error,
  } = useGetPaginatedArtists({ search }, page + 1, rowsPerPage, '', 600, refreshKey);

  // Function to refresh data
  const refreshData = () => setRefreshKey((prevKey) => prevKey + 1);

  const { user, userError, userIsLoading } = useUser();

  useEffect(() => {
    if (fetchedArtists) {
      setArtists(fetchedArtists);
      setPaginationMeta(fetchedPaginationMeta);
    }
  }, [fetchedArtists, fetchedPaginationMeta, refreshKey]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value) => {
    setSearch(value); // Update search value after debouncing
    setPage(0); // Reset pagination to first page
  };

  const handleEditRow = (row) => {
    refreshData(); // Refresh the data
    setEditRow(row);
    quickEdit.onTrue();
  };

  // handel dialog closing
  const handleCloseDialog = () => {
    quickEdit.onFalse(); // Close the dialog
    refreshData(); // Refresh the data
  };

  const pagination = {
    count: paginationMeta.total,
    page,
    rowsPerPage,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  const columns = [
    {
      field: 'imageUrl',
      label: 'Image',
      render: (value, row) => (
        <Link href={row.slug ? `/dashboard/art-piece/view/${row.slug}` : '#'}>
          <Avatar alt={row.name} src={value} sx={{ width: 64, height: 64 }} />
        </Link>
      ),
      sx: { display: 'flex', alignItems: 'center' },
    },
    { field: 'name', label: 'Artist', render: (_, row) => row?.name || 'Unknown' },
    { field: 'country', label: 'Country', render: (_, row) => row?.Country?.name || 'Unknown' },
    { field: 'city', label: 'City', render: (_, row) => row?.City?.name || 'Unknown' },
    { field: 'state', label: 'State', render: (_, row) => row?.State?.name || 'Unknown' },
    { field: 'created_date', label: 'Created' },
    { field: 'status', label: 'Status', render: (value) => <Chip label={value} color="primary" /> },
  ];

  const renderActions = (row) => (
    <Tooltip title="Quick Edit" placement="top" arrow>
      <IconButton onClick={() => handleEditRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );

  if (isLoading || userIsLoading) return null; // change this to load a skelleton
  if (error || userError) return <ErrorView message="There was an error loading the artist home" />;

  return (
    <ErrorBoundary>
      <Box data-cy="image-home-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          <CustomBreadcrumbs
            data-cy="breadcrumbs"
            heading="Admin Images"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Images', href: paths.dashboard.image.home },
            ]}
            sx={{ mb: 3 }}
          />

          {/* Search Filter */}
          <TableSearchFilter
            value={search}
            onDebouncedChange={handleSearch}
            placeholder="Search art pieces..."
            sx={{ mb: 4 }}
          />
          {error && <ErrorView message="There was an error loading the data" />}

          {/* Table */}
          <TableDefault
            data={artists}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            isDense
            actions={renderActions}
            sx={{ mb: 10 }}
          />
          <ArtistEditDialog
            currentArtist={editRow}
            open={quickEdit.value}
            onClose={handleCloseDialog}
            user={user}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
