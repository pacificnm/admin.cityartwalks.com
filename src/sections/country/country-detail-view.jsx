'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Box, Chip, Button, Tooltip, Container, IconButton, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { CountryForm } from 'src/forms/country';
import { useGetCountry } from 'src/actions/country/hooks';

import { ErrorView } from 'src/components/error';
import { TableDefault } from 'src/components/table';
import { StateEditDialog } from 'src/components/state';
import { AddIcon, EditIcon } from 'src/components/icons';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { CountrySkeletonView } from 'src/sections/country/country-skeleton-view';

export function CountryDetailView({ slug }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const pageProgress = useScrollProgress();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const quickEdit = useBoolean();
  const [editRow, setEditRow] = useState({});
  const [reloadTrigger, setReloadTrigger] = useState(false); // Trigger to refetch data

  const { country, countryError, countryLoading } = useGetCountry(slug, reloadTrigger);

  const handleEditRow = (row) => {
    setEditRow(row);
    quickEdit.onTrue();
  };

  const handleCloseEditDialog = () => {
    quickEdit.onFalse();
    setReloadTrigger((prev) => !prev); // Toggle reloadTrigger to refetch country data
  };
  const handleChangePage = null;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    {
      field: 'name',
      label: 'Country',
      render: (_, row) =>
        row?.name ? (
          <Link href={paths.dashboard.location.stateDetails(country.slug, row.slug)}>
            {row.name}
          </Link>
        ) : (
          'Unknown'
        ),
    },
    { field: 'code', label: 'Code' },
    { field: 'latitude', label: 'Latitude' },
    { field: 'longitude', label: 'Longitude' },
    { field: 'slug', label: 'Slug' },
    {
      field: 'active',
      label: 'Active',
      render: (value) => (
        <Chip
          label={value ? 'Active' : 'Not Active'} // Conditionally set label
          color={value ? 'primary' : 'error'} // Use 'primary' for Active, 'error' for Not Active
        />
      ),
    },
  ];

  const renderActions = (row) => (
    <Tooltip title="Quick Edit" placement="top" arrow>
      <IconButton onClick={() => handleEditRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );

  if (countryError) return <ErrorView message="Error loading country" />;
  if (countryLoading) return <CountrySkeletonView />;

  const pagination = {
    count: country.states?.length || 0,
    page,
    rowsPerPage,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  };

  return (
    <ErrorBoundary>
      <Box data-cy="artist-home-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }} data-cy="container">
          {!isSmallScreen && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading={country.name}
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Dasboard', href: paths.dashboard },
                { name: 'Location', href: paths.dashboard.location.home },
                { name: 'Countries', href: paths.dashboard.location.country },
                { name: country.name, href: paths.dashboard.location.countryDetails(country.slug) },
              ]}
              action={
                <Button
                  data-cy="breadcrumbs-action-button"
                  component={RouterLink}
                  href={paths.art.artist.create}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  New State
                </Button>
              }
              sx={{ mb: 3 }}
            />
          )}
          <CountryForm currentCountry={country} />
          <TableDefault
            data={country.states}
            columns={columns}
            isLoading={countryLoading}
            isDense
            pagination={pagination}
            actions={renderActions}
            sx={{ mb: 10, mt: 4 }}
          />
          <StateEditDialog
            currentState={editRow}
            open={quickEdit.value}
            onClose={handleCloseEditDialog}
            countrySlug={slug}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
