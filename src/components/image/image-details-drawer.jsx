import Drawer from '@mui/material/Drawer';

import { useBoolean } from 'src/hooks/use-boolean';

import { Scrollbar } from 'src/components/scrollbar';

export function ImageDetailsDrawer() {
  const open = useBoolean();

  return (
    <Drawer
      open={open}
      onClose={open.onFalse}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Scrollbar sx={{ height: 1 }} />
    </Drawer>
  );
}
