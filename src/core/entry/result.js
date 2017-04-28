import * as Utils  from '../lib/utils'

/**
 * @summary Creates an instance of `Result`.
 * @description An initializer is responsible for creating Result object.
 * @param {Object} object - API result object
 * @example
 * blogEntry.then(function (result) {
 *      // sucess function
 * },function (error) {
 *      // error function
 * })
 * @returns {Result}
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
     * @description Converts `Result` to plain javascript object.
     * @example
     * blogEntry.then(function (result) {
     *      result = result.toJSON()
     * },function (error) {
     *      // error function
     * })
     * @returns {object}
     */
    toJSON() {
        return (this.object()) ? Utils.mergeDeep(JSON.parse(JSON.stringify({})), this.object()) : null;
    }

    /**
     * @method get
     * @description `get` to access the key value.
     * @param field_uid
     * @example
     * blogEntry.then(function (result) {
     *      var value = result.get(field_uid)
     * },function (error) {
     *      // error function
     * })
     * @returns {Object}
     */
    get(key){
        if(this.object() && key) {
            var fields = key.split('.');
            var value = fields.reduce(function(prev, field) {
                return prev[field];
            }, this.object());
            return value;
        }
        return ;
    }    

}

module.exports = function(object) {
    return new Result(object);
};