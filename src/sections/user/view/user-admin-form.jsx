'use client';

/**
 * UserAdminForm component for admin user editing/creation.
 * Wraps the UserNewEditForm and passes current user and mutate handler.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - The user object to edit (or undefined for new user)
 * @param {Function} props.mutate - Function to refresh/revalidate user data after changes
 * @returns {JSX.Element}
 */

import { UserNewEditForm } from '../user-new-edit-form';

export function UserAdminForm({ currentUser, mutate }) {
  return <UserNewEditForm currentUser={currentUser} mutate={mutate} />;
}
