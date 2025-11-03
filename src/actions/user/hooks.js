/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Users.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.User.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";
import {
  userQuerySchema,
  createUserSchema,
  updateUserSchema,
} from "src/validators/user";

import { UserApiClient } from "./requests";

// Create a single instance to use across all hooks
const userApiClient = new UserApiClient();

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @description SWR configuration options to control revalidation behavior.
 *
 * These options are defined inline in each hook for better control and consistency.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useGetPaginatedUsers
 * @description Hook to get paginated users with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.role=''] - Role filter
 * @param {string} [params.status=''] - Status filter
 * @param {number} [params.countryId] - Country ID filter
 * @param {number} [params.stateId] - State ID filter
 * @param {number} [params.cityId] - City ID filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.usersLoading - Loading state
 * @returns {Error} result.usersError - Error state
 * @returns {boolean} result.usersValidating - Validation state
 * @returns {boolean} result.usersEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedUsers(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    role = "",
    status = "",
    countryId,
    stateId,
    cityId,
    refreshKey = null,
  } = params;

  // Validate parameters using Zod schema
  const validationResult = useMemo(
    () =>
      baseHook.validators.validateWithSchema(
        { page, limit, search, role, status, countryId, stateId, cityId },
        userQuerySchema,
        "useGetPaginatedUsers"
      ),
    [
      baseHook.validators,
      page,
      limit,
      search,
      role,
      status,
      countryId,
      stateId,
      cityId,
    ]
  );

  const { swrKey } = useMemo(() => {
    if (!validationResult.success) {
      return { swrKey: null, cacheKey: null };
    }

    const key = [
      "getPaginatedUsers",
      page,
      limit,
      search,
      role,
      status,
      countryId,
      stateId,
      cityId,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    validationResult.success,
    page,
    limit,
    search,
    role,
    status,
    countryId,
    stateId,
    cityId,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await userApiClient.getPaginatedUsers(
          { page, limit, search, role, status, countryId, stateId, cityId },
          revalidate
        );
        return response;
      },
      revalidate
    );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results, // Complete API results object with data, pagination, performance, etc.
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useGetUsers
 * @description Hook to get all users (non-paginated), with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and list of users
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUsers(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getUsers", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await userApiClient.getUsers(revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const users = data?.results?.data || [];
    return {
      users,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && users.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useGetUser
 * @description Hook to get user by ID with IndexedDB caching.
 *
 * @param {string|number} userId - The user ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and user data
 * @throws {Error} When userId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUser(userId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  // Validate userId parameter
  useEffect(() => {
    if (
      userId &&
      !baseHook.validators.validateWithSchema(
        ["string", "number"],
        userId,
        "userId",
        "useGetUser"
      )
    ) {
      // Validation handled by base hook
    }
  }, [baseHook.validators, userId]);

  const { swrKey } = useMemo(() => {
    if (!userId) return { swrKey: null };
    const key = ["getUser", userId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, userId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await userApiClient.getUser(userId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const user = data?.results?.data || null;
    return {
      user,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !user,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useGetUserAvatar
 * @description Hook to get user avatar data by ID with IndexedDB caching (optimized for UserBadge component).
 *
 * @param {string|number} userId - The user ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and user avatar data
 * @throws {Error} When userId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserAvatar(userId, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  // Validate userId parameter
  useEffect(() => {
    if (userId && typeof userId !== "string" && typeof userId !== "number") {
      baseHook.logger.error(
        "useGetUserAvatar",
        "Invalid userId parameter type",
        {
          userId: typeof userId,
          expected: "string or number",
        }
      );
    }
  }, [baseHook.logger, userId]);

  const { swrKey } = useMemo(() => {
    if (!userId) return { swrKey: null };
    const key = ["getUserAvatar", userId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, userId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await userApiClient.getUserAvatar(userId, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const user = data?.results?.data || null;
    return {
      user,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !user,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useGetUserByEmail
 * @description Hook to get user by email with IndexedDB caching.
 *
 * @param {string} email - The user email address
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and user data
 * @returns {Object|null} result.user - User object or null if not found
 * @returns {boolean} result.userLoading - Loading state
 * @returns {Error} result.userError - Error state
 * @returns {boolean} result.userValidating - Validation state
 * @returns {boolean} result.userEmpty - Empty state (no user found)
 * @throws {Error} When email is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserByEmail(email, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  // Validate email parameter
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        baseHook.logger.error("useGetUserByEmail", "Invalid email format", {
          email: baseHook.utils.redactSensitive(email, "email"),
        });
      }
    }
  }, [baseHook.logger, baseHook.utils, email]);

  const { swrKey } = useMemo(() => {
    if (!email) return { swrKey: null };
    const key = ["getUserByEmail", email, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, email, revalidate]);

  const { data, isLoading, error, isValidating } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await userApiClient.getUserByEmail(email, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const user = data?.results?.data || null;
    return {
      user,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !user,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useCreateUser
 * @description Hook to create a new user with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (user) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createUser = useCreateUser();
 * await createUser.mutate(userData);
 */
export function useCreateUser() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (user) => {
      // Validate user data if not FormData
      if (!(user instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          user,
          createUserSchema,
          "useCreateUser",
          true // throw on error
        );
      }

      const result = await userApiClient.createUser(user);
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useUpdateUser
 * @description Hook to update an existing user with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, userData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateUser = useUpdateUser();
 * await updateUser.mutate(userId, updatedUserData);
 */
export function useUpdateUser() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, user) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateUser", "User ID is required");
        throw new Error("User ID is required");
      }

      // Validate user data if not FormData
      if (!(user instanceof FormData)) {
        baseHook.validators.validateWithSchema(
          user,
          updateUserSchema,
          "useUpdateUser",
          true // throw on error
        );
      }

      const result = await userApiClient.updateUser(id, user);
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useUpdateUserProfileImage
 * @description Hook to update a user's profile image with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, profileImage) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user ID or profile image is missing, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateUserProfileImage = useUpdateUserProfileImage();
 * await updateUserProfileImage.mutate(userId, imageFile);
 */
export function useUpdateUserProfileImage() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, profileImage) => {
      // Validate parameters
      if (!id || !profileImage) {
        baseHook.logger.error(
          "useUpdateUserProfileImage",
          "User ID and profile image are required",
          {
            hasId: !!id,
            hasProfileImage: !!profileImage,
          }
        );
        throw new Error("User ID and profile image are required");
      }

      const result = await userApiClient.updateUserProfileImage(
        id,
        profileImage
      );
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useUpdateUserCoverImage
 * @description Hook to update a user's cover image with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, coverImage) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user ID or cover image is missing, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateUserCoverImage = useUpdateUserCoverImage();
 * await updateUserCoverImage.mutate(userId, imageFile);
 */
export function useUpdateUserCoverImage() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, coverImage) => {
      // Validate parameters
      if (!id || !coverImage) {
        baseHook.logger.error(
          "useUpdateUserCoverImage",
          "User ID and cover image are required",
          {
            hasId: !!id,
            hasCoverImage: !!coverImage,
          }
        );
        throw new Error("User ID and cover image are required");
      }

      const result = await userApiClient.updateUserCoverImage(id, coverImage);
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useUpdateUserLastLogin
 * @description Hook to update a user's last login timestamp with cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateUserLastLogin = useUpdateUserLastLogin();
 * await updateUserLastLogin.mutate(userId);
 */
export function useUpdateUserLastLogin() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdateUserLastLogin", "User ID is required");
        throw new Error("User ID is required");
      }

      const result = await userApiClient.updateUserLastLogin(id);
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useDeleteUser
 * @description Hook to delete a user with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When user ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteUser = useDeleteUser();
 * await deleteUser.mutate(userId);
 */
export function useDeleteUser() {
  const baseHook = useBaseHook("CityArtWalks.Actions.User.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDeleteUser", "User ID is required");
        throw new Error("User ID is required");
      }

      const result = await userApiClient.deleteUser(id);
      return result;
    },
    ["user", "getPaginatedUsers"]
  );
}

/**
 * @memberof CityArtWalks.Actions.User.Hooks
 * @function useUserMutations
 * @description Hook that returns all user mutation functions for convenient access.
 *
 * @returns {Object} Collection of all user mutation functions
 * @returns {Function} result.createUser - Create user mutation function
 * @returns {Function} result.updateUser - Update user mutation function
 * @returns {Function} result.updateUserProfileImage - Update profile image mutation function
 * @returns {Function} result.updateUserCoverImage - Update cover image mutation function
 * @returns {Function} result.updateUserLastLogin - Update last login mutation function
 * @returns {Function} result.deleteUser - Delete user mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createUser, updateUser, deleteUser } = useUserMutations();
 * await createUser.mutate(userData);
 * await updateUser.mutate(userId, updatedData);
 * await deleteUser.mutate(userId);
 */
export function useUserMutations() {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateUserProfileImage = useUpdateUserProfileImage();
  const updateUserCoverImage = useUpdateUserCoverImage();
  const updateUserLastLogin = useUpdateUserLastLogin();
  const deleteUser = useDeleteUser();

  return {
    createUser,
    updateUser,
    updateUserProfileImage,
    updateUserCoverImage,
    updateUserLastLogin,
    deleteUser,
  };
}
