import { BaseQuery } from './base-query';

/* eslint-disable @cspell/spellchecker */
export class EntryQueryable extends BaseQuery {
  /**
   * @method only
   * @memberof EntryQueryable
   * @description Selects specific field/fields of an entry
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType("contentTypeUid").entry().only("fieldUID").find()
   *
   * @param {string} fieldUid - field uid to select
   * @returns {EntryQueryable} - returns EntryQueryable object for chaining method calls
   */
  only(fieldUid: string): EntryQueryable {
    this._queryParams['only[BASE][]'] = fieldUid;

    return this;
  }

  /**
   * @method except
   * @memberof EntryQueryable
   * @description Excludes specific field/fields of an entry
   * @example
   * import contentstack from '@contentstack/delivery'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const result = await stack.contentType("contentTypeUid").entry().except("fieldUID").find()
   *
   * @param {string} fieldUid - field uid to exclude
   * @returns {EntryQueryable} - returns EntryQueryable object for chaining method calls
   */
  except(fieldUid: string): EntryQueryable {
    this._queryParams['except[BASE][]'] = fieldUid;

    return this;
  }
}
