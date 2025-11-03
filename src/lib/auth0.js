/**
 * @file auth0.js
 * @description Auth0 Management API integration utilities for CityArtWalks. Provides comprehensive utilities for Auth0 authentication, user management, role management, and permissions handling with secure token-based API access and comprehensive error handling for user lifecycle operations.
 * @namespace CityArtWalks.Lib.Auth0
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Auth0 integration documentation
 */

/**
 * Gets an access token from Auth0 Management API for server-to-server authentication.
 * Uses client credentials flow to obtain a token for accessing Auth0 Management API endpoints.
 * Handles authentication errors and returns null on failure with comprehensive error logging.
 *
 * @async
 * @function getAccessToken
 * @memberof CityArtWalks.Lib.Auth0
 * @returns {Promise<string|null>} Access token string or null if authentication fails
 *
 * @example
 * // Example usage:
 * const token = await getAccessToken();
 * if (token) {
 *   // Use token for Auth0 Management API calls
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function getAccessToken() {
  const url = 'https://pdxartwalks.us.auth0.com/oauth/token';

  const body = JSON.stringify({
    client_id: process.env.AUTH0_MGMT_CLIENT_ID,
    client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
    audience: process.env.AUTH0_MGMT_AUDIENCE,
    grant_type: 'client_credentials',
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      console.error('Error fetching token?:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error getting access token?:', error);
    return null;
  }
}

/**
 * Gets all users from Auth0 Management API with comprehensive user data.
 * Retrieves complete list of users from Auth0 tenant including user profiles, metadata,
 * and authentication information. Handles authentication token management and API errors.
 *
 * @async
 * @function getAuth0Users
 * @memberof CityArtWalks.Lib.Auth0
 * @returns {Promise<Object|null>} List of users object or null if request fails
 *
 * @example
 * // Example usage:
 * const users = await getAuth0Users();
 * if (users) {
 *   console.log(`Found ${users.length} users`);
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function getAuth0Users() {
  const token = getAccessToken();

  const url = `https://pdxartwalks.us.auth0.com/api/v2/users`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error fetching users?:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error getting users?:', error);
    return null;
  }
}

/**
 * Gets a single user object from Auth0 Management API by user ID.
 * Retrieves complete user profile including metadata, authentication details, and account information.
 * Handles authentication token management and provides detailed error handling for user lookup operations.
 *
 * @async
 * @function getAuth0User
 * @memberof CityArtWalks.Lib.Auth0
 * @param {string} id - Auth0 User ID (e.g., "auth0|60d5ec49f8ba7c0071f748d1")
 * @returns {Promise<Object|null>} User object with profile data or null if user not found or request fails
 *
 * @example
 * // Example usage:
 * const user = await getAuth0User('auth0|60d5ec49f8ba7c0071f748d1');
 * if (user) {
 *   console.log(`User: ${user.name} (${user.email})`);
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function getAuth0User(id) {
  const token = getAccessToken();

  const url = `https://pdxartwalks.us.auth0.com/api/v2/users/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error fetching user?:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error getting user?:', error);
    return null;
  }
}

/**
 * Updates a user in Auth0 Management API with comprehensive profile and metadata updates.
 * Updates user metadata, app metadata, profile information, and account settings through Auth0 Management API.
 * Handles user profile synchronization, role management, and billing status updates with comprehensive error handling.
 *
 * @async
 * @function updateAuth0User
 * @memberof CityArtWalks.Lib.Auth0
 * @param {Object} user - User object containing update data with accounts array and profile information
 * @param {Array} user.accounts - Array of user accounts with providerAccountId
 * @param {string} user.userId - Internal user ID
 * @param {string} [user.phoneNumber] - User phone number
 * @param {string} [user.address] - User address
 * @param {string} [user.state] - User state
 * @param {string} [user.zipCode] - User zip code
 * @param {string} [user.company] - User company
 * @param {string} [user.status] - User status
 * @param {string} [user.role] - User role
 * @param {string} [user.image] - User profile image URL
 * @param {string} [user.name] - User display name
 * @returns {Promise<Object|null>} Updated user object or null if update fails
 *
 * @example
 * // Example usage:
 * const updatedUser = await updateAuth0User({
 *   accounts: [{ providerAccountId: 'auth0|60d5ec49f8ba7c0071f748d1' }],
 *   userId: 123,
 *   name: 'John Doe',
 *   status: 'ACTIVE',
 *   role: 'USER'
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function updateAuth0User(user) {
  const token = getAccessToken();
  const id = user.accounts[0].providerAccountId;
  const url = `https://pdxartwalks.us.auth0.com/api/v2/users/${id}`;

  const data = JSON.stringify({
    user_metadata: {
      id: user.userId,
      phoneNumber: user.phoneNumber,
      address: user.address,
      state: user.state,
      zipCode: user.zipCode,
      company: user.company,
      cover: user.cover,
      facebook: user.facebook,
      instagram: user.instagram,
    },
    app_metadata: {
      lastUpdate: new Date(),
      updateFrom: 'form',
      status: user.status,
      role: user.role,
      allowEmail: true,
      billingStatus: 'ACTIVE',
    },
    picture: user.image,
    name: user.name,
  });

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error updating user?:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error updating user?:', error);
    return null;
  }
}

/**
 * Gets user permissions from Auth0 Management API for authorization management.
 * Retrieves comprehensive list of permissions assigned to a specific user including
 * resource permissions, scopes, and authorization details for access control validation.
 *
 * @async
 * @function getUserPermissions
 * @memberof CityArtWalks.Lib.Auth0
 * @param {string} id - Auth0 User ID (e.g., "auth0|60d5ec49f8ba7c0071f748d1")
 * @returns {Promise<Object|undefined>} User permissions object or undefined if request fails or user ID missing
 *
 * @example
 * // Example usage:
 * const permissions = await getUserPermissions('auth0|60d5ec49f8ba7c0071f748d1');
 * if (permissions) {
 *   console.log('User permissions:', permissions);
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function getUserPermissions(id) {
  if (!id) {
    console.error('User ID is required');
    return;
  }

  const token = await getAccessToken();
  if (!token) {
    console.error('No access token available');
    return;
  }

  const url = `https://pdxartwalks.us.auth0.com/api/v2/users/${id}/permissions`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await response.json();
    } else {
      console.error('Error fetching user permissions?:', response.statusText);
    }
  } catch (error) {
    console.error('Error getting user permissions?:', error);
  }
}

/**
 * Gets user roles from Auth0 Management API for role-based access control.
 * Retrieves complete list of roles assigned to a specific user including role names,
 * descriptions, and permissions for comprehensive authorization management and access control validation.
 *
 * @async
 * @function getAuth0UserRoles
 * @memberof CityArtWalks.Lib.Auth0
 * @param {string} userId - Auth0 User ID (e.g., "auth0|60d5ec49f8ba7c0071f748d1")
 * @returns {Promise<Array>} Array of user roles or empty array if request fails or user ID missing
 *
 * @example
 * // Example usage:
 * const roles = await getAuth0UserRoles('auth0|60d5ec49f8ba7c0071f748d1');
 * if (roles.length > 0) {
 *   console.log('User roles:', roles.map(role => role.name));
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth0-Lib} - Complete documentation
 */
export async function getAuth0UserRoles(userId) {
  if (!userId) {
    console.error('User ID is required');
    return [];
  }

  const token = await getAccessToken();
  if (!token) {
    console.error('No access token available');
    return [];
  }

  const url = `https://pdxartwalks.us.auth0.com/api/v2/users/${userId}/roles`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error fetching user roles?:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error getting user roles?:', error);
    return [];
  }
}
