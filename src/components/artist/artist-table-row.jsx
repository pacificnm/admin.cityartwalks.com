/**
 * @file artist-table-row.jsx
 * @description Table row component for displaying individual artist data
 * @namespace CityArtWalks.Components.Artist
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
 * @description Table row component for displaying individual artist data.
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistTableRow
 * @param {Object} props - Component props
 * @param {Object} props.row - Artist data
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onViewRow - Handler for viewing artist details
 * @param {Function} props.onEditRow - Handler for editing artist
 * @param {Function} props.onDeleteRow - Handler for deleting artist
 * @param {Function} props.onViewUser - Handler for viewing user details
 * @param {Function} props.onViewImage - Handler for viewing image details
 * @returns {JSX.Element} The Artist Table Row component.
 */
export function ArtistTableRow({
  row,
  selected,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onViewUser,
  onViewImage,
}) {
  return (
    <TableRow hover selected={selected}>
      <TableCell>
        {row.imageUrl ? (
          <Tooltip title="Click to view image">
            <Box
              component="img"
              src={row.imageUrl}
              alt={row.name}
              onClick={() => onViewImage(row.imageUrl, row.name)}
              sx={{
                width: 40,
                height: 40,
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
              width: 40,
              height: 40,
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
          href={paths.artist.details(row.artistId)}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {row.name || 'N/A'}
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={row.featured ? 'Featured' : 'Not Featured'}
          color={row.featured ? 'secondary' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </TableCell>
      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {row.slug || 'N/A'}
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
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          {row.UpdatedByUser ? (
            <Tooltip
              title={`Click to view ${row.UpdatedByUser.name} (${row.UpdatedByUser.email})`}
            >
              <Avatar
                src={row.UpdatedByUser.image}
                alt={row.UpdatedByUser.name}
                onClick={() => onViewUser(row.UpdatedByUser.userId)}
                sx={{ width: 24, height: 24, cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.300', fontSize: '0.625rem' }}>
              ?
            </Avatar>
          )}
          <Typography variant="body2">
            {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : 'N/A'}
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
