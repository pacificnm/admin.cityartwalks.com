'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog, debugError } from 'src/lib/debug';

import { DownloadIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV (Comma Separated Values)' },
  { value: 'xlsx', label: 'Excel Spreadsheet' },
  { value: 'json', label: 'JSON Format' },
  { value: 'pdf', label: 'PDF Report' },
];

const EXPORT_FIELDS = [
  { value: 'id', label: 'Email ID', default: true },
  { value: 'recipient', label: 'Recipient Information', default: true },
  { value: 'subject', label: 'Subject', default: true },
  { value: 'template', label: 'Template', default: true },
  { value: 'status', label: 'Status', default: true },
  { value: 'sentAt', label: 'Sent Date/Time', default: true },
  { value: 'openedAt', label: 'Opened Date/Time', default: false },
  { value: 'clickCount', label: 'Click Count', default: false },
  { value: 'metadata', label: 'Additional Metadata', default: false },
];

// ----------------------------------------------------------------------

export function EmailExportDialog({ open, onClose, filters }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedFields, setSelectedFields] = useState(
    EXPORT_FIELDS.filter((field) => field.default).map((field) => field.value)
  );
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFieldChange = (fieldValue) => {
    setSelectedFields((prev) =>
      prev.includes(fieldValue) ? prev.filter((f) => f !== fieldValue) : [...prev, fieldValue]
    );
  };

  const handleSelectAllFields = () => {
    const allFields = EXPORT_FIELDS.map((field) => field.value);
    setSelectedFields(selectedFields.length === allFields.length ? [] : allFields);
  };

  const handleExport = async () => {
    try {
      debugLog('EmailExportDialog.handleExport', 'Starting export', {
        format: exportFormat,
        fields: selectedFields,
        dateRange: { from: dateFrom, to: dateTo },
        filters,
      });

      setExporting(true);
      setExportProgress(0);

      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/email/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     format: exportFormat,
      //     fields: selectedFields,
      //     dateRange: { from: dateFrom, to: dateTo },
      //     filters
      //   })
      // });

      // Mock export process
      setTimeout(() => {
        clearInterval(progressInterval);
        setExportProgress(100);

        setTimeout(() => {
          // Generate mock download
          const mockData = generateMockExportData();
          downloadFile(mockData, exportFormat);

          setExporting(false);
          setExportProgress(0);
          onClose();
        }, 1000);
      }, 3000);
    } catch (error) {
      debugError('EmailExportDialog.handleExport', 'Export failed', error);
      setExporting(false);
      setExportProgress(0);
    }
  };

  const generateMockExportData = () => {
    // Generate mock data based on selected format
    const mockEmails = [
      {
        id: '1',
        recipient: 'john.doe@example.com',
        subject: 'Welcome to City Art Walks!',
        template: 'welcome',
        status: 'opened',
        sentAt: '2024-01-15 10:30:00',
        openedAt: '2024-01-15 11:15:00',
        clickCount: 2,
        metadata: '{"device": "mobile", "location": "New York"}',
      },
      {
        id: '2',
        recipient: 'jane.smith@example.com',
        subject: 'New Art Piece Added',
        template: 'notification',
        status: 'delivered',
        sentAt: '2024-01-15 09:45:00',
        openedAt: null,
        clickCount: 0,
        metadata: '{"device": "desktop", "location": "Los Angeles"}',
      },
    ];

    // Filter data based on selected fields
    const filteredData = mockEmails.map((email) => {
      const filtered = {};
      selectedFields.forEach((field) => {
        if (email[field] !== undefined) {
          filtered[field] = email[field];
        }
      });
      return filtered;
    });

    if (exportFormat === 'csv') {
      return convertToCSV(filteredData);
    } else if (exportFormat === 'json') {
      return JSON.stringify(filteredData, null, 2);
    }

    return filteredData;
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        })
        .join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadFile = (data, format) => {
    const mimeTypes = {
      csv: 'text/csv',
      json: 'application/json',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
    };

    const blob = new Blob([data], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email_export_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Emails</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Alert severity="info">
            Export emails based on current filters or customize the export settings below.
          </Alert>

          {/* Export Format */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Export Format</FormLabel>
            <RadioGroup value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
              {EXPORT_FORMATS.map((format) => (
                <FormControlLabel
                  key={format.value}
                  value={format.value}
                  control={<Radio />}
                  label={format.label}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Date Range */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Date Range (Optional)
            </Typography>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="From Date"
                value={dateFrom}
                onChange={setDateFrom}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
              <DatePicker
                label="To Date"
                value={dateTo}
                onChange={setDateTo}
                slotProps={{
                  textField: { size: 'small', fullWidth: true },
                }}
              />
            </Stack>
          </Box>

          {/* Fields Selection */}
          <FormControl component="fieldset">
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
            >
              <FormLabel component="legend">Fields to Export</FormLabel>
              <Button size="small" onClick={handleSelectAllFields}>
                {selectedFields.length === EXPORT_FIELDS.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>
            <FormGroup>
              {EXPORT_FIELDS.map((field) => (
                <FormControlLabel
                  key={field.value}
                  control={
                    <Checkbox
                      checked={selectedFields.includes(field.value)}
                      onChange={() => handleFieldChange(field.value)}
                    />
                  }
                  label={field.label}
                />
              ))}
            </FormGroup>
          </FormControl>

          {/* Export Progress */}
          {exporting && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Preparing export... {Math.round(exportProgress)}%
              </Typography>
              <LinearProgress variant="determinate" value={exportProgress} />
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={exporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={exporting || selectedFields.length === 0}
        >
          {exporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
