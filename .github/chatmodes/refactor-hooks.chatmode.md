# Refactor Hooks Chat Mode

## Objective
Refactor entity hooks to follow the standardized SWR-based pattern with caching and proper error handling. **NO validation in hooks** - validation happens in forms and API clients.

## Pattern Reference
Use `src/actions/user/hooks.js` as the canonical reference implementation.

## Prerequisites
- Entity must have a completed ApiClient class (extending ApiClient from `@/lib/api-client`)
- Understand the entity's data structure and relationships
- Note: Validation schemas exist for forms and API clients, NOT for hooks

## Core Principles

### 1. File Structure
```javascript
/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for {Entity}.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.{Entity}.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/{Entity}} - {Entity} entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { {Entity}ApiClient } from "./requests";

// Create a single instance to use across all hooks
const {entity}ApiClient = new {Entity}ApiClient();
```

### 2. Hook Types Required

#### A. Query Hooks (GET operations)
- `useGetPaginated{Entities}` - Paginated list with filters
- `useGet{Entities}` - Non-paginated list (if applicable)
- `useGet{Entity}` - Single entity by ID
- Additional query hooks based on entity-specific endpoints

#### B. Mutation Hooks (POST/PUT/DELETE operations)
- `useCreate{Entity}` - Create new entity
- `useUpdate{Entity}` - Update existing entity
- `useDelete{Entity}` - Delete entity
- Entity-specific mutation hooks (e.g., `useUpdateUserProfileImage`)

#### C. Convenience Hook
- `use{Entity}Mutations` - Returns all mutation hooks

### 3. Query Hook Pattern

```javascript
/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function useGetPaginated{Entities}
 * @description Hook to get paginated {entities} with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.{entities}Loading - Loading state
 * @returns {Error} result.{entities}Error - Error state
 * @returns {boolean} result.{entities}Validating - Validation state
 * @returns {boolean} result.{entities}Empty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginated{Entities}(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");

  const {
    page = 1,
    limit = 10,
    search = "",
    // Add entity-specific filters here
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getPaginated{Entities}",
      page,
      limit,
      search,
      // Add all filter params
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    // Add all filter params
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await {entity}ApiClient.getPaginated{Entities}(
          { page, limit, search /* filters */ },
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
      {entities}Loading: isLoading,
      {entities}Error: error,
      {entities}Validating: isValidating,
      {entities}Empty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}
```

### 4. Single Entity Query Pattern

```javascript
/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function useGet{Entity}
 * @description Hook to get {entity} by ID with IndexedDB caching.
 *
 * @param {string|number} {entity}Id - The {entity} ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and {entity} data
 * @throws {Error} When {entity}Id is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGet{Entity}({entity}Id, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");

  const { swrKey } = useMemo(() => {
    if (!{entity}Id) return { swrKey: null };
    const key = ["get{Entity}", {entity}Id, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, {entity}Id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await {entity}ApiClient.get{Entity}({entity}Id, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const {entity} = data?.results?.data || null;
    return {
      {entity},
      {entity}Loading: isLoading,
      {entity}Error: error,
      {entity}Validating: isValidating,
      {entity}Empty: !isLoading && !{entity},
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}
```

### 5. Mutation Hook Pattern

```javascript
/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function useCreate{Entity}
 * @description Hook to create a new {entity} with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation ({entity}) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When {entity} data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const create{Entity} = useCreate{Entity}();
 * await create{Entity}.mutate({entity}Data);
 */
export function useCreate{Entity}() {
  const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");

  return baseHook.useMutationWithInvalidation(
    async ({entity}) => {
      const result = await {entity}ApiClient.create{Entity}({entity});
      return result;
    },
    ["{entity}", "getPaginated{Entities}"]
  );
}

/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function useUpdate{Entity}
 * @description Hook to update an existing {entity} with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, {entity}Data) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When {entity} ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const update{Entity} = useUpdate{Entity}();
 * await update{Entity}.mutate({entity}Id, updated{Entity}Data);
 */
export function useUpdate{Entity}() {
  const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id, {entity}) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useUpdate{Entity}", "{Entity} ID is required");
        throw new Error("{Entity} ID is required");
      }

      const result = await {entity}ApiClient.update{Entity}(id, {entity});
      return result;
    },
    ["{entity}", "getPaginated{Entities}"]
  );
}

/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function useDelete{Entity}
 * @description Hook to delete a {entity} with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When {entity} ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const delete{Entity} = useDelete{Entity}();
 * await delete{Entity}.mutate({entity}Id);
 */
export function useDelete{Entity}() {
  const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error("useDelete{Entity}", "{Entity} ID is required");
        throw new Error("{Entity} ID is required");
      }

      const result = await {entity}ApiClient.delete{Entity}(id);
      return result;
    },
    ["{entity}", "getPaginated{Entities}"]
  );
}
```

### 6. Mutations Collection Hook

```javascript
/**
 * @memberof CityArtWalks.Actions.{Entity}.Hooks
 * @function use{Entity}Mutations
 * @description Hook that returns all {entity} mutation functions for convenient access.
 *
 * @returns {Object} Collection of all {entity} mutation functions
 * @returns {Function} result.create{Entity} - Create {entity} mutation function
 * @returns {Function} result.update{Entity} - Update {entity} mutation function
 * @returns {Function} result.delete{Entity} - Delete {entity} mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { create{Entity}, update{Entity}, delete{Entity} } = use{Entity}Mutations();
 * await create{Entity}.mutate({entity}Data);
 * await update{Entity}.mutate({entity}Id, updatedData);
 * await delete{Entity}.mutate({entity}Id);
 */
export function use{Entity}Mutations() {
  const create{Entity} = useCreate{Entity}();
  const update{Entity} = useUpdate{Entity}();
  const delete{Entity} = useDelete{Entity}();

  return {
    create{Entity},
    update{Entity},
    delete{Entity},
  };
}
```

## Critical Rules

### 1. Imports
- **ALWAYS** import `useMemo` and `useEffect` from React
- **ALWAYS** import `useBaseHook` from `src/lib/base-hook`
- **ALWAYS** import ApiClient from `./requests`
- **NEVER** import validation schemas (validation happens in forms, not hooks)
- **NEVER** import debug utilities, axios, or manual fetch

### 2. ApiClient Instance
- **ALWAYS** create a single instance outside hooks: `const {entity}ApiClient = new {Entity}ApiClient();`
- **NEVER** create new instances inside hooks

### 3. Base Hook Usage
- **ALWAYS** initialize with: `const baseHook = useBaseHook("CityArtWalks.Actions.{Entity}.Hooks");`
- **ALWAYS** use `baseHook.useSWRWithCache` for queries
- **ALWAYS** use `baseHook.useMutationWithInvalidation` for mutations
- **NEVER** use `baseHook.validators.validateWithSchema` (validation = forms + API clients)
- **ALWAYS** use `baseHook.logger.error` for error logging
- **ALWAYS** use `baseHook.utils.generateKeys` for SWR keys

### 4. SWR Key Generation
- **ALWAYS** wrap key generation in `useMemo`
- **ALWAYS** include all filter parameters in the key array
- **ALWAYS** include `revalidate` parameter in the key
- **ALWAYS** use `baseHook.utils.generateKeys(key)` to generate swrKey
- **NEVER** manually construct cache keys

### 5. Validation
- **NEVER** validate in hooks - validation happens in forms and API clients
- **NEVER** import or use Zod schemas in hooks
- **NEVER** use `baseHook.validators.validateWithSchema` in hooks
- **ONLY** validate that required IDs exist (simple null/undefined checks)
- Form validation: React Hook Form + Zod schemas in form components
- API validation: API clients handle server-side validation

### 6. Return Values
- **Query Hooks MUST return:**
  - `results` - Complete API response (for paginated queries)
  - `{entity}` or `{entities}` - The actual data
  - `{entity}Loading` or `{entities}Loading` - Loading state
  - `{entity}Error` or `{entities}Error` - Error state
  - `{entity}Validating` or `{entities}Validating` - Validation state
  - `{entity}Empty` or `{entities}Empty` - Empty state check
  - `mutate` - SWR mutate function

- **Mutation Hooks MUST return:**
  - From `baseHook.useMutationWithInvalidation` (includes: `mutate`, `loading`, `error`, `data`)

### 7. Cache Invalidation
- **ALWAYS** specify cache keys to invalidate in mutation hooks
- **MINIMUM**: `["{entity}", "getPaginated{Entities}"]`
- **ADD** related entity keys if applicable (e.g., artist mutations invalidate artPiece cache)

### 8. Naming Conventions
- Hook names: `useGet{Entity}`, `useCreate{Entity}`, `useUpdate{Entity}`, `useDelete{Entity}`
- Variable names: `{entity}Loading`, `{entities}Error`, `{entity}Validating`, `{entity}Empty`
- API client: `{entity}ApiClient` (instance), `{Entity}ApiClient` (class)
- Parameter names: `{entity}Id` for IDs, `{entity}` or `{entity}Data` for data objects

### 9. RefreshKey Pattern
- **ALWAYS** add `refreshKey` parameter to paginated query hooks
- **ALWAYS** implement: `useEffect(() => { if (refreshKey) mutate(); }, [refreshKey, mutate]);`
- **NEVER** use manual refresh without proper dependency tracking

### 10. Revalidate Parameter
- **DEFAULT**: 600 seconds (10 minutes)
- **ALWAYS** pass through to ApiClient methods
- **ALWAYS** include in SWR key generation
- **NEVER** hardcode different values without justification

### 11. Error Handling
- **ALWAYS** use `baseHook.logger.error` for logging
- **ALWAYS** throw errors in mutation hooks for missing required IDs
- **ALWAYS** include context in error logs (what failed, why)
- **NEVER** use console.log or debugLog
- **NEVER** throw validation errors (validation happens in forms/API)

### 12. FormData Handling
- **NEVER** detect or check for FormData in hooks
- **NEVER** validate FormData (or any data) in hooks
- API clients handle FormData vs JSON automatically
- Hooks simply pass data through to API client methods

## Entity-Specific Adaptations

### Adding Custom Query Hooks
For entity-specific queries (e.g., `getUserByEmail`, `getArtPiecesByArtist`):
1. Follow the same pattern as `useGetUser`
2. Validate input parameters
3. Generate unique SWR key including all parameters
4. Use `baseHook.useSWRWithCache`
5. Return consistent result structure

### Adding Custom Mutation Hooks
For entity-specific mutations (e.g., `useUpdateUserProfileImage`):
1. Follow the same pattern as `useUpdateUser`
2. Validate all required parameters
3. Use `baseHook.useMutationWithInvalidation`
4. Specify appropriate cache keys to invalidate
5. Include proper error messages

## Verification Checklist

Before considering a hooks file complete:

- [ ] All imports are correct (React, useBaseHook, ApiClient)
- [ ] NO validation schema imports present
- [ ] Single ApiClient instance created outside hooks
- [ ] All query hooks use `baseHook.useSWRWithCache`
- [ ] All mutation hooks use `baseHook.useMutationWithInvalidation`
- [ ] SWR keys properly generated with `useMemo` and `generateKeys`
- [ ] NO validation code in hooks (no validateWithSchema calls)
- [ ] Only simple null/undefined checks for required IDs
- [ ] Return values follow naming conventions
- [ ] Cache invalidation specified for all mutations
- [ ] RefreshKey pattern implemented for paginated queries
- [ ] Error logging uses `baseHook.logger.error`
- [ ] JSDoc documentation complete for all hooks
- [ ] `use{Entity}Mutations` convenience hook provided
- [ ] File compiles without errors (`get_errors` returns clean)

## Refactoring Process

1. **Read the existing hooks file** to understand current implementation
2. **Verify ApiClient exists** and all methods are available
3. **Replace file header** with standard format
4. **Add proper imports** (React, useBaseHook, ApiClient) - NO validators
5. **Create ApiClient instance** outside hooks
6. **Implement query hooks** following patterns above (NO validation code)
7. **Implement mutation hooks** following patterns above (NO validation code)
8. **Add mutations collection hook**
9. **Verify NO validation code** - no schema imports, no validateWithSchema calls
10. **Verify with get_errors** - must return "No errors found"
11. **Update todo list** to mark entity complete

## Example Command Flow

When user says "Refactor this hook":
1. Read current hooks file
2. Verify ApiClient exists and has all required methods
3. Replace entire file following patterns (NO validation code)
4. Verify NO validation imports or code present
5. Verify compilation with `get_errors`
6. Confirm success to user

## Common Pitfalls to Avoid

- ❌ Adding validation to hooks (validation = forms + API clients)
- ❌ Importing Zod schemas into hooks files
- ❌ Using `baseHook.validators.validateWithSchema` in hooks
- ❌ Creating ApiClient instances inside hooks
- ❌ Missing `useMemo` wrappers on key generation
- ❌ Inconsistent naming conventions
- ❌ Missing cache invalidation on mutations
- ❌ Using console.log instead of baseHook.logger
- ❌ Missing refreshKey pattern on paginated queries
- ❌ Not including all parameters in SWR keys
- ❌ Incomplete JSDoc documentation
- ❌ Missing `use{Entity}Mutations` convenience hook

## Success Criteria

A hooks file is successfully refactored when:
1. ✅ Follows User hooks pattern exactly
2. ✅ All hooks use baseHook utilities
3. ✅ NO validation code in hooks
4. ✅ NO Zod schema imports
5. ✅ Cache management proper
6. ✅ Error handling consistent
7. ✅ get_errors returns "No errors found"
8. ✅ All JSDoc complete
8. ✅ Naming conventions followed
