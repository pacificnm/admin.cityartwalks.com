/**
 * @file requests.js
 * @description ContactApiClient class for Contact CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Contact.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact} - Contact entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ContactApiClient class for handling Contact API operations.
 * Extends ApiClient to provide contact-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ContactApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Contact.Requests
 */
export class ContactApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated contacts with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.name] - Name filter
   * @param {string} [params.email] - Email filter
   * @param {string} [params.subject] - Subject filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated contacts data
   */
  async getPaginatedContacts({ page = 1, limit = 10, search = '', name, email, subject } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(name && { name }),
      ...(email && { email }),
      ...(subject && { subject }),
    });

    const path = `${endpoints.contact.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single contact by ID.
   * @param {string|number} id - The contact ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The contact object
   */
  async getContactById(id, revalidate) {
    const path = endpoints.contact.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new contact.
   * @param {Object|FormData} data - The contact data
   * @returns {Promise<Object>} The created contact
   */
  async createContact(data) {
    const path = endpoints.contact.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing contact.
   * @param {string|number} id - The contact ID
   * @param {Object|FormData} data - The updated contact data
   * @returns {Promise<Object>} The updated contact
   */
  async updateContact(id, data) {
    const path = endpoints.contact.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a contact.
   * @param {string|number} id - The contact ID
   * @returns {Promise<Object>} The response data
   */
  async deleteContact(id) {
    const path = endpoints.contact.delete.path(id);
    return this.delete(path);
  }
}
