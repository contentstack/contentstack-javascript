import * as Utils from '../lib/utils';
import Stack from '../stack';
import Query from './query';

/**
 * @summary Creates an instance of `SyncApi`.
 * @description An initializer is responsible for creating Sync object.
 * @param {String} uid - uid of the Sync
 * @example
 * let syncApi = Stack().SyncApi('init', 'true');
 * @returns {Assets}
 * @ignore
 */
export default class SyncApi {
    constructor(key, value, Stack_config) {
        Stack_config._query = {};
        //let this = config;
        //console.log("i m here man ", Stack_config)
         Stack_config._query[key] = value
            Stack_config.requestParams = {
                method: 'POST',
                headers: Stack_config.headers,
                url: Stack_config.config.protocol + "://" + Stack_config.config.host + ':' + Stack_config.config.port + '/' + Stack_config.config.version + Stack_config.config.urls.sync,
                body: {
                    _method: 'GET',
                    query: Stack_config._query
                }
            }
        return Utils.sendRequest(Stack_config);
    }

}