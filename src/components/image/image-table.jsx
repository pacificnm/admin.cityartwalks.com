/**
 * @file image-table-admin.jsx
 * @description Complete image table component with filters, pagination, and CRUD operations
 * @namespace CityArtWalks.Components.Image
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
import { useGetImage, useDeleteImage, useGetPaginatedImages } from 'src/actions/image/hooks';

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

import { ImageError } from './image-error';
import { ImageTableRow } from './image-table-row';
import { ImageEditDialog } from './image-edit-dialog';
import { ImageTableFilter } from './image-table-filter';
import { ImageDeleteDialog } from './image-delete-dialog';
import { ArtistUserDialog } from '../artist/artist-user-dialog';
import { ArtistImageDialog } from '../artist/artist-image-dialog';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.Image
 * @description Table head configuration for the image table.
 * @constant
 * @type {Array<{ id: string, label: string, width?: number }>}
 */
const TABLE_HEAD = [
  { id: 'image', label: 'Image', width: 80 },
  { id: 'title', label: 'Title' },
  { id: 'artist', label: 'Artist', width: 200 },
  { id: 'artPiece', label: 'Art Piece', width: 200 },
  { id: 'featured', label: 'Featured', width: 100 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdBy', label: 'Created By', width: 150 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * @description Complete image table component with filtering, pagination, and CRUD operations
 * @memberof CityArtWalks.Components.Image
 * @function ImageTable
 * @param {Object} props - Component props
 * @param {boolean} [props.featured=false] - Filter by featured status
 * @param {string} [props.status=''] - Filter by status
 * @param {string|null} [props.artistId=null] - Filter by artist ID
 * @param {string|null} [props.artPieceId=null] - Filter by art piece ID
 * @returns {JSX.Element} The Image Table component.
 */
export function ImageTable({ featured = false, status = '', artistId = null, artPieceId = null }) {
  const table = useTable({ defaultRowsPerPage: 25 });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(status);
  const [featuredFilter, setFeaturedFilter] = useState(featured ? true : '');

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  // Edit dialog state
  const [editDialog, setEditDialog] = useState({ open: false, imageId: null });

  // User details dialog state
  const [userDialog, setUserDialog] = useState({ open: false, userId: null });

  // Full image dialog state
  const [imageDialog, setImageDialog] = useState({ open: false, imageUrl: null, imageTitle: '' });

  // Delete image mutation
  const deleteImage = useDeleteImage();

  // Fetch image for editing (only when dialog is open and we have an ID)
  const { image: editImage, imageLoading: loadingImage } = useGetImage(
    editDialog.open ? editDialog.imageId : null,
    600
  );

  // Fetch user for details dialog (only when dialog is open and we have a userId)
  const { user: dialogUser, userLoading: loadingUser } = useGetUser(
    userDialog.open ? userDialog.userId : null,
    600
  );

  // Fetch paginated images
  const { results, imagesLoading, imagesError, imagesEmpty, mutate } = useGetPaginatedImages(
    {
      page: table.page + 1, // API uses 1-based pagination
      limit: table.rowsPerPage,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      featured: featuredFilter || undefined,
      artistId: artistId || undefined,
      artPieceId: artPieceId || undefined,
    },
    600
  );

  console.log('Paginated Images Results:', results);
  const images = results?.data || [];
  const totalCount = results?.total || 0;

  const notFound = imagesEmpty;

  const handleViewRow = useCallback(
    (id) => {
      window.location.href = `/image/${id}`;
    },
    []
  );

  const handleEditRow = useCallback(
    (id) => {
      setEditDialog({ open: true, imageId: id });
    },
    []
  );

  const handleCloseEditDialog = useCallback(() => {
    setEditDialog({ open: false, imageId: null });
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

  const handleViewFullImage = useCallback((imageUrl, imageTitle) => {
    setImageDialog({ open: true, imageUrl, imageTitle });
  }, []);

  const handleCloseImageDialog = useCallback(() => {
    setImageDialog({ open: false, imageUrl: null, imageTitle: '' });
  }, []);

  const handleDeleteRow = useCallback(
    (id, title) => {
      setDeleteDialog({ open: true, id, title });
    },
    []
  );

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, id: null, title: '' });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.id) {
      return;
    }

    setDeleting(true);
    try {
      await deleteImage(deleteDialog.id);
      
      // Refresh the image list after successful deletion
      await mutate();
      
      toast.success(`Image "${deleteDialog.title}" deleted successfully`);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error?.message || 'Failed to delete image. Please try again.');
      // Keep dialog open on error so user can retry
    } finally {
      setDeleting(false);
    }
  }, [deleteDialog, deleteImage, mutate, handleCloseDeleteDialog]);

  return (
    <>
      <Card>
        <ImageTableFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
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
                rowCount={images.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {imagesLoading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} sx={{ textAlign: 'center', py: 3 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {images.map((image) => (
                      <ImageTableRow
                        key={image.imageId}
                        row={image}
                        selected={table.selected.includes(image.imageId)}
                        onViewRow={() => handleViewRow(image.imageId)}
                        onEditRow={() => handleEditRow(image.imageId)}
                        onDeleteRow={() => handleDeleteRow(image.imageId, image.title)}
                        onViewUser={handleViewUser}
                        onViewFullImage={handleViewFullImage}
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

      <ImageError error={imagesError} />

      <ImageDeleteDialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        imageTitle={deleteDialog.title}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      <ImageEditDialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        image={editImage}
        loading={loadingImage}
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
        artistName={imageDialog.imageTitle}
      />
    </>
  );
}
