/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.HelpLaunchButton
 */

'use client';

import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.HelpLaunchButton
 * @function HelpLaunchButton
 * @description Reusable help launch button component with consistent styling.
 * Used across the application to open help drawers with a standardized appearance.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - Callback function when the button is clicked.
 * @param {Object} [props.sx] - Additional styling to apply to the button.
 * @param {string} [props.color='primary'] - The color theme of the button.
 * @param {string} [props.icon='solar:question-circle-bold'] - The icon to display in the button.
 * @param {Object} [props.other] - Additional props to spread onto the IconButton.
 * @returns {JSX.Element} The rendered help launch button component.
 *
 * @example
 * <HelpLaunchButton
 *   onClick={toggleHelpDrawer}
 *   color="primary"
 * />
 */
export function HelpLaunchButton({
  onClick,
  sx,
  color = 'primary',
  icon = 'solar:question-circle-bold',
  ...other
}) {
  return (
    <IconButton
      color={color}
      onClick={onClick}
      sx={{
        bgcolor: 'primary.lighter',
        '&:hover': { bgcolor: 'primary.light' },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon={icon} />
    </IconButton>
  );
}

/**
 * @memberof CityArtWalks.Components.HelpLaunchButton
 * @prop {Function} onClick - Callback function when the button is clicked. This prop is required.
 * @prop {Object} [sx] - Additional styling to apply to the button. This prop is optional.
 * @prop {string} [color='primary'] - The color theme of the button. This prop is optional.
 * @prop {string} [icon='solar:question-circle-bold'] - The icon to display in the button. This prop is optional.
 * @prop {Object} [other] - Additional props to spread onto the component. This prop is optional.
 */
HelpLaunchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  sx: PropTypes.object,
  color: PropTypes.string,
  icon: PropTypes.string,
  other: PropTypes.object,
};
