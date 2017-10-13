import * as Utils from '../lib/utils';
import Stack from '../stack';
import Query from './query';
/**
 * @summary Creates an instance of `Asset`.
 * @description An initializer is responsible for creating Asset object.
 * @param {String} uid - uid of the asset
 * @example
 * let Entry = Contentstack.Stack().Asset('bltsomething123');
 * @returns {Asset}
 * @ignore
 */
export default class Asset {
	constructor(){
		this._query = {};
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
    toJSON(){
        this.tojson = true;
        return this;
    }

    /**
	 * @method fetch
	 * @description fetch asset obhect of requested Asset uid of defined query if present.
	 * @example
	 * Stack.Asset('bltsomething123').fetch()
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
			console.error("Kindly provide an asset uid. e.g. .Asset('bltsomething123')");
		}
	}
}