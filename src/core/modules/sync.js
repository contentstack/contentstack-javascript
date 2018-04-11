import * as Utils from '../lib/utils';
import Stack from '../stack';
/**
 * @summary Creates an instance of `SyncApi`.
 * @description An initializer is responsible for creating Sync object.
 * @param {String} uid - uid of the Sync
 * @example
 * let syncApi = Stack().SyncApi('init', 'true');
 * @returns {Assets}
 * @ignore
 */
export default class Sync {
    constructor() {

        this._query = {};
    }

     /**
     * @method toJSON
     * @description This method is used to convert the result in to plain javascript object.
     * @example
     * blogEntry
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
     * @method fetch
     * @description fetch entry of requested content_type of defined query if present.
     * @example
     * blogEntry.fetch()
     */
    fetch() {   
        
        this._query['web_ui_api_key'] = this.config.web_ui_api_key;
        this._query = Object.assign(this._query, this.params);
        this.requestParams = {
            method: 'POST',
            headers: this.headers,
            url: this.config.protocol + "://" + this.config.host + ':' + this.config.port + '/' + this.config.version + this.config.urls.sync,
            body: {
                _method: 'GET',
                query: this._query
            }
        }
        return Utils.sendRequest(this);
    }

}