import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import {
  EditIcon,
  ShareIcon,
  DeleteIcon,
  CheckCircleIcon,
  VerticalFillIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

export function AnalyticsTasks({ title, subheader, list, sx, ...other }) {
  const [selected, setSelected] = useState(['2']);

  const handleClickComplete = (taskId) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 304 }}>
        <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 560 }}>
          {list.map((item) => (
            <TaskItem
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onChange={() => handleClickComplete(item.id)}
            />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function TaskItem({ item, selected, onChange, sx, ...other }) {
  const menuActions = usePopover();

  const handleMarkComplete = () => {
    menuActions.onClose();
    console.info('MARK COMPLETE', item.id);
  };

  const handleShare = () => {
    menuActions.onClose();
    console.info('SHARE', item.id);
  };

  const handleEdit = () => {
    menuActions.onClose();
    console.info('EDIT', item.id);
  };

  const handleDelete = () => {
    menuActions.onClose();
    console.info('DELETE', item.id);
  };

  return (
    <>
      <Box
        sx={[
          () => ({
            pl: 2,
            pr: 1,
            py: 1.5,
            display: 'flex',
            ...(selected && {
              color: 'text.disabled',
              textDecoration: 'line-through',
            }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <FormControlLabel
          label={item.name}
          control={
            <Checkbox
              disableRipple
              checked={selected}
              onChange={onChange}
              slotProps={{ input: { id: `${item.name}-checkbox` } }}
            />
          }
          sx={{ flexGrow: 1, m: 0 }}
        />

        <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
          <VerticalFillIcon />
        </IconButton>
      </Box>

      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleMarkComplete}>
            <CheckCircleIcon />
            Mark complete
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <EditIcon />
            Edit
          </MenuItem>

          <MenuItem onClick={handleShare}>
            <ShareIcon />
            Share
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
