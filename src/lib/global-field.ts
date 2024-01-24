import { AxiosInstance, getData } from '@contentstack/core';

export class GlobalField {
  private _client: AxiosInstance;
  private _urlPath: string;
  _queryParams: { [key: string]: string | number } = {};

  constructor(clientConfig: AxiosInstance, globalFieldUid: string) {
    this._client = clientConfig;
    this._urlPath = `/global_fields/${globalFieldUid}`;
  }
  /**
   * @method includeBranch
   * @memberof GlobalField
   * @description Includes the _branch top-level key in the response
   * @returns {GlobalField}
   * @example
   * const stack = contentstack.Stack('apiKey','deliveryToken','environment');
   * const globalField = stack.globalField('global_field_uid');
   * const result = globalField.includeBranch().fetch();
   */
  includeBranch(): GlobalField {
    this._queryParams.include_branch = 'true';

    return this;
  }
  /**
   * @method find
   * @memberof GlobalField
   * @description Fetches comprehensive details of a specific global field
   * @returns {GlobalField}
   * @example
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const globalField = stack.globalField('global_field_uid');
   * const result = globalField.fetch();
   */
  async fetch<T>(): Promise<T> {
    const response = await getData(this._client, this._urlPath, this._queryParams);

    return response.global_field as T;
  }
}