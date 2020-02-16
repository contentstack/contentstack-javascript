import Stack from "./stack";
import CacheProvider from './cache-provider/index';
import ContentstackRegion from "./contentstackregion";


/**
* @class Contentstack 
* @description Creates an instance of `Contentstack`.
* @instance
*/

class Contentstack {

	constructor(){
		/**
		 * @memberOf Contentstack
		 * @description CachePolicy contains different cache policies constants.
		 * @example
		 * Contentstack.CachePolicy.IGNORE_CACHE
		 * Contentstack.CachePolicy.ONLY_NETWORK
		 * Contentstack.CachePolicy.CACHE_ELSE_NETWORK
		 * Contentstack.CachePolicy.NETWORK_ELSE_CACHE
		 * Contentstack.CachePolicy.CACHE_THEN_NETWORK
		 */
		this.CachePolicy = CacheProvider.policies;
		this.Region = ContentstackRegion;
	}
/**

* @memberOf Contentstack
*/
	Stack(...stack_arguments){
		return new Stack(...stack_arguments);
	}
}

module.exports = new Contentstack();
