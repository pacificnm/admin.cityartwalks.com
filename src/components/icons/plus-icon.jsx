import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

/**
 * @namespace CityArtWalks.Components.Icons.PlusIcon
 * @description Plus icon component
 * @author Jaimie Garner
 * @version 1.0.0
 * @description Plus icon component using solar:add-circle-bold for addition and creation actions.
 *
 * @memberof CityArtWalks.Components.Icons
 * @since 1.0.0
 *
 * @memberof CityArtWalks.Components.Icons.PlusIcon
 * @function PlusIcon
 * @description Renders a plus icon using the solar:add-circle-bold icon.
 *
 * @param {Object} props - Component props
 * @param {number} [props.size=24] - Size of the icon in pixels
 * @param {Object} [props.sx={}] - MUI sx styling object
 * @param {Object} props.other - Additional props passed to the Box component
 *
 * @returns {JSX.Element} The rendered PlusIcon component.
 *
 * @example
 * <PlusIcon size={16} />
 * <PlusIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function PlusIcon({ size = 24, sx = {}, ...props }) {
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
      <Iconify icon="solar:add-circle-bold" width="100%" height="100%" />
    </Box>
  );
}
