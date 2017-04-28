import Request from  '../lib/request';
import * as Utils from '../lib/utils.js';
import Entry from './entry';


var _extend = {
    compare: function(type) {
        return function(key, value) {
            if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
                this._query['query'][key] = this._query['query'][key] || {};
                this._query['query'][key][type] = value;
                return this;
            } else {
                console.error("Kindly provide valid parameters.");
            }
        };
    },
    contained: function(bool) {
        var type = (bool) ? '$in' : '$nin';
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
            var _query = [];
            for (var i = 0, _i = arguments.length; i < _i; i++) {
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
 * var Query = Contentstack.Stack().ContentType('example).Query();
 * @ignore
 */
export default class Query extends Entry{
    constructor(){
        super();
        this._query = this._query || {};
        this._query['query'] = this._query['query'] || {};
        
        /**
         * @method lessThan
         * @description This method provides only the entries with values less than the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.lessThan('created_at','2015-06-22')
         * @returns {Query}
         */
        this.lessThan = _extend.compare('$lt');
        
        /**
         * @method lessThanOrEqualTo
         * @description This method provides only the entries with values less than or equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.lessThanOrEqualTo('created_at','2015-03-12')
         * @returns {Query}
         */
        this.lessThanOrEqualTo = _extend.compare('$lte');
        
        /**
         * @method greaterThan
         * @description This method provides only the entries with values greater than the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.greaterThan('created_at','2015-03-12')
         * @returns {Query}
         */
        this.greaterThan = _extend.compare('$gt');
        
        /**
         * @method greaterThanOrEqualTo
         * @description This method provides only the entries with values greater than or equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.greaterThanOrEqualTo('created_at', '2015-06-22')
         * @returns {Query}
         */
        this.greaterThanOrEqualTo = _extend.compare('$gte');
        
        /**
         * @method notEqualTo
         * @description This method provides only the entries with values not equal to the specified value for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - The value used to match or compare
         * @example blogQuery.notEqualTo('title','Demo')
         * @returns {Query}
         */
        this.notEqualTo = _extend.compare('$ne');
        
        /**
         * @method containedIn
         * @description This method provides only the entries with values matching the specified values for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {*} value - An array of values that are to be used to match or compare
         * @example blogQuery.containedIn('title', ['Demo', 'Welcome'])
         * @returns {Query}
         */
        this.containedIn =  _extend.contained(true);
        
        /**
         * @method notContainedIn
         * @description This method provides only the entries that do not contain values matching the specified values for a field.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @param {Array} value - An array of values that are to be used to match or compare
         * @example blogQuery.notContainedIn('title', ['Demo', 'Welcome'])
         * @returns {Query}
         */
        this.notContainedIn = _extend.contained(false);
        
        /**
         * @method exists
         * @description This method provides only the entries that contains the field matching the specified field uid.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @example blogQuery.exists('featured')
         * @returns {Query}
         */
        this.exists =  _extend.exists(true);
        
        /**
         * @method notExists
         * @description This method provides only the entries that do not contain the field matching the specified field uid.
         * @param {String} key - uid of the field that is to be taken into consideration
         * @example blogQuery.notExists('featured')
         * @returns {Query}
         */
        this.notExists =  _extend.exists(false);
        
        /**
         * @method ascending
         * @description This parameter sorts the provided entries in the ascending order on the basis of the specified field.
         * @param {String} key - field uid based on which the ordering should be done
         * @example blogQuery.ascending('created_at')
         * @returns {Query}
         */
        this.ascending = _extend.sort('asc');
        
        /**
         * @method descending
         * @description This method sorts the provided entries in the descending order on the basis of the specified field.
         * @param {String} key - field uid based on which the ordering should be done.
         * @example blogQuery.descending('created_at')
         * @returns {Query}
         */
        this.descending =  _extend.sort('desc');
        
        /**
         * @method beforeUid
         * @description This method provides only the entries before the specified entry id.
         * @param {String} uid - uid of the entry
         * @example blogQuery.beforeUid('blt1234567890abcdef')
         * @returns {Query}
         * @ignore
         */
        this.beforeUid =   _extend.sort('before_uid');
        
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
         * @description This method skips the specified number of entries.
         * @param {Number} skip - number of entries to be skipped
         * @example blogQuery.skip(5)
         * @returns {Query}
         */
        this.skip =  _extend.pagination('skip');
        
        /**
         * @method limit
         * @description This method limits the response by providing only the specified number of entries.
         * @param {Number} limit - number of entries to be present in the result(at most)
         * @example blogQuery.limit(10)
         * @returns {Query}
         */
        this.limit =  _extend.pagination('limit');
        
        /**
         * @method or
         * @description This method performs the OR operation on the specified query objects and provides only the matching entries.
         * @param {object} queries - array of Query objects/raw queries to be taken into consideration
         * @example
         * <caption> .or with Query instances</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.or(Query1, Query2)
         * @example
         * <caption> .or with raw queries</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.or(Query1, Query2)
         * @returns {Query}
         */
        this.or =  _extend.logical('$or');
        
        /**
         * @method and
         * @description This method performs the AND operation on the specified query objects and provides only the matching entries.
         * @param {object} queries - array of Query objects/raw queries to be taken into consideration
         * @example
         * <caption> .and with Query instances</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo')
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10)
         * blogQuery.and(Query1, Query2)
         * @example
         * <caption> .and with raw queries</caption>
         * var Query1 = Stack.ContentType('blog').Query().where('title', 'Demo').getQuery()
         * var Query2 = Stack.ContentType('blog').Query().lessThan('comments', 10).getQuery()
         * blogQuery.and(Query1, Query2)
         * @returns {Query}
         */
        this.and =  _extend.logical('$and');
    }

    /**
     * @method where(equalTo)
     * @description This method provides only the entries matching the specified value for a field.
     * @param {String} key - uid of the field that is to be taken into consideration
     * @param {*} value - The value used to match or compare
     * @example blogQuery.where('title','Demo')
     * @returns {Query}
     */
    equalTo(key, value){
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query['query'][key] = value;
            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    where(key, value){
        if (key && value && typeof key === 'string' && typeof value === 'string') {
            this._query['query'][key] = value;
            return this;
        } else {
            console.error("Kindly provide valid parameters.");
        }
    }

    /**
     * @method count
     * @description This method provides only the number of entries matching the specified filters.
     * @example blogQuery.count()
     * @returns {Query}
     */
    count(){
        this._query['count'] = true;
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return this;
    }

    /**
     * @method query
     * @description This method used to set raw queries on Query instance.
     * @param {object} query - raw{json} queries to filter the entries in result set.
     * @returns {Query}
     */
    query(query){
        if (typeof query === "object") {
            this._query['query'] = Utils.mergeDeep(this._query['query'], query);
            return this;
        } else {
            console.error("Kindly provide valid parameters");
        }
    }

    /**
     * @method tags
     * @description The "tags" parameter allows you to specify an array of tags to search objects.
     * @param {Array} values - tags
     * @example blogQuery.tags(['technology', 'business'])
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
     * @description This method also includes the total number of entries returned in the response.
     * @example blogQuery.includeCount()
     * @returns {Query}
     */
    includeCount() {
        this._query['include_count'] = true;
        return this;
    }

    /**
     * @method getQuery
     * @summary returns the raw query which can be used for futher calls(.and/.or).
     * @description This method provides raw{json} queries based on the filters applied on Query objet.
     * @example blogQuery.where('title','Demo').getQuery()
     * @returns {Query}
     */
    getQuery() {
        return this._query.query || {};
    }

    /**
     * @method regex
     * @description This method provides only the entries matching the regular expression for the specified field.
     * @param {String} key - Uid of the field that is to be taken into consideration
     * @param {*} value - The value used to match or compare
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
     * @description This method is used to search data in entries.
     * @param {string} value - value to search in entries
     * @example blogQuery.search('Welcome to demo')
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
     * @description Provides all the entries which satisfied the query specified.
     * @example
     * blogQuery.find()
     */
    find() {
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return Utils.sendRequest(this);
    }

    /**
     * @method findOne
     * @description Provides the single entry from the resultset.
     * @example
     * blogQuery.findOne()
     */
    findOne() {
        this.singleEntry = true;
        this._query.limit = 1;
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries,
            body: {
                _method: 'GET',
                query: this._query
            }
        };
        return Utils.sendRequest(this);
    }

}


