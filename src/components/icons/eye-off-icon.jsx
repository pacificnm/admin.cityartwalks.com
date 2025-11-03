import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

/**
 * @namespace CityArtWalks.Components.Icons.EyeOffIcon
 * @description Eye Off icon component
 * @author Jaimie Garner
 * @version 1.0.0
 * @description Eye Off icon component using solar:eye-closed-bold for hiding/visibility toggle actions.
 *
 * @memberof CityArtWalks.Components.Icons
 * @since 1.0.0
 *
 * @memberof CityArtWalks.Components.Icons.EyeOffIcon
 * @function EyeOffIcon
 * @description Renders an eye off icon using the solar:eye-closed-bold icon.
 *
 * @param {Object} props - Component props
 * @param {number} [props.size=24] - Size of the icon in pixels
 * @param {Object} [props.sx={}] - MUI sx styling object
 * @param {Object} props.other - Additional props passed to the Box component
 *
 * @returns {JSX.Element} The rendered EyeOffIcon component.
 *
 * @example
 * <EyeOffIcon size={16} />
 * <EyeOffIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function EyeOffIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Box
      component="span"
      className="component-iconify"
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        ...sx,
      }}
      {...props}
    >
      <Iconify icon="solar:eye-closed-bold" width="100%" height="100%" />
    </Box>
  );
}
