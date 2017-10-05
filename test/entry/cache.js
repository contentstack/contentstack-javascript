'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
//var Contentstack = require('contentstack');
var Contentstack = require('../../dist/node/contentstack.js');
var init = require('../config.js');
var Utils = require('../../src/core/lib/utils.js');
var localStorage = require('./../../node_modules/contentstack/src/cache.js');

var Stack;

function getHashData(hash, tojson) {
    var _data = localStorage.get(hash);
    if (!tojson) _data = Utils.resultWrapper(_data);
    var spreadResult = Utils.spreadResult(_data);
    return spreadResult;
}

test('Initalise the Contentstack Stack Instance', function(TC) {
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        TC.end();
    }, 1000);
});

test('CACHE_ELSE_NETWORK Policy', function(TC) {
    var Query,isSingle;
    TC.test('Set Cache Policy On Stack Object', function (assert) {
        Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        Query = Stack.ContentType('source').Query().toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var toJson = Query.tojson;
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        localStorage.set(hash, null);
        assert.ok(!localStorage.get(hash), hash+' for this request not exists in localstorage');
        Query
            .find()
            .then(function success(result) {
                try {
                    console.log("toJson:");
                    var cacheData = getHashData(hash, toJson);
                    // console.log(cacheData);
                    // console.log(result);
                    assert.ok(result.length, 'Entries exists in resultset');
                    assert.ok(cacheData.length, hash+' for this request exists in localstorage');
                    if(result[0].length && cacheData[0].length) {
                        // console.log(result[0], cacheData[0]);
                        assert.deepEqual(result[0], cacheData[0], 'Result and cache object are same');
                    } else {
                        assert.fail('Hash result and actual result not equal');
                    }
                    assert.end();
                } catch(e) {
                    console.error('exception : ', e.stack)
                }
            }, function error(err) {
                assert.false(err, 'Error occured');
                assert.end();
            });
    });

    TC.test('GET the SAME Result from the cache', function (assert) {
        Query = Stack.ContentType('source').Query().toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        var cacheData = getHashData(hash, Query.tojson);
        assert.ok((cacheData && cacheData[0].length), hash+' for this request exists in localstorage');
        assert.end();
    });
});

test('CACHE_THEN_NETWORK Policy', function(TC) {
    var Query, isSingle;
    TC.test('Set Cache Policy On Stack Object', function (assert) {
        var count = 0;
        Stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK);
        Query = Stack.ContentType('source').Query().toJSON().skip(1).limit(2);
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var toJson = Query.tojson;
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        localStorage.set(hash, null);
        assert.ok(!localStorage.get(hash), hash+' for this request not exists in localstorage');
        Query
            .find()
            .then(function success(result) {
                count++;
                if(count > 1) {
                    var cacheData = getHashData(hash, toJson);
                    assert.ok(result.length, 'Entries exists in resultset');
                    assert.ok(cacheData.length, hash+' for this request exists in localstorage');
                    if(result[0].length && cacheData[0].length) {
                        assert.deepEqual(result[0], cacheData[0], 'Result and cache object are same');
                    } else {
                        assert.fail('Hash result and actual result not equal');
                    }
                    assert.end();
                } else {
                    // console.log("Result should not exists:", hash, localStorage.get(hash));
                    assert.notok(result, 'Result should not exists');
                }
            }, function error(err) {
                assert.false(err, 'Error occured');
                assert.end();
            });
    });    

    TC.test('GET the SAME Result from the cache', function (assert) {
        Query = Stack.ContentType('source').Query().toJSON().skip(1).limit(2);
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        var cacheData = getHashData(hash, Query.tojson);
        assert.ok(cacheData[0].length, hash+' for this request exists in localstorage');
        assert.end();
    });
});

test('ONLY_NETWORK Policy', function(TC) {
    var Query, isSingle;
    TC.test('Set Cache Policy On Stack Object', function (assert) {
        Stack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK);
        Query = Stack.ContentType('source').Query().skip(1).limit(2).toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var toJson = Query.tojson;
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        localStorage.set(hash, null);
        assert.ok(!localStorage.get(hash), hash+' for this request not exists in localstorage');
        Query
            .find()
            .then(function success(result) {
                var cacheData = getHashData(hash, toJson);
                assert.ok(result.length, 'Entries exists in resultset');
                assert.ok(cacheData.length, hash+' for this request exists in localstorage');
                if(result[0].length && cacheData[0].length) {
                    assert.deepEqual(result[0], cacheData[0], 'Result and cache object are same');
                } else {
                    assert.fail('Hash result and actual result not equal');
                }
                assert.end();
            }, function error(err) {
                assert.false(err, 'Error occured');
                assert.end();
            });
    });

    TC.test('GET the SAME Result from the cache', function (assert) {
        Query = Stack.ContentType('source').Query().skip(1).limit(2).toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        var cacheData = getHashData(hash, Query.tojson);
        assert.ok(cacheData[0].length, hash+' for this request exists in localstorage');
        assert.end();
    });
});

test('IGNORE_CACHE Policy', function(TC) {
    var Query, isSingle;
    TC.test('Set Cache Policy On Stack Object', function (assert) {
        Stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
        Query = Stack.ContentType('source').Query().skip(1).limit(2).toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        // if(Query.environment_uid) {
        //     Query.requestParams.body.query.environment_uid = Query.environment_uid;
        // } else {
        //     Query.requestParams.body.query.environment = Query.environment;
        // }
        var toJson = Query.tojson;
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        localStorage.set(hash, null);
        assert.ok(!localStorage.get(hash), hash+' for this request not exists in localstorage');
        Query
            .find()
            .then(function success(result) {
                var cacheData = getHashData(hash, toJson);
                assert.ok(result.length, 'Entries exists in resultset');
                assert.notok(cacheData[0], hash+' for this request not exists in localstorage');
                if(result[0] && cacheData[0]) {
                    assert.deepEqual(result[0], cacheData[0], 'Result and cache object are same');
                } else {
                    assert.fail('Hash result and actual result not equal');
                }
                assert.end();
            }, function error(err) {
                assert.false(err, 'Error occured');
                assert.end();
            });
    });

    TC.test('GET the SAME Result from the cache', function (assert) {
        Query = Stack.ContentType('source').Query().skip(1).limit(2).toJSON();
        isSingle = (Query.entry_uid || Query.singleEntry) ? true : false;
        if(Query.environment_uid) {
            Query.requestParams.body.query.environment_uid = Query.environment_uid;
        } else {
            Query.requestParams.body.query.environment = Query.environment;
        }
        var hash = Utils.getHash(Utils.parseQueryFromParams(Query, isSingle, Query.tojson));
        var cacheData = getHashData(hash, Query.tojson);
        assert.notok(cacheData[0], hash+' for this request not exists in localstorage');
        assert.end();
    });
});
