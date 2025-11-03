/**
 * @file requests.js
 * @description EmailApiClient class for Email operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Email.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email} - Email entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * EmailApiClient class for handling Email API operations.
 * Extends ApiClient to provide email-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class EmailApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Email.Requests
 */
export class EmailApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated emails with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.recordType] - Record type filter
   * @param {string} [params.email] - Email address filter
   * @param {string} [params.userId] - User ID filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated emails data
   */
  async getPaginatedEmails({ page = 1, limit = 10, search = '', recordType, email, userId } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(recordType && { recordType }),
      ...(email && { email }),
      ...(userId && { userId }),
    });

    const path = `${endpoints.email.list.path}?${params}`;
    return this.get(path, { revalidate });
  }
}
