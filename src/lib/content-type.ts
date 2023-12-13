import { AxiosInstance, getData } from '@contentstack/core';
import { Entry } from './entry';
import { Entries } from './entries';

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
   * @method entry
   * @memberof ContentType
   * @description Creates entry object of the passed entry uid.
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/typescript'
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
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(asset_uid).fetch();
   */
  async fetch<T>(): Promise<ContentTypeResponse<T>> {
    const response = await getData(this._client, this._urlPath);

    return response as ContentTypeResponse<T>;
  }
}
