/**
 * @file artist-table.jsx
 * @description Complete artist table component with filters, pagination, and CRUD operations
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetUser } from 'src/actions/user/hooks';
import { useGetArtist, useDeleteArtist, useGetPaginatedArtists } from 'src/actions/artist/hooks';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import {
  ArtistError,
  ArtistTableRow,
  ArtistEditDialog,
  ArtistUserDialog,
  ArtistImageDialog,
  ArtistTableFilter,
  ArtistDeleteDialog,
} from 'src/components/artist';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.Artist
 * @description Table head configuration for the artist table.
 * @constant
 * @type {Array<{ id: string, label: string, width?: number }>}
 */
const TABLE_HEAD = [
  { id: 'image', label: 'Image', width: 80 },
  { id: 'name', label: 'Artist Name' },
  { id: 'featured', label: 'Featured', width: 100 },
  { id: 'slug', label: 'Slug', width: 200 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Created', width: 200 },
  { id: 'updatedAt', label: 'Updated', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * @description Complete artist table component with filtering, pagination, and CRUD operations
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistTable
 * @returns {JSX.Element} The Artist Table component.
 */
export function ArtistTable({ featured = false, createdBy = null, updatedBy = null, status = '' }) {
  const table = useTable({ defaultRowsPerPage: 25 });

  // Filter states
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState(status);
  const [featuredFilter, setFeaturedFilter] = useState(featured ? true : '');

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  // Edit dialog state
  const [editDialog, setEditDialog] = useState({ open: false, artistId: null });

  // User details dialog state
  const [userDialog, setUserDialog] = useState({ open: false, userId: null });

  // Image details dialog state
  const [imageDialog, setImageDialog] = useState({ open: false, imageUrl: null, artistName: '' });

  // Delete artist mutation
  const deleteArtist = useDeleteArtist();

  // Fetch artist for editing (only when dialog is open and we have an ID)
  const { artist: editArtist, artistLoading: loadingArtist } = useGetArtist(
    editDialog.open ? editDialog.artistId : null,
    600
  );

  // Fetch user for details dialog (only when dialog is open and we have a userId)
  const { user: dialogUser, userLoading: loadingUser } = useGetUser(
    userDialog.open ? userDialog.userId : null,
    600
  );

  // Fetch paginated artists
  const { results, artistsLoading, artistsError, artistsEmpty, mutate } = useGetPaginatedArtists(
    {
      page: table.page + 1, // API uses 1-based pagination
      limit: table.rowsPerPage,
      search: searchName || undefined,
      status: statusFilter || undefined,
      featured: featuredFilter || undefined,
    },
    600
  );

  const artists = results?.data || [];
  const totalCount = results?.total || 0;

  const notFound = artistsEmpty;

  const handleViewRow = useCallback(
    (id) => {
      window.location.href = `/artist/${id}`;
    },
    []
  );

  const handleEditRow = useCallback(
    (id) => {
      setEditDialog({ open: true, artistId: id });
    },
    []
  );

  const handleCloseEditDialog = useCallback(() => {
    setEditDialog({ open: false, artistId: null });
  }, []);

  const handleEditSuccess = useCallback(() => {
    // Refresh the list after successful edit
    mutate();
    handleCloseEditDialog();
  }, [mutate, handleCloseEditDialog]);

  const handleViewUser = useCallback((userId) => {
    setUserDialog({ open: true, userId });
  }, []);

  const handleCloseUserDialog = useCallback(() => {
    setUserDialog({ open: false, userId: null });
  }, []);

  const handleViewImage = useCallback((imageUrl, artistName) => {
    setImageDialog({ open: true, imageUrl, artistName });
  }, []);

  const handleCloseImageDialog = useCallback(() => {
    setImageDialog({ open: false, imageUrl: null, artistName: '' });
  }, []);

  const handleDeleteRow = useCallback(
    (id, name) => {
      setDeleteDialog({ open: true, id, name });
    },
    []
  );

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, id: null, name: '' });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.id) {
      return;
    }

    setDeleting(true);
    try {
      await deleteArtist(deleteDialog.id);
      
      // Refresh the artist list after successful deletion
      await mutate();
      
      toast.success(`Artist "${deleteDialog.name}" deleted successfully`);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error(error?.message || 'Failed to delete artist. Please try again.');
      // Keep dialog open on error so user can retry
    } finally {
      setDeleting(false);
    }
  }, [deleteDialog, deleteArtist, mutate, handleCloseDeleteDialog]);

  return (
    <>
      <Card>
        <ArtistTableFilter
          searchName={searchName}
          onSearchChange={setSearchName}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          featuredFilter={featuredFilter}
          onFeaturedChange={setFeaturedFilter}
        />

        <TableContainer sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={artists.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {artistsLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} sx={{ textAlign: 'center', py: 3 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {artists.map((artist) => (
                      <ArtistTableRow
                        key={artist.artistId}
                        row={artist}
                        selected={table.selected.includes(artist.artistId)}
                        onViewRow={() => handleViewRow(artist.artistId)}
                        onEditRow={() => handleEditRow(artist.artistId)}
                        onDeleteRow={() => handleDeleteRow(artist.artistId, artist.name)}
                        onViewUser={handleViewUser}
                        onViewImage={handleViewImage}
                      />
                    ))}

                    {notFound && <TableNoData notFound={notFound} />}

                    {!notFound && (
                      <TableEmptyRows
                        height={table.dense ? 56 : 76}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, totalCount)}
                      />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <ArtistError error={artistsError} />

      <ArtistDeleteDialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        artistName={deleteDialog.name}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      <ArtistEditDialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        artist={editArtist}
        loading={loadingArtist}
        onSuccess={handleEditSuccess}
      />

      <ArtistUserDialog
        open={userDialog.open}
        onClose={handleCloseUserDialog}
        user={dialogUser}
        loading={loadingUser}
      />

      <ArtistImageDialog
        open={imageDialog.open}
        onClose={handleCloseImageDialog}
        imageUrl={imageDialog.imageUrl}
        artistName={imageDialog.artistName}
      />
    </>
  );
}
