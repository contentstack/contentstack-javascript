import * as Utils from '../lib/utils';
import Stack from '../stack';
import Query from './query';

const _extend = function (type) { 
    return function () {
        this._query[type] = this._query[type] || {};
        switch (arguments.length) {
            case 1:
            if (Array.isArray(arguments[0]) || typeof arguments[0] === "string") {
                let query = this._query[type]['BASE'] || [];
                query = query.concat(arguments[0]);
                this._query[type]['BASE'] = query;
                return this;
            } else {
                console.error("Kindly provide valid parameters");
            }
            break;
            case 2:
            if (typeof arguments[0] === "string" && (Array.isArray(arguments[1]) || typeof arguments[1] === "string")) {
                let query = this._query[type][arguments[0]] || [];
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
 * @summary Creates an instance of `Asset`.
 * @description An initializer is responsible for creating Asset object.
 * @param {String} uid - uid of the asset
 * @example
 * let Entry = Contentstack.Stack().Assets('bltsomething123');
 * @returns {Asset}
 * @ignore
 */
 export default class Asset {
     constructor(){
       /**
         * @method only
         * @description This method is use to show the selected fields of the assets in resultset.
         * @param {String} [key=BASE] - single field in asset
         * @param {Array} values - array of fields to be show in resultset
         * @example
         * <caption> .only with field uid </caption>
         * Assets().only('title')
         * @example
         * <caption> .only with field uid </caption>
         * Assets().only('BASE','title')
         * @example
         * <caption> .only with field uids(array) </caption>
         * Assets().only(['title','description'])
         * @returns {Asset}
         */
         this.only = _extend('only');
         return this;
     }

    /**
     * @method Query
     * @description Query instance to provide support for all search queries.
     * @example Assets().Query()
     * @returns {Query}
     */
     Query(){
        let query = new Query();
        return Utils.merge(query, this);
    }

    /**
     * @method addQuery
     * @description This method is used to add query to Entry object.
     * @param {String} key - key of the query
     * @param {String} value - value of the query
     * @example Assets().addQuery('include_schema',true)
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
     * @method toJSON
     * @description This method is used to convert the result in to plain javascript object.
     * @example
     * assetQuery
     *      .toJSON()
     *      .then(function (result) {
     *          let value = result.get(field_uid)
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
     * @description fetch asset obhect of requested Asset uid of defined query if present.
     * @example
     * Stack.Assets('bltsomething123').fetch()
     */
     fetch() {
          if (this.asset_uid) {
               this.requestParams = {
                     method: 'POST',
                     headers: this.headers,
                     url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.assets + this.asset_uid,
                     body: {
                         _method: 'GET',
                         query: this._query
                     }
                }
                return Utils.sendRequest(this); 
        } else {
            console.error("Kindly provide an asset uid. e.g. .Assets('bltsomething123')");
        }
    }
}