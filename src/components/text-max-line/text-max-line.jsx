import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import useTypography from './use-typography.js';

// ----------------------------------------------------------------------

export const TextMaxLine = forwardRef(
  ({ asLink, variant = 'body1', line = 2, persistent = false, children, sx, ...other }, ref) => {
    const { lineHeight } = useTypography(variant);

    const styles = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: line,
      WebkitBoxOrient: 'vertical',
      ...(persistent && {
        height: lineHeight * line,
      }),
      ...sx,
    };

    if (asLink) {
      return (
        <Link color="inherit" ref={ref} variant={variant} sx={{ ...styles }} {...other}>
          {children}
        </Link>
      );
    }

    return (
      <Typography ref={ref} variant={variant} sx={{ ...styles }} {...other}>
        {children}
      </Typography>
    );
  }
);
