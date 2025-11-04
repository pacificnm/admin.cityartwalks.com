/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Image
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormService } from 'src/services/form-service';
import { useCreateImage, useUpdateImage } from 'src/actions/image/hooks';
import { createImageSchema, updateImageSchema, defaultImageValues } from 'src/validators/image';
import {
  ElementStatus,
  ElementFormRow,
  ElementImageUrl,
  ElementSystemId,
  ElementFeatured,
  ElementViewCount,
  ElementCreatedAt,
  ElementUpdatedAt,
  ElementFormActions,
  ElementFormDivider,
  ElementImageDescription,
} from 'src/forms/elements';

import { Form } from 'src/components/hook-form';

/**
 * @memberof CityArtWalks.Forms.Image
 * @function ImageForm
 * @description Form component for creating and updating image information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentImage=null] - Current image data for editing, null for creating new image
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 *   Receives object with: { result, operation, imageData, isEdit, image, data }
 *   - result: Full API response
 *   - operation: 'create' or 'update'
 *   - imageData: The image data from the response
 *   - isEdit: Boolean indicating if this was an edit operation
 *   - image: Convenience property pointing to imageData
 *   - data: Backward compatibility property pointing to imageData
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ImageForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ImageForm({ currentImage = null, onSuccess, onCancel }) {
  const isEdit = Boolean(currentImage?.imageId);

  // Use appropriate hooks for create/update operations
  const createImage = useCreateImage();
  const updateImage = useUpdateImage();

  // Get default values using validator utility
  const defaultValues = defaultImageValues(currentImage);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateImageSchema : createImageSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const { reset, handleSubmit } = methods;

  /**
   * @memberof CityArtWalks.Forms.Image.ImageForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations using FormService.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    await FormService.handleEntitySubmit(isEdit, {
      entityName: 'image',
      entityId: currentImage?.imageId,
      currentEntity: currentImage,
      data,
      operations: {
        create: () => createImage(data),
        update: (id) => updateImage(id, data),
      },
      form: {
        reset,
        getDefaultValues: defaultImageValues,
      },
      callbacks: {
        onSuccess,
      },
      logging: {
        namespace: 'CityArtWalks.Forms.Image.ImageForm.onSubmit',
      },
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {/* Primary Information Section */}
      <ElementFormRow>
        <ElementImageUrl name="url" label="Image URL" required />
        <ElementImageDescription name="caption" label="Caption" />
        <ElementStatus name="status" label="Status" />
        <ElementFeatured />
      </ElementFormRow>

      {/* System Fields (Edit Only) */}
      {isEdit && currentImage && (
        <>
          <ElementFormDivider />
          <ElementFormRow>
            <ElementSystemId name="imageId" />
            <ElementViewCount name="viewCount" />
            <ElementCreatedAt />
            <ElementUpdatedAt />
          </ElementFormRow>
        </>
      )}

      {/* Form Actions */}
      <ElementFormActions
        onCancel={onCancel ? () => FormService.handleCancel(reset, defaultValues, onCancel) : undefined}
        isEdit={isEdit}
        createLabel="Create image"
      />
    </Form>
  );
}
