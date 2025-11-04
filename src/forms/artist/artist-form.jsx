/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Artist
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FormService } from "src/services/form-service";
import { useCreateArtist, useUpdateArtist } from "src/actions/artist/hooks";
import {
  createArtistSchema,
  updateArtistSchema,
  defaultArtistValues,
  getCreateArtistDefaults,
} from "src/validators/artist";
import {
  ElementName,
  ElementSlug,
  ElementStatus,
  ElementWebsite,
  ElementFormRow,
  ElementFacebook,
  ElementLocation,
  ElementSystemId,
  ElementViewCount,
  ElementCreatedAt,
  ElementCreatedBy,
  ElementUpdatedAt,
  ElementUpdatedBy,
  ElementArtistBio,
  ElementBirthDate,
  ElementDeathDate,
  ElementInstagram,
  ElementFormActions,
  ElementFormDivider,
  ElementArtistMetaTitle,
  ElementArtistMetaKeywords,
  ElementArtistMetaDescription,
} from "src/forms/elements";

import { Form } from "src/components/hook-form";

/**
 * @memberof CityArtWalks.Forms.Artist
 * @function ArtistForm
 * @description Form component for creating and updating artist information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtist=null] - Current artist data for editing, null for creating new artist
 * @param {Object} [props.initialValues={}] - Initial values for creating new artist (when currentArtist is null)
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 *   Receives object with: { result, operation, artistData, isEdit, artist, data }
 *   - result: Full API response
 *   - operation: 'create' or 'update'
 *   - artistData: The artist data from the response
 *   - isEdit: Boolean indicating if this was an edit operation
 *   - artist: Convenience property pointing to artistData
 *   - data: Backward compatibility property pointing to artistData
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtistForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtistForm({
  currentArtist = null,
  initialValues = {},
  onSuccess,
  onCancel,
}) {
  const isEdit = Boolean(currentArtist?.artistId);

  // Use appropriate hooks for create/update operations
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();

  // Get default values using FormService
  const defaultValues = FormService.getFormDefaults(isEdit, {
    currentEntity: currentArtist,
    entityDefaultsFunc: defaultArtistValues,
    createDefaultsFunc: getCreateArtistDefaults,
    initialValues,
  });

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtistSchema : createArtistSchema;

  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const { reset, handleSubmit } = methods;

  /**
   * @memberof CityArtWalks.Forms.Artist.ArtistForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations using FormService.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    await FormService.handleEntitySubmit(isEdit, {
      entityName: 'artist',
      entityId: currentArtist?.artistId,
      currentEntity: currentArtist,
      data,
      operations: {
        create: () => createArtist(data),
        update: (id) => updateArtist(id, data),
      },
      form: {
        reset,
        getDefaultValues: defaultArtistValues,
      },
      callbacks: {
        onSuccess,
      },
      logging: {
        namespace: 'CityArtWalks.Forms.Artist.ArtistForm.onSubmit',
      },
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {/* Primary Information Section */}
      <ElementFormRow columns={3}>
        <ElementName name="name" label="Artist Name" required />
        <ElementSlug name="slug" label="Slug" sourceField="name" disabled />
        <ElementStatus name="status" label="Status" />
      </ElementFormRow>

      <ElementFormRow columns={1}>
        <ElementArtistBio
          name="biography"
          label="Biography"
          currentArtist={currentArtist}
        />
      </ElementFormRow>

      {/* Date Information */}
      <ElementFormDivider />
      <ElementFormRow>
        <ElementBirthDate name="birthDate" label="Birth Date" />
        <ElementDeathDate name="deathDate" label="Death Date" />
      </ElementFormRow>

      {/* Social Media Information */}
      <ElementFormDivider />
      <ElementFormRow columns={3}>
        <ElementFacebook name="facebook" label="Facebook" />
        <ElementInstagram name="instagram" label="Instagram" />
        <ElementWebsite name="website" label="Website" />
      </ElementFormRow>

      {/* Location Information */}
      <ElementFormDivider />
      <ElementLocation />

      {/* SEO Meta Tags Section */}
      <ElementFormDivider />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          SEO Meta Tags
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Optimize your artist profile for search engines with custom meta tags.
          These help improve visibility and click-through rates in search
          results.
        </Typography>
      </Box>
      <ElementFormRow columns={1}>
        <ElementArtistMetaTitle
          name="metaTitle"
          label="Meta Title"
          currentArtist={currentArtist}
        />
        <ElementArtistMetaDescription
          name="metaDescription"
          label="Meta Description"
          currentArtist={currentArtist}
        />
        <ElementArtistMetaKeywords
          name="metaKeywords"
          label="Meta Keywords"
          currentArtist={currentArtist}
        />
      </ElementFormRow>

      {/* System Information (Edit Only) */}
      {isEdit && (
        <>
          <ElementFormDivider />
          <ElementFormRow>
            <ElementSystemId name="artistId" label="Artist ID" />
            <ElementViewCount name="viewCount" label="Views" disabled />
            <ElementCreatedAt />
            <ElementCreatedBy createdByUser={currentArtist.CreatedByUser} />
            <ElementUpdatedAt />
            <ElementUpdatedBy updatedByUser={currentArtist.UpdatedByUser} />
          </ElementFormRow>
        </>
      )}

      {/* Form Actions */}
      <ElementFormActions
        onCancel={onCancel ? () => FormService.handleCancel(reset, defaultValues, onCancel) : undefined}
        isEdit={isEdit}
        createLabel="Create artist"
      />
    </Form>
  );
}
