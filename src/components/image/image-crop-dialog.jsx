/* eslint-disable @next/next/no-img-element */
/**
 * @namespace CityArtWalks.Components.Image.ImageCropDialog
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Image cropping and rotation dialog using react-image-crop with canvas integration.
 */

'use client';

import 'react-image-crop/dist/ReactCrop.css';

import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog, debugError } from 'src/lib/debug';

import { CloseIcon } from 'src/components/icons/close-icon';
import { RotateLeftIcon } from 'src/components/icons/rotate-left-icon';
import { RotateRightIcon } from 'src/components/icons/rotate-right-icon';

/**
 * Generates a cropped image from the canvas based on crop data
 * @memberof CityArtWalks.Components.Image.ImageCropDialog
 * @function getCroppedImg
 * @description Creates a cropped image using HTML5 Canvas from the crop selection data.
 * @private
 * @param {HTMLImageElement} image - The source image element
 * @param {Object} crop - The crop data with x, y, width, height
 * @param {number} [rotation=0] - Rotation angle in degrees
 * @param {string} [fileName='croppedImage.jpeg'] - Output filename
 * @returns {Promise<File>} Promise resolving to the cropped image file
 */
function getCroppedImg(image, crop, rotation = 0, fileName = 'croppedImage.jpeg') {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('No 2d context'));
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio || 1;

    // Calculate rotation angle
    const radians = (rotation * Math.PI) / 180;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.save();

    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.translate(canvas.width / (2 * pixelRatio), canvas.height / (2 * pixelRatio));
      ctx.rotate(radians);
      ctx.translate(-canvas.width / (2 * pixelRatio), -canvas.height / (2 * pixelRatio));
    }

    ctx.translate(-cropX, -cropY);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        resolve(file);
      },
      'image/jpeg',
      0.9
    );
  });
}

/**
 * @memberof CityArtWalks.Components.Image.ImageCropDialog
 * @function ImageCropDialog
 * @description Interactive image cropping and rotation dialog with aspect ratio controls and canvas-based processing.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {File} props.imageFile - The source image file to crop.
 * @param {Function} props.onClose - Callback function called when dialog is closed.
 * @param {Function} props.onCropComplete - Callback function called when cropping is complete with cropped file.
 * @param {string} [props.title='Crop Image'] - Dialog title.
 * @returns {JSX.Element} The rendered ImageCropDialog component.
 *
 * @example
 * <ImageCropDialog
 *   open={cropDialogOpen}
 *   imageFile={selectedFile}
 *   onClose={() => setCropDialogOpen(false)}
 *   onCropComplete={handleCroppedImage}
 *   title="Crop Art Piece Image"
 * />
 */
export function ImageCropDialog(props) {
  const { open, imageFile, onClose, onCropComplete, title = 'Crop Image' } = props;

  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [aspect, setAspect] = useState(null);
  const [circularCrop, setCircularCrop] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef(null);

  /**
   * @memberof CityArtWalks.Components.Image.ImageCropDialog
   * @function handleClose
   * @description Handles dialog close and cleanup.
   * @private
   */
  const handleClose = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }

    // Reset state
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setCompletedCrop(null);
    setImageSrc('');
    setRotation(0);
    setAspect(null);
    setCircularCrop(false);

    debugLog('CityArtWalks.Components.Image.ImageCropDialog.handleClose', 'Crop dialog closed');

    if (onClose) {
      onClose();
    }
  }, [imageSrc, onClose]);

  /**
   * @memberof CityArtWalks.Components.Image.ImageCropDialog
   * @function handleCropComplete
   * @description Handles crop completion and generates the cropped image.
   * @private
   */
  const handleCropComplete = useCallback(async () => {
    if (!imageRef.current || !completedCrop?.width || !completedCrop?.height || !imageFile) {
      debugError(
        'CityArtWalks.Components.Image.ImageCropDialog.handleCropComplete',
        'Invalid crop data or image ref',
        {
          hasImageRef: !!imageRef.current,
          hasImageFile: !!imageFile,
          cropWidth: completedCrop?.width,
          cropHeight: completedCrop?.height,
        }
      );
      return;
    }

    setIsProcessing(true);

    try {
      const croppedImage = await getCroppedImg(
        imageRef.current,
        completedCrop,
        rotation,
        `cropped_${imageFile.name}`
      );

      debugLog(
        'CityArtWalks.Components.Image.ImageCropDialog.handleCropComplete',
        'Crop completed successfully',
        {
          originalSize: imageFile.size,
          croppedSize: croppedImage.size,
          fileName: croppedImage.name,
          cropData: completedCrop,
          rotation,
        }
      );

      if (onCropComplete) {
        onCropComplete(croppedImage);
      }

      // Close dialog after successful crop
      handleClose();
    } catch (error) {
      debugError(
        'CityArtWalks.Components.Image.ImageCropDialog.handleCropComplete',
        'Failed to generate cropped image',
        error
      );
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, rotation, imageFile, onCropComplete, handleClose]);

  /**
   * @memberof CityArtWalks.Components.Image.ImageCropDialog
   * @function handleAspectChange
   * @description Handles aspect ratio selection change.
   * @private
   */
  const handleAspectChange = (event) => {
    const value = event.target.value;
    setAspect(value === 'free' ? null : value);

    debugLog(
      'CityArtWalks.Components.Image.ImageCropDialog.handleAspectChange',
      'Aspect ratio changed',
      {
        newAspect: value,
      }
    );
  };

  /**
   * @memberof CityArtWalks.Components.Image.ImageCropDialog
   * @function handleRotation
   * @description Handles image rotation.
   * @private
   */
  const handleRotation = (degrees) => {
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);

    debugLog('CityArtWalks.Components.Image.ImageCropDialog.handleRotation', 'Image rotated', {
      previousRotation: rotation,
      newRotation,
      rotationDelta: degrees,
    });
  };

  // Load image when dialog opens
  useEffect(() => {
    if (open && imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);

      debugLog('CityArtWalks.Components.Image.ImageCropDialog', 'Image loaded for cropping', {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
      });

      // Return cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    // Return undefined when condition is not met
    return undefined;
  }, [open, imageFile]); // Only depend on open and imageFile

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            minHeight: 600,
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {title}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Controls */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            {/* Aspect Ratio */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Aspect Ratio</InputLabel>
              <Select
                value={aspect === null ? 'free' : aspect.toString()}
                label="Aspect Ratio"
                onChange={handleAspectChange}
              >
                <MenuItem value="free">Free Form</MenuItem>
                <MenuItem value="1">Square (1:1)</MenuItem>
                <MenuItem value={4 / 3}>Standard (4:3)</MenuItem>
                <MenuItem value={3 / 2}>Photo (3:2)</MenuItem>
                <MenuItem value={16 / 9}>Widescreen (16:9)</MenuItem>
                <MenuItem value={2 / 3}>Portrait (2:3)</MenuItem>
              </Select>
            </FormControl>

            {/* Circular Crop */}
            <FormControlLabel
              control={
                <Switch
                  checked={circularCrop}
                  onChange={(e) => setCircularCrop(e.target.checked)}
                />
              }
              label="Circular"
            />

            {/* Rotation Controls */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Rotate:</Typography>
              <Tooltip title="Rotate Left 90°">
                <IconButton
                  size="small"
                  onClick={() => handleRotation(-90)}
                  disabled={isProcessing}
                >
                  <RotateLeftIcon size={20} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate Right 90°">
                <IconButton size="small" onClick={() => handleRotation(90)} disabled={isProcessing}>
                  <RotateRightIcon size={20} />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {rotation}°
              </Typography>
            </Stack>
          </Stack>

          {/* Crop Area */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              maxHeight: 500,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                circularCrop={circularCrop}
                ruleOfThirds
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <img
                  ref={imageRef}
                  alt="Crop preview"
                  src={imageSrc}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                  onLoad={() => {
                    // Center crop on initial load
                    if (imageRef.current) {
                      setCrop({
                        unit: '%',
                        width: 50,
                        height: 50,
                        x: 25,
                        y: 25,
                      });
                    }
                  }}
                />
              </ReactCrop>
            )}
          </Box>

          {/* Crop Information */}
          {completedCrop && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Crop Size: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}{' '}
              pixels
              {rotation !== 0 && ` | Rotation: ${rotation}°`}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={handleClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCropComplete}
          disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
        >
          {isProcessing ? 'Processing...' : 'Apply Crop'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageCropDialog
 * PropTypes validation for the ImageCropDialog component
 */
ImageCropDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  imageFile: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onCropComplete: PropTypes.func.isRequired,
  title: PropTypes.string,
};
