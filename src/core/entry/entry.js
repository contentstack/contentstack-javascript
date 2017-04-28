import * as Utils from "../lib/utils";
import Stack from "../stack";


const _extend = function (type) {
    return function () {
        this._query[type] = this._query[type] || {};
        switch (arguments.length) {
            case 1:
                if (Array.isArray(arguments[0]) || typeof arguments[0] === "string") {
                    var query = this._query[type]['BASE'] || [];
                    query = query.concat(arguments[0]);
                    this._query[type]['BASE'] = query;
                    return this;
                } else {
                    console.error("Kindly provide valid parameters");
                }
                break;
            case 2:
                if (typeof arguments[0] === "string" && (Array.isArray(arguments[1]) || typeof arguments[1] === "string")) {
                    var query = this._query[type][arguments[0]] || [];
                    query = query.concat(arguments[1]);
                    this._query[type][arguments[0]] = query;
                    return this;
                } else {
                    console.error("Kindly provide valid parameters");
                }
                break;
            default:
                console.error("Kindly provide valid parameters");
        }
    };
};

/**
 * @summary Creates an instance of `Entry`.
 * @description An initializer is responsible for creating Entry object.
 * @param {String} uid - uid of the entry
 * @example
 * var Entry = Contentstack.Stack().ContentType('example).Entry();
 * @returns {Entry}
 * @ignore
 */
export default class Entry{
	constructor(){
		this._query = {};
		/**
		 * @method only
		 * @description This method is use to show the selected fields of the entries in resultset.
		 * @param {String} [key=BASE] - reference field in the entry/single field in entry
		 * @param {Array} values - array of fields to be show in resultset
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
		 */
		this.only = _extend('only');
		/**
		 * @method except
		 * @description This method is use to hide the selected fields of the entries in resultset.
		 * @param {String} [key=BASE] - reference field in the entry/single field in entry
		 * @param {Array} values - array of fields to be show in resultset
		 * @example
		 * <caption> .except with field uid </caption>
		 * blogEntry.except('title')
		 * @example
		 * <caption> .except with field uid </caption>
		 * blogEntry.except('BASE','title')
		 * @example
		 * <caption> .except with field uids(array) </caption>
		 * blogEntry.except(['title','description'])
		 * @example
		 * <caption> .except with reference_field_uid and field uid </caption>
		 * blogEntry.includeReference('category').except('category','title')
		 * @example
		 * <caption> .except with reference_field_uid and field uids(array) </caption>
		 * blogEntry.includeReference('category').except('category', ['title', 'description'])
		 * @returns {Entry} */
		this.except = _extend('except');
		return this;
    }

    setCacheProvider(provider){
        if(provider && typeof provider === 'object') {
            this.provider = provider;

        }
        return this;
    }

    setCachePolicy(policy){
        if(typeof policy === 'number' && policy >= -1 && policy < 4) {
            if(!this._query) {
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
	 * @description This method is use to include referenced entries from the other Contenttype.
	 * @example
	 * <caption> .includeReference with reference_field_uids as array </caption>
	 * blogEntry.includeReference(['category', 'author'])
	 * @example
	 * <caption> .includeReference with reference_field_uids </caption>
	 * blogEntry.includeReference('category', 'author')
	 * @returns {Entry}
	 */
	includeReference(...val){
		if (Array.isArray(val) || typeof val === "string") {
	        if(arguments.length){
	            for (var i = 0; i < arguments.length; i++) {
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
	 * @description This method is used set language code, which language's data to be retrieve.
	 * @param {String} language_code - language code. e.g. 'en-us', 'ja-jp', etc.
	 * @example blogEntry.language('en-us')
	 * @returns {Entry}
	 */
	language(language_code){
	    if (language_code && typeof language_code === 'string') {
	        this._query['locale'] = language_code;
	        return this;
	    } else {
	        console.error("Argument should be a String.");
	    }
	}

	/**
	 * @method addQuery
	 * @description This method is used to add query to Entry object.
	 * @param {String} key - key of the query
	 * @param {String} value - value of the query
	 * @example blogEntry.addQuery('include_schema',true)
	 * @returns {Entry}
	 */
	addQuery(key, value){
	    if (key && value && typeof key === 'string') {
	        this._query[key] = value;
	        return this;
	    } else {
	        console.error("First argument should be a String.");
	    }
	}

	/**
	 * @method includeSchema
	 * @description This method is used to include the schema of the current contenttype in result set along with the entry/entries.
	 * @example blogEntry.includeSchema()
	 * @returns {Entry}
	 */
	includeSchema(){
	    this._query['include_schema'] = true;
	    return this;
	}

	/**
	 * @method includeOwner
	 * @description This method is used to include the owner of the entry/entries in resultset.
	 * @example blogEntry.includeOwner()
	 * @returns {Entry}
	 */
	includeOwner(){
	    this._query['include_owner'] = true;
	    return this;
	}

	/**
	 * @method toJSON
	 * @description This method is used to convert the result in to plain javascript object.
	 * @example
	 * blogEntry
	 *      .toJSON()
	 *      .then(function (result) {
	 *          var value = result.get(field_uid)
	*       },function (error) {
	 *          // error function
	 *      })
	 * @returns {Object}
	 */
	toJSON(){
	    this.tojson = true;
	    return this;
	}

	/**
	 * @method fetch
	 * @description fetch entry of requested content_type of defined query if present.
	 * @example
	 * blogEntry.fetch()
	 */
	fetch(){
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

