/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.HelpDrawer
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.HelpDrawer
 * @function HelpDrawer
 * @description Reusable help drawer component that slides in from the right.
 * Can display any help content component passed as children.
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the drawer is open
 * @param {Function} props.onClose - Callback function when drawer should close
 * @param {React.ReactNode} props.children - The help content to display
 * @param {string} [props.title='Help & Guide'] - Title to display in the drawer header
 * @param {Object} [props.sx] - Additional styling for the drawer
 * @returns {JSX.Element} The rendered HelpDrawer component
 *
 * @example
 * // Basic usage
 * <HelpDrawer open={isOpen} onClose={handleClose}>
 *   <MyHelpContent />
 * </HelpDrawer>
 *
 * // With custom title
 * <HelpDrawer
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Explore Help"
 * >
 *   <ExploreHomeHelp />
 * </HelpDrawer>
 */
export function HelpDrawer({ open, onClose, children, title = 'Help & Guide', sx, ...other }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480, md: 560 },
          p: 3,
          ...sx,
        },
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" color="primary.main">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="solar:close-circle-bold" />
        </IconButton>
      </Box>
      <Box sx={{ overflowY: 'auto', height: '100%' }}>{children}</Box>
    </Drawer>
  );
}

/**
 * @memberof CityArtWalks.Components.HelpDrawer
 * @prop {boolean} open - Whether the drawer is open. This prop is required.
 * @prop {Function} onClose - Callback function when drawer should close. This prop is required.
 * @prop {React.ReactNode} children - The help content to display. This prop is required.
 * @prop {string} [title='Help & Guide'] - Title to display in the drawer header. This prop is optional.
 * @prop {Object} [sx] - Additional styling for the drawer. This prop is optional.
 */
HelpDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  sx: PropTypes.object,
};
