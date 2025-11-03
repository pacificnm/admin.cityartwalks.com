import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { NavigationArrowIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function FormReturnLink({ sx, href, label, icon, children, ...other }) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="subtitle2"
      sx={[
        {
          mt: 3,
          gap: 0.5,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {icon || <NavigationArrowIcon direction="left" width={16} />}
      {label || 'Return to sign in'}
      {children}
    </Link>
  );
}
