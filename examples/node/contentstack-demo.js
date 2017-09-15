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
        config = config || {'api_key': 'blt950d694ee9fce907', 'access_token': 'blt98a76e10ad802238', 'environment': 'development'}
        // Initialize the Contentstackstack
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
        return this.Stack.ContentType(contentTypeUid).Query().toJSON().find()
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
        entryUid = entryUid || 'blte9cab9a80ba36d22'
        return this.Stack.ContentType(contentTypeUid).Entry(entryUid).fetch()
    }
}

module.exports = ContentstackDemo