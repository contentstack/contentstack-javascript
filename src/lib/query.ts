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
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.where("field_UID", QueryOperation.IS_LESS_THAN, ["field1", "field2"]).find()
   * // OR
   * const asset = await stack.asset().where("field_UID", QueryOperation.IS_LESS_THAN, ["field1", "field2"]).find()
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
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
   * import contentstack from '@contentstack/delivery-sdk'
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
   * import contentstack from '@contentstack/delivery-sdk'
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

  /**
   * @method containedIn
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.containedIn('fieldUid', ['value1', 'value2']).find()
   * 
   * @returns {Query}
   */
  containedIn(key: string, value: (string | number | boolean)[]): Query {
    this._parameters[key] = { '$in': value };
    return this;
  }

  /**
   * @method NoContainedIn
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.notContainedIn('fieldUid', ['value1', 'value2']).find()
   * 
   * @returns {Query}
   */
  notContainedIn(key: string, value: (string | number | boolean)[]): Query {
    this._parameters[key] = { '$nin': value };
    return this;
  }

  /**
   * @method notExists
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType("contentTypeUid").entry().query();
   * const result = await query.notExists('fieldUid').find()
   * 
   * @returns {Query}
   */
  notExists(key: string): Query {
    this._parameters[key] = { '$exists': false };
    return this;
  }

  /**
   * @method or
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query1 = stack.contentType('contenttype_uid').Entry().query().containedIn('fieldUID', ['value']);
   * const query2 = stack.contentType('contenttype_uid').Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');
   * const query = await stack.contentType('contenttype_uid').Entry().query().or(query1, query2).find();
   *  
   * @returns {Query}
   */
  or(...queries: Query[]): Query {
    const paramsList: BaseQueryParameters[] = [];
    for (const queryItem of queries) {
      paramsList.push(queryItem._parameters);
    }
    this._parameters.$or = paramsList;
    return this;
  }

  /**
   * @method and
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query1 = stack.contentType('contenttype_uid').Entry().query().containedIn('fieldUID', ['value']);
   * const query2 = stack.contentType('contenttype_uid').Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');
   * const query = await stack.contentType('contenttype_uid').Entry().query().and(query1, query2).find();
   *  
   * @returns {Query}
   */
  and(...queries: Query[]): Query {
    const paramsList: BaseQueryParameters[] = [];
    for (const queryItem of queries) {
      paramsList.push(queryItem._parameters);
    }
    this._parameters.$and = paramsList;
    return this;
  }

  /**
   * @method equalTo
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = await stack.contentType('contenttype_uid').Entry().query().equalTo('fieldUid', 'value').find();
   *  
   * @returns {Query}
   */
  equalTo(key: string, value: string | number | boolean): Query {
    this._parameters[key] = value;
    return this;
  }

  /**
   * @method equalTo
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
   * const entryQuery = await stack.contentType('contenttype_uid').query().referenceIn('reference_uid', query).find<TEntry>();
   *  
   * @returns {Query}
   */
  referenceIn(key: string, query: Query) {
    this._parameters[key] = { '$in_query': query._parameters }
    return this;
  }

  /**
   * @method referenceNotIn
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
   * const entryQuery = await stack.contentType('contenttype_uid').query().referenceNotIn('reference_uid', query).find<TEntry>();
   *  
   * @returns {Query}
   */
  referenceNotIn(key: string, query: Query) {
    this._parameters[key] = { '$nin_query': query._parameters }
    return this;
  }

  /**
   * @method tags
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
   * const entryQuery = await stack.contentType('contenttype_uid').query().tags(['tag1']).find<TEntry>();
   *  
   * @returns {Query}
   */
  tags(values: (string | number | boolean)[]): Query {
    this._parameters['tags'] = values;
    return this;
  }

  /**
   * @method afterUid
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType('contenttype_uid').query().afterUid('entryUid');
   *  
   * @returns {Query}
   */
  afterUid(key: string): Query {
    this._parameters['after_uid'] = key;
    return this;
  }

  /**
   * @method beforeUid
   * @memberof Query
   * @description Returns the raw (JSON) query based on the filters applied on Query object.
   * @example
   * import contentstack from '@contentstack/delivery-sdk'
   *
   * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
   * const query = stack.contentType('contenttype_uid').query().beforeUid('entryUid');
   *  
   * @returns {Query}
   */
  beforeUid(key: string): Query {
    this._parameters['before_uid'] = key;
    return this;
  }
}
