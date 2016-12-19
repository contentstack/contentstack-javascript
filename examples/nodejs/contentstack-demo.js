'use strict'
/*!
 * module dependencies
 */
var Contentstack = require('./../../contentstack.js');

/*
 * Example ContentstackDemo Class
 * */

class ContentstackDemo {
    constructor(config) {
        config = config || {'api_key': 'bltsomething1234', 'access_token': 'bltsomething1234asdf', 'environment': 'development'}
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
        contentTypeUid = contentTypeUid || 'blog_content_type'
        return this.Stack.ContentType(contentTypeUid).Query().find()
    }

    /**
     * fetchEntry
     * @description  : fetchEntry is used to get the specified uid entry
     * @params       : contentTypeUid {string} - Content-Type from which entry to be fetched
     *                 entryUid       {string} - Specified entry to be fetched
     * @return       : Result {Promise}
     */
    getEntry(contentTypeUid, entryUid) {
        contentTypeUid = contentTypeUid || 'blog_content_type'
        entryUid = entryUid || 'home_entry_uid'
        return this.Stack.ContentType(contentTypeUid).Entry(entryUid).fetch()
    }
}

module.exports = ContentstackDemo