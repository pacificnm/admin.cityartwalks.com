/**
 * @file image-table-row.jsx
 * @description Table row component for displaying individual image data
 * @namespace CityArtWalks.Components.Image
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EditIcon, ViewIcon, DeleteIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @description Returns the color for a status chip based on the status value
 * @param {string} status - The status value
 * @returns {string} The color for the chip
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REVIEW':
      return 'info';
    case 'ARCHIVED':
      return 'default';
    case 'BANNED':
      return 'error';
    case 'DELETED':
      return 'error';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

// ----------------------------------------------------------------------

/**
 * @description Table row component for displaying individual image data.
 * @memberof CityArtWalks.Components.Image
 * @function ImageTableRow
 * @param {Object} props - Component props
 * @param {Object} props.row - Image data
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onViewRow - Handler for viewing image details
 * @param {Function} props.onEditRow - Handler for editing image
 * @param {Function} props.onDeleteRow - Handler for deleting image
 * @param {Function} props.onViewUser - Handler for viewing user details
 * @param {Function} props.onViewFullImage - Handler for viewing full image
 * @returns {JSX.Element} The Image Table Row component.
 */
export function ImageTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onViewUser,
  onViewFullImage,
}) {
  return (
    <TableRow hover selected={selected}>
      <TableCell>
        {row.url ? (
          <Tooltip title="Click to view full image">
            <Box
              component="img"
              src={row.url}
              alt={row.title || 'Image'}
              onClick={() => onViewFullImage(row.url, row.title)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                objectFit: 'cover',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            />
          </Tooltip>
        ) : (
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
              bgcolor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            N/A
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Box
          component={RouterLink}
          href={paths.image.details(row.imageId)}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {row.title || 'Untitled'}
        </Box>
      </TableCell>
      <TableCell>
        {row.Artist ? (
          <Box
            component={RouterLink}
            href={paths.artist.details(row.Artist.artistId)}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            {row.Artist.name}
          </Box>
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell>
        {row.ArtPiece ? (
          <Box
            component={RouterLink}
            href={paths.artPiece.details(row.ArtPiece.artPieceId)}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              },
            }}
          >
            {row.ArtPiece.title}
          </Box>
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell>
        <Chip
          label={row.featured ? 'Featured' : 'Not Featured'}
          color={row.featured ? 'secondary' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </TableCell>
      <TableCell>
        {row.status ? (
          <Chip
            label={row.status}
            color={getStatusColor(row.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          {row.CreatedByUser ? (
            <Tooltip
              title={`Click to view ${row.CreatedByUser.name} (${row.CreatedByUser.email})`}
            >
              <Avatar
                src={row.CreatedByUser.image}
                alt={row.CreatedByUser.name}
                onClick={() => onViewUser(row.CreatedByUser.userId)}
                sx={{ width: 24, height: 24, cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.300', fontSize: '0.625rem' }}>
              ?
            </Avatar>
          )}
          <Typography variant="body2">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View">
            <IconButton onClick={onViewRow} size="small" color="default">
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={onEditRow} size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteRow} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
