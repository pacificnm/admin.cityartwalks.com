/**
 * @file requests.js
 * @description HarvestBatchApiClient class for HarvestBatch operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.HarvestBatch.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/HarvestBatch} - HarvestBatch entity documentation
 */

import { ApiClient } from '@/lib/api-client';

/**
 * HarvestBatchApiClient class for handling HarvestBatch API operations.
 * Extends ApiClient to provide harvest batch-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class HarvestBatchApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.HarvestBatch.Requests
 */
export class HarvestBatchApiClient extends ApiClient {
  constructor() {
    super();
  }

  // TODO: Implement methods when endpoints.harvestBatch is configured
  // - getPaginatedHarvestBatches
  // - getHarvestBatch
  // - createHarvestBatch
  // - updateHarvestBatch
  // - deleteHarvestBatch
}
