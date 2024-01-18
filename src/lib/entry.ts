import { AxiosInstance, getData } from '@contentstack/core';

interface EntryResponse<T> {
  entry: T;
}
export class Entry {
  private _client: AxiosInstance;
  private _contentTypeUid: string;
  private _entryUid: string;
  private _urlPath: string;
  _queryParams: { [key: string]: string | number } = {};

  constructor(client: AxiosInstance, contentTypeUid: string, entryUid: string) {
    this._client = client;
    this._contentTypeUid = contentTypeUid;
    this._entryUid = entryUid;
    this._urlPath = `/content_types/${this._contentTypeUid}/entries/${this._entryUid}`;
  }

  /**
   * @method includeFallback
   * @memberof Entry
   * @description When an entry is not published in a specific language, content can be fetched from its fallback language
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).includeFallback().fetch();
   */
  includeFallback(): Entry {
    this._queryParams.include_fallback = 'true';

    return this;
  }

  /**
   * @method includeMetadata
   * @memberof Entry
   * @description Include the metadata for getting metadata content for the entry.
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).includeMetadata().fetch();
   */
  includeMetadata(): Entry {
    this._queryParams.include_metadata = 'true';

    return this;
  }

  /**
   * @method includeEmbeddedItems
   * @memberof Entry
   * @description Include Embedded Objects (Entry and Assets) along with entry/entries details.
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).includeEmbeddedItems().fetch();
   */
  includeEmbeddedItems(): Entry {
    this._queryParams['include_embedded_items[]'] = 'BASE';

    return this;
  }

  /**
   * @method includeContentType
   * @memberof Entry
   * @description IInclude the details of the content type along with the entries details
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).includeContentType().fetch();
   */
  includeContentType(): Entry {
    this._queryParams.include_content_type = 'true';

    return this;
  }

  /**
   * @method includeBranch
   * @memberof Entry
   * @description Includes the branch in result
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).includeBranch().fetch();
   */
  includeBranch(): Entry {
    this._queryParams.include_branch = 'true';

    return this;
  }

  /**
   * @method locale
   * @memberof Entry
   * @description The assets published in the locale will be fetched
   * @returns {Entry}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.assetQuery().locale('en-us').fetch();
   */
  locale(locale: string): Entry {
    this._queryParams.locale = locale;

    return this;
  }

  /**
   * @method fetch
   * @memberof Entry
   * @description Fetches the entry data on the basis of the entry uid
   * @returns {Collection}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType(contentType_uid).entry(entry_uid).fetch();
   */
  async fetch<T>(): Promise<T> {
    const response = await getData(this._client, this._urlPath, this._queryParams);

    if (response.entry) return response.entry as T;

    return response;
  }
}
