'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../dist/node/contentstack.js');
var _ = require('lodash');
var init = require('./config');
var Utils = require('./utils.js');

var Stack;
/*
 * Initalise the Contentstack Instance
 * */
test('Initalise the Contentstack Stack Instance', function(TC) {
    setTimeout(function() {
        Stack = Contentstack.Stack(init.stack);
        // Stack.setHost("localhost");
        // Stack.setPort(1600);
        // Stack.setProtocol("http");

        // Stack.setHost(init.host);
        TC.end();
    }, 2000);
});

test('Find operations', function(TC) {
    TC.test('.count()', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .count()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                assert.ok(entries[0], 'Entries present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".count()");
                assert.end();
            });
    });

    /*TC.test('.skip()', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .toJSON()
            .find()
            .then(function success(allEntries) {
                //assert.equal(Utils.isEntriesPublished(allEntries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                // assert.ok("entries" in allEntries, 'Entries key present in the resultset');
                Stack
                    .ContentType('source')
                    .Query()
                    .skip(1)
                    .toJSON()
                    .find()
                    .then(function success(entries) {
                        // assert.ok("entries" in result, 'Entries key present in the resultset');
                        //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                        assert.ok((entries[0].length >= 2), '2 or more Entries present in the resultset');
                        assert.deepEqual(allEntries[0].slice(1), entries[0], 'All elements matched.');
                        if(entries && entries.length && entries[0].length) {
                            var prev = entries[0][0][field];
                            var _entries = entries[0].every(function(entry) {
                                var flag = (entry[field] <= prev);
                                prev = entry[field];
                                return flag;
                            });
                            assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                        }
                        assert.end();
                    }, function error(err) {
                        console.error("error :", err);
                        assert.fail(".skip()");
                        assert.end();
                    });
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".skip()");
                assert.end();
            });
    });*/

    /*TC.test('default .find()', function(assert) {
        var Query = Stack.ContentType('blog').Entry('blt731285ad83731dfb'),
            field = 'updated_at';
        Query = Query
            .toJSON()
            .fetch();

        Query
            .then(function success(entries, schema, count) {
                console.log("result : ", arguments);
                // // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.ok(entries.length, '3 Entries present in the resultset');
                // if(entries && entries.length && entries[0].length) {
                //     var prev = entries[0][0][field];
                //     var _entries = entries[0].every(function(entry) {
                //         console.log(entry[field], prev);
                //         prev = entry[field];
                //         return (entry[field] <= prev);
                //     });
                //     assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                // }
                // assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail("default .find()");
                assert.end();
            });
    });*/

    /*TC.test('default .find()', function(assert) {
        var Query = Stack.ContentType('blog').Query(),
            field = 'updated_at';
        Query
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "All entries are published");
                assert.ok(entries.length, '3 Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].every(function(entry) {
                        prev = entry[field];
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "default sorting of descending 'updated_at'");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail("default .find()");
                assert.end();
            });
    });*/

    /*
    TC.test('findOne:  default .findOne().toJSON()', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .only('BASE', 'title')
            .findOne().toJSON()
            .then(function success(entry) {
                console.info("====", JSON.stringify(entry));
                assert.ok(entry.length, 'Entry key present in the resultset');
                var flag = (entry[0] && Object.keys(entry).length === 2 && "title" in entry[0] && "uid" in entry[0]);
                assert.ok(flag, 'entry with the field title in the resultset');
                assert.end();
            }, function error(err) {
                console.error("Error :",err);
                assert.fail("findOne:  .only() - Multiple String Parameter");
                assert.end();
            });
    });
*/

    /*TC.test('.count()', function(assert) {
        var test = this;
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .count()
            .find()
            .toJSON()
            .then(function success(count) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                assert.ok(count, 'Entries present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(err.message|| err.error_message);
                assert.end();
            });
    });*/

    /*TC.test('Nested', function (assert) {
        var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']);
        var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']);
        var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']);
        var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']);
        var Query = Stack.ContentType('source').Query();

        Query
            .and(Query1, Query2, Query3, Query4)
            .find()
            // .includeCount()
            .then(function success(result) {
                console.log("========");
                console.log(result[0]);
                console.log(result[1]);
                // assert.ok("entries" in result, 'entries key present in the resultset');
                assert.equal(result[0].length, 1, '1 Entry present in the resultset');
                if(result[0] && result[0].length) {
                    var _entries = result[0].every(function(entry) {
                        entry = entry.toJSON();
                        return (~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6'));
                    });
                    assert.ok(_entries, '$AND condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.end();
            });
        /!*var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']);
        var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']);
        var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']);
        var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']);
        var Query = Stack.ContentType('source').Query();

        Query
            .and(Query1, Query2, Query3, Query4)
            .find()
            .toJSON()
            .then(function success(result) {
                console.log();
                assert.ok("entries" in result, 'entries key present in the resultset');
                assert.equal(result.entries.length, 1, '1 Entry present in the resultset');
                if(result.entries && result.entries.length) {
                    var _entries = result.entries.every(function(entry) {
                        console.log("\n\n\n\n",JSON.stringify(entry));
                        return (~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6'));
                    });
                    assert.ok(_entries, '$AND condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.end();
            });*!/
    });*/

    /*TC.test('with entry, schema argument', function(assert) {
        var Query = Stack.ContentType('blog').Query();
        Query
            .findOne()
            .includeSchema()
            .spread(function success(entries, schema) {
                assert.ok(entries, 'Entries exists as first parameter');
                assert.ok(schema, 'Schema exists as second parameter');
                assert.end();
            }, function error(err) {
                assert.fail(err.message);
                assert.end();
            });
    });

    TC.test('with entry, schema argument', function(assert) {
        var Query = Stack.ContentType('blog').Query();
        Query
            .findOne()
            .includeSchema()
            .spread(function success(entries, schema) {
                assert.ok(entries, 'Entries exists as first parameter');
                assert.ok(schema, 'Schema exists as second parameter');
                assert.end();
            }, function error(err) {
                assert.fail(err.message);
                assert.end();
            });
    });*/
});