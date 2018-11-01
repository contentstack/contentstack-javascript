import Request from '../lib/request';
import * as Utils from '../lib/utils.js';
import Entry from './entry';

const _extend = {
    compare: function(type) {
        return function(key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this._query['query'][key] = this._query['query']['file_size'] || {};
                this._query['query'][key][type] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    contained: function(bool) {
        let type = (bool) ? '$in' : '$nin';
        return function(key, value) {
            if (key && value && typeof key === 'string' && Array.isArray(value)) {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key][type] = this._query['query'][key][type] || [];
                this._query['query'][key][type] = this._query['query'][key][type].concat(value);
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    exists: function(bool) {
        return function(key) {
            if (key && typeof key === 'string') {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key]['$exists'] = bool;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    logical: function(type) {
        return function() {
            let _query = [];
            for (let i = 0, _i = arguments.length; i < _i; i++) {
                if (arguments[i] instanceof Query && arguments[i]._query.query) {
                    _query.push(arguments[i]._query.query);
                } else if (typeof arguments[i] === "object") {
                    _query.push(arguments[i]);
                }
            }
            if (this._query['query'][type]) {
                this._query['query'][type] = this._query['query'][type].concat(_query);
            } else {
                this._query['query'][type] = _query;
            }
            return this;
        };
    },
    sort: function(type) {
        return function(key) {
            if (key && typeof key === 'string') {
                this._query[type] = key;
                return this;
            } else {
                console.error("Argument should be a string.");
            }
        };
    },
    pagination: function(type) {
        return function(value) {
            if (typeof value === 'number') {
                this._query[type] = value;
                return this;
            } else {
                console.error("Argument should be a number.");
            }
        }
    }
};

/**
 * @summary
 * Creates an instance of `Query`.
 * @description
 * An initializer is responsible for creating Query object.
 * @example
 * <caption>Query instance creation.</caption>
 * let Query = Contentstack.Stack().ContentType('example').Query();
 * let assetQuery =  Contentstack.Stack().Assets().Query();
 * @ignore
 */
export default class Query extends Entry {

    constructor() {
        super();
        this._query = this._query || {};
        this._query['query'] = this._query['query'] || {};
         /**
         * @method lessThan
         * @description Retrieves entries in which the value of a field is lesser than the provided value
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.lessThan('created_at','2015-06-22').find()
         *          data.then(function (result) {
         *          // result content the data who's created_at date is less than '2015-06-22'
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.lessThan = _extend.compare('$lt');

         /**
         * @method lessThanOrEqualTo
         * @description Retrieves entries in which the value of a field is lesser than or equal to the provided value.
         * @param {String} key - uid of the field
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.lessThanOrEqualTo('created_at','2015-06-22').find()
         *          data.then(function (result) {
         *          // result contain the data of entries where the created_at date will be less than or equalto '2015-06-22'.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.lessThanOrEqualTo = _extend.compare('$lte');
         /**
         * @method greaterThan
         * @description Retrieves entries in which the value for a field is greater than the provided value.
         * @param {String} key - uid of the field
         * @param {*} value -  value used to match or compare.
         * @example 
         *          let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.greaterThan('created_at','2015-03-12').find()
         *                     data.then(function(result) {
         *                       // result contains the data of entries where the created_at date will be greaterthan '2015-06-22'
         *                     },function (error) {
         *                       // error function
         *                     })
         * @returns {Query}
         */
        this.greaterThan = _extend.compare('$gt');

        /**
         * @method greaterThanOrEqualTo
         * @description Retrieves entries in which the value for a field is greater than or equal to the provided value.
         * @param {String} key - uid of the field 
         * @param {*} value - Value used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.greaterThanOrEqualTo('created_at','2015-03-12').find()
         *          data.then(function(result) {
         *          // result contains the data of entries where the created_at date will be greaterThan or equalto '2015-06-22'
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.greaterThanOrEqualTo = _extend.compare('$gte');

        /**
         * @method notEqualTo
         * @description Retrieves entries in which the value for a field does not match the provided value.
         * @param {String} key - uid of the field 
         * @param {*} value - Value used to match or compare
         * @example blogQuery.notEqualTo('title','Demo')
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.notEqualTo('title','Demo').find()
         *          data.then(function(result) {
         *            // ‘result’ contains the list of entries where value of the ‘title’ field will not be 'Demo'.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.notEqualTo = _extend.compare('$ne');

        /**
         * @method containedIn
         * @description Retrieve entries in which the value of a field matches with any of the provided array of values
         * @param {String} key - uid of the field
         * @param {*} value - Array of values that are to be used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.containedIn('title', ['Demo', 'Welcome']).find()
         *          data.then(function(result) {
         *          // ‘result’ contains the list of entries where value of the ‘title’ field will contain either 'Demo' or ‘Welcome’.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.containedIn = _extend.contained(true);

       /**
         * @method notContainedIn
         * @description Retrieve entries in which the value of a field does not match with any of the provided array of values.
         * @param {String} key - uid of the field
         * @param {Array} value - Array of values that are to be used to match or compare
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.notContainedIn('title', ['Demo', 'Welcome']).find()
         *          data.then(function(result) {
         *          // result contains the list of entries where value of the title field should not be either "Demo" or ‘Welcome’
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.notContainedIn = _extend.contained(false);

         /**
         * @method exists
         * @description Retrieve entries if value of the field, mentioned in the condition, exists.
         * @param {String} key - uid of the field
         * @example blogQuery.exists('featured')
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.exists('featured').find()
         *          data.then(function(result) {
         *          // ‘result’ contains the list of entries in which "featured" exists.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.exists = _extend.exists(true);

         /**
         * @method notExists
         * @description Retrieve entries if value of the field, mentioned in the condition, does not exists.
         * @param {String} key - uid of the field
         * @example blogQuery.notExists('featured')
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.notExists('featured').find()
         *          data.then(function(result) {
         *        // result is the list of non-existing’featured’" data.
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.notExists = _extend.exists(false);

         /**
         * @method ascending
         * @description Sort fetched entries in the ascending order with respect to a specific field.
         * @param {String} key - uid of the field
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.ascending('created_at').find()
         *          data.then(function(result) {
         *           // ‘result’ contains the list of entries which is sorted in ascending order on the basis of ‘created_at’. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.ascending = _extend.sort('asc');

        /**
         * @method descending
         * @description Sort fetched entries in the descending order with respect to a specific field
         * @param {String} key - field uid based on which the ordering will be done.
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.descending('created_at').find()
         *          data.then(function(result) {
         *           // ‘result’ contains the list of entries which is sorted in descending order on the basis of ‘created_at’. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.descending = _extend.sort('desc');

         /**
         * @method beforeUid
         * @description Sort fetched entries in the descending order with respect to a specific field
         * @param {String} uid - field uid based on which the ordering will be done.
         * @example blogQuery.beforeUid('blt1234567890abcdef')
         * @returns {Query}
         * @ignore
         */
        this.beforeUid = _extend.sort('before_uid');

        /**
         * @method afterUid
         * @description This method provides only the entries after the specified entry id.
         * @param {String} uid - uid of the entry
         * @example blogQuery.afterUid('blt1234567890abcdef')
         * @returns {Query}
         * @ignore
         */
        this.afterUid = _extend.sort('after_uid');

         /**
         * @method skip
         * @description Skips at specific number of entries.
         * @param {Number} skip - number of entries to be skipped
         * @example blogQuery.skip(5)
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.skip(5).find()
         *          data.then(function(result) {
         *          // result contains the list of data which is sorted in descending order on created_at bases. 
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.skip = _extend.pagination('skip');

         /**
         * @method limit
         * @description Returns a specific number of entries based on the set limit
         * @param {Number} limit - maximum number of entries to be returned
         * @example let blogQuery = Stack().ContentType('example').Query();
         *          let data = blogQuery.limit(10).find()
         *          data.then(function(result) {
         *          // result contains the limited number of entries
         *       },function (error) {
         *          // error function
         *      })
         * @returns {Query}
         */
        this.limit = _extend.pagination('limit');

         /**
         * @method or
         * @description Retrieves entries that satisfy at least one of the given conditions
         * @param {object} queries - array of Query objects or raw queries
         * @example
         * <caption> .or with Query instances</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').find()
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).find()
         * blogQuery.or(Query1, Query2)
         * @example
         * <caption> .or with raw queries</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.or(Query1, Query2)
         * @returns {Query}
         */
        this.or = _extend.logical('$or');

        /**
         * @method and
         * @description Retrieve entries that satisfy all the provided conditions.
         * @param {object} queries - array of query objects or raw queries.
         * @example
         * <caption> .and with Query instances</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * let Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * let Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         */
        this.and = _extend.logical('$and');
    }

   
    equalTo(key, value) {
        if (key && typeof key === 'string') {
            this._query['query'][key] = value;

            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method where()
     * @description Retrieve entries in which a specific field satisfies the value provided
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.where('title','Demo').find()
     *          data.then(function(result) {
     *            // ‘result’ contains the list of entries where value of ‘title’ is equal to ‘Demo’. 
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */

    where(key, value) {
        if (key && typeof key === 'string') {
            this._query['query'][key] = value;
            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method count
     * @description Returns the total number of entries
     * @example blogQuery.count()
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.count().find()
     *          data.then(function(result) {
     *           // ‘result’ contains the total count. 
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    count() {
        const host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
            url = (this.type && this.type === 'asset') ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
        this._query['count'] = true;
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: url,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return this;
    }

    /**
     * @method query
     * @description Retrieve entries based on raw queries
     * @param {object} query - RAW (JSON) queries 
     * @returns {Query}
     */
    query(query) {
        if (typeof query === "object") {
            this._query['query'] = Utils.mergeDeep(this._query['query'], query);
            return this;
        } else {
            console.error("Kindly provide valid parameters");
        }
    }

    /**
     * @method tags
     * @description Retrieves entries based on the provided tags
     * @param {Array} values - tags
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.tags(['technology', 'business']).find()
     *          data.then(function(result) {
     *        // ‘result’ contains list of entries which have tags "’technology’" and ‘"business’".
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    tags(values) {
        if (Array.isArray(values)) {
            this._query['tags'] = values;
            return this;
        } else {
            console.error("Kindly provide valid parameters");
        }
    }

    /**
     * @method includeCount
     * @description Includes the total number of entries returned in the response.
     * @example blogQuery.includeCount()
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.includeCount().find()
     *          data.then(function(result) {
     *         // ‘result’ contains a list of entries in which count of object is present at array[1] position. 
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    includeCount() {
        this._query['include_count'] = true;
        return this;
    }

    /**
     * @method AddParam
     * @description Retrieves entries based on the query provided
     * @example blogQuery.addParam('include_count', 'true')
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.addParam('include_count', 'true').find()
     *          data.then(function(result) {
     *         // ‘result’ contains the count of object present in array[1] position. 
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    addParam(key, value) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
                this._query[key] = value;
                return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method getQuery
     * @description Returns the raw (JSON) query based on the filters applied on Query object.
     * @example Stack.ContentType('contentType_uid').Query().where('title','Demo').getQuery().find()
     * @returns {Query}
     */
    getQuery() {
        return this._query.query || {};
    }

    /**
     * @method regex
     * @description Retrieve entries that match the provided regular expressions
     * @param {String} key - uid of the field
     * @param {*} value - value used to match or compare
     * @param {String} [options] - match or compare value in entry
     * @example
     * <caption> .regex without options</caption>
     * blogQuery.regex('title','^Demo')
     * @example
     * <caption> .regex with options</caption>
     * blogQuery.regex('title','^Demo', 'i')
     * @returns {Query}
     */
    regex(key, value, options) {
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query['query'][key] = {
                $regex: value
            };
            if (options) this._query['query'][key]['$options'] = options;
            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method search
     * @description Retrieve entries that have fields which match the provided search value.
     * @param {string} value - value to search in entries
     * @example blogQuery.search('Welcome to demo')
     * @example let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.search('welcome to demo').find()
     *          data.then(function(result) {
     *         // ‘result’ contains the object that possess the text "’welcome to demo’".
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     */
    search(value) {
        if (value && typeof value === 'string') {
            this._query['typeahead'] = value;
            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method find
     * @description Retrieves entries that satisfied the specified query
     * @example let blogQuery = Stack().ContentType('example').Query().find();
     *          blogQuery.then(function(result) {
     *          // result contains the list of object. 
     *       },function (error) {
     *          // error function
     *      })
     * blogQuery.find()
     */
    find() {
        const host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
            url = (this.type && this.type === 'asset') ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: url,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return Utils.sendRequest(this);
    }

     /**
     * @method findOne
     * @deprecated since verion 3.3.0
     * @description Retrieve a single entry from the result
     * @example let blogQuery = Stack().ContentType('example').Query().findOne();
     *          blogQuery.then(function(result) {
     *          // result contains the single item object. 
     *       },function (error) {
     *          // error function
     *      })
     * blogQuery.findOne()
     */
    findOne() {
        const host = this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version,
            url = (this.type && this.type === 'asset') ? host + this.config.urls.assets : host + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries;
        this.singleEntry = true;
        this._query.limit = 1;
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: url,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return Utils.sendRequest(this);
    }

}