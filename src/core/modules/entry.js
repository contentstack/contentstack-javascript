import * as Utils from "../lib/utils";
import Stack from "../stack";

/**
 * @class 
  Entry 
* @summary Creates an instance of `Entry`.   
* @description An initializer is responsible for creating Entry object.
* @param {String} uid - uid of the entry
* @example
* let Entry = Stack.ContentType('example').Entry('entry_uid');
* @returns {Entry}
* @instance
*/

export default class Entry {
    constructor() {
        this._query = {};
        /**
         * @method only
         * @memberOf Entry
         * @description Displays values of only the specified fields of entries or assets in the response
         * @param {String} [key=BASE] -  Assets: </br>
         *                                <p>Retrieves specified field of asset</p>
         * @param {String}            -  Entries:</br>
         *                                       <p>- retrieves default fields of the schema.</p>
         *                                       <p>- referenced_content-type-uid : retrieves fields of the referred content type.</p>
         * @param {Array} values - array of fields that you want to display in the response
         * @example
         * <caption> The only function with field_uid will include the data of only the specified fields for each entry and exclude the data of all other fields. </caption>
         * Stack.ContentType('contentTypeUid').Query().only('title').toJSON().find()
         * @example
         * <caption> The only function with an array of field_uids will include multiple fields for each entry and exclude the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().only(['title','description']).toJSON().find()
         * @example
         * <caption> In only, we have the only with a reference parameter, where you need to enter the UID of the reference field in place of "reference_field_uid", and the second parameter to include the data of only the specified field_uid for each entry and exclude the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('reference_field_uid').only('reference_field_uid','title').toJSON().find()
         * @example
         * <caption> In only, we have the only with a reference parameter with an array, where you need to enter the UID of the reference field in place of "reference_field_uid", and the second parameter with an array of fields to include the data of only the specified array of field_uids for each entry and exclude the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('reference_field_uid').only('reference_field_uid', ['title', 'description']).toJSON().find()
         * 
         * @returns {Entry}
         * @instance
         */
        this.only = Utils.transform('only');
        /**
         * @method except
         * @memberOf Entry
         * @description Displays all data of an entries or assets excluding the data of the specified fields.
         * @param {String} [key=BASE] - BASE (default value) - retrieves default fields of the schema.
                                                             - referenced_content-type-uid - retrieves fields of the referred content type.
         * @param {Array} values - array of fields that you want to skip in the response
         * @example
         * <caption> The except function with field_uid will exclude the data of only the specified fields for each entry and includes the data of all other fields. </caption>
         * Stack.ContentType('contentTypeUid').Query().except('title').toJSON().find()
         * @example
         * <caption> The except function with an array of field_uids will except multiple fields for each entry and include the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().except(['title','description']).toJSON().find()
         * @example
         * <caption> In except, we have the only with a reference parameter, where you need to enter the UID of the reference field in place of "reference_field_uid", and the second parameter to except the data of only the specified field_uid for each entry and include the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('reference_field_uid').except('reference_field_uid','title').toJSON().find()
         * @example
         * <caption> In except, we have the only with a reference parameter with an array, where you need to enter the UID of the reference field in place of "reference_field_uid", and the second parameter with an array of fields to except the data of only the specified array of field_uids for each entry and include the data of all other fields.</caption>
         * Stack.ContentType('contentTypeUid').Query().includeReference('reference_field_uid').except('reference_field_uid', ['title', 'description']).toJSON().find()
         * @returns {Entry}
         * @instance 
         */
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
     * @memberOf Entry
     * @description Fetches the entire content of referenced entry(ies). <a href='https://www.contentstack.com/docs/developers/apis/content-delivery-api/#include-reference'>Read More</a>
     * @example
     * <caption> .includeReference with reference_field_uids as array </caption>
     * var Query = Stack.ContentType(contentTypes.source).Query();
            Query
                .includeReference(['reference_field_uid', 'other_reference_field_uid'])
                .toJSON()
                .find()
                .then(function success(entries) {
                    //'entries' is  an object used to retrieve data including reference entries.
                })
     * @example
     * <caption> .includeReference with reference_field_uids and its children reference </caption>
     * var Query = Stack.ContentType(contentTypes.source).Query();
            Query
                .includeReference(['reference_field_uid', 'reference_field_uid.child_reference_field_uid'])
                .toJSON()
                .find()
                .then(function success(entries) {
                    //'entries' is  an object used to retrieve data including reference entries.
                })
     * @example
     * <caption> .includeReference with reference_field_uids </caption>
     * var Query = Stack.ContentType(contentTypes.source).Query(); 
     Query
        .includeReference('reference_field_uid')
        .toJSON()
        .find()
        .then(function success(entries) {
            //'entries' is  an object used to retrieve data including particular reference using reference_uid.
        })
     * @returns {Entry}
     * @instance
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
     * Sets the language code of which you want to retrieve data.
     * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
     * @memberOf Entry
     * @example 
     * let data = Stack.ContentType(contentTypeUid).Entry(entryUid).language('ja-jp').fetch()
     * data
     *      .then(function(result) {
     *           // 'result' is  an object used to retrieve data of ja-jp language.
     *      }, function(error) {
     *           // error function
     *      })
     *          
     * @returns {Entry}
     * @instance
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
     * @memberOf Entry
     * @description Adds query to Entry object
     * @param {String} key - key of the query
     * @param {String} value - value of the query
     * @example Stack.ContentType(contentTypeUid).Entry(entry_uid).addQuery('include_schema',true)
     * @returns {Entry}
     * @instance
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
     * @method includeEmbeddedItems
     * @memberOf Entry
     * @description Include Embedded Objects (Entries and Assets) along with entry/entries details.
     * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeEmbeddedItems().fetch()
     * @returns {Entry}
     * @instance
     */
    includeEmbeddedItems() {
        this._query['include_embedded_items'] = ["BASE"];
        return this;
    }

    /**
     * @method includeSchema
     * @memberOf Entry
     * @deprecated since verion 3.3.0
     * @description  Include schema of the current content type along with entry/entries details.
     * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeSchema().fetch()
     * @returns {Entry}
     * @instance
     */
    includeSchema() {
        this._query['include_schema'] = true;
        return this;
    }

    /**
     * @method includeReferenceContentTypeUid
     * @memberOf Entry
     * @description  This method also includes the content type UIDs of the referenced entries returned in the response.
     * @example Stack.ContentType("contentType_uid").Entry("entry_uid").includeReferenceContentTypeUID().fetch()
     * @example 
     * Query = Stack.ContentType("contentType_uid").Entry("entry_uid").includeReferenceContentTypeUID().fetch()
     * Query
     *      .toJSON()
     *      .then(function (result) {
     *          let value = result.get(field_uid)
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Entry}
     * @instance
     */
    includeReferenceContentTypeUID() {
        this._query['include_reference_content_type_uid'] = true;
        return this;
    }

    /**
     * @method includeFallback
     * @memberOf Entry
     * @description Include the fallback locale publish content, if specified locale content is not publish.
     * @example stack.ContentType(contentType_uid).Entry(entry_uid).includeFallback().fetch()
     * @returns {Entry}
     * @instance
     */
    includeFallback() {
        this._query['include_fallback'] = true;
        return this;
    }

    /**
     * @method includeContentType
     * @memberOf Entry
     * @description Include the details of the content type along with the entry/entries details.
     * @example stack.ContentType(contentType_uid).Entry(entry_uid).includeContentType().fetch()
     * @returns {Entry}
     * @instance
     */
    includeContentType() {
        this._query['include_content_type'] = true;
        return this;
    }

   /**
     * @method includeOwner
     * @memberOf Entry 
     * @description Includes the owner details of the entry/entries
     * @example stack.ContentType(contentType_uid).Entry(entry_uid).includeOwner().fetch()
     * @returns {Entry}
     * @instance
     */
    includeOwner() {
        this._query['include_owner'] = true;
        return this;
    }

    /**
     * @method toJSON
     * @memberOf Entry 
     * @description Converts your response into plain JavasScript object.Supports both entry and asset queries.
     * @example
     * Query = Stack.ContentType(contentTypeUid).Entry(entryUid).fetch()
     * Query
     *      .toJSON()
     *      .then(function (result) {
     *          let value = result.get(field_uid)
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Entry}
     * @instance
     */
    toJSON() {
        this.tojson = true;
        return this;
    }

    /**
     * @method addParam
     * @memberOf Entry 
     * @description Includes query parameters in your queries.
     * @example var data = Stack.ContentType(contentTypeUid).Entry(entryUid).addParam('include_count', 'true').fetch()
     *      data.then(function (result) {
     *          // 'result' is an object which content the data including count in json object form
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Entry}
     * @instance
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
     * @memberOf Entry 
     * @description Fetches a particular entry based on the provided entry UID.
     * @example
     * Stack.ContentType(contentTypeUid).Entry(entryUid).toJSON().fetch()
     * 
     * @example
     * Stack.ContentType(contentTypeUid).Entry(entryUid).toJSON().fetch({
     *         
     *      })
     * @returns {promise}
     * @instance
     */
    fetch(fetchOptions) {
        var host = this.config.host + ':' + this.config.port
        if(this.live_preview && this.live_preview.enable === true && this.live_preview.content_type_uid === this.content_type_uid ) {
            host = this.live_preview.host
        }
        if (this.entry_uid) {
            this.requestParams = {
                method: 'POST',
                headers: this.headers,
                url: this.config.protocol + "://" + host + '/' + this.config.version + this.config.urls.content_types + this.content_type_uid + this.config.urls.entries + this.entry_uid,
                body: {
                    _method: 'GET',
                    query: this._query
                }
            };
            var options = Utils.mergeDeep({}, this.fetchOptions, fetchOptions);
            return Utils.sendRequest(this, options);
        } else {
            console.error("Kindly provide an entry uid. e.g. .Entry('bltsomething123')");
        }
    }
}