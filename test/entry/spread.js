/**
 * Created by Aamod Pisat on 09-06-2017.
 */
'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../../dist/node/contentstack.js');
var init = require('../config.js');
var contentTypes = {
    source: "source",
    numbers_content_type: "numbers_content_type"
};

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

test('spread:  .find()', function(TC) {
    TC.test('entries as first argument', function(assert) {
        var Query = Stack.ContentType(contentTypes.source).Query(),
            field = 'updated_at';

        Query
            .limit(1)
            .find()
            .spread(function success(entries) {
                assert.ok(entries.length, 'Entries exists as first parameter');
                if(entries && entries.length) {
                    var prev = entries[0].get(field);
                    var _entries = entries.every(function(entry) {
                        entry = entry.toJSON();
                        prev = entry[field];
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                }
                assert.end();
            }, function error(err) {
                assert.end();
            });
    });

    TC.test('with entries and count argument', function(assert) {
        var Query = Stack.ContentType(contentTypes.source).Query(),
            field = 'updated_at';
        Query
            .includeCount()
            .find()
            .spread(function success(entries, count) {
                assert.ok(entries.length, 'Entries exists as first parameter');
                assert.ok(count, 'Count exists as second parameter');
                if(entries && entries.length) {
                    var prev = entries[0].get(field);
                    var _entries = entries.every(function(entry) {
                        entry = entry.toJSON();
                        prev = entry[field];
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                }
                assert.end();
            }, function error(err) {
                assert.end();
            });
    });

    TC.test('with entries, schema and count argument', function(assert) {
        var Query = Stack.ContentType(contentTypes.source).Query(),
            field = 'updated_at';
        Query
            .includeSchema()
            .includeCount()
            .find()
            .spread(function success(entries, schema, count) {
                assert.ok(entries.length, 'Entries exists as first parameter');
                assert.ok(schema, 'Schema exists as second parameter');
                assert.ok(count, 'Count exists as third parameter');
                if(entries && entries.length) {
                    var prev = entries[0].get(field);
                    var _entries = entries.every(function(entry) {
                        entry = entry.toJSON();
                        prev = entry[field];
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                }
                assert.end();
            }, function error(err) {
                assert.end();
            });
    });

    TC.test('with entries, schema and count argument', function(assert) {
        var Query = Stack.ContentType(contentTypes.source).Query(),
            field = 'updated_at';
        Query
            .includeCount()
            .includeSchema()
            .find()
            .spread(function success(entries, schema, count) {
                assert.ok(entries.length, 'Entries exists as first parameter');
                assert.ok(schema, 'Schema exists as second parameter');
                assert.ok(count, 'Count exists as third parameter');
                if(entries && entries.length) {
                    var prev = entries[0].get(field);
                    var _entries = entries.every(function(entry) {
                        entry = entry.toJSON();
                        prev = entry[field];
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                }
                assert.end();
            }, function error(err) {
                assert.fail(err.message);
                assert.end();
            });
    });
});
