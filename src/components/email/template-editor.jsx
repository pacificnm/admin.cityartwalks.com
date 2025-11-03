/**
 * Email Template Editor Component
 *
 * Advanced code editor for email templates with syntax highlighting,
 * auto-completion, live validation, and template assistance.
 *
 * @component
 * @memberof Components.Email
 */

import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';

/**
 * Template snippets for quick insertion
 * @constant
 */
const TEMPLATE_SNIPPETS = {
  variables: [
    { label: 'User First Name', code: '{{user.firstName}}' },
    { label: 'User Email', code: '{{user.email}}' },
    { label: 'Unsubscribe Link', code: '{{unsubscribeUrl}}' },
    { label: 'Site Name', code: '{{site.name}}' },
    { label: 'Current Date', code: '{{formatDate date.current}}' },
  ],
  conditionals: [
    {
      label: 'If Statement',
      code: `{{#if condition}}
  Content when true
{{else}}
  Content when false
{{/if}}`,
    },
    {
      label: 'Unless Statement',
      code: `{{#unless condition}}
  Content when false
{{/unless}}`,
    },
    {
      label: 'Each Loop',
      code: `{{#each items}}
  {{this.name}}
{{/each}}`,
    },
    {
      label: 'With Block',
      code: `{{#with user}}
  Hello {{firstName}} {{lastName}}!
{{/with}}`,
    },
  ],
  layouts: [
    {
      label: 'Basic HTML Email',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello {{user.firstName}}!</h1>
        <p>Your content goes here.</p>
        
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p><a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Preferences</a></p>
        </footer>
    </div>
</body>
</html>`,
    },
    {
      label: 'Notification Email',
      code: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333;">{{subject}}</h2>
    </div>
    
    <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
        <p>Hi {{user.firstName}},</p>
        <p>{{message}}</p>
        
        {{#if actionUrl}}
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{actionUrl}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                {{actionText}}
            </a>
        </div>
        {{/if}}
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
        <p><a href="{{unsubscribeUrl}}">Unsubscribe</a> • <a href="{{preferencesUrl}}">Manage Preferences</a></p>
    </div>
</div>`,
    },
  ],
};

/**
 * Email Template Editor Component
 * @component
 */
export function TemplateEditor({
  value = '',
  onChange = () => {},
  onValidationChange = () => {},
  showValidation = true,
  showSnippets = true,
  showLineNumbers = true,
  height = '400px',
  placeholder = 'Enter your email template...',
  ...other
}) {
  // State
  const [content, setContent] = useState(value);
  const [validation, setValidation] = useState(null);
  const [showSnippetPanel, setShowSnippetPanel] = useState(false);
  const [activeSnippetCategory, setActiveSnippetCategory] = useState('variables');
  const [wordWrap, setWordWrap] = useState(true);
  const [autoValidate, setAutoValidate] = useState(true);

  // Refs
  const textareaRef = useRef(null);
  const validationTimeoutRef = useRef(null);

  // Update internal content when value changes
  useEffect(() => {
    setContent(value);
  }, [value]);

  // Validate on content change
  useEffect(() => {
    if (!autoValidate || !content.trim()) {
      setValidation(null);
      return undefined;
    }

    // Debounce validation
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    

    return () => {
      
    };
  }, [content, autoValidate, onValidationChange]);

  // Handle content change
  const handleContentChange = useCallback(
    (event) => {
      const newContent = event.target.value;
      setContent(newContent);
      onChange(newContent);
    },
    [onChange]
  );

  // Insert text at cursor position
  const insertAtCursor = useCallback(
    (text) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);

      setContent(newContent);
      onChange(newContent);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    },
    [content, onChange]
  );

  // Handle format document
  const handleFormatDocument = useCallback(() => {
    try {
      // Simple HTML formatting (basic indentation)
      let formatted = content
        .replace(/></g, '>\n<')
        .replace(/\{\{/g, '\n{{')
        .replace(/\}\}/g, '}}\n');

      // Basic indentation
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const formattedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';

        if (trimmed.startsWith('</') || trimmed.startsWith('{{/')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indented = '  '.repeat(indentLevel) + trimmed;

        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++;
        } else if (trimmed.startsWith('{{#')) {
          indentLevel++;
        }

        return indented;
      });

      const newContent = formattedLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
      setContent(newContent);
      onChange(newContent);
    } catch (error) {
      debugLog('TemplateEditor.formatDocument', 'Format error', error);
    }
  }, [content, onChange]);

  

  return (
    <Card {...other}>
      {/* Editor Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Template Editor
          </Typography>

          
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={autoValidate}
                onChange={(e) => setAutoValidate(e.target.checked)}
              />
            }
            label="Auto Validate"
          />

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
              />
            }
            label="Word Wrap"
          />

          <IconButton
            size="small"
            onClick={() => setShowSnippetPanel(!showSnippetPanel)}
            color={showSnippetPanel ? 'primary' : 'default'}
          >
            <Iconify icon="solar:code-bold" />
          </IconButton>

          <IconButton size="small" onClick={handleFormatDocument}>
            <Iconify icon="solar:programming-arrows-bold" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Editor Content */}
      <Stack direction="row" sx={{ height }}>
        {/* Main Editor */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <TextField
            ref={textareaRef}
            fullWidth
            multiline
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            InputProps={{
              sx: {
                height: '100%',
                alignItems: 'flex-start',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                '& .MuiInputBase-input': {
                  height: '100% !important',
                  overflow: 'auto !important',
                  resize: 'none',
                  whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                  wordWrap: wordWrap ? 'break-word' : 'normal',
                },
              },
            }}
            sx={{ height: '100%' }}
          />

          {/* Line Numbers Overlay */}
          {showLineNumbers && content && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                width: '40px',
                height: 'calc(100% - 16px)',
                backgroundColor: 'grey.100',
                borderRight: '1px solid',
                borderColor: 'divider',
                pointerEvents: 'none',
                overflow: 'hidden',
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'text.secondary',
                padding: '8px 4px',
                boxSizing: 'border-box',
              }}
            >
              {content.split('\n').map((_, index) => (
                <div key={index} style={{ height: '21px', textAlign: 'right' }}>
                  {index + 1}
                </div>
              ))}
            </Box>
          )}
        </Box>

        {/* Snippet Panel */}
        {showSnippets && showSnippetPanel && (
          <>
            <Divider orientation="vertical" />
            <Box sx={{ width: 300, height: '100%', overflow: 'auto' }}>
              <Stack sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Template Snippets
                </Typography>

                <TextField
                  select
                  size="small"
                  value={activeSnippetCategory}
                  onChange={(e) => setActiveSnippetCategory(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="variables">Variables</MenuItem>
                  <MenuItem value="conditionals">Conditionals</MenuItem>
                  <MenuItem value="layouts">Layouts</MenuItem>
                </TextField>

                <Stack spacing={1}>
                  {TEMPLATE_SNIPPETS[activeSnippetCategory]?.map((snippet, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => insertAtCursor(snippet.code)}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        textTransform: 'none',
                      }}
                    >
                      {snippet.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </>
        )}
      </Stack>

      {/* Validation Results */}
      {showValidation && validation && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          {validation.errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 1 }}>
              <AlertTitle>
                {validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}
              </AlertTitle>
              <Stack spacing={0.5}>
                {validation.errors.slice(0, 3).map((error, index) => (
                  <Typography key={index} variant="body2">
                    • {error}
                  </Typography>
                ))}
                {validation.errors.length > 3 && (
                  <Typography variant="body2" color="text.secondary">
                    ... and {validation.errors.length - 3} more
                  </Typography>
                )}
              </Stack>
            </Alert>
          )}

          {validation.warnings.length > 0 && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              <AlertTitle>
                {validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}
              </AlertTitle>
              <Stack spacing={0.5}>
                {validation.warnings.slice(0, 3).map((warning, index) => (
                  <Typography key={index} variant="body2">
                    • {warning}
                  </Typography>
                ))}
                {validation.warnings.length > 3 && (
                  <Typography variant="body2" color="text.secondary">
                    ... and {validation.warnings.length - 3} more
                  </Typography>
                )}
              </Stack>
            </Alert>
          )}

          {validation.valid && validation.errors.length === 0 && (
            <Alert severity="success">Template is valid and ready to use!</Alert>
          )}
        </Box>
      )}
    </Card>
  );
}

TemplateEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onValidationChange: PropTypes.func,
  showValidation: PropTypes.bool,
  showSnippets: PropTypes.bool,
  showLineNumbers: PropTypes.bool,
  height: PropTypes.string,
  placeholder: PropTypes.string,
};
