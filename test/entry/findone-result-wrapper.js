'use strict';
/*
 * Module Dependencies.
 */
const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');
const Utils = require('./utils.js');
const init = require('../config.js');

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

test('findOne:  default .findOne()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();
    Query
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  default .findOne()");
            assert.end();
        });
});

/*!
 * SORTING
 * !*/
test('findOne:  .ascending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'updated_at';

    Query
        .ascending(field)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .ascending()");
            assert.end();
        });
});

test('findOne:  .descending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'created_at';

    Query
        .descending(field)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .descending()");
            assert.end();
        });
});


/*!
 * COMPARISION
 * !*/
test('findOne:  .lessThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;
    Query
        .lessThan(field, value)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get(field) < value), 'Entry num_field having value less than ' + value + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .lessThan()");
            assert.end();
        });
});

test('findOne:  .lessThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;
    Query
        .lessThanOrEqualTo(field, value)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get(field) <= value), 'Entry num_field having value less than or equal to ' + value + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .lessThanOrEqualTo()");
            assert.end();
        });
});

test('findOne:  .greaterThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 6;

    Query
        .greaterThan(field, value)
        .ascending(field)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get(field) > value), 'Entry num_field having value greater than ' + value + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .greaterThan()");
            assert.end();
        });
});

test('findOne:  .greaterThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;

    Query
        .greaterThanOrEqualTo(field, value)
        .descending(field)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get(field) >= value), 'Entry num_field having value greater than ' + value + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .greaterThanOrEqualTo()");
            assert.end();
        });
});

test('findOne:  .notEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 6;

    Query
        .notEqualTo(field, value)
        .descending(field)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get(field) !== value), 'Entry num_field having value is not equal to ' + value + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .notEqualTo()");
            assert.end();
        });
});


/*!
 * Array/Subset
 * !*/

test('findOne:  .containedIn()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        _in = ["source1", "source2"];

    Query
        .containedIn('title', _in)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('title') && ~_in.indexOf(entry.get('title'))), 'Entry title exists from the available options ' + _in.join(', ') + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .containedIn()");
            assert.end();
        });
});

test('findOne:  .notContainedIn()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        _in = ["source1"];

    Query
        .notContainedIn('title', _in)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('title') && _in.indexOf(entry.get('title')) === -1), 'Entry title not exists from the available options ' + _in.join(', ') + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("findOne:  .notContainedIn() :", err);
            assert.deepEqual(err, { error_code: 141, error_message: 'The requested entry doesn\'t exist.' }, "No entry found");
            assert.end();
        });
});


/*!
 *Element(exists)
 * !*/

test('findOne:  .exists()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        queryField = "boolean";

    Query
        .exists(queryField)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && typeof entry.get(queryField) !== 'undefined'), 'Entry having the ' + queryField + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .exists()");
            assert.end();
        });
});

test('findOne:  .notExists()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        queryField = "isspecial";

    Query
        .notExists(queryField)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && typeof entry.get(queryField) === 'undefined'), 'Entry having the ' + queryField + '.');
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("findOne:  .notExists():", err);
            assert.deepEqual(err, { error_code: 141, error_message: 'The requested entry doesn\'t exist.' }, "No entry found");
            assert.end();
        });
});


// Pagination
test('findOne:  .skip()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .find()
        .then(function success(allEntries) {
            assert.ok(allEntries.length, 'entry key present in the resultset');
            Stack
                .ContentType(contentTypes.source)
                .Query()
                .skip(1)
                .findOne()
                .then(function result(entry) {
                    assert.deepEqual(allEntries[0][1].toJSON(), entry.toJSON(), 'Element matched.');
                    assert.end();
                }, function error(err) {
                    console.error("error :", err);
                    assert.fail("findOne:  .skip()");
                    assert.end();
                });
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .skip()");
            assert.end();
        });
});



// Logical
test('findOne:  .or() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().containedIn('title', ['source1']);
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', 'false');
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .or(Query1, Query2)
        .findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.get('uid') && entry.get('locale') && entry.get('publish_details')), 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .or() - Query Objects");
            assert.end();
        });
});

test('findOne:  .and() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().containedIn('title', ['source1']);
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .and(Query1, Query2)
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.ok(entry && entry.uid && entry.locale && entry.publish_details, 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .and() - Query Objects");
            assert.end();
        });
});



// Custom query
test('findOne:  .query() - Raw query', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .query({ "$or": [{ "title": "source1" }, { "boolean": "false" }] })
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.ok(entry && entry.uid && entry.locale && entry.publish_details, 'Entry should have uid, publish_details, locale.');
            assert.ok(~(entry.title === 'source1' || entry.boolean === true), '$OR condition satisfied');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .query() - Raw query");
            assert.end();
        });
});


// tags
test('findOne:  .tags()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        tags = ["tag1", "tag2"];

    Query
        .tags(tags)
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.ok(entry && entry.uid && entry.locale && entry.publish_details, 'Entry should have uid, publish_details, locale.');
            assert.equal((Utils.arrayPresentInArray(tags, entry.tags) > 0), true, 'Tags specified are found in result set');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .tags()");
            assert.end();
        });
});


// search
test('findOne:  .search()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .search('source1')
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.ok(entry && entry.uid && entry.locale && entry.publish_details, 'Entry should have uid, publish_details, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .search()");
            assert.end();
        });
});


// search
test('findOne:  .regex()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'title',
        regex = {
            pattern: '^source',
            options: 'i'
        };

    Query
        .regex(field, regex.pattern, regex.options)
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.ok(entry && entry.uid && entry.locale && entry.publish_details, 'Entry should have uid, publish_details, locale.');
            assert.ok((new RegExp(regex.pattern, regex.options).test(entry[field])), "regexp satisfied");
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .regex()");
            assert.end();
        });
});


test('findOne: without fallback', function(assert) {
    var _in = ['ja-jp']
    Stack.ContentType(contentTypes.source).Query().language('ja-jp')
    .findOne()
    .then((entry) => {
        var _entries = (_in.indexOf(entry.toJSON()['publish_details']['locale']) != -1);
        assert.equal(_entries, true, "Publish content fallback");
        assert.end();
    }).catch((error) => {
        assert.fail("Entries default .find() fallback catch", error.toString());
        assert.end();
    })
})

test('findOne: fallback', function(assert) {
    var _in = ['ja-jp', 'en-us']
    Stack.ContentType(contentTypes.source).Query().language('ja-jp')
    .includeFallback()
    .findOne()
    .then((entry) => {
        var _entries = (_in.indexOf(entry.toJSON()['publish_details']['locale']) != -1);
        assert.equal(_entries, true, "Publish content fallback");
        assert.end();
    }).catch((error) => {
        assert.fail("Entries default .find() fallback catch", error.toString());
        assert.end();
    })
})

// includeReference
test('findOne:  .includeReference() - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .findOne()
        .then(function success(entry) {
            assert.equal((entry && entry.get('reference') && typeof entry.get('reference') === 'object'), true, 'all the present reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .includeReference() - String");
            assert.end();
        });
});

test('findOne:  .includeReference() - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference(['reference', 'other_reference'])
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            assert.equal((entry && entry.reference && typeof entry.reference === 'object' && entry.other_reference && typeof entry.other_reference === 'object'), true, 'all the present reference and other reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .includeReference() - Array");
            assert.end();
        });
});


// includeSchema
test('findOne:  .includeSchema()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeSchema()
        .findOne()
        .then(function success(entry, schema) {
            // console.log("result : ", Object.keys(result || {}));
            assert.ok(entry, 'entry present in the resultset');
            //assert.ok(schema, 'Schema is not present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .includeSchema()");
            assert.end();
        });
});

// includeContentType
test('findOne:  .includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeContentType()
        .findOne()
        .then(function success(entry, contentType) {
            // console.log("result : ", entry, contentType);
            assert.ok(entry, 'entry present in the resultset');
            assert.ok((typeof contentType === "undefined"), 'ContentType is not present.');
            // assert.ok((contentType.uid === "source"), 'ContentType is title matched.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .includeContentType()");
            assert.end();
        });
});

// includeSchema & includeContentType
test('findOne:  includeSchema & .includeContentType()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeSchema()
        .includeContentType()
        .findOne()
        .then(function success(entry, contentType) {
            // console.log("result : ", entry, contentType);
            assert.ok(entry, 'entry present in the resultset');
            assert.ok((typeof contentType === "undefined"), 'ContentType is not present.');
            // assert.ok((contentType.uid === "source"), 'ContentType is title matched.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  includeSchema & .includeContentType()");
            assert.end();
        });
});

// only
test('findOne:  .only() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('title')
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            var flag = (entry && Object.keys(entry).length === 2 && "title" in entry && "uid" in entry);
            assert.ok(flag, 'entry with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .only() - Single String Parameter");
            assert.end();
        });
});

test('findOne:  .only() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('BASE', 'title')
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            var flag = (entry && Object.keys(entry).length === 2 && "title" in entry && "uid" in entry);
            assert.ok(flag, 'entry with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .only() - Multiple String Parameter");
            assert.end();
        });
});

test('findOne:  .only() - Array Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only(['title', 'url'])
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            var flag = (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
            assert.ok(flag, 'entry with the field title,url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .only() - Array Parameter");
            assert.end();
        });
});

test('findOne:  .only() - For the reference - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', 'reference')
        .only('reference', 'title')
        .findOne()
        .then(function success(entry) {
            var flag = false;
            if (entry && entry.get('reference') && typeof entry.get('reference') === 'object') {
                flag = entry.get('reference').every(function(reference) {
                    return (reference && "title" in reference && "uid" in reference);
                });
            } else {
                flag = true
            }
            assert.equal(flag, true, 'Entry has the reference with only paramteres.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .only() - For the reference - String");
            assert.end();
        });
});

test('findOne:  .only() - For the reference - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .only('reference', ['title'])
        .findOne()
        .then(function success(entry) {
            var flag = false;            if (entry && entry.get('reference')) {
                if (entry.get('reference').length) {
                    if (entry.get('reference').length === 0){
                        flag = true
                    } else {
                        flag = entry.get('reference').every(function(reference) {
                            return (reference && "title" in reference && "uid" in reference);
                        });
                    }
                } else {
                    flag = true
                }
            } else {
                flag = true
            }
            assert.equal(flag, true, 'Entry do not have the reference with only paramteres.');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .only() - For the reference - Array");
            assert.end();
        });
});

// except
test('findOne:  .except() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('title')
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            var flag = (entry && !("title" in entry));
            assert.ok(flag, 'entry without the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .except() - Single String Parameter");
            assert.end();
        });
});

test('findOne:  .except() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('BASE', 'title')
        .findOne()
        .then(function success(entry) {
            entry = entry.toJSON();
            var flag = (entry && !("title" in entry));
            assert.ok(flag, 'entry without the field title, url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .except() - Multiple String Parameter");
            assert.end();
        });
});

test('findOne:  .except() - Array of String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except(['title', 'url'])
        .findOne()
        .then(function success(entry) {
            var flag = (entry && !("title" in entry) && !("url" in entry));
            assert.ok(flag, 'entry without the field title, url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("");
            assert.end();
        });
});

test('findOne:  .except() - For the reference - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', 'reference')
        .except('reference', 'title')
        .findOne()
        .then(function success(entry) {
            var flag = false;
            if (entry && entry.get('reference') && typeof entry.get('reference') === 'object') {
                flag = entry.get('reference').every(function(reference) {
                    return (reference && !("title" in reference));
                });
            }
            assert.ok(flag, 'entry with the field reference without title field in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .except() - For the reference - String");
            assert.end();
        });
});

test('findOne:  .except() - For the reference - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', ['reference'])
        .except('reference', ['title'])
        .findOne()
        .then(function success(entry) {
            var flag = false;
            if (entry && entry.get('reference') && typeof entry.get('reference') === 'object') {
                flag = entry.get('reference').every(function(reference) {
                    return (reference && !("title" in reference));
                });
            }
            assert.ok(flag, 'entry with the field reference without title field in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :", err);
            assert.fail("findOne:  .except() - For the reference - Array");
            assert.end();
        });
});