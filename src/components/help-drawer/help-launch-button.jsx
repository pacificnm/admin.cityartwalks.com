/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.HelpDrawer.HelpLaunchButton
 */

'use client';

import PropTypes from 'prop-types';

import { IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.HelpDrawer.HelpLaunchButton
 * @function HelpLaunchButton
 * @description Reusable help launch button component that triggers the help drawer.
 * Provides consistent styling and behavior across the application.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - Callback function when the button is clicked.
 * @param {string} [props.icon='solar:question-circle-bold'] - Icon to display in the button.
 * @param {string} [props.color='primary'] - Button color theme.
 * @param {Object} [props.sx] - Additional Material-UI sx styling.
 * @param {Object} [props.other] - Additional props to spread to IconButton.
 * @returns {JSX.Element} The rendered help launch button.
 *
 * @example
 * <HelpLaunchButton onClick={toggleHelpDrawer} />
 *
 * @example
 * <HelpLaunchButton
 *   onClick={toggleHelpDrawer}
 *   icon="solar:info-circle-bold"
 *   color="secondary"
 * />
 */
export function HelpLaunchButton({
  onClick,
  icon = 'solar:question-circle-bold',
  color = 'primary',
  sx,
  ...other
}) {
  return (
    <IconButton
      color={color}
      onClick={onClick}
      sx={{
        bgcolor: `${color}.lighter`,
        '&:hover': { bgcolor: `${color}.light` },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon={icon} />
    </IconButton>
  );
}

/**
 * @memberof CityArtWalks.Components.HelpDrawer.HelpLaunchButton
 * @prop {Function} onClick - Callback function when the button is clicked. This prop is required.
 * @prop {string} [icon='solar:question-circle-bold'] - Icon to display in the button. This prop is optional.
 * @prop {string} [color='primary'] - Button color theme. This prop is optional.
 * @prop {Object} [sx] - Additional Material-UI sx styling. This prop is optional.
 */
HelpLaunchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  sx: PropTypes.object,
};
