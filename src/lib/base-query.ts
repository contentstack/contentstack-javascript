import { AxiosInstance, getData } from '@contentstack/core';
import { Pagination } from './pagination';
import { FindResponse } from './types';
import { params } from './internal-types';

export class BaseQuery extends Pagination {
  _parameters: params = {}; // Params of query class ?query={}

  protected _client!: AxiosInstance;
  protected _urlPath!: string;

  /**
   * @method includeCount
   * @memberof BaseQuery
   * @description Retrieve count and data of objects in result
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.includeCount().find()
   * // OR
   * const asset = await stack.asset().includeCount().find()
   *
   * @returns {BaseQuery}
   */
  includeCount(): BaseQuery {
    this._queryParams.include_count = 'true';

    return this;
  }

  /**
   * @method orderByAscending
   * @memberof BaseQuery
   * @description Sorts the results in ascending order based on the specified field UID.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.orderByAscending("field_uid").find()
   * // OR
   * const asset = await stack.asset().orderByAscending().find()
   *
   * @returns {BaseQuery}
   */
  orderByAscending(key: string): BaseQuery {
    this._queryParams.asc = key;

    return this;
  }

  /**
   * @method orderByDescending
   * @memberof BaseQuery
   * @description Sorts the results in descending order based on the specified key.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.orderByDescending("field_uid").find()
   * // OR
   * const asset = await stack.asset().orderByDescending().find()
   *
   * @returns {BaseQuery}
   */
  orderByDescending(key: string): BaseQuery {
    this._queryParams.desc = key;

    return this;
  }

  /**
   * @method limit
   * @memberof BaseQuery
   * @description Returns a specific number of entries based on the set limit
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.limit("limit_value").find()
   * // OR
   * const asset = await stack.asset().limit(5).find()
   *
   * @returns {BaseQuery}
   */
  limit(key: number): BaseQuery {
    this._queryParams.limit = key;

    return this;
  }

  /**
   * @method skip
   * @memberof BaseQuery
   * @description Skips at specific number of entries.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.skip("skip_value").find()
   * // OR
   * const asset = await stack.asset().skip(5).find()
   *
   * @returns {BaseQuery}
   */
  skip(key: number): BaseQuery {
    this._queryParams.skip = key;

    return this;
  }



  /**
   * @method param
   * @memberof BaseQuery
   * @description Adds query parameters to the URL.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.param("key", "value").find()
   * // OR
   * const asset = await stack.asset().param("key", "value").find()
   *
   * @returns {BaseQuery}
   */
  param(key: string, value: string | number): BaseQuery {
    this._queryParams[key] = value;

    return this;
  }

  /**
   * @method addParams
   * @memberof BaseQuery
   * @description Adds a query parameter to the query.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.addParams({"key": "value"}).find()
   * // OR
   * const asset = await stack.asset().addParams({"key": "value"}).find()
   *
   * @returns {BaseQuery}
   */
  addParams(paramObj: { [key: string]: string | boolean | number }): BaseQuery {
    this._queryParams = { ...this._queryParams, ...paramObj };

    return this;
  }

  /**
   * @method removeParam
   * @memberof BaseQuery
   * @description Removes a query parameter from the query.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.removeParam("query_param_key").find()
   * // OR
   * const asset = await stack.asset().removeParam("query_param_key").find()
   *
   * @returns {BaseQuery}
   */
  removeParam(key: string): BaseQuery {
    delete this._queryParams[key];

    return this;
  }

  /**
   * @method find
   * @memberof AssetQuery
   * @description The assets of the stack will be fetched
   * @returns {Collection}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().find();
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType("contentType1Uid").entry().query().find();
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset(asset_uid).fetch();
   */

  async find<T>(): Promise<FindResponse<T>> {
    let requestParams: { [key: string]: any } = this._queryParams;
    if (Object.keys(this._parameters)) requestParams = { ...this._queryParams, query: { ...this._parameters } };

    const response = await getData(this._client, this._urlPath, requestParams);

    return response as FindResponse<T>;
  }
}
