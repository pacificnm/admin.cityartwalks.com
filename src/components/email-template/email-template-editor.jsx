import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { debugLog } from 'src/lib/debug';

import {
  LinkIcon,
  TextIcon,
  ViewIcon,
  CodeIcon,
  WidgetIcon,
  TextBoldIcon,
  MinimizeIcon,
  TextFieldIcon,
  TextItalicIcon,
  InfoCircleIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

const AVAILABLE_VARIABLES = [
  { key: '{{userName}}', label: 'User Name', description: "The recipient's full name" },
  { key: '{{userEmail}}', label: 'User Email', description: "The recipient's email address" },
  { key: '{{artPieceName}}', label: 'Art Piece Name', description: 'Name of the art piece' },
  { key: '{{artistName}}', label: 'Artist Name', description: 'Name of the artist' },
  { key: '{{pathName}}', label: 'Path Name', description: 'Name of the path' },
  { key: '{{cityName}}', label: 'City Name', description: 'Name of the city' },
  { key: '{{reviewText}}', label: 'Review Text', description: 'Content of the review' },
  {
    key: '{{moderationReason}}',
    label: 'Moderation Reason',
    description: 'Reason for moderation action',
  },
  {
    key: '{{verificationLink}}',
    label: 'Verification Link',
    description: 'Email verification link',
  },
  {
    key: '{{resetPasswordLink}}',
    label: 'Reset Password Link',
    description: 'Password reset link',
  },
  {
    key: '{{unsubscribeLink}}',
    label: 'Unsubscribe Link',
    description: 'Unsubscribe from emails link',
  },
  { key: '{{currentDate}}', label: 'Current Date', description: "Today's date" },
  { key: '{{currentYear}}', label: 'Current Year', description: 'Current year' },
];

export function EmailTemplateEditor({
  content = '',
  onChange,
  onPreview,
  showVariables = true,
  readOnly = false,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [localContent, setLocalContent] = useState(content);
  const [showVariableHelp, setShowVariableHelp] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    debugLog('EmailTemplateEditor.handleTabChange', 'Tab changed', { newTab: newValue });
  };

  const handleContentChange = useCallback(
    (event) => {
      const newContent = event.target.value;
      setLocalContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
      debugLog('EmailTemplateEditor.handleContentChange', 'Content updated', {
        contentLength: newContent.length,
      });
    },
    [onChange]
  );

  const insertVariable = useCallback(
    (variable) => {
      if (readOnly || !editorRef.current) return;

      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      const newText = text.substring(0, start) + variable + text.substring(end);
      setLocalContent(newText);

      if (onChange) {
        onChange(newText);
      }

      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);

      debugLog('EmailTemplateEditor.insertVariable', 'Variable inserted', { variable });
    },
    [onChange, readOnly]
  );

  const handleFormat = useCallback(
    (format) => {
      if (readOnly || !editorRef.current) return;

      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const text = textarea.value;

      let formattedText = '';
      let cursorOffset = 0;

      switch (format) {
        case 'bold':
          formattedText = `<strong>${selectedText || 'bold text'}</strong>`;
          cursorOffset = selectedText ? formattedText.length : 9;
          break;
        case 'italic':
          formattedText = `<em>${selectedText || 'italic text'}</em>`;
          cursorOffset = selectedText ? formattedText.length : 4;
          break;
        case 'link':
          formattedText = `<a href="#">${selectedText || 'link text'}</a>`;
          cursorOffset = 9;
          break;
        case 'button':
          formattedText = `<a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">${selectedText || 'Button Text'}</a>`;
          cursorOffset = 9;
          break;
        case 'paragraph':
          formattedText = `<p>${selectedText || 'paragraph text'}</p>`;
          cursorOffset = 3;
          break;
        case 'heading':
          formattedText = `<h2>${selectedText || 'Heading'}</h2>`;
          cursorOffset = 4;
          break;
        default:
          return;
      }

      const newText = text.substring(0, start) + formattedText + text.substring(end);
      setLocalContent(newText);

      if (onChange) {
        onChange(newText);
      }

      // Set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      }, 0);

      debugLog('EmailTemplateEditor.handleFormat', 'Format applied', { format });
    },
    [onChange, readOnly]
  );

  const renderHTMLTab = () => (
    <Box sx={{ p: 2, height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        {!readOnly && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Tooltip title="Bold">
              <IconButton size="small" onClick={() => handleFormat('bold')}>
                <TextBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton size="small" onClick={() => handleFormat('italic')}>
                <TextItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton size="small" onClick={() => handleFormat('link')}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Button">
              <IconButton size="small" onClick={() => handleFormat('button')}>
                <WidgetIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Paragraph">
              <IconButton size="small" onClick={() => handleFormat('paragraph')}>
                <TextFieldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Heading">
              <IconButton size="small" onClick={() => handleFormat('heading')}>
                <TextIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Button size="small" startIcon={<ViewIcon />} onClick={onPreview} variant="outlined">
              Preview
            </Button>
          </Stack>
        )}

        <TextField
          inputRef={editorRef}
          fullWidth
          multiline
          rows={20}
          value={localContent}
          onChange={handleContentChange}
          placeholder="Enter your HTML template here..."
          InputProps={{
            readOnly,
            sx: {
              fontFamily: 'monospace',
              fontSize: '14px',
            },
          }}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
    </Box>
  );

  const renderVariablesTab = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Template Variables</Typography>
          <IconButton size="small" onClick={() => setShowVariableHelp(!showVariableHelp)}>
            {showVariableHelp ? <MinimizeIcon /> : <InfoCircleIcon />}
          </IconButton>
        </Stack>

        {showVariableHelp && (
          <Alert severity="info">
            Click on any variable to insert it at the current cursor position in the template.
            Variables will be replaced with actual values when the email is sent.
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {AVAILABLE_VARIABLES.map((variable) => (
            <Tooltip key={variable.key} title={variable.description} arrow>
              <Chip
                label={variable.label}
                onClick={() => insertVariable(variable.key)}
                clickable={!readOnly}
                disabled={readOnly}
                color="primary"
                variant="outlined"
                size="small"
                icon={<CodeIcon />}
              />
            </Tooltip>
          ))}
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Common Template Patterns
          </Typography>
          <Stack spacing={1}>
            <Button
              size="small"
              variant="text"
              onClick={() => insertVariable('Hello {{userName}},')}
              disabled={readOnly}
              sx={{ justifyContent: 'flex-start' }}
            >
              Greeting: Hello {'{{userName}'},
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() =>
                insertVariable('© {{currentYear}} City Art Walks. All rights reserved.')
              }
              disabled={readOnly}
              sx={{ justifyContent: 'flex-start' }}
            >
              Footer: © {'{{currentYear}'} City Art Walks
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => insertVariable('<a href="{{unsubscribeLink}}">Unsubscribe</a>')}
              disabled={readOnly}
              sx={{ justifyContent: 'flex-start' }}
            >
              Unsubscribe Link
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="HTML Editor" />
          {showVariables && <Tab label="Variables" />}
        </Tabs>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 0 && renderHTMLTab()}
        {activeTab === 1 && showVariables && renderVariablesTab()}
      </Box>
    </Card>
  );
}

EmailTemplateEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  onPreview: PropTypes.func,
  showVariables: PropTypes.bool,
  readOnly: PropTypes.bool,
};
