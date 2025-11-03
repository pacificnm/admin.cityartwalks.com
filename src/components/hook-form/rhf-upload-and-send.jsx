import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { HelperText } from './help-text';
import { Upload, UploadAvatar } from '../upload';

// Generic uploader that sends file to API and sets URL
export function RHFUploadAndSend({
  name,
  onUpload,
  imageType,
  id,
  avatar,
  slotProps,
  helperText,
  onValidationError,
  ...other
}) {
  const { control, setValue } = useFormContext();

  // Allowed types and max size
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleDrop = async (acceptedFiles) => {
          const file = acceptedFiles[0];
          if (!file) return;

          // Validate type
          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            if (onValidationError)
              onValidationError('Only JPEG, PNG, GIF, or WEBP images are allowed');
            return;
          }
          // Validate size
          if (file.size > MAX_IMAGE_SIZE) {
            if (onValidationError) onValidationError('Image must be less than 3MB');
            return;
          }

          if (onUpload) {
            const url = await onUpload(file, imageType, id);
            if (url) setValue(name, url, { shouldValidate: true });
          }
        };

        const UploadComponent = avatar ? UploadAvatar : Upload;

        return (
          <Box {...slotProps?.wrapper}>
            <UploadComponent value={field.value} error={!!error} onDrop={handleDrop} {...other} />
            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }} />
          </Box>
        );
      }}
    />
  );
}
