import Stack from "./stack";
import CacheProvider from './cache-provider/index';
import ContentstackRegion from "./contentstackregion";
import {render , renderContent} from '@contentstack/utils';

 /**
 * @class 
  Contentstack 
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
		
		this.Utils = {
			/**
			 * @memberof Contentstack
			 * @description Renders embedded objects in Rich text from Entry or Multiple Entry Object.
			 * 
			 * @param {EntryEmbedable| EntryEmbedable[]} entry - Objects that contains RTE with embedded objects
			 * @param {string[]} keyPaths - Key paths for RTE contents in Entry object
			 * @param {RenderOption?} renderOption -  Optional render options to render content
			 */
				render,
			/**
			 * @memberof Contentstack
			 * @description Renders embedded objects in Rich text from String or String of array.
			 * @param {string | string[]} content - RTE content to render 
			 * @param {EntryEmbedable} options.entry - Entry object containing embedded objects
			 * @param {RenderOption?} options.renderOption - Optional render options to render content
			 */
				renderContent
			}
	}
/**

* @memberOf Contentstack
*/
	Stack(...stack_arguments){
		return new Stack(...stack_arguments);
	}
}

module.exports = new Contentstack();
