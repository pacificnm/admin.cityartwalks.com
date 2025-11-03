/**
 * @file requests.js
 * @description EmailTemplateApiClient class for EmailTemplate CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.EmailTemplate.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/EmailTemplate} - EmailTemplate entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * EmailTemplateApiClient class for handling EmailTemplate API operations.
 * Extends ApiClient to provide email template-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class EmailTemplateApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.EmailTemplate.Requests
 */
export class EmailTemplateApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated email templates with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=25] - Results per page limit
   * @param {string} [params.search=''] - Search term across template content
   * @param {string} [params.category] - Template category filter
   * @param {boolean} [params.isActive] - Active status filter
   * @param {string} [params.sortBy=''] - Sort field
   * @param {string} [params.sortOrder='asc'] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated email templates data
   */
  async getEmailTemplates({ page = 1, limit = 25, search = '', category, isActive, sortBy = '', sortOrder = 'asc' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.emailTemplate.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single email template by ID.
   * @param {string|number} id - The email template ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The email template object
   */
  async getEmailTemplate(id, revalidate) {
    const path = endpoints.emailTemplate.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new email template.
   * @param {Object|FormData} data - The email template data
   * @returns {Promise<Object>} The created email template
   */
  async createEmailTemplate(data) {
    const path = endpoints.emailTemplate.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing email template.
   * @param {string|number} id - The email template ID
   * @param {Object|FormData} data - The updated email template data
   * @returns {Promise<Object>} The updated email template
   */
  async updateEmailTemplate(id, data) {
    const path = endpoints.emailTemplate.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an email template.
   * @param {string|number} id - The email template ID
   * @returns {Promise<Object>} The response data
   */
  async deleteEmailTemplate(id) {
    const path = endpoints.emailTemplate.delete.path(id);
    return this.delete(path);
  }

  /**
   * Preview an email template with sample data.
   * @param {string|number} id - The email template ID
   * @param {Object} [sampleData={}] - Sample data for variable substitution
   * @returns {Promise<Object>} Preview with rendered template content
   */
  async previewEmailTemplate(id, sampleData = {}) {
    const path = endpoints.emailTemplate.preview.path(id);
    return this.post(path, {
      body: JSON.stringify({ sampleData }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Send a test email using the template.
   * @param {string|number} id - The email template ID
   * @param {string} testEmail - Email address to send test to
   * @param {Object} [sampleData={}] - Sample data for variable substitution
   * @returns {Promise<Object>} Test email send result
   */
  async sendTestEmail(id, testEmail, sampleData = {}) {
    const path = endpoints.emailTemplate.test.path(id);
    return this.post(path, {
      body: JSON.stringify({ testEmail, sampleData }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
