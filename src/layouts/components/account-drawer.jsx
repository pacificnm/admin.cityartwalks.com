'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useUser } from '@auth0/nextjs-auth0/client';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }) {
  const { user, isLoading } = useUser();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar src={user?.picture} alt={user?.name} sx={{ width: 1, height: 1 }}>
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {data.map((option) => {
        // If option.role is defined, only show if user.role is in allowed roles
        if (
          Array.isArray(option.role) &&
          option.role.length > 0 &&
          (!user?.role || !option.role.includes(user.role))
        ) {
          return null;
        }
        return (
          <MenuItem key={option.label}>
            <Link
              component={RouterLink}
              href={option.href}
              color="inherit"
              underline="none"
              onClick={onClose}
              sx={{
                p: 1,
                width: 1,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                color: 'text.secondary',
                '& svg': { width: 24, height: 24 },
                '&:hover': { color: 'text.primary' },
              }}
            >
              {option.icon}
              <Box component="span" sx={{ ml: 2 }}>
                {option.label}
              </Box>
              {option.info && (
                <Label color="error" sx={{ ml: 1 }}>
                  {option.info}
                </Label>
              )}
            </Link>
          </MenuItem>
        );
      })}
    </MenuList>
  );

  if (isLoading) return null;

  if (user) {
    return (
      <>
        <AccountButton
          onClick={onOpen}
          photoURL={user?.picture}
          displayName={user?.name}
          sx={sx}
          {...other}
        />

        <Drawer
          open={open}
          onClose={onClose}
          anchor="right"
          slotProps={{
            backdrop: { invisible: true },
            paper: { sx: { width: 320 } },
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              top: 12,
              left: 12,
              zIndex: 9,
              position: 'absolute',
            }}
          >
            <Iconify icon="solar:close-bold" />
          </IconButton>

          <Scrollbar>
            <Box
              sx={{
                pt: 8,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {renderAvatar()}

              <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
                {user?.name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
                {user?.email}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                gap: 1,
                flexWrap: 'wrap',
                display: 'flex',
                justifyContent: 'center',
              }}
            />

            {renderList()}
          </Scrollbar>

          <Box sx={{ p: 2.5 }}>
            <SignOutButton onClose={onClose} />
          </Box>
        </Drawer>
      </>
    );
  }

  // Users should never reach this point since middleware protects all routes
  return null;
}
