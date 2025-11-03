'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog, debugError } from 'src/lib/debug';

import { CloseIcon, ArchiveIcon as SaveIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'never', label: 'Never' },
];

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London Time' },
  { value: 'Europe/Paris', label: 'Central European Time' },
  { value: 'Asia/Tokyo', label: 'Japan Time' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const PREFERENCE_CATEGORIES = [
  {
    title: 'Essential Communications',
    description: 'Important account and transactional emails',
    preferences: [
      {
        key: 'transactional',
        label: 'Account & Security',
        description: 'Password resets, account changes',
        required: true,
      },
      {
        key: 'notifications',
        label: 'System Notifications',
        description: 'Important platform updates',
      },
    ],
  },
  {
    title: 'Content & Updates',
    description: 'Art and platform content notifications',
    preferences: [
      {
        key: 'newsletter',
        label: 'Newsletter',
        description: 'Weekly newsletter with curated content',
      },
      {
        key: 'artUpdates',
        label: 'Art Updates',
        description: 'New art pieces and artist features',
      },
      {
        key: 'pathNotifications',
        label: 'Path Notifications',
        description: 'New art walks and path updates',
      },
      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary of weekly activities' },
    ],
  },
  {
    title: 'Marketing & Promotions',
    description: 'Promotional content and marketing materials',
    preferences: [
      { key: 'marketing', label: 'Marketing Emails', description: 'Promotional offers and events' },
      {
        key: 'partnerships',
        label: 'Partner Offers',
        description: 'Special offers from our partners',
      },
    ],
  },
];

// ----------------------------------------------------------------------

export function UserPreferenceManager({ open, onClose, user, onUpdate }) {
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [frequency, setFrequency] = useState(user?.frequency || 'weekly');
  const [timezone, setTimezone] = useState(user?.timezone || 'America/New_York');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
    setHasChanges(true);
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
    setHasChanges(true);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      debugLog('UserPreferenceManager.handleSave', 'Saving user preferences', {
        userId: user.id,
        preferences,
        frequency,
        timezone,
        language,
      });

      setSaving(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${user.id}/preferences`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     preferences,
      //     frequency,
      //     timezone,
      //     language
      //   })
      // });

      // Mock API call
      setTimeout(() => {
        onUpdate(preferences);
        setSaving(false);
        setHasChanges(false);
        onClose();
      }, 1000);
    } catch (error) {
      debugError('UserPreferenceManager.handleSave', 'Failed to save preferences', error);
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(user?.preferences || {});
    setFrequency(user?.frequency || 'weekly');
    setTimezone(user?.timezone || 'America/New_York');
    setLanguage(user?.language || 'en');
    setHasChanges(false);
  };

  const getEnabledCount = (categoryPreferences) =>
    categoryPreferences.filter((pref) => preferences[pref.key]).length;

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Email Preferences</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.name} ({user.email})
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={4}>
          {hasChanges && (
            <Alert severity="info">
              You have unsaved changes. Don&apos;t forget to save your preferences.
            </Alert>
          )}

          {/* General Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Email Frequency</InputLabel>
                <Select value={frequency} label="Email Frequency" onChange={handleFrequencyChange}>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select value={timezone} label="Timezone" onChange={handleTimezoneChange}>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select value={language} label="Language" onChange={handleLanguageChange}>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Divider />

          {/* Email Preferences by Category */}
          {PREFERENCE_CATEGORIES.map((category) => (
            <Box key={category.title}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">{category.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
                <Chip
                  label={`${getEnabledCount(category.preferences)}/${category.preferences.length} enabled`}
                  size="small"
                  color={getEnabledCount(category.preferences) > 0 ? 'primary' : 'default'}
                />
              </Stack>

              <FormGroup>
                {category.preferences.map((preference) => (
                  <FormControlLabel
                    key={preference.key}
                    control={
                      <Switch
                        checked={preferences[preference.key] || false}
                        onChange={() => handlePreferenceChange(preference.key)}
                        disabled={preference.required}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          {preference.label}
                          {preference.required && (
                            <Chip label="Required" size="small" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {preference.description}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          ))}

          {/* Summary */}
          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preference Summary
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {Object.entries(preferences).map(([key, enabled]) => {
                if (!enabled) return null;
                const allPreferences = PREFERENCE_CATEGORIES.flatMap((cat) => cat.preferences);
                const preference = allPreferences.find((p) => p.key === key);
                return (
                  <Chip
                    key={key}
                    label={preference?.label || key}
                    size="small"
                    color="primary"
                    variant="soft"
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} disabled={saving || !hasChanges}>
          Reset
        </Button>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={saving || !hasChanges}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
