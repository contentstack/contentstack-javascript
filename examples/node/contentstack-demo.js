'use strict'
/*!
 * module dependencies
 */
const Contentstack = require('../../dist/node/contentstack.js');

/*
 * Example ContentstackDemo Class
 * */

class ContentstackDemo {
    constructor(config) {
        config = config || { 'api_key': 'blt123something', 'access_token': 'blt123something', 'environment': 'development',  }
            // Initialize the Contentstackstack
            //console.log("datattatata", Contentstack.Region.EUROPE)

        this.Stack = Contentstack.Stack(config);
    }
    

    /**
     * getEntries
     * @description  : getEntries is used to get the entries of the specified entries
     * @params       : contentTypeUid {string} - Content-Type from which entries to be retrieved
     * @return       : Result {Promise}
     */
    getEntries(contentTypeUid) {
        contentTypeUid = contentTypeUid || 'source'
        return this.Stack.ContentType('dinu1234').Query().includeSchema().toJSON().find()
        //return this.Stack.getContentTypes(contentTypeUid)
    
    }

    /**
     * getEntries
     * @description  : getEntries is used to get the entries of the specified entries
     * @params       : contentTypeUid {string} - Content-Type from which entries to be retrieved
     * @return       : Result {Promise}
     */
    getLastActivities() {
        //contentTypeUid = contentTypeUid || 'source'
        return this.Stack.getLastActivities()
    }

    /**
     * getEntries
     * @description  : getEntries is used to get the entries of the specified entries
     * @params       : contentTypeUid {string} - Content-Type from which entries to be retrieved
     * @return       : Result {Promise}
     */
    getContentTypedemo() {
        contentTypeUid = contentTypeUid || 'source'
        return this.Stack.ContentType(contentTypeUid).fetch()
       // return this.Stack.ContentType('event_list').Entry('blt5d40c608567844d4').toJSON().fetch()
    }

    /**
     * getEntries
     * @description  : getEntries is used to get the entries of the specified entries
     * @params       : contentTypeUid {string} - Content-Type from which entries to be retrieved
     * @return       : Result {Promise}
     */
    getContentType(uid) {
        //contentTypeUid = contentTypeUid || 'source'
        return this.Stack.getContentType(uid)
    }

    /**
     * fetchEntry
     * @description  : fetchEntry is used to get the specified uid entry
     * @params       : contentTypeUid {string} - Content-Type from which entry to be fetched
     *                 entryUid       {string} - Specified entry to be fetched
     * @return       : Result {Promise}
     */
    getEntry(contentTypeUid, entryUid) {
            contentTypeUid = contentTypeUid || 'source'
            entryUid = entryUid || 'blt123something'
            return this.Stack.ContentType(contentTypeUid).Entry(entryUid).language('ja-jp').fetch()
        }

        /**
         * getAssets
         * @description  : getAssets is used to get the assets
         * @return       : Result {Promise}
         */
    getAssets() {
        return this.Stack.Assets().Query().toJSON().find()
    }


    /**
     * fetchAsset
     * @description  : fetchAsset is used to get the specified uid asset
     * @params       : assetUid       {string} - Specified Asset uid to be fetched                 
     * @return       : Result {Promise}
     */
    getAsset(assetUid) {
        assetUid = assetUid || 'blt123something'
        return this.Stack.Assets(assetUid).addParam('include_dimension', 'true').fetch()
    }


    /**
     * fetchAsset
     * @description  : fetchAsset is used to get the specified uid asset
     * @params       : assetUid       {string} - Specified Asset uid to be fetched                 
     * @return       : Result {Promise}
     */
    getSyncApi(params) {
        params = params || 'blt123something'
        return this.Stack.sync(params);
    }

}

module.exports = ContentstackDemo