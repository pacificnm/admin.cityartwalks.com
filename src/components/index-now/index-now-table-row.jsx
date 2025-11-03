'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { ViewIcon, SendIcon } from 'src/components/icons';
import { StatusChip, ActionChip } from 'src/components/index-now';

// ----------------------------------------------------------------------

/**
 * IndexNow Table Row Component
 *
 * Renders a single table row for IndexNow submission with:
 * - Checkbox for selection
 * - Submission details and metadata
 * - Status and action chips
 * - Action buttons for processing and viewing
 * - Loading states and tooltips
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @param {Object} props - Component props
 * @param {Object} props.submission - The IndexNow submission data
 * @param {boolean} props.selected - Whether the row is selected
 * @param {boolean} props.isProcessing - Whether the submission is being processed
 * @param {Function} props.onSelect - Callback when row is selected
 * @param {Function} props.onProcess - Callback when process button is clicked
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Table-Row|IndexNow Table Row Documentation}
 */
export function IndexNowTableRow({ submission, selected, isProcessing, onSelect, onProcess }) {
  return (
    <TableRow hover selected={selected} onClick={onSelect} sx={{ cursor: 'pointer' }}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} />
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          #{submission.indexNowSubmissionId}
        </Typography>
      </TableCell>

      <TableCell>
        <Tooltip title={submission.url}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {submission.url}
          </Typography>
        </Tooltip>
      </TableCell>

      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            {submission.entityType}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {submission.entityId}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <ActionChip action={submission.action} />
      </TableCell>

      <TableCell>
        <StatusChip status={submission.status} />
      </TableCell>

      <TableCell>
        <Typography variant="body2">{fDateTime(submission.createdAt)}</Typography>
      </TableCell>

      <TableCell>
        {submission.submittedAt ? (
          <Typography variant="body2">{fDateTime(submission.submittedAt)}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not submitted
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {submission.responseCode ? (
          <Typography
            variant="body2"
            color={
              submission.responseCode >= 200 && submission.responseCode < 300
                ? 'success.main'
                : 'error.main'
            }
          >
            {submission.responseCode}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            -
          </Typography>
        )}
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={0.5}>
          {/* Process Button - only show for PENDING or FAILED submissions */}
          {(submission.status === 'PENDING' || submission.status === 'FAILED') && (
            <Tooltip title="Submit to IndexNow">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onProcess(submission.indexNowSubmissionId);
                }}
                disabled={isProcessing}
                color="primary"
              >
                {isProcessing ? <CircularProgress size={18} /> : <SendIcon size={18} />}
              </IconButton>
            </Tooltip>
          )}

          {/* View Details Button */}
          <Tooltip title="View Details">
            <IconButton
              component={RouterLink}
              href={paths.dashboard.indexNow.details(submission.indexNowSubmissionId)}
              size="small"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ViewIcon size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

IndexNowTableRow.propTypes = {
  submission: PropTypes.shape({
    indexNowSubmissionId: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
    entityId: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    submittedAt: PropTypes.string,
    responseCode: PropTypes.number,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onProcess: PropTypes.func.isRequired,
};
