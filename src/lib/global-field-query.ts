import { BaseQuery } from './base-query';
import { AxiosInstance } from '@contentstack/core';

export class GlobalFieldQuery extends BaseQuery {

  constructor(client: AxiosInstance) {
    super();
    this._client = client;
    this._urlPath = '/global_fields';
  }
  /**
   * @method includeBranch
   * @memberof GlobalFieldQuery
   * @description Includes the _branch top-level key in the response
   * @returns {GlobalFieldQuery}
   * @example
   * const stack = contentstack.Stack('apiKey','deliveryToken','environment');
   * const globalFields = stack.globalFields();
   * const result = globalFields.includeBranch().find();
   */
  includeBranch(): GlobalFieldQuery {
    this._queryParams.include_branch = 'true';

    return this;
  }
}