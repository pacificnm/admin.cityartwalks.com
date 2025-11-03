/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplatePreview
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog, debugError } from 'src/lib/debug';

import { LetterIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

const PREVIEW_DEVICES = [
  { value: 'desktop', label: 'Desktop', width: '100%' },
  { value: 'tablet', label: 'Tablet', width: '768px' },
  { value: 'mobile', label: 'Mobile', width: '375px' },
];

const PREVIEW_MODES = [
  { value: 'html', label: 'HTML View' },
  { value: 'text', label: 'Plain Text' },
  { value: 'raw', label: 'Raw HTML' },
];

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplatePreview
 * @description Preview dialog for email templates with responsive and mode switching
 *
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Dialog close handler
 * @param {Object} props.template - Template data to preview
 * @param {Object} props.sampleData - Sample data for variable substitution
 * @param {Function} props.onSendTest - Send test email callback
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplatePreview({ open, onClose, template, sampleData = {}, onSendTest }) {
  const [device, setDevice] = useState('desktop');
  const [mode, setMode] = useState('html');
  const [renderedContent, setRenderedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTest = useBoolean();

  const defaultSampleData = useMemo(
    () => ({
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      contact: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        subject: 'Sample Contact Subject',
        message: 'This is a sample contact message for preview purposes.',
      },
      system: {
        siteName: 'City Art Walks',
        siteUrl: 'https://cityartwalks.com',
        currentDate: new Date().toLocaleDateString(),
        unsubscribeUrl: 'https://cityartwalks.com/unsubscribe/sample-token',
      },
      ...sampleData,
    }),
    [sampleData]
  );

  // Render template with sample data
  const renderTemplate = useCallback((templateContent, data) => {
    if (!templateContent) return '';

    try {
      let rendered = templateContent;

      // Simple variable substitution
      const substituteVariables = (content, variables, prefix = '') => {
        Object.entries(variables).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            substituteVariables(content, value, `${prefix}${key}.`);
          } else {
            const placeholder = `{{${prefix}${key}}}`;
            content = content.replace(
              new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              String(value)
            );
          }
        });
        return content;
      };

      rendered = substituteVariables(rendered, data);
      return rendered;
    } catch (error) {
      debugError('EmailTemplatePreview.renderTemplate', 'Template rendering failed', error);
      return templateContent;
    }
  }, []);

  useEffect(() => {
    if (!template) return;

    setLoading(true);

    try {
      const content =
        mode === 'text'
          ? renderTemplate(template.textTemplate || '', defaultSampleData)
          : renderTemplate(template.htmlTemplate || '', defaultSampleData);

      setRenderedContent(content);
    } catch (error) {
      debugError('EmailTemplatePreview.effect', 'Failed to render template', error);
      setRenderedContent('Error rendering template');
    } finally {
      setLoading(false);
    }
  }, [template, mode, defaultSampleData, renderTemplate]);

  const handleDeviceChange = useCallback((event) => {
    setDevice(event.target.value);
  }, []);

  const handleModeChange = useCallback((event) => {
    setMode(event.target.value);
  }, []);

  const handleSendTest = useCallback(() => {
    if (!template?.templateId) return;

    debugLog('EmailTemplatePreview.handleSendTest', 'Sending test email', {
      templateId: template.templateId,
    });

    onSendTest?.(template.templateId, defaultSampleData);
    sendTest.onFalse();
  }, [template, defaultSampleData, onSendTest, sendTest]);

  const currentDevice = PREVIEW_DEVICES.find((d) => d.value === device);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { height: '90vh' },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Template Preview: {template?.name}</Typography>

            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Device</InputLabel>
                <Select value={device} onChange={handleDeviceChange} label="Device">
                  {PREVIEW_DEVICES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Mode</InputLabel>
                <Select value={mode} onChange={handleModeChange} label="Mode">
                  {PREVIEW_MODES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
          <Stack sx={{ height: '100%' }}>
            {/* Subject Preview */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Subject:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {renderTemplate(template?.subjectTemplate || '', defaultSampleData)}
              </Typography>
            </Box>

            {/* Content Preview */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                bgcolor: 'grey.100',
                overflow: 'auto',
              }}
            >
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Rendering template...
                  </Typography>
                </Box>
              ) : (
                <Card
                  sx={{
                    width: currentDevice?.width || '100%',
                    maxWidth: currentDevice?.width === '100%' ? 800 : currentDevice?.width,
                    minHeight: 400,
                    transition: 'width 0.3s ease',
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    {mode === 'raw' ? (
                      <Box
                        component="pre"
                        sx={{
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          backgroundColor: 'grey.50',
                          p: 2,
                          borderRadius: 1,
                        }}
                      >
                        {renderedContent}
                      </Box>
                    ) : mode === 'text' ? (
                      <Box
                        component="pre"
                        sx={{
                          fontFamily: 'inherit',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {renderedContent}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          '& img': { maxWidth: '100%', height: 'auto' },
                          '& table': { width: '100%', borderCollapse: 'collapse' },
                        }}
                        dangerouslySetInnerHTML={{ __html: renderedContent }}
                      />
                    )}
                  </Box>
                </Card>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={sendTest.onTrue} startIcon={<LetterIcon />} variant="outlined">
            Send Test Email
          </Button>

          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Send Test Email Dialog */}
      <Dialog open={sendTest.value} onClose={sendTest.onFalse} maxWidth="sm" fullWidth>
        <DialogTitle>Send Test Email</DialogTitle>
        <DialogContent>
          <Typography>
            Send a test email using this template with sample data to verify the content and
            formatting.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={sendTest.onFalse}>Cancel</Button>
          <Button onClick={handleSendTest} variant="contained">
            Send Test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
