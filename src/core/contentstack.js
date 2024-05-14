import Stack from "./stack";
import CacheProvider from './cache-provider/index';
import ContentstackRegion from "./contentstackregion";

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
		
		this.Utils = require('@contentstack/utils');
	}

	/**

	* @memberOf Contentstack
	*/
	Stack(...stack_arguments){
		return new Stack(...stack_arguments);
	}

	updateAssetURL(entry) {
		// check if entry consist of _embedded_items object
		if (entry._embedded_items == undefined) {
			throw new Error("_embedded_items not present in entry. Call includeEmbeddedItems() before fetching entry.");
		}

		// Iterate through each object in _embedded_items and update the asset link
		for (let key in entry._embedded_items) {
			let embedded_item = entry._embedded_items[key];
			if (Array.isArray(embedded_item)) {

				embedded_item.forEach((item) => {

					if (item._content_type_uid == 'sys_assets' && item.filename) {

						const correspondingAsset = entry[key].children.find(child => child.attrs['asset-uid'] === item.uid);
						correspondingAsset.attrs['asset-link'] = item.url;
					}
				});
			}
		}
	}
}

module.exports = new Contentstack();
