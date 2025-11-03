/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplateTableRow
 */

'use client';

import { useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import {
  Chip,
  Stack,
  Button,
  Avatar,
  Checkbox,
  MenuList,
  MenuItem,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import {
  ViewIcon,
  EditIcon,
  CopyIcon,
  LetterIcon,
  DeleteIcon,
  PaperBinIcon,
  VerticalFillIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplateTableRow
 * @description Email template table row component with actions menu
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.row - Template data
 * @param {boolean} props.selected - Row selection state
 * @param {Function} props.onEditRow - Edit callback
 * @param {Function} props.onSelectRow - Select callback
 * @param {Function} props.onDeleteRow - Delete callback
 * @param {Function} props.onPreviewRow - Preview callback
 * @param {Function} props.onDuplicateRow - Duplicate callback
 * @param {Function} props.onTestRow - Test callback
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onPreviewRow,
  onDuplicateRow,
  onTestRow,
}) {
  const { templateId, name, category, subjectTemplate, isActive, version, createdAt } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  const handleDelete = useCallback(() => {
    debugLog('EmailTemplateTableRow.handleDelete', 'Confirming template deletion', { templateId });
    onDeleteRow();
    confirm.onFalse();
  }, [onDeleteRow, confirm, templateId]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={name}
            sx={{
              mr: 2,
              bgcolor: isActive ? 'success.main' : 'grey.500',
              color: 'white',
              width: 40,
              height: 40,
            }}
          >
            <LetterIcon size={20} />
          </Avatar>

          <Stack>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              ID: {templateId}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Chip size="small" label={category || 'General'} color="default" variant="outlined" />
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
            {subjectTemplate}
          </Typography>
        </TableCell>

        <TableCell>
          <Label variant="soft" color={isActive ? 'success' : 'default'}>
            {isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2">v{version}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {fDate(createdAt)}
          </Typography>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <VerticalFillIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { placement: 'right-top' },
        }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onPreviewRow();
              popover.onClose();
            }}
          >
            <ViewIcon />
            Preview
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <EditIcon />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDuplicateRow();
              popover.onClose();
            }}
          >
            <CopyIcon />
            Duplicate
          </MenuItem>

          <MenuItem
            onClick={() => {
              onTestRow();
              popover.onClose();
            }}
          >
            <PaperBinIcon />
            Send Test
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Template"
        content={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
