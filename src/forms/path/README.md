# Path User Edit Form

## Overview

The `PathUserEditForm` component provides a user-friendly interface for creating and editing path information. This form follows the established patterns from the form instructions and excludes admin-only features like the "featured" field.

## Features

- **Dual Mode Operation**: Supports both create and edit modes
- **Proper Validation**: Uses Zod schemas for robust form validation
- **Location Chaining**: Cascading country > state > city selectors
- **Rich Text Editor**: Full-featured description editor
- **Responsive Design**: Mobile-friendly layout with proper spacing
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Success Feedback**: Toast notifications for successful operations

## Usage

### Basic Import

```javascript
import { PathUserEditForm } from 'src/forms/path';
```

### Create Mode

```javascript
<PathUserEditForm
  onSuccess={(result) => {
    console.log('Path created:', result.data);
    // Handle success (e.g., redirect to path page)
  }}
  onCancel={() => {
    // Handle cancellation
  }}
/>
```

### Edit Mode

```javascript
<PathUserEditForm
  currentPath={pathData}
  onSuccess={(result) => {
    console.log('Path updated:', result.data);
    // Handle success
  }}
  onCancel={() => {
    // Handle cancellation
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPath` | `Object\|null` | `null` | Path data for editing. If null, form operates in create mode |
| `onSuccess` | `Function` | `undefined` | Callback fired after successful form submission |
| `onCancel` | `Function` | `undefined` | Callback fired when form is cancelled |

### Path Object Structure

```javascript
{
  pathId: 1,                          // Required for edit mode
  title: 'Downtown Art Walk',         // Path title
  slug: 'downtown-art-walk',          // URL slug (auto-generated)
  description: '<p>Rich HTML...</p>',  // HTML description
  status: 'active',                   // Path status
  pathType: 'walking',                // 'walking' or 'cycling'
  mapType: 'roadmap',                 // Map display type
  zoom: 15,                           // Map zoom level
  distance: 2.5,                      // Distance in kilometers
  duration: 45,                       // Duration in minutes
  cityId: 1,                          // City ID
  stateId: 1,                         // State ID
  countryId: 1,                       // Country ID
  viewCount: 127,                     // View count (read-only)
  createdAt: '2024-01-15T10:30:00Z',  // Creation date
  updatedAt: '2024-01-20T14:22:00Z'   // Last update date
}
```

## Form Fields

### Required Fields
- **Title**: Path name/title
- **Description**: Rich text description using the editor
- **Path Type**: Walking or cycling path
- **Country**: Country selection (triggers state loading)

### Optional Fields
- **Map Type**: Display style for maps
- **Zoom Level**: Default map zoom
- **State**: State/province (depends on country)
- **City**: City selection (depends on state)

### Read-Only Fields (Edit Mode Only)
- **Slug**: Auto-generated URL slug
- **View Count**: Number of times path was viewed
- **Distance**: Calculated path distance
- **Duration**: Estimated duration

## Validation

The form uses Zod schemas for validation:

- `createPathSchema`: For new path creation
- `updatePathSchema`: For existing path updates
- Field-level validation with real-time feedback
- Custom validation for location dependencies

## Error Handling

The form includes comprehensive error handling:

- **Network Errors**: "Network error. Please check your connection..."
- **Validation Errors**: "Please check the form fields for validation errors."
- **Permission Errors**: "You do not have permission to perform this action."
- **Duplicate Errors**: "This path already exists. Please use different values."

## Location Chaining

The form implements cascading location selectors:

1. **Country Selection**: Loads available states
2. **State Selection**: Loads available cities
3. **City Selection**: Final location specification

When a parent location changes, child locations are reset to ensure data consistency.

## Integration Notes

### Authentication
- Requires valid user authentication
- Uses `useAuthContext` for access token
- Automatically handles token-based API requests

### Hooks Used
- `useCreatePath`: For creating new paths
- `useUpdatePath`: For updating existing paths
- Both hooks include proper error handling and cache invalidation

### Components Used
- `Form` and `Field` from hook-form components
- `Element*` components for specialized selectors
- Material-UI components for consistent styling

## Testing

A test page is available at `src/test-pages/path-form-test.jsx` for development and testing purposes.

## Dependencies

- React Hook Form with Zod resolver
- Material-UI components
- Custom form elements and validators
- Authentication context
- SWR-based data hooks

## Notes

- Form excludes admin-only features (e.g., "featured" field)
- Follows established form patterns from the project
- Includes proper JSDoc documentation
- Implements error boundaries for stability
- Uses consistent styling with the rest of the application
