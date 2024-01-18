import { BaseQuery } from './base-query';
import { AxiosInstance } from '@contentstack/core';

export class AssetQuery extends BaseQuery {
  constructor(client: AxiosInstance) {
    super();
    this._client = client;
    this._urlPath = '/assets';
  }
  /**
   * @method version
   * @memberof AssetQuery
   * @description Retrieve a specific version of an asset in result
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().version(1).find();
   */
  version(version: number): AssetQuery {
    this._queryParams.version = String(version);

    return this;
  }

  /**
   * @method includeDimension
   * @memberof AssetQuery
   * @description Includes the dimensions (height and width) of the image in result
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().includeDimension().find();
   */
  includeDimension(): AssetQuery {
    this._queryParams.include_dimension = 'true';

    return this;
  }

  /**
   * @method includeBranch
   * @memberof AssetQuery
   * @description Includes the branch in result
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().includeBranch().find();
   */
  includeBranch(): AssetQuery {
    this._queryParams.include_branch = 'true';

    return this;
  }

  /**
   * @method includeMetadata
   * @memberof Entries
   * @description Include the metadata for getting metadata content for the entry.
   * @returns {Entries}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().includeMetadata().fetch();
   */
  includeMetadata(): AssetQuery {
    this._queryParams.include_metadata = 'true';

    return this;
  }

  /**
   * @method relativeUrls
   * @memberof AssetQuery
   * @description Includes the relative URLs of the assets in result
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().relativeUrls().find();
   */
  relativeUrls(): AssetQuery {
    this._queryParams.relative_url = 'true';

    return this;
  }

  /**
   * @method includeFallback
   * @memberof AssetQuery
   * @description When an entry is not published in a specific language, content can be fetched from its fallback language
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().includeFallback().find();
   */
  includeFallback(): AssetQuery {
    this._queryParams.include_fallback = 'true';

    return this;
  }

  /**
   * @method locale
   * @memberof AssetQuery
   * @description The assets published in the locale will be fetched
   * @returns {AssetQuery}
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.asset().locale('en-us').find();
   */
  locale(locale: string): AssetQuery {
    this._queryParams.locale = locale;

    return this;
  }
}
