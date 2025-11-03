/**
 * @file email-template-preview-dialog.jsx
 * @description Preview dialog for email templates with HTML and text versions
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate
 */

'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import {
  CodeIcon,
  TextIcon,
  LetterIcon,
  CloseCircleIcon,
  CheckCircleIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * Sample data for variable substitution
 * @constant {Object} SAMPLE_VARIABLE_DATA
 * @memberof CityArtWalks.Components.EmailTemplate
 */
const SAMPLE_VARIABLE_DATA = {
  userName: 'John Doe',
  userEmail: 'john.doe@example.com',
  appName: 'City Art Walks',
  appUrl: 'https://cityartwalks.com',
  supportEmail: 'support@cityartwalks.com',
  currentDate: new Date().toLocaleDateString(),
  unsubscribeUrl: 'https://cityartwalks.com/unsubscribe?token=abc123',
};

/**
 * Substitute variables in template content
 * @function substituteVariables
 * @memberof CityArtWalks.Components.EmailTemplate
 * @param {string} content - Template content with variables
 * @param {Object} variables - Variable values
 * @returns {string} Content with variables substituted
 */
function substituteVariables(content, variables) {
  if (!content) return '';

  let result = content;
  const variablePattern = /\{\{(\w+)\}\}/g;

  result = result.replace(
    variablePattern,
    (match, variableName) => variables[variableName] || `[${variableName}]`
  );

  return result;
}

/**
 * Tab panel component
 * @function TabPanel
 * @memberof CityArtWalks.Components.EmailTemplate
 */
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------

/**
 * Email template preview dialog component
 * @function EmailTemplatePreviewDialog
 * @memberof CityArtWalks.Components.EmailTemplate
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Object} props.template - Template data to preview
 * @param {string} props.template.name - Template name
 * @param {string} props.template.subjectTemplate - Subject template
 * @param {string} props.template.htmlTemplate - HTML template
 * @param {string} props.template.textTemplate - Text template
 * @param {Object} props.template.variables - Template variables
 * @returns {JSX.Element} Email template preview dialog
 */
export function EmailTemplatePreviewDialog({ open, onClose, template = {} }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [customVariables, setCustomVariables] = useState({});

  // Merge sample data with custom variables
  const variableData = useMemo(
    () => ({
      ...SAMPLE_VARIABLE_DATA,
      ...customVariables,
    }),
    [customVariables]
  );

  // Process templates with variable substitution
  const processedTemplate = useMemo(() => {
    if (!template) return {};

    return {
      subject: substituteVariables(template.subjectTemplate || '', variableData),
      html: substituteVariables(template.htmlTemplate || '', variableData),
      text: substituteVariables(template.textTemplate || '', variableData),
    };
  }, [template, variableData]);

  // Extract variables used in templates
  const usedVariables = useMemo(() => {
    const variables = new Set();
    const variablePattern = /\{\{(\w+)\}\}/g;

    [template.subjectTemplate, template.htmlTemplate, template.textTemplate].forEach((content) => {
      if (content) {
        let match;
        while ((match = variablePattern.exec(content)) !== null) {
          variables.add(match[1]);
        }
      }
    });

    return Array.from(variables);
  }, [template.subjectTemplate, template.htmlTemplate, template.textTemplate]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleVariableChange = (variableName, value) => {
    setCustomVariables((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };

  const handleClose = () => {
    setCustomVariables({});
    setCurrentTab(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', display: 'flex', flexDirection: 'column' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Email Template Preview</Typography>
            <Typography variant="body2" color="text.secondary">
              {template.name || 'Untitled Template'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseCircleIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* Variable Controls */}
        {usedVariables.length > 0 && (
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Test Variables ({usedVariables.length})
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              {usedVariables.map((variable) => (
                <Chip key={variable} label={variable} size="small" color="primary" variant="soft" />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Customize variable values to test your template:
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 2,
                mt: 1,
              }}
            >
              {usedVariables.slice(0, 6).map((variable) => (
                <TextField
                  key={variable}
                  size="small"
                  label={variable}
                  value={customVariables[variable] || variableData[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  placeholder={`Enter ${variable}...`}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Preview Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Subject Line" icon={<LetterIcon />} iconPosition="start" />
            <Tab label="HTML Version" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Text Version" icon={<TextIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TabPanel value={currentTab} index={0}>
            <Stack spacing={2} sx={{ px: 3 }}>
              <Typography variant="subtitle2">Subject Line Preview</Typography>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  {processedTemplate.subject || 'No subject template defined'}
                </Typography>
              </Box>
              {!processedTemplate.subject && (
                <Alert severity="info">Add a subject template to see the preview here.</Alert>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Stack spacing={2} sx={{ px: 3 }}>
              <Typography variant="subtitle2">HTML Email Preview</Typography>
              {processedTemplate.html ? (
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'grey.100',
                      p: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      HTML Preview (rendered)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      maxHeight: 400,
                      overflow: 'auto',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: processedTemplate.html,
                    }}
                  />
                  <Divider />
                  <Box sx={{ bgcolor: 'grey.100', p: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      HTML Source
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                  >
                    {processedTemplate.html}
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">Add an HTML template to see the preview here.</Alert>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Stack spacing={2} sx={{ px: 3 }}>
              <Typography variant="subtitle2">Plain Text Email Preview</Typography>
              {processedTemplate.text ? (
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                >
                  {processedTemplate.text}
                </Box>
              ) : (
                <Alert severity="info">
                  Add a text template to see the preview here. This is optional but recommended for
                  better email client compatibility.
                </Alert>
              )}
            </Stack>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
        <Button variant="contained" onClick={handleClose} startIcon={<CheckCircleIcon />}>
          Looks Good
        </Button>
      </DialogActions>
    </Dialog>
  );
}
