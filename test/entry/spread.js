/**
 * Created by Aamod Pisat on 09-06-2017.
 */
'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');

const contentTypes = init.contentTypes;

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

test('entries as first argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .limit(1)
        .toJSON()
        .find()
        .spread(function success(entries) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .toJSON()
        .find()
        .spread(function success(entries, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(count, 'Count exists as second parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries, schema and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeSchema()
        .includeCount()
        .toJSON()
        .find()
        .spread(function success(entries, schema, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(schema, 'Schema exists as second parameter');
            assert.ok(count, 'Count exists as third parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries, schema and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .includeSchema()
        .toJSON()
        .find()
        .spread(function success(entries, schema, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(schema, 'Schema exists as second parameter');
            assert.ok(count, 'Count exists as third parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries, content_type and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeContentType()
        .includeCount()
        .toJSON()
        .find()
        .spread(function success(entries, contentType, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(contentType, 'ContentType exists as second parameter');
            assert.ok((contentType.uid === contentTypes.source), 'ContentType exists as second parameter');
            assert.ok(count, 'Count exists as third parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries, content_type and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .includeContentType()
        .toJSON()
        .find()
        .spread(function success(entries, contentType, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(contentType, 'ContentType exists as second parameter');
            assert.ok((contentType.uid === contentTypes.source), 'ContentType exists as second parameter');
            assert.ok(count, 'Count exists as third parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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

test('with entries, content_type|schema and count argument', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .includeCount()
        .includeSchema()
        .includeContentType()
        .toJSON()
        .find()
        .spread(function success(entries, contentType, count) {
            assert.ok(entries.length, 'Entries exists as first parameter');
            assert.ok(contentType, 'ContentType exists as second parameter');
            assert.ok((contentType.uid === contentTypes.source), 'ContentType exists as second parameter');
            assert.ok(count, 'Count exists as third parameter');
            if (entries && entries.length) {
                var prev = entries[0][field];
                var _entries = entries.every(function(entry) {
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