import * as Utils  from '../lib/utils'

/**
 * @class Result
 * @summary Creates an instance of `Result`.
 * @description An initializer is responsible for creating Result object.
 * @param {Object} object - API result object
 * @example
 * blogEntry.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @example
 * assetQuery.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @returns {Result}
 * @instance 
 */
class Result {
    constructor(object){
        if(object) {
            this.object = function() {
                return object;
            }
        }
        return this;
    }


    /**
     * @method toJSON
     * @memberOf Result
     * @description Converts `Result` to plain javascript object.
     * @example
     * blogEntry.then(function (result) {
     *      result = result[0][0].toJSON()
     * },function (error) {
     *      // error function
     * })
     * @example
     * assetQuery.then(function (result) {
     *      result = result[0][0].toJSON()
     * },function (error) {
     *      // error function
     * })
     * @returns {object}
     * @instance 
     */
    toJSON() {
        return (this.object()) ? Utils.mergeDeep(JSON.parse(JSON.stringify({})), this.object()) : null;
    }

   /**
     * @method get
     * @memberOf Result
     * @description Retrieve details of a field based on the UID provided
     * @param field_uid uid of the field
     * @example
     * blogEntry.then(function (result) {
     *      let value = result[0][0].get(field_uid)
     * },function (error) {
     *      // error function
     * })
     * @example
     * assetQuery.then(function (result) {
     *      let value = result[0][0].get(field_uid)
     * },function (error) {
     *      // error function
     * })
     * @returns {promise}
     * @instance  
     */
    get(key){
        if(this.object() && key) {
            let fields = key.split('.');
            let value = fields.reduce(function(prev, field) {
                return prev[field];
            }, this.object());
            return value;
        }
        return ;
    }

     /**
     * @method getDownloadUrl
     * @memberOf Result
     * @description Retrieves the download URL based on the disposition value.
     * @param {String} string - disposition value
     * @example
     * assetQuery.then(function (result) {
     *      let value = result[0][0].getDownloadUrl(disposition_value)
     * },function (error) {
     *      // error function
     * })
     * @returns {Object}
     * @instance    
     */
     getDownloadUrl(disposition) {
        if (this.object()) {
            let url = (this.object().url) ? this.object().url : null,
                _disposition = (disposition && typeof disposition === 'string') ? disposition: 'attachment';
            return (url) ? url + '?disposition=' + _disposition : null;    
        }
     }    
}

module.exports = function(object) {
    return new Result(object);
};