/**
 * @namespace CityArtWalks.Components.Filters.FilterCounts
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

/**
 * @memberof CityArtWalks.Components.Filters.FilterCounts
 * @description FilterCounts component displays a title with an optional badge showing the count of active filters.
 * It provides visual feedback to users about how many filters are currently applied.
 *
 * Key Features:
 * - Displays a title with optional filter count badge
 * - Responsive layout with space-between alignment
 * - Customizable badge color and styling
 * - Conditional badge display (only shows when count > 0)
 * - Accessible design with proper spacing
 *
 * @component
 * @example
 * // Basic usage
 * <FilterCounts
 *   title="Search & Filters"
 *   activeFilterCount={3}
 * />
 *
 * // With custom styling
 * <FilterCounts
 *   title="Active Filters"
 *   activeFilterCount={5}
 *   badgeColor="warning"
 *   sx={{ mb: 2 }}
 * />
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title text to display.
 * @param {number} [props.activeFilterCount=0] - Number of active filters for badge display.
 * @param {string} [props.badgeColor="info"] - Color of the badge indicator.
 * @param {Object} [props.sx] - Additional styling props for the container.
 * @param {Object} [props.titleSx] - Additional styling props for the title.
 * @param {Object} [props.badgeSx] - Additional styling props for the badge.
 * @returns {JSX.Element} The FilterCounts component.
 */
export function FilterCounts(props) {
  const {
    title,
    activeFilterCount = 0,
    badgeColor = 'info',
    sx = {},
    titleSx = {},
    badgeSx = {},
  } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        pr: 2,
        ...sx,
      }}
    >
      <Typography variant="h6" sx={titleSx}>
        {title}
      </Typography>
      {activeFilterCount > 0 && (
        <Badge
          badgeContent={activeFilterCount}
          color={badgeColor}
          sx={{
            mr: 2,
            ...badgeSx,
          }}
        >
          <Box />
        </Badge>
      )}
    </Box>
  );
}

FilterCounts.propTypes = {
  title: PropTypes.string.isRequired,
  activeFilterCount: PropTypes.number,
  badgeColor: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
  ]),
  sx: PropTypes.object,
  titleSx: PropTypes.object,
  badgeSx: PropTypes.object,
};
