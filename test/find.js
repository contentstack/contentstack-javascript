'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../dist/node/contentstack.js');
var init = require('./config');
var Utils = require('./utils.js');
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

test('Find operations', function(TC) {
    TC.test('default .find()', function(assert) {
        var Query = Stack.ContentType('blog').Query(),
            field = 'updated_at';
        Query
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                assert.notok(entries[1], 'Count should not be present');
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
    });

    /*!
     * SORTING
     * !*/
    TC.test('.ascending()', function(assert) {
        var Query = Stack.ContentType('blog').Query(),
            field = 'updated_at';

        Query
            .ascending(field)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].every(function(entry) {
                        var flag = (entry[field] <= prev);
                        prev = entry[field];
                        return (entry[field] >= prev);
                    });
                    assert.equal(_entries, true, "entries sorted ascending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".ascending()");
                assert.end();
            });
    });

    TC.test('.descending()', function(assert) {
        var Query = Stack.ContentType('blog').Query(),
            field = 'created_at';

        Query
            .descending(field)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
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
                assert.fail(".descending()");
                assert.end();
            });
    });


    /*!
     * COMPARISION
     * !*/
    TC.test('.lessThan()', function(assert) {
        var Query = Stack.ContentType('numbers_content_type').Query(),
            field = 'updated_at',
            value = 11;
        Query
            .lessThan('num_field', value)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, '1 Entry present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].slice(1).every(function(entry) {
                        var flag = (entry[field] < value);
                        prev = entry[field];
                        return flag;
                    });
                    assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error('Error : ', err);
                assert.fail(".lessThan()");
                assert.end();
            });
    });

    TC.test('.lessThanOrEqualTo()', function(assert) {
        var Query = Stack.ContentType('numbers_content_type').Query(),
            field = 'updated_at',
            value = 11;
        Query
            .lessThanOrEqualTo('num_field', value)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
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
                assert.fail(".lessThanOrEqualTo()");
                assert.end();
            });
    });

    TC.test('.greaterThan()', function(assert) {
        var Query = Stack.ContentType('numbers_content_type').Query(),
            field = 'num_field',
            value = 6;

        Query
            .greaterThan('num_field', value)
            .ascending(field)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].slice(1).every(function(entry) {
                        var flag = (entry[field] > value);
                        prev = entry[field];
                        return flag;
                    });
                    assert.equal(_entries, true, "entries sorted ascending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                assert.fail(".greaterThan()");
                assert.end();
            });
    });

    TC.test('.greaterThanOrEqualTo()', function(assert) {
        var Query = Stack.ContentType('numbers_content_type').Query(),
            field = 'num_field',
            value = 11;

        Query
            .greaterThanOrEqualTo('num_field', value)
            .descending(field)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].every(function(entry) {
                        var flag = (entry[field] >= value);
                        prev = entry[field];
                        return flag;
                    });
                    assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".greaterThanOrEqualTo()");
                assert.end();
            });
    });

    TC.test('.notEqualTo()', function(assert) {
        var Query = Stack.ContentType('numbers_content_type').Query(),
            field = 'num_field',
            value = 6;

        Query
            .notEqualTo('num_field', value)
            .descending(field)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].every(function(entry) {
                        var flag = (entry[field] != value);
                        prev = entry[field];
                        return flag;
                    });
                    assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".notEqualTo()");
                assert.end();
            });
    });


    /*!
     * Array/Subset
     * !*/

    TC.test('.containedIn()', function(assert) {
        var Query = Stack.ContentType('multiple_assets').Query(),
            _in = ["Multiple Assets", "Multiple Assets 2"],
            field = 'updated_at';

        Query
            .containedIn('title', _in)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        return (_in.indexOf(entry['title']) != -1);
                    });
                    assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".containedIn()");
                assert.end();
            });
    });

    TC.test('.notContainedIn()', function(assert) {
        var Query = Stack.ContentType('multiple_assets').Query(),
            _in = ["Multiple Assets", "Multiple Assets 2"];

        Query
            .notContainedIn('title', _in)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                assert.notok(entries[0].length, 'No Entry present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".notContainedIn()");
                assert.end();
            });
    });


    /*!
     *Element(exists)
     * !*/

    TC.test('.exists()', function(assert) {
        var Query = Stack.ContentType('multiple_assets').Query(),
            queryField = "assets",
            field = 'updated_at';

        Query
            .exists(queryField)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
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
                assert.fail(".exists()");
                assert.end();
            });
    });

    TC.test('.notExists()', function(assert) {
        var Query = Stack.ContentType('multiple_assets').Query(),
            queryField = "isspecial",
            field = 'updated_at';

        Query
            .notExists(queryField)
            .toJSON()
            .find()
            .then(function success(entries) {
                assert.ok("entries" in entries, 'Entries key present in the resultset');
                //assert.notok(entries[0].length, 'No entry present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var prev = entries[0][0][field];
                    var _entries = entries[0].every(function(entry) {
                        return (entry[field] <= prev);
                    });
                    assert.equal(_entries, true, "entries sorted descending on '"+field+"' field");
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".notExists()");
                assert.end();
            });
    });


    // Pagination
    TC.test('.skip()', function(assert) {
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
    });

    TC.test('.limit()', function(assert) {
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
                    .limit(2)
                    .toJSON()
                    .find()
                    .then(function success(entries) {
                        // assert.ok("entries" in result, 'Entries key present in the resultset');
                        //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                        assert.ok(entries[0].length, 'Entries present in the resultset');
                        assert.deepEqual(allEntries[0].slice(0, 2), entries[0], 'All elements matched.');
                        if(entries && entries.length && entries[0] && entries[0].length) {
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
                        assert.fail(".limit()");
                        assert.end();
                    });
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".limit()");
                assert.end();
            });
    });

    TC.test('.count()', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .count()
            .toJSON()
            .find()
            .then(function success(count) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                assert.ok(count, 'Entries present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".count()");
                assert.end();
            });
    });

    // Navigation
    // TC.test('.beforeUid()', function(assert) {
    //     var Query = Stack.ContentType('source').Query(),
    //         uid = "blt5cbb9523685c42bf",
    //         field = 'created_at';

    //     Query
    //         .beforeUid(uid)
    //         .toJSON()
    //         .find()
    //         .then(function success(entries) {
    //             // assert.ok("entries" in result, 'Entries key present in the resultset');
    //             // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
    //             assert.ok((entries.length >= 1), '1 or more Entries present in the resultset');
    //             if(entries && entries.length && entries[0].length) {
    //                 var prev = entries[0][0][field];
    //                 var _entries = entries[0].every(function(entry) {
    //                     var flag = (prev >= entry[field]);
    //                     prev = entry[field];
    //                     return flag;
    //                 });
    //                 assert.equal(_entries, true, "entries are before provided one");
    //             }
    //             assert.end();
    //         }, function error(err) {
    //             console.error("error :", err);
    //             assert.fail(".beforeUid()");
    //             assert.end();
    //         })
    // });

    // TC.test('.afterUid()', function(assert) {
    //     var Query = Stack.ContentType('source').Query(),
    //         field = 'created_at',
    //         uid = "blt5cbb9523685c42bf";

    //     Query
    //         .afterUid(uid)
    //         .toJSON()
    //         .find()
    //         .then(function success(entries) {
    //             // assert.ok("entries" in result, 'Entries key present in the resultset');
    //             // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
    //             assert.ok((entries.length >= 1), '1 or more Entries present in the resultset');
    //             if(entries && entries.length && entries[0].length) {
    //                 var prev = entries[0][0][field];
    //                 var _entries = entries[0].every(function(entry) {
    //                     var flag = (prev <= entry[field]);
    //                     prev = entry[field];
    //                     return flag;
    //                 });
    //                 assert.equal(_entries, true, "entries are after provided one");
    //             }
    //             assert.end();
    //         }, function error(err) {
    //             console.error("error :", err);
    //             assert.fail(".afterUid()");
    //             assert.end();
    //         })
    // });


    // Logical
    TC.test('.or() - Query Objects', function(assert) {
        var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt02e485ce0a3aef14']);
        var Query2 = Stack.ContentType('source').Query().containedIn('other_reference', ['blted2d2fa1f02c4981']);
        var Query = Stack.ContentType('source').Query();

        Query
            .or(Query1, Query2)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        return (~entry.reference.indexOf('blt02e485ce0a3aef14') || ~entry.other_reference.indexOf('blted2d2fa1f02c4981'));
                    });
                    assert.ok(_entries, '$OR condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".or() - Query Objects");
                assert.end();
            });
    });

    TC.test('.or() - Raw queries', function(assert) {
        var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt02e485ce0a3aef14']).getQuery();
        var Query2 = Stack.ContentType('source').Query().containedIn('other_reference', ['blted2d2fa1f02c4981']).getQuery();
        var Query = Stack.ContentType('source').Query();

        Query
            .or(Query1, Query2)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        return (~entry.reference.indexOf('blt02e485ce0a3aef14') || ~entry.other_reference.indexOf('blted2d2fa1f02c4981'));
                    });
                    assert.ok(_entries, '$OR condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".or() - Raw queries");
                assert.end();
            });
    });

    TC.test('.and() - Query Objects', function(assert) {
        var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']);
        var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']);
        var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']);
        var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']);
        var Query = Stack.ContentType('source').Query();

        Query
            .and(Query1, Query2, Query3, Query4)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, '1 Entry present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    // console.log("\n\n\n\n",JSON.stringify(entries));
                    var _entries = entries[0].every(function(entry) {
                        return (~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6'));
                    });
                    assert.ok(_entries, '$AND condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".and() - Query Objects");
                assert.end();
            });
    });

    TC.test('.and() - Raw queries', function(assert) {
        var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']).getQuery();
        var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']).getQuery();
        var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']).getQuery();
        var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']).getQuery();
        var Query = Stack.ContentType('source').Query();

        Query
            .and(Query1, Query2, Query3, Query4)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, '1 Entry present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        return (~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6'));
                    });
                    assert.ok(_entries, '$AND condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".and() - Raw queries");
                assert.end();
            });
    });


    // Custom query
    TC.test('.query() - Raw query', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .query({"$or": [{"reference": {"$in": ["blt1ce8bb666a834bfb"]}}, {"other_reference" : {"$in": ["blted2d2fa1f02c4981"]}}]})
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        if((entry.reference.indexOf('blt1ce8bb666a834bfb') != -1)  || (entry.other_reference.indexOf('blted2d2fa1f02c4981') != -1)){
                            return true;
                        } else {
                            return false;
                        }
                        // return (entry.reference.indexOf('blt1ce8bb666a834bfb') || entry.other_reference.indexOf('blted2d2fa1f02c4981') ? true : false);
                    });
                    assert.ok(_entries, '$OR condition satisfied');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".query() - Raw query");
                assert.end();
            });
    });


    // tags
    TC.test('.tags()', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'tags',
            tags = ["tag1", "tag2"];

        Query
            .tags(tags)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                // assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok((entries.length >= 1), '1 or more Entry/Entries present in the resultset');
                if(entries && entries.length && entries[0].length) {
                    var _entries = entries[0].every(function(entry) {
                        return (Utils.arrayPresentInArray(tags, entry[field]));
                    });
                    assert.equal(_entries, true, 'Tags specified are found in result set');
                }
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".tags()");
                assert.end();
            });
    });


    // search
    TC.test('.search()', function(assert) {
        var Query = Stack.ContentType('home').Query();

        Query
            .toJSON()
            .search('Welcome Back')
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, '1 Entry present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".search()");
                assert.end();
            });
    });

    // regex
    TC.test('.regex()', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'title',
            regex = {
                pattern: '^source',
                options: 'i'
            },
            regexpObj = new RegExp(regex.pattern, regex.options);

        Query
            .regex(field, regex.pattern, regex.options)
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok((entries.length >= 1), '1 or more Entry/Entries present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return regexpObj.test(entry[field]);
                });
                assert.ok(flag, "regexp satisfied for all the entries in the resultset");
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".regex()");
                assert.end();
            });
    });


    // includeReference
    TC.test('.includeReference() - String', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .includeReference('reference')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                var flag = entries[0].every(function(entry) {
                    return (entry && entry.reference && typeof entry.reference === 'object');
                });
                assert.equal(flag, true, 'all the present reference are included');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".includeReference() - String");
                assert.end();
            });
    });

    TC.test('.includeReference() - Array', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .includeReference(['reference', 'other_reference'])
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                var flag = entries[0].every(function(entry) {
                    return (entry && entry.reference && typeof entry.reference === 'object' && entry.other_reference && typeof entry.other_reference === 'object');
                });
                assert.equal(flag, true, 'all the present reference are included');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".includeReference() - Array");
                assert.end();
            });
    });
    
    // includeCount
    TC.test('.includeCount()', function(assert) {
        var Query = Stack.ContentType('home').Query();

        Query
            .includeCount()
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                assert.ok(entries[1], 'Count present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".includeCount()");
                assert.end();
            });
    });

    // includeSchema
    TC.test('.includeSchema()', function(assert) {
        var Query = Stack.ContentType('home').Query();

        Query
            .includeSchema()
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                assert.ok(entries[1], 'Schema present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".includeSchema()");
                assert.end();
            });
    });

    // includeCount && includeSchema
    TC.test('.includeCount() and .includeSchema()', function(assert) {
        var Query = Stack.ContentType('home').Query();

        Query
            .includeCount()
            .includeSchema()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
                assert.ok(entries[0].length, 'Entries present in the resultset');
                assert.ok(entries[1].length, 'Schema present in the resultset');
                assert.ok(entries[2], 'Count present in the resultset');
                assert.end();
            }, function error(err) {
                console.error("Error :", err);
                assert.fail(".includeSchema()");
                assert.end();
            });
    });

    // only
    TC.test('.only() - Single String Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .only('title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
                });
                assert.ok(flag, 'entries with the field title in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".only() - Single String Parameter");
                assert.end();
            });
    });

    TC.test('.only() - Multiple String Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .only('BASE', 'title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
                });
                assert.ok(flag, 'entries with the field title in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".only() - Multiple String Parameter");
                assert.end();
            });
    });

    TC.test('.only() - Array Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .only(['title', 'url'])
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && Object.keys(entry).length === 3 && "title" in entry && "url" in entry && "uid" in entry);
                });
                assert.ok(flag, 'entries with the field title,url in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".only() - Array Parameter");
                assert.end();
            });
    });

    TC.test('.only() - For the reference - String', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .only('reference', 'title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    var _flag = true;
                    if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                        _flag = true;
                        _flag = entry.reference.every(function(reference) {
                            // console.log("==", reference && Object.keys(reference).length === 2 && "title" in reference && "url" in reference && "uid" in reference);
                            return (reference && Object.keys(reference).length === 2 && "title" in reference && "uid" in reference);
                        });
                    } else {
                        _flag = false;
                    }
                    return (_flag && entry && Object.keys(entry).length === 2 && "reference" in entry && "uid" in entry);
                });
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".only() - For the reference - String");
                assert.end();
            });
    });

    TC.test('.only() - For the reference - Array', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .only('reference', ['title'])
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    var _flag = true;
                    if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                        _flag = true;
                        _flag = entry.reference.every(function(reference) {
                            // console.log("==", reference && Object.keys(reference).length === 2 && "title" in reference && "url" in reference && "uid" in reference);
                            return (reference && Object.keys(reference).length === 2 && "title" in reference && "uid" in reference);
                        });
                    } else {
                        _flag = false;
                    }
                    return (_flag && entry && Object.keys(entry).length === 2 && "reference" in entry && "uid" in entry);
                });
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".only() - For the reference - Array");
                assert.end();
            });
    });

    // except
    TC.test('.except() - Single String Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .except('title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && !("title" in entry));
                });
                assert.ok(flag, 'entries without the field title in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".except() - Single String Parameter");
                assert.end();
            });
    });

    TC.test('.except() - Multiple String Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .except('BASE', 'title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && !("title" in entry));
                });
                assert.ok(flag, 'entries without the field title, url in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".except() - Multiple String Parameter");
                assert.end();
            });
    });

    TC.test('.except() - Array of String Parameter', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .except(['title', 'file'])
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    return (entry && !("title" in entry) && !("file" in entry));
                });
                assert.ok(flag, 'entries without the field title, file in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".except() - Array of String Parameter");
                assert.end();
            });
    });

    TC.test('.except() - For the reference - String', function(assert) {
        var Query = Stack.ContentType('source').Query();

        Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .except('reference', 'title')
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    var _flag;
                    if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                        _flag = true;
                        _flag = entry.reference.every(function(reference) {
                            return (reference && !("title" in reference));
                        });
                    } else {
                        _flag = false;
                    }
                    return (_flag && entry && Object.keys(entry).length === 3 && "reference" in entry && "uid" in entry && "url" in entry);
                });
                assert.ok(flag, 'entries with the field reference without title field in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".except() - For the reference - String");
                assert.end();
            });
    });

    TC.test('.except() - For the reference - Array', function(assert) {
        var Query = Stack.ContentType('source').Query(),
            field = 'updated_at';

        Query
            .includeReference('reference')
            .only('BASE', ['reference'])
            .except('reference', ['title'])
            .toJSON()
            .find()
            .then(function success(entries) {
                // assert.ok("entries" in result, 'Entries key present in the resultset');
                var flag = entries[0].every(function(entry) {
                    var _flag;
                    if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                        _flag = true;
                        _flag = entry.reference.every(function(reference) {
                            return (reference && !("title" in reference));
                        });
                    } else {
                        _flag = false;
                    }
                    return (_flag && entry && Object.keys(entry).length === 3 && "reference" in entry && "uid" in entry && "url" in entry);
                });
                assert.ok(flag, 'entries with the field reference without title field in the resultset');
                assert.end();
            }, function error(err) {
                console.error("error :", err);
                assert.fail(".except() - For the reference - Array");
                assert.end();
            });
    });
});