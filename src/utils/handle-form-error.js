/**
 * Handles form errors by mapping API field errors to react-hook-form `setError`.
 * Optionally returns the top-level error message for toast notifications.
 *
 * @param {Object} error - The caught error from an API call.
 * @param {Function} setError - The react-hook-form setError function.
 * @returns {string|null} - General error message from server, if available.
 */
export function handleFormError(error, setError) {
  console.error('Error during form submission?:', error);

  const fieldErrors = error?.response?.fieldErrors || error?.response?.data?.fieldErrors;
  const generalError = error?.response?.error || error?.response?.data?.error || error?.message;

  if (fieldErrors && typeof setError === 'function') {
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        setError(field, {
          type: 'server',
          message: messages[0], // Show first error
        });
      }
    });
  }

  return generalError ?? 'An unexpected error occurred.';
}
