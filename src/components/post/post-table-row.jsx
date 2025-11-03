/**
 * @file post-table-row.jsx
 * @description Post Table Row Component with Role-Based Actions
 * @namespace CityArtWalks.Components.Post.PostTableRow
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fTime, formatStr } from 'src/utils/format-time';

import { debugLog, debugWarn } from 'src/lib/debug';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableEmptyRows } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, ViewIcon, StarIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Gets the appropriate Material-UI color for status values
 * @memberof CityArtWalks.Components.Post
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'REVIEW':
      return 'info';
    case 'ARCHIVED':
      return 'default';
    case 'DELETED':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Post Table Row Component
 *
 * Displays individual post records within a table with role-based interactive features including
 * selection capabilities (admin only), action menus (admin only), comment count display,
 * and delete confirmations. Integrates with the parent table component for state management
 * and data operations.
 *
 * Features:
 * - Role-based row selection with checkbox (admin only)
 * - Role-based action menu with edit and delete options (admin only)
 * - Comment count display with click-to-view functionality
 * - Delete confirmation dialog (admin only)
 * - Status color coding
 * - Featured post highlighting
 * - Author information display
 * - Loading state handling
 * - Accessibility support
 * - Public-readable interface for non-admin users
 *
 * @namespace CityArtWalks.Components.Post
 * @fileoverview Table row component for post management with role-based access
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */

/**
 * Post Table Row component
 * Displays individual post records within a table with role-based actions and selection capabilities.
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - Post data object from database
 * @param {boolean} props.selected - Whether the row is currently selected (admin only)
 * @param {Function} props.onSelectRow - Handler for row selection toggle (admin only)
 * @param {Function} props.onDeleteRow - Handler for row deletion (admin only)
 * @param {Function} props.onViewComments - Handler for viewing post comments
 * @param {string} props.editHref - URL for editing the post (admin only)
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @param {boolean} [props.isAdmin=false] - Whether current user is admin
 * @param {boolean} [props.showActions=false] - Whether to show action buttons
 * @returns {JSX.Element} The table row component
 *
 * @example
 * // Admin view with full functionality
 * <PostTableRow
 *   row={postData}
 *   selected={table.selected.includes(postData.postId)}
 *   onSelectRow={() => table.onSelectRow(postData.postId)}
 *   onDeleteRow={() => handleDeleteRow(postData.postId)}
 *   onViewComments={() => handleViewComments(postData)}
 *   editHref={paths.dashboard.post.update(postData.postId)}
 *   loading={false}
 *   isAdmin={true}
 *   showActions={true}
 * />
 *
 * // Public view - read-only
 * <PostTableRow
 *   row={postData}
 *   selected={false}
 *   onSelectRow={undefined}
 *   onDeleteRow={undefined}
 *   onViewComments={() => handleViewComments(postData)}
 *   editHref={undefined}
 *   loading={false}
 *   isAdmin={false}
 *   showActions={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Database schema reference
 */
export function PostTableRow({
  row,
  selected = false,
  onSelectRow,
  onDeleteRow,
  onViewComments,
  editHref,
  loading = false,
  isAdmin = false,
  showActions = false,
}) {
  // Action menu popover state - only for admin users
  const menuActions = usePopover();

  // Delete confirmation dialog state - only for admin users
  const confirmDialog = useBoolean();

  // Early return for loading state
  if (loading) return <TableEmptyRows />;

  // Handle comment count click
  const handleCommentClick = () => {
    if (onViewComments) {
      debugLog(
        'CityArtWalks.Components.Post.PostTableRow.handleCommentClick',
        'Comment count clicked',
        { postId: row.postId, commentCount: row.commentCount || 0 }
      );
      onViewComments(row);
    }
  };

  // Handle delete action with admin check
  const handleDeleteAction = () => {
    if (!isAdmin) {
      debugWarn(
        'CityArtWalks.Components.Post.PostTableRow.handleDeleteAction',
        'Non-admin user attempted delete action',
        { postId: row.postId }
      );
      return;
    }

    if (onDeleteRow) {
      debugLog(
        'CityArtWalks.Components.Post.PostTableRow.handleDeleteAction',
        'Delete action triggered',
        { postId: row.postId, title: row.title }
      );
      onDeleteRow(row.postId);
    }
    confirmDialog.onFalse();
  };

  /**
   * Renders the action menu popover with edit and delete options (admin only)
   * @memberof CityArtWalks.Components.Post
   * @returns {JSX.Element|null} Action menu popover component or null
   */
  const renderMenuActions = () => {
    if (!isAdmin || !showActions) return null;

    return (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {editHref && (
            <MenuItem
              component={RouterLink}
              href={editHref}
              onClick={() => {
                menuActions.onClose();
                debugLog(
                  'CityArtWalks.Components.Post.PostTableRow.editAction',
                  'Edit action clicked',
                  { postId: row.postId, editHref }
                );
              }}
            >
              <EditIcon />
              Edit
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              confirmDialog.onTrue();
              menuActions.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    );
  };

  /**
   * Renders the delete confirmation dialog (admin only)
   * @memberof CityArtWalks.Components.Post
   * @returns {JSX.Element|null} Confirmation dialog component or null
   */
  const renderConfirmDialog = () => {
    if (!isAdmin || !showActions) return null;

    return (
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete Post"
        content={
          <>
            Are you sure you want to delete{' '}
            <strong>&ldquo;{row.title || 'this post'}&rdquo;</strong>?
            <br />
            This action cannot be undone and will also delete all associated comments.
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteAction}>
            Delete
          </Button>
        }
      />
    );
  };

  // Checkbox cell - only render for admin users
  const renderPrimary =
    isAdmin && onSelectRow ? (
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          slotProps={{
            input: {
              id: `${row.postId}-checkbox`,
              'aria-label': `Select ${row.title || row.postId}`,
            },
          }}
        />
      </TableCell>
    ) : null;

  // Title cell with post information
  const renderTitle = (
    <TableCell>
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
        {/* Featured indicator */}
        {row.featured && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <StarIcon sx={{ color: 'warning.main', width: 16, height: 16 }} />
          </Box>
        )}

        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          <Link
            component={RouterLink}
            href={paths.post?.details?.(row.slug) || `/post/${row.slug}`}
            color="inherit"
            sx={{ cursor: 'pointer', fontWeight: 'medium' }}
            title={row.title}
          >
            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
              {row.title || 'Untitled Post'}
            </Typography>
          </Link>

          {/* Post excerpt or description */}
          {row.excerpt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: 300,
              }}
            >
              {row.excerpt}
            </Typography>
          )}

          {/* Tags display */}
          {row.tags && row.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {row.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              ))}
              {row.tags.length > 3 && (
                <Chip
                  label={`+${row.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </TableCell>
  );

  // Author cell
  const renderAuthor = (
    <TableCell>
      <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={row.author?.name || row.createdBy?.name || 'Author'}
          src={row.author?.imageUrl || row.createdBy?.imageUrl}
          sx={{ width: 32, height: 32 }}
        >
          {(row.author?.name || row.createdBy?.name || 'A')[0]?.toUpperCase()}
        </Avatar>
        <Stack sx={{ typography: 'body2' }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {row.author?.name || row.createdBy?.name || 'Unknown Author'}
          </Typography>
          {(row.author?.role || row.createdBy?.role) && (
            <Typography variant="caption" color="text.secondary">
              {row.author?.role || row.createdBy?.role}
            </Typography>
          )}
        </Stack>
      </Box>
    </TableCell>
  );

  // Category cell
  const renderCategory = (
    <TableCell>
      {row.category ? (
        <Chip
          label={row.category}
          size="small"
          variant="soft"
          color="info"
          sx={{ textTransform: 'capitalize' }}
        />
      ) : (
        <Typography variant="body2" color="text.disabled">
          No Category
        </Typography>
      )}
    </TableCell>
  );

  // Comment count cell with click handler
  const renderCommentCount = (
    <TableCell>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.main',
          },
        }}
        onClick={handleCommentClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCommentClick();
          }
        }}
      >
        <Iconify icon="solar:chat-round-dots-bold" sx={{ width: 16, height: 16 }} />
        <Typography variant="body2">{row.commentCount || 0}</Typography>
      </Box>
    </TableCell>
  );

  // View count cell
  const renderViewCount = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ViewIcon sx={{ width: 16, height: 16, color: 'text.secondary' }} />
        <Typography variant="body2">{row.viewCount?.toLocaleString() || 0}</Typography>
      </Box>
    </TableCell>
  );

  // Status cell
  const renderStatus = (
    <TableCell>
      <Label variant="soft" color={getStatusColor(row.status)}>
        {row.status || 'UNKNOWN'}
      </Label>
    </TableCell>
  );

  // Published date cell
  const renderPublishedDate = (
    <TableCell>
      <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
        {row.publishedAt ? (
          <>
            <Box component="div">Published</Box>
            <Box component="div" sx={{ fontWeight: 'medium' }}>
              {fTime(row.publishedAt, formatStr.date)}
            </Box>
          </>
        ) : (
          <>
            <Box component="div">Created</Box>
            <Box component="div" sx={{ fontWeight: 'medium' }}>
              {fTime(row.createdAt, formatStr.date)}
            </Box>
          </>
        )}
      </Box>
    </TableCell>
  );

  // Actions cell - only render for admin users
  const renderActions =
    isAdmin && showActions ? (
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color={menuActions.open ? 'inherit' : 'default'}
            onClick={menuActions.onOpen}
            aria-label={`Actions for ${row.title || 'post'}`}
          >
            <VerticalFillIcon />
          </IconButton>
        </Box>
      </TableCell>
    ) : (
      // Empty cell to maintain table structure
      <TableCell />
    );

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{
          '&.Mui-selected': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.action.selected
                : theme.palette.action.selected,
          },
        }}
      >
        {renderPrimary}
        {renderTitle}
        {renderAuthor}
        {renderCategory}
        {renderCommentCount}
        {renderViewCount}
        {renderStatus}
        {renderPublishedDate}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
