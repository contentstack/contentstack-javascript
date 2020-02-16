'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../../dist/node/contentstack.js');
var init = require('../config.js');

var Stack;
/*
 * Initalise the Contentstack Instance
 * */
test('Initalise the Contentstack Stack Instance', function(TC) {
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        Stack.setHost(init.host);
        TC.end();
    }, 1000);
});


test('assets as first argument', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .limit(1)
        .find()
        .spread(function success(assets) {
            assert.ok(assets.length, 'assets exists as first parameter');
            if (assets && assets.length) {
                var prev = assets[0].get(field);
                var _assets = assets.every(function(asset) {
                    asset = asset.toJSON();
                    prev = asset[field];
                    return (asset[field] <= prev);
                });
                assert.equal(_assets, true, "default sorting of descending 'updated_at'");
            }
            assert.end();
        }, function error(err) {
            assert.end();
        });
});

test('with assets and count argument', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .find()
        .spread(function success(assets, count) {
            assert.ok(assets.length, 'assets exists as first parameter');
            assert.ok(count, 'Count exists as second parameter');
            if (assets && assets.length) {
                var prev = assets[0].get(field);
                var _assets = assets.every(function(asset) {
                    asset = asset.toJSON();
                    prev = asset[field];
                    return (asset[field] <= prev);
                });
                assert.equal(_assets, true, "default sorting of descending 'updated_at'");
            }
            assert.end();
        }, function error(err) {
            assert.end();
        });
});

test('with assets and count argument', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .find()
        .spread(function success(assets, count) {
            assert.ok(assets.length, 'assets exists as first parameter');
            assert.ok(count, 'Count exists as second parameter');
            if (assets && assets.length) {
                var prev = assets[0].get(field);
                var _assets = assets.every(function(asset) {
                    asset = asset.toJSON();
                    prev = asset[field];
                    return (asset[field] <= prev);
                });
                assert.equal(_assets, true, "default sorting of descending 'updated_at'");
            }
            assert.end();
        }, function error(err) {
            assert.end();
        });
});