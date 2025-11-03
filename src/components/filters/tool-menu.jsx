/**
 * @namespace CityArtWalks.Components.Filters.ToolMenu
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Filters.ToolMenu
 * @description ToolMenu component provides a reusable tool menu button with badge indicator.
 * It displays an options button with a badge showing the count of active filters.
 *
 * Key Features:
 * - Options button with customizable icon
 * - Badge indicator for active filter count
 * - Visual feedback when filters are active (background color change)
 * - Customizable layout and styling
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage
 * <ToolMenu
 *   onClick={handleMenuOpen}
 *   activeFilterCount={activeFilterCount}
 * />
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - Callback function when button is clicked.
 * @param {number} [props.activeFilterCount=0] - Number of active filters for badge display.
 * @param {string} [props.icon="solar:settings-bold"] - Icon to display in the button.
 * @param {string} [props.ariaLabel="Open action menu"] - ARIA label for accessibility.
 * @param {string} [props.badgeColor="info"] - Color of the badge indicator.
 * @param {Object} [props.sx] - Additional styling props for the container.
 * @param {Object} [props.buttonSx] - Additional styling props for the button.
 * @returns {JSX.Element} The ToolMenu component.
 */
export function ToolMenu(props) {
  const {
    onClick,
    activeFilterCount = 0,
    icon = 'solar:settings-bold',
    ariaLabel = 'Open action menu',
    badgeColor = 'info',
    sx = {},
    buttonSx = {},
  } = props;

  const dynamicAriaLabel = `${ariaLabel}${activeFilterCount > 0 ? ` (${activeFilterCount} active filters)` : ''}`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2,
        ...sx,
      }}
    >
      <Badge badgeContent={activeFilterCount} color={badgeColor}>
        <IconButton
          onClick={onClick}
          aria-label={dynamicAriaLabel}
          sx={{
            bgcolor: activeFilterCount > 0 ? 'action.selected' : 'transparent',
            ...buttonSx,
          }}
        >
          <Iconify icon={icon} />
        </IconButton>
      </Badge>
    </Box>
  );
}

ToolMenu.propTypes = {
  onClick: PropTypes.func.isRequired,
  activeFilterCount: PropTypes.number,
  icon: PropTypes.string,
  ariaLabel: PropTypes.string,
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
  buttonSx: PropTypes.object,
};
