import { AxiosInstance, getData } from '@contentstack/core';

export class Asset {
  private _client: AxiosInstance;
  private _urlPath: string;
  _queryParams: { [key: string]: string | number } = {};

  constructor(client: AxiosInstance, assetUid: string) {
    this._client = client;
    this._urlPath = `/assets/${assetUid}`;
  }

  /**
   * @method includeFallback
   * @memberof Asset
   * @description When an entry is not published in a specific language, content can be fetched from its fallback language
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').includeFallback().fetch();
   */
  includeFallback(): Asset {
    this._queryParams.include_fallback = 'true';

    return this;
  }

  /**
   * @method includeMetadata
   * @memberof Entries
   * @description Include the metadata for getting metadata content for the entry.
   * @returns {Entries}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').includeMetadata().fetch();
   */
  includeMetadata(): Asset {
    this._queryParams.include_metadata = 'true';

    return this;
  }

  /**
   * @method includeDimension
   * @memberof Asset
   * @description Includes the dimensions (height and width) of the image in result
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').includeDimension().fetch();
   */
  includeDimension(): Asset {
    this._queryParams.include_dimension = 'true';

    return this;
  }

  /**
   * @method includeBranch
   * @memberof Asset
   * @description Includes the branch in result
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').includeBranch().fetch();
   */
  includeBranch(): Asset {
    this._queryParams.include_branch = 'true';

    return this;
  }

  /**
   * @method relativeUrls
   * @memberof Asset
   * @description Includes the relative URLs of the asset in result
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').relativeUrls().fetch();
   */
  relativeUrls(): Asset {
    this._queryParams.relative_urls = 'true';

    return this;
  }

  /**
   * @method version
   * @memberof Asset
   * @description Retrieve a specific version of an asset in result
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').version(1).fetch();
   */
  version(version: number): Asset {
    this._queryParams.version = String(version);

    return this;
  }

  /**
   * @method locale
   * @memberof Asset
   * @description The assets published in the locale will be fetched
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').locale('en-us').fetch();
   */
  locale(locale: string): Asset {
    this._queryParams.locale = locale;

    return this;
  }

  /**
   * @method fetch
   * @memberof Asset
   * @description Fetches the asset data on the basis of the asset uid
   * @returns {Asset}
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset('asset_uid').fetch();
   */
  async fetch<T>(): Promise<T> {
    const response = await getData(this._client, this._urlPath, this._queryParams);

    if (response.asset) return response.asset as T;

    return response;
  }
}
