import { AxiosInstance } from '@contentstack/core';
import { BaseQuery } from './base-query';
import { BaseQueryParameters, QueryOperation, QueryOperator, TaxonomyQueryOperation } from './types';
export class Query extends BaseQuery {
  private _contentTypeUid?: string;

  constructor(client: AxiosInstance, uid: string, queryObj?: { [key: string]: any }) {
    super();
    this._client = client;
    this._contentTypeUid = uid;
    this._urlPath = `/content_types/${this._contentTypeUid}/entries`;

    if (queryObj) {
      this._parameters = { ...this._parameters, ...queryObj };
    }
  }

  /**
   * @method where
   * @memberof Query
   * @description Filters the results based on the specified criteria.
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.where("field_UID", QueryOperation.IS_LESS_THAN, ["field1", "field2"]).find()
   * // OR
   * const asset = await stack.asset().where("field_UID", QueryOperation.IS_LESS_THAN, ["field1", "field2"]).find()
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.where("field_UID", QueryOperation.MATCHES, ["field1", "field2"]).find()
   * @returns {Query}
   */
  where(
    fieldUid: string, 
    queryOperation: QueryOperation | TaxonomyQueryOperation, 
    fields: string | string[] | number | number[] | object | boolean,
    additionalData?: object
  ): Query {
    if (queryOperation == QueryOperation.EQUALS) {
      this._parameters[fieldUid] = fields;
    } else {
      const parameterValue: { [key in QueryOperation]?: string | string[] } = { [queryOperation]: fields, ...additionalData };
      this._parameters[fieldUid] = parameterValue;
    }

    return this;
  }

  /**
   * @method regex
   * @memberof Query
   * @description Retrieve entries that match the provided regular expressions
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.regex('title','^Demo').find()
   * // OR
   * const result = await query..regex('title','^Demo', 'i').find() // regex with options
   * @returns {Query}
   */
  regex(fieldUid: string, regexPattern: string, options?: string): Query {
    this._parameters[fieldUid] = { $regex: regexPattern };

    if (options) this._parameters[fieldUid].$options = options;

    return this;
  }

  /**
   * @method whereIn
   * @memberof Query
   * @description Get entries having values based on referenced fields.
   * The query retrieves all entries that satisfy the query conditions made on referenced fields
   * This method sets the '$in_query' parameter to a reference field UID and a query instance in the API request.
   * @example
   * const stack = contentstack.Stack("apiKey", "deliveryKey", "environment");
   * const query = stack.contentType("contentTypeUid").entry().query();
   * query.whereIn("brand")
   * const res = await query.find()
   *
   * @param {string} referenceUid - UID of the reference field to query.
   * @param {Query} queryInstance - The Query instance to include in the where clause.
   * @returns {Query} - Returns the Query instance for chaining.
   */
  whereIn(referenceUid: string, queryInstance: Query): Query {
    // eslint-disable-next-line @typescript-eslint/naming-convention, prettier/prettier
    this._parameters[referenceUid] = { '$in_query': queryInstance._parameters };

    return this;
  }

  /**
   * @method whereNotIn
   * @memberof Query
   * @description Get entries having values based on referenced fields.
   * This query works the opposite of $in_query and retrieves all entries that does not satisfy query conditions made on referenced fields.
   * This method sets the '$nin_query' parameter to a reference field UID and a query instance in the API request.
   * @example
   * const stack = contentstack.Stack("apiKey", "deliveryKey", "environment");
   * const query = stack.contentType("contentTypeUid").entry().query();
   * query.whereNotIn("brand")
   * const res = await query.find()
   *
   * @param {string} referenceUid - UID of the reference field to query.
   * @param {Query} queryInstance - The Query instance to include in the where clause.
   * @returns {Query} - Returns the Query instance for chaining.
   */
  whereNotIn(referenceUid: string, queryInstance: Query): Query {
    // eslint-disable-next-line @typescript-eslint/naming-convention, prettier/prettier
    this._parameters[referenceUid] = { '$nin_query': queryInstance._parameters };

    return this;
  }

  /**
   * @method queryOperator
   * @memberof Query
   * @description In case of '$and' get entries that satisfy all the conditions provided in the '$and' query and
   * in case of '$or' query get all entries that satisfy at least one of the given conditions provided in the '$or' query.
   * @example
   * const stack = contentstack.Stack("apiKey", "deliveryKey", "environment");
   * const query = stack.contentType("contentType1Uid").entry().query();
   * const subQuery1 = stack.contentType("contentType2Uid").query().where("price", QueryOperation.IS_LESS_THAN, fields=90);
   * const subQuery2 = stack.contentType("contentType3Uid").query().where("discount", QueryOperation.INCLUDES, fields=[20, 45]);
   * query.queryOperator(QueryOperator.AND, subQuery1, subQuery2)
   * const res = await query.find()
   *
   * @param {QueryOperator} queryType - The type of query operator to apply.
   * @param {...Query[]} queryObjects - The Query instances to apply the query to.
   * @returns {Query} - Returns the Query instance for chaining.
   */
  queryOperator(queryType: QueryOperator, ...queryObjects: Query[]): Query {
    const paramsList: BaseQueryParameters[] = [];
    for (const queryItem of queryObjects) {
      paramsList.push(queryItem._parameters);
    }
    this._parameters[queryType] = paramsList;

    return this;
  }

  /**
   * @method getQuery
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/typescript'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.query({'brand': {'$nin_query': {'title': 'Apple Inc.'}}}).getQuery()
   * // OR
   * const asset = await stack.asset().query({'brand': {'$nin_query': {'title': 'Apple Inc.'}}}).getQuery()
   *
   * @returns {Query}
   */
  getQuery(): { [key: string]: any } {
    return this._parameters;
  }
}
