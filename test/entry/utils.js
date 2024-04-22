'use strict';

/**
 * Module Dependencies.
 */
var _ = require('lodash');

var utils = {};
module.exports = exports = utils;

exports.calculateBinary = function(uid) {
    var binary = 0,
        bits = uid.split('').slice(3);
    for(var i = 0, _i = bits.length; i < _i; i++) {
        binary+=parseInt(bits[i].toString(), 16);
    }
    return binary;
};

exports.arrayPresentInArray = function(src, dest) {
    return (_.intersection(src, dest).length);
};

exports.isEntriesPublished = function (entries, environment_uid, locale) {
    var searchInPublishDetails = function (entry) {
        var flag = false;
        if(entry && entry._metadata && entry._metadata.publish_details && entry._metadata.publish_details.length) {
            for(var i = 0, _i = entry._metadata.publish_details.length; i < _i; i++) {
                if(entry._metadata.publish_details[i] && entry._metadata.publish_details[i].environment === environment_uid && entry._metadata.publish_details[i].locale === locale) {
                    if(entry._metadata.publish_details[i].scheduled && entry._metadata.publish_details[i].time) continue
                    flag = true
                    break
                }
            }
        }
        return flag
    }

    var _flag = true;
    if(entries instanceof Array) {
        for(var j = 0, _j = entries.length; j < _j; j++) {
            if(typeof entries[j].toJSON === "function" && typeof entries[j].get === "function") entries[j] = entries[j].toJSON();
            _flag = searchInPublishDetails(entries[j])
            if(!_flag) break
        }
    } else if(typeof entries === "object") {
        if(typeof entries.toJSON === "function" && typeof entries.get === "function") entries = entries.toJSON();
        _flag = searchInPublishDetails(entries)
    }
    return _flag
}