import Stack from "./stack";
import CacheProvider from './cache-provider/index';

/**
 * @method Contentstack
 * @description Creates an instance of `Contentstack`.
 * @api public
 */
class Contentstack {

	constructor(){
		/**
		 * @constant CachePolicy
		 * @description CachePolicy contains different cache policies constants.
		 * @example
		 * Contentstack.CachePolicy.IGNORE_CACHE
		 * Contentstack.CachePolicy.ONLY_NETWORK
		 * Contentstack.CachePolicy.CACHE_ELSE_NETWORK
		 * Contentstack.CachePolicy.NETWORK_ELSE_CACHE
		 * Contentstack.CachePolicy.CACHE_THEN_NETWORK
		 */
		this.CachePolicy = CacheProvider.policies;
	}

	/**
	 * @method Stack
	 * @description Initialize an instance of ‘Stack’
	 * @api public
	 * @example
	 *var Stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
                 OR
	 *var Stack = Contentstack.Stack({
	 *    'api_key':'stack_api_key',
	 *   'access_token':'stack_delivery_token',
	 *    'environment':'environment_name'
	 * });
	 *
	 * @returns {Stack}
	 */
	Stack(...stack_arguments){
		return new Stack(...stack_arguments);
	}
}

module.exports = new Contentstack();
