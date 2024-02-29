import { AxiosInstance, getData } from '@contentstack/core';
import { Entry } from './entry';
import { Entries } from './entries';
import { Query } from './query';

interface ContentTypeResponse<T> {
  content_type: T;
}
export class ContentType {
  private _client: AxiosInstance;
  private _contentTypeUid: string;
  private _urlPath: string;

  _queryParams: { [key: string]: string | number } = {};

  constructor(client: AxiosInstance, contentTypeUid: string) {
    this._client = client;
    this._contentTypeUid = contentTypeUid;
    this._urlPath = `/content_types/${this._contentTypeUid}`;
  }

  /**
   * @method Query
   * @memberof ContentType
   * @description queries get all entries that satisfy the condition of the following function
   * @returns {Query}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const entries = stack.contentType("contentTypeUid").Query().containedIn('fieldUid', ['value1','value2'])
   */
  Query(): Query {
    return new Query(this._client, this._contentTypeUid);
  };

  /**
   * @method entry
   * @memberof ContentType
   * @description Creates entry object of the passed entry uid.
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const entry = stack.contentType("contentTypeUid").entry("entryUid");
   */
  Entry(uid: string): Entry;
  Entry(): Entries;
  Entry(uid?: string): Entry | Entries {
    if (uid) return new Entry(this._client, this._contentTypeUid, uid);

    return new Entries(this._client, this._contentTypeUid);
  }

  /**
   * @method fetch
   * @memberof ContentType
   * @description Fetches the contentType data on the basis of the contentType uid
   * @returns {ContentType}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(asset_uid).fetch();
   */
  async fetch<T>(): Promise<T> {
    const response = await getData(this._client, this._urlPath);

    if (response.content_type) return response.content_type as T;

    return response;
  }
}
