import * as Utils from '../lib/utils';
import Stack from '../stack';
import Query from './query';

/**
 * @summary Creates an instance of `Assets`.
 * @description An initializer is responsible for creating Asset object.
 * @param {String} uid - uid of the asset
 * @example
 * let Assets = Contentstack.Stack().Assets('bltsomething123');
 * @returns {Assets}
 * @ignore
 */
export default class Assets {
    constructor() {
         this._query = {};
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
        this.only = Utils.transform('only');
        return this;
    }

    /**
     * @method Query
     * @description Query instance to provide support for all search queries.
     * @example Assets().Query()
     * @returns {Query}
     */
    Query() {
        let query = new Query();
        return Utils.merge(query, this);
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
    toJSON() {
        this.tojson = true;
        return this;
    }

     /**
     * @method AddParam
     * @description This method includes query parameter in query.
     * @example Stack.Assets('bltsomething123').addParam('include_dimension', 'true').fetch()
     */
    addParam(key, value) {
        if (key && typeof key === 'string' && value && typeof value === 'string') {        
            this._query[key] = value;
            return this;
        } else {
            console.error("Kindly provide a valid parameters.");
        }
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