'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const _ = require('lodash');
const init = require('../config.js');
const Utils = require('./utils.js');

const contentTypes = init.contentTypes;

let Stack;
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

test('default .find()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';
    Query
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(!entries[1], 'Count should not present in the result');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] <= prev);
                    prev = entry[field];
                    return (entry.updated_at <= prev);
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
test('.ascending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .ascending(field)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] <= prev);
                    prev = entry[field];
                    return (entry[field] >= prev);
                });
                assert.equal(_entries, true, "entries sorted ascending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".ascending()");
            assert.end();
        });
});

test('.descending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'created_at';

    Query
        .descending(field)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] <= prev);
                    prev = entry[field];
                    return (entry[field] >= prev);
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
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
test('.lessThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        value = 11,
        field = 'updated_at';
    Query
        .lessThan('num_field', value)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, '1 Entry present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = true;
                _entries = entries[0].slice(1).every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] < value);
                    prev = entry[field];
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".lessThan()");
            assert.end();
        });
});

test('.lessThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'updated_at',
        value = 11;
    Query
        .lessThanOrEqualTo('num_field', value)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] <= prev);
                    prev = entry[field];
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".lessThanOrEqualTo()");
            assert.end();
        });
});

test('.greaterThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;

    Query
        .greaterThan('num_field', value)
        .ascending(field)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].slice(1).every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] > value);
                    prev = entry[field];
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted ascending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".greaterThan()");
            assert.end();
        });
});

test('.greaterThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;

    Query
        .greaterThanOrEqualTo('num_field', value)
        .descending(field)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] >= value);
                    prev = entry[field];
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".greaterThanOrEqualTo()");
            assert.end();
        });
});

test('.notEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 6;

    Query
        .notEqualTo('num_field', value)
        .descending(field)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    var flag = (entry[field] != value);
                    prev = entry[field];
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
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

test('.containedIn()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        _in = ["source1", "source2"],
        field = 'updated_at';

    Query
        .containedIn('title', _in)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    return (_in.indexOf(entry.get('title')) != -1);
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".containedIn()");
            assert.end();
        });
});

test('.notContainedIn()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        _in = ["sourceddd1", "sourceddddd2"];

    Query
        .notContainedIn('title', _in)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'No Entry present in the resultset');
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

test('.exists()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        queryField = "boolean",
        field = 'updated_at';

    Query
        .exists(queryField)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries should not be present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    var flag = (entry.get(field) <= prev);
                    prev = entry.get(field);
                    return flag;
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".exists()");
            assert.end();
        });
});

test('.notExists()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        queryField = "isspecial",
        field = 'updated_at';

    Query
        .notExists(queryField)
        .find()
        .then(function success(entries) {
            assert.ok("entries" in entries, 'Entries key present in the resultset');
            //assert.notok(entries[0].length, 'No entry present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var prev = entries[0][0].get(field);
                var _entries = entries[0].every(function(entry) {
                    return (entry.get(field) <= prev);
                });
                assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".notExists()");
            assert.end();
        });
});


// Pagination
test('.skip()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .toJSON()
        .find()
        .then(function success(allEntries) {
            // assert.ok("entries" in allEntries, 'Entries key present in the resultset');
            Stack
                .ContentType(contentTypes.source)
                .Query()
                .skip(1)
                .toJSON()
                .find()
                .then(function success(entries) {
                    // assert.ok("entries" in result, 'Entries key present in the resultset');
                    assert.ok((entries[0].length >= 2), '2 or more Entries present in the resultset');
                    assert.deepEqual(allEntries[0].slice(1), entries[0], 'All elements matched.');
                    if (entries && entries.length && entries[0].length) {
                        allEntries[0] = allEntries[0].slice(1);
                        //var prev = entries[0][0].get(field);
                        var prev = entries[0][0][field];
                        var _entries = entries[0].every(function(entry, idx) {
                            var flag = (entry[field] <= prev);
                            prev = entry[field];
                            return flag;
                        });
                        assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
                    }
                    assert.end();
                }, function error(err) {
                    console.error("error :", err);
                    assert.fail("");
                    assert.end();
                });
        }, function error(err) {
            console.error("error :", err);
            assert.fail("skip()");
            assert.end();
        });
});

test('.limit()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .toJSON()
        .find()
        .then(function success(allEntries) {
            // assert.ok("entries" in allEntries, 'Entries key present in the resultset');
            Stack
                .ContentType(contentTypes.source)
                .Query()
                .limit(2)
                .toJSON()
                .find()
                .then(function success(entries) {
                    // assert.ok("entries" in result, 'Entries key present in the resultset');
                    assert.ok(entries[0].length, 'Entries present in the resultset');
                    assert.deepEqual(allEntries[0].slice(0, 2), entries[0], 'All elements matched.');
                    if (entries && entries.length && entries[0].length) {
                        var prev = entries[0][0][field];
                        var _entries = entries[0].every(function(entry) {
                            var flag = (entry[field] <= prev);
                            prev = entry[field];
                            return flag;
                        });
                        assert.equal(_entries, true, "entries sorted descending on '" + field + "' field");
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

test('.count()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

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



// Logical
test('.or() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().containedIn('title', ['source1', 'source2']);
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .or(Query1, Query2)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    return (~(entry.title === 'source1' || entry.boolean === true));
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

test('.and() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().where('title', 'source1');
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .and(Query1, Query2)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, '1 Entry present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    return (~(entry.title === 'source1' || entry.boolean === true));
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

test('.and() - Raw queries', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().where('title', 'source1');
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .and(Query1, Query2)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, '1 Entry present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    return (~(entry.title === 'source1' || entry.boolean === true));
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
test('.query() - Raw query', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .query({ "$or": [{ "title": "source1" }, { "boolean": "true" }] })
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    entry = entry.toJSON();
                    if (entry.title === 'source1' || entry.boolean === true) {
                        return true;
                    } else {
                        return false;
                    }
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
test('.tags()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'tags',
        tags = ["tag1", "tag2"];

    Query
        .tags(tags)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok((entries.length >= 1), '1 or more Entry/Entries present in the resultset');
            if (entries && entries.length && entries[0].length) {
                var _entries = entries[0].every(function(entry) {
                    return (Utils.arrayPresentInArray(tags, entry.get(field)));
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
test('.search()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .search('source1')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, '1 or more Entry present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".search()");
            assert.end();
        });
});

// regex
test('.regex()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'title',
        regex = {
            pattern: '^source',
            options: 'i'
        },
        regexpObj = new RegExp(regex.pattern, regex.options);

    Query
        .regex(field, regex.pattern, regex.options)
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok((entries.length >= 1), '1 or more Entry/Entries present in the resultset');
            var flag = entries[0].every(function(entry) {
                return regexpObj.test(entry.get(field));
            });
            assert.ok(flag, "regexp satisfied for all the entries in the resultset");
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".regex()");
            assert.end();
        });
});


// includeReference
test('.includeReference() - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                return (entry && entry.get('reference') && typeof entry.get('reference') === 'object');
            });
            assert.equal(flag, true, 'all the present reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeReference() - String");
            assert.end();
        });
});

test('.includeReference() - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference(['reference', 'other_reference'])
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                return (entry && entry.get('reference') && typeof entry.get('reference') === 'object' && entry.get('other_reference') && typeof entry.get('other_reference') === 'object');
            });
            assert.equal(flag, true, 'all the present reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeReference() - Array");
            assert.end();
        });
});

// includeCount
test('.includeCount()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeCount()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
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
test('.includeSchema()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeSchema()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(entries[1].length, 'Schema present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeSchema()");
            assert.end();
        });
});


// includeCount && includeSchema
test('.includeCount() and .includeSchema()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeCount()
        .includeSchema()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
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

// includeContentType
test('.includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeContentType()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(entries[1], 'ContentType present in the resultset');
            assert.ok(entries[1]['title'], 'ContentType title exists');
            assert.ok((entries[1]['uid'] === contentTypes.source), 'ContentType uid is same as requested');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".includeContentType()");
            assert.end();
        });
});

// includeCount && includeContentType
test('.includeCount() and .includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeCount()
        .includeContentType()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(entries[1], 'ContentType present in the resultset');
            assert.ok(entries[1]['title'], 'ContentType title exists');
            assert.ok((entries[1]['uid'] === contentTypes.source), 'ContentType uid is same as requested');
            assert.ok(entries[2], 'Count present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeCount && includeContentType");
            assert.end();
        });
});

// includeSchema && includeContentType
test('.includeSchema() and .includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeSchema()
        .includeContentType()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(entries[1], 'ContentType present in the resultset');
            assert.ok(entries[1]['title'], 'ContentType title exists');
            assert.ok((entries[1]['uid'] === contentTypes.source), 'ContentType uid is same as requested');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeCount && includeContentType");
            assert.end();
        });
});

// includeCount, includeSchema && includeContentType
test('.includeSchema() and .includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeCount()
        .includeSchema()
        .includeContentType()
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            //assert.equal(Utils.isEntriesPublished(entries[0], Stack.environment_uid, 'en-us'), true, "Entries present in the resultset are published.");
            assert.ok(entries[0].length, 'Entries present in the resultset');
            assert.ok(entries[1], 'ContentType present in the resultset');
            assert.ok(entries[1]['title'], 'ContentType title exists');
            assert.ok((entries[1]['uid'] === contentTypes.source), 'ContentType uid is same as requested');
            assert.ok(entries[2], 'Count present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".includeCount && includeContentType");
            assert.end();
        });
});


// only
test('.only() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
            });
            assert.ok(flag, 'entries with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".only() - Single String Parameter");
            assert.end();
        });
});

test('.only() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('BASE', 'title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
            });
            assert.ok(flag, 'entries with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".only() - Multiple String Parameter");
            assert.end();
        });
});

test('.only() - Array Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only(['title', 'url'])
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && Object.keys(entry).length === 3 && "title" in entry && "url" in entry && "uid" in entry);
            });
            assert.ok(flag, 'entries with the field title,url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".only() - Array Parameter");
            assert.end();
        });
});

test('.only() - For the reference - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .only('reference', 'title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                var _flag = true;
                if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
                    _flag = true;
                    _flag = entry.reference.every(function(reference) {
                        // console.log("==", reference && Object.keys(reference).length === 2 && "title" in reference && "url" in reference && "uid" in reference);
                        return (reference && Object.keys(reference).length === 4 && "title" in reference && "uid" in reference && "url" in reference);
                    });
                } else {
                    _flag = false;
                }
                return (_flag && entry && Object.keys(entry).length === 3 && "reference" in entry && "uid" in entry && "url" in entry);
            });
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".only() - For the reference - String");
            assert.end();
        });
});

test('.only() - For the reference - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .only('reference', ['title'])
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                var _flag = true;
                if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
                    _flag = true;
                    _flag = entry.reference.every(function(reference) {
                        console.log("==", reference && Object.keys(reference).length === 2 && "title" in reference && "url" in reference && "uid" in reference);
                        return (reference && Object.keys(reference).length === 2 && "title" in reference && "uid" in reference);
                    });
                } else {
                    _flag = false;
                }
                return (_flag && entry && Object.keys(entry).length === 3 && "reference" in entry && "uid" in entry && "url" in entry);
            });
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".only() - For the reference - Array");
            assert.end();
        });
});

// except
test('.except() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && !("title" in entry));
            });
            assert.ok(flag, 'entries without the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".except() - Single String Parameter");
            assert.end();
        });
});

test('.except() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('BASE', 'title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && !("title" in entry));
            });
            assert.ok(flag, 'entries without the field title, url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".except() - Multiple String Parameter");
            assert.end();
        });
});

test('.except() - Array of String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except(['title', 'file'])
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                return (entry && !("title" in entry) && !("file" in entry));
            });
            assert.ok(flag, 'entries without the field title, file in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".except() - Array of String Parameter");
            assert.end();
        });
});

test('.except() - For the reference - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .except('reference', 'title')
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                var _flag;
                if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
                    _flag = true;
                    _flag = entry.reference.every(function(reference) {
                        return (reference && !("title" in reference));
                    });
                } else {
                    _flag = false;
                }
                return (_flag && entry && Object.keys(entry).length === 3 && "reference" in entry && "uid" in entry && "url" in entry);
            });
            assert.ok(flag, 'entries withthe field reference without title field in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail(".except() - For the reference - String");
            assert.end();
        });
});

test('.except() - For the reference - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .except('reference', ['title'])
        .find()
        .then(function success(entries) {
            // assert.ok("entries" in result, 'Entries key present in the resultset');
            var flag = entries[0].every(function(entry) {
                entry = entry.toJSON();
                var _flag;
                if (entry && entry['reference'] && typeof entry['reference'] === 'object') {
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
            console.error("Error :", err);
            assert.fail(".except() - For the reference - Array");
            assert.end();
        });
});