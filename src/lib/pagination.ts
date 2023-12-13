import { PaginationObj } from './types';

export class Pagination {
  _queryParams: { [key: string]: string | boolean | number } = {};
  /**
   * @method constructor
   * @memberof Pagination
   * @description Create a pagination class object to paginate through the query response
   * @param {baseQuery} object of class BaseQUery
   * @param {paginationObj} object to send skip and limit values
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   *
   * interface TEntryProps {
   *   uid: string;
   *   title: string;
   *   created_at: string;
   *   _version: number;
   *   locale: string;
   *   created_by: string;
   *   url: string;
   *   // other props
   * }
   * interface TEntries {
   *   entries: TEntryProps[];
   * }
   * const pagedResult = await query.paginate().find<TEntries>();
   * OR
   * const pageObj = await query.paginate({ skip: 10, limit: 20 }).find<TEntries>();
   * @returns {Pagination}
   */
  paginate(paginationObj?: PaginationObj) {
    this._queryParams.skip = paginationObj?.skip || 0;
    this._queryParams.limit = paginationObj?.limit || 10;

    return this;
  }

  /**
   * @method next
   * @memberof Pagination
   * @description Go to next set of response values - skips the current num of responses and shows next responses
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   *
   * interface TEntryProps {
   *   uid: string;
   *   title: string;
   *   created_at: string;
   *   _version: number;
   *   locale: string;
   *   created_by: string;
   *   url: string;
   *   // other props
   * }
   * interface TEntries {
   *   entries: TEntryProps[];
   * }
   * const pagedResult = await query.paginate().find<TEntries>();
   * const nextPageResult = await query.next().find<TEntries>();
   * @returns {Object}
   */
  next() {
    if (!this._queryParams.skip) this.paginate();

    (this._queryParams.skip as number) += this._queryParams.limit as number;

    return this;
  }

  /**
   * @method previous
   * @memberof Pagination
   * @description Go to previous set of response values - skips the current num of responses and shows previous responses
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   *
   * interface TEntryProps {
   *   uid: string;
   *   title: string;
   *   created_at: string;
   *   _version: number;
   *   locale: string;
   *   created_by: string;
   *   url: string;
   *   // other props
   * }
   * interface TEntries {
   *   entries: TEntryProps[];
   * }
   * const pagedResult = await query.paginate().find<TEntries>();
   * const prevPageResult = await query.previous().find<TEntries>();
   * @returns {Pagination}
   */
  previous() {
    if (!this._queryParams.skip) this.paginate();

    const skipVal = (this._queryParams.skip as number) - (this._queryParams.limit as number);
    this._queryParams.skip = skipVal < 0 ? 0 : skipVal;

    return this;
  }
}
