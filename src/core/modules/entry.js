import * as Utils from "../lib/utils";
import Stack from "../stack";

/**
 * @summary Creates an instance of `Entry`.
 * @description An initializer is responsible for creating Entry object.
 * @param {String} uid - uid of the entry
 * @example
 * let Entry = Contentstack.Stack().ContentType('example).Entry();
 * @returns {Entry}
 * @ignore
 */
export default class Entry {
    constructor() {
        this._query = {};
        /**
         * @method only
         * @description Displays values of only the specified fields of entries or assets in the response
         * @param {String} [key=BASE] -  Assets: </br>
         *                                <p>Retrieves specified field of asset</p>
         * @param {String}            -  Entries:</br>
         *                                       <p>- retrieves default fields of the schema.</p>
         *                                       <p>- referenced_content-type-uid : retrieves fields of the referred content type.</p>
         * @param {Array} values - array of fields that you want to display in the response
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('title')
         * @example
         * <caption> .only with field uid </caption>
         * blogEntry.only('BASE','title')
         * @example
         * <caption> .only with field uids(array) </caption>
         * blogEntry.only(['title','description'])
         * @example
         * <caption> .only with reference_field_uid and field uid </caption>
         * blogEntry.includeReference('category').only('category','title')
         * @example
         * <caption> .only with reference_field_uid and field uids(array) </caption>
         * blogEntry.includeReference('category').only('category', ['title', 'description'])
         * @returns {Entry}
         * @returns {Asset}
         */
        this.only = Utils.transform('only');
        /**
         * @method except
         * @description Displays all data of an entries or assets excluding the data of the specified fields.
         * @param {String} [key=BASE] - BASE (default value) - retrieves default fields of the schema.
                                                             - referenced_content-type-uid - retrieves fields of the referred content type.
         * @param {Array} values - array of fields that you want to skip in the response
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('title').toJSON().find()
         * @example
         * <caption> .except with field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().except('BASE','title').toJSON().find()
         * @example
         * <caption> .except with field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().except(['title','description']).toJSON().find()
         * @example
         * <caption> .except with reference_field_uid and field uid </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category','title').toJSON().find()
         * @example
         * <caption> .except with reference_field_uid and field uids(array) </caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('category').except('category', ['title', 'description']).toJSON().find()
         * @returns {Entry} */
        this.except = Utils.transform('except');
        return this;
    }

    setCacheProvider(provider) {
        if (provider && typeof provider === 'object') {
            this.provider = provider;
        }
        return this;
    }

    setCachePolicy(policy) {
        if (typeof policy === 'number' && policy >= -1 && policy < 4) {
            if (!this._query) {
                this.cachePolicy = policy;
            } else {
                this.queryCachePolicy = policy;
            }
        } else {
            console.error("Kindly provide the valid policy");
        }
        return this;
    }

    /**
     * @method includeReference
     * @description Fetches the entire content of referenced entry(ies)
     * @example
     * <caption> .includeReference with reference_field_uids as array </caption>
     * blogEntry.includeReference(['category', 'author'])
     * @example
     * <caption> .includeReference with reference_field_uids </caption>
     * blogEntry.includeReference('category', 'author')
     * @returns {Entry}
     */
    includeReference(...val) {
        if (Array.isArray(val) || typeof val === "string") {
            if (arguments.length) {
                for (let i = 0; i < arguments.length; i++) {
                    this._query['include'] = this._query['include'] || [];
                    this._query['include'] = this._query['include'].concat(arguments[i]);
                }
            }
            return this;
        } else {
            console.error("Argument should be a String or an Array.");
        }
    }

     /**
     * @method language
     * @description Sets the language code of which you want to retrieve data.
     * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
     * @example 
     * let data = blogEntry.language('en-us')
     * data
     *      .then(function(result) {
     *           // result is  an object used to retrieve data of en-us language.
     *      }, function(error) {
     *           // error function
     *      })
     *          
     * @returns {Entry}
     */
    language(language_code) {
        if (language_code && typeof language_code === 'string') {
            this._query['locale'] = language_code;
            return this;
        } else {
            console.error("Argument should be a String.");
        }
    }

     /**
     * @method addQuery
     * @description Adds query to Entry object
     * @param {String} key - key of the query
     * @param {String} value - value of the query
     * @example blogEntry.addQuery('include_schema',true)
     * @returns {Entry}
     */
    addQuery(key, value) {
        if (key && value && typeof key === 'string') {
            this._query[key] = value;
            return this;
        } else {
            console.error("First argument should be a String.");
        }
    }

    /**
     * @method includeSchema
     * @deprecated since verion 3.3.0
     * @description  Include schema of the current content type along with entry/entries details.
     * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeSchema().fetch()
     * @returns {Entry}
     */
    includeSchema() {
        this._query['include_schema'] = true;
        return this;
    }

    /**
     * @method includeContentType
     * @description Include the details of the content type along with the entry/entries details.
     * @example blogEntry.includeContentType()
     * @returns {Entry}
     */
    includeContentType() {
        this._query['include_content_type'] = true;
        return this;
    }

   /**
     * @method includeOwner
     * @description Includes the owner details of the entry/entries
     * @example blogEntry.includeOwner()
     * @returns {Entry}
     */
    includeOwner() {
        this._query['include_owner'] = true;
        return this;
    }

    /**
     * @method toJSON
     * @description Converts your response into plain JavasScript object.Supports both entry and asset queries.
     * @example
     * Query
     *      .toJSON()
     *      .then(function (result) {
     *          let value = result.get(field_uid)
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Object}
     */
    toJSON() {
        this.tojson = true;
        return this;
    }

    /**
     * @method AddParam
     * @description Includes query parameters in your queries. Supports both 'entries' and 'assets' queries.
     * @example var data = blogQuery.addParam('include_count', 'true').fetch()
     *      data.then(function (result) {
     *          // 'result' is an object which content the data including count in json object form
     *       },function (error) {
     *          // error function
     *      })
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
     * @method fetch
     * @description Fetches a particular entry/asset based on the provided entry UID/asset UID.
     * @example
     * Stack.blogEntry('entry_uid').toJSON().fetch()
     * @example
     * Stack.Assets('assets_uid').toJSON().fetch()
     */
    fetch() {
        if (this.entry_uid) {
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries + this.entry_uid,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };

            return Utils.sendRequest(this);
        } else {
            console.error("Kindly provide an entry uid. e.g. .Entry('bltsomething123')");
        }
    }

}