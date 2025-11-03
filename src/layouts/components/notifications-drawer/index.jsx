'use client';

import { m } from 'framer-motion';
import { useBoolean } from 'minimal-shared/hooks';
import { useUser } from '@auth0/nextjs-auth0/client';

import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export function NotificationsDrawer({ sx, ...other }) {
  const { user } = useUser();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  // Mock data for now - will be replaced with real API calls later
  const unreadCount = 0;

  const renderButton = () => (
    <m.div whileTap={varTap()} whileHover={varHover()} transition={transitionTap()}>
      <Tooltip title="Notifications">
        <IconButton
          color={open ? 'primary' : 'default'}
          onClick={onOpen}
          sx={sx}
          {...other}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Iconify icon="solar:bell-bold-duotone" width={24} />
          </Badge>
        </IconButton>
      </Tooltip>
    </m.div>
  );

  // For now, just return the button without the drawer
  // TODO: Implement full notification drawer with Auth0 Next.js SDK access tokens
  return renderButton();
}
