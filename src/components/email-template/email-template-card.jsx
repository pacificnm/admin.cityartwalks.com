import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { fDateTime } from 'src/utils/format-time';

import { debugLog } from 'src/lib/debug';

import {
  ViewIcon,
  EditIcon,
  BellIcon,
  DeleteIcon,
  LetterIcon,
  SettingsIcon,
  MegaphoneIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

export function EmailTemplateCard({ template, onEdit, onDelete, onPreview }) {
  debugLog('EmailTemplateCard.render', 'Rendering email template card', {
    templateId: template.id,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TRANSACTIONAL':
        return <LetterIcon size={24} />;
      case 'NOTIFICATION':
        return <BellIcon size={24} />;
      case 'MARKETING':
        return <MegaphoneIcon size={24} />;
      case 'SYSTEM':
        return <SettingsIcon size={24} />;
      default:
        return <LetterIcon size={24} />;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {getCategoryIcon(template.category)}
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onPreview(template)}>
                <ViewIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onEdit(template)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(template)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Box>
            <Typography variant="h6" gutterBottom>
              {template.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {template.description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={template.status}
              size="small"
              color={getStatusColor(template.status)}
              variant="soft"
            />
            <Chip label={template.category} size="small" variant="outlined" />
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Subject: {template.subject}
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Updated: {fDateTime(template.updatedAt)}
            </Typography>
            {template.sendCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                Sent: {template.sendCount}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

EmailTemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    subject: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    sendCount: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPreview: PropTypes.func,
};
