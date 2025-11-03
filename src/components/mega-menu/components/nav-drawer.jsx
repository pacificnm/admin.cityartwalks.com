import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { ArrowLeftIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export const NavDrawerHeader = styled(({ onBack, title, ...other }) => (
  <div {...other}>
    <IconButton onClick={onBack}>
      <ArrowLeftIcon
        size={16}
        sx={(theme) => ({ ...(theme.direction === 'rtl' && { transform: 'scaleX(-1)' }) })}
      />
    </IconButton>
    {title}
  </div>
))(({ theme }) => ({
  ...theme.typography.subtitle1,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 1),
}));
