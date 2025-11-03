'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { imageSchema, defaultImageValues } from 'src/validators/image';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

export function ImageEditDialog({ currentImage, open, onClose }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(imageSchema),
    defaultValues: defaultImageValues(currentImage), // Initial default values
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Watch for changes to `currentImage` and reset the form
  useEffect(() => {
    if (currentImage) {
      reset(defaultImageValues(currentImage));
    }
  }, [currentImage, reset]);

  const onSubmit = handleSubmit(async (data) => {
    console.error(data);
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
