'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../dist/node/contentstack.js');
var Utils = require('./utils.js');
var init = require('./config');
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

test('findOne:  default .toJSON().findOne()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();
    Query
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  default .toJSON().findOne()");
            assert.end();
        });
});

/*!
 * SORTING
 * !*/
test('findOne:  .ascending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'created_at';

    Query
        .ascending(field)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .ascending()");
            assert.end();
        });
});

test('findOne:  .descending()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        field = 'created_at';

    Query
        .descending(field)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .descending()");
            assert.end();
        });
});


/*!
 * COMPARISION
 * !*/
test('findOne:  .lessThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        value = 11;
    Query
        .lessThan('num_field', value)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.num_field < value), 'Entry num_field having value less than '+value+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .lessThan()");
            assert.end();
        });
});

test('findOne:  .lessThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        value = 11;
    Query
        .lessThanOrEqualTo('num_field', value)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.num_field <= value), 'Entry num_field having value less than or equal to '+value+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .lessThanOrEqualTo()");
            assert.end();
        });
});

test('findOne:  .greaterThan()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;

    Query
        .greaterThan('num_field', value)
        .ascending(field)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry[field] > value), 'Entry num_field having value greater than '+value+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .greaterThan()");
            assert.end();
        });
});

test('findOne:  .greaterThanOrEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 11;

    Query
        .greaterThanOrEqualTo('num_field', value)
        .descending(field)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry[field] >= value), 'Entry num_field having value greater than '+value+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error : ", err);
            assert.fail("findOne:  .greaterThanOrEqualTo()");
            assert.end();
        });
});

test('findOne:  .notEqualTo()', function(assert) {
    var Query = Stack.ContentType(contentTypes.numbers_content_type).Query(),
        field = 'num_field',
        value = 6;

    Query
        .notEqualTo('num_field', value)
        .descending(field)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry[field] !== value), 'Entry num_field having value is not equal to '+value+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error : ", err);
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
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.title && ~_in.indexOf(entry.title)), 'Entry title exists from the available options '+_in.join(', ')+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .containedIn()");
            assert.end();
        });
});

test('findOne:  .notContainedIn()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        _in = ["source1", "source2", "source3", "source4"];

    Query
        .notContainedIn('title', _in)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.title && _in.indexOf(entry.title) === -1), 'Entry title not exists from the available options '+_in.join(', ')+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.deepEqual(err,  {error_code: 141, error_message: 'The requested entry doesn\'t exist.'}, "No entry found");
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
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && typeof entry[queryField] !== 'undefined'), 'Entry having the '+queryField+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .exists()");
            assert.end();
        });
});

test('findOne:  .notExists()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query(),
        queryField = "isspecial";

    Query
        .notExists(queryField)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && typeof entry[queryField] === 'undefined'), 'Entry having the '+queryField+'.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.deepEqual(err,  {error_code: 141, error_message: 'The requested entry doesn\'t exist.'}, "No entry found");
            assert.end();
        });
});


// Pagination
test('findOne:  .skip()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .toJSON().find()
        .then(function success(allEntries) {
            assert.ok(allEntries.length, 'entry key present in the resultset');
            Stack
                .ContentType(contentTypes.source)
                .Query()
                .skip(1)
                .toJSON().findOne()
                .then(function success(entry) {
                    assert.deepEqual(allEntries[0][1], entry, 'Element matched.');
                    assert.end();
                }, function error(err) {
                    console.error("Error :",err);
                    assert.fail("findOne:  .skip()");
                    assert.end();
                });
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .skip()");
            assert.end();
        });
});

// Logical
test('findOne:  .or() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().containedIn('title', ['source1', 'source2']);
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .or(Query1, Query2)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && (~(entry.title === 'source1' || entry.boolean === true))), 'Entry satisfies the $OR condition');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .or() - Query Objects");
            assert.end();
        });
});

test('findOne:  .and() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType(contentTypes.source).Query().where('title', 'source1');
    var Query2 = Stack.ContentType(contentTypes.source).Query().where('boolean', true);
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .and(Query1, Query2)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok(~(entry.title === 'source1' && entry.boolean === true), 'Entry satisfies the $AND operation.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .and() - Query Objects");
            assert.end();
        });
});

// Custom query
test('findOne:  .query() - Raw query', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .query({"$or": [{"title": "source1"}, {"boolean" : "false"}]})
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.ok(~(entry.title === 'source1' || entry.boolean === true), '$OR condition satisfied');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .query() - Raw query");
            assert.end();
        });
});


// // tags
// test('findOne:  .tags()', function(assert) {
//     var Query = Stack.ContentType(contentTypes.source).Query(),
//         tags = ["tag1", "tag2"];

//     Query
//         .tags(tags)
//         .toJSON().findOne()
//         .then(function success(entry) {
//             assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
//             assert.equal((Utils.arrayPresentInArray(tags, entry.tags) > 0), true, 'Tags specified are found in result set');
//             assert.end();
//         }, function error(err) {
//             console.error("Error :",err);
//             assert.fail("findOne:  .tags()");
//             assert.end();
//         });
// });


// search
test('findOne:  .search()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .search('source1')
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
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
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.ok((new RegExp(regex.pattern, regex.options).test(entry[field])), "regexp satisfied");
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .regex()");
            assert.end();
        });
});


// includeReference
test('findOne:  .includeReference() - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .toJSON().findOne()
        .then(function success(entry) {
            assert.equal((entry && entry.reference && typeof entry.reference === 'object'), true, 'all the present reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .includeReference() - String");
            assert.end();
        });
});

test('findOne:  .includeReference() - Array', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference(['reference', 'other_reference'])
        .toJSON().findOne()
        .then(function success(entry) {
            assert.equal((entry && entry.reference && typeof entry.reference === 'object' && entry.other_reference && typeof entry.other_reference === 'object'), true, 'all the present reference and other reference are included');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .includeReference() - Array");
            assert.end();
        });
});


// includeSchema
test('findOne:  .includeSchema()', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeSchema()
        .toJSON().findOne()
        .then(function success(entry) {
            // console.log("result : ", Object.keys(result || {}));
            assert.ok(entry, 'Entry present in the resultset');
            //assert.ok(entry.length, 'Schema key present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .includeSchema()");
            assert.end();
        });
});


// only
test('findOne:  .only() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('title')
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
            assert.ok(flag, 'entry with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .only() - Single String Parameter");
            assert.end();
        });
});

test('findOne:  .only() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only('BASE', 'title')
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && Object.keys(entry).length === 3 && "title" in entry && "uid" in entry && "url" in entry);
            assert.ok(flag, 'entry with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .only() - Multiple String Parameter");
            assert.end();
        });
});

test('findOne:  .only() - Array Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .only(['title', 'url'])
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && Object.keys(entry).length === 3 && "title" in entry  && "url" in entry && "uid" in entry);
            assert.ok(flag, 'entry with the field title,url in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
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
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = false;
            if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                flag = entry.reference.every(function(reference) {
                    return (reference && "title" in reference && "uid" in reference);
                });
            }
            assert.equal(flag, true, 'Entry has the reference with only paramteres.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
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
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = false;
            if(entry && entry['reference'] && entry['reference'].length) {
                flag = entry.reference.every(function(reference) {
                    return (reference && "title" in reference && "uid" in reference);
                });
            }
            assert.equal(flag, true, 'Entry has the reference with only paramteres.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .only() - For the reference - Array");
            assert.end();
        });
});

// except
test('findOne:  .except() - Single String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('title')
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && !("title" in entry));
            assert.ok(flag, 'entry without the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .except() - Single String Parameter");
            assert.end();
        });
});

test('findOne:  .except() - Multiple String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except('BASE', 'title')
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && !("title" in entry));
            assert.ok(flag, 'entry without the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .except() - Multiple String Parameter");
            assert.end();
        });
});

test('findOne:  .except() - Array of String Parameter', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .except(['title', 'file'])
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = (entry && !("title" in entry) && !("file" in entry));
            assert.ok(flag, 'entry without the field title, file in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .except() - Array of String Parameter");
            assert.end();
        });
});

test('findOne:  .except() - For the reference - String', function(assert) {
    var Query = Stack.ContentType(contentTypes.source).Query();

    Query
        .includeReference('reference')
        .only('BASE', 'reference')
        .except('reference', 'title')
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = false;
            if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                flag = entry.reference.every(function(reference) {
                    return (reference && !("title" in reference));
                });
            }
            assert.ok(flag, 'entry with the field reference without title field in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
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
        .toJSON().findOne()
        .then(function success(entry) {
            var flag = false;
            if(entry && entry['reference'] && typeof entry['reference'] === 'object') {
                flag = entry.reference.every(function(reference) {
                    return (reference && !("title" in reference));
                });
            }
            assert.ok(flag, 'entry with the field reference without title field in the resultset');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .except() - For the reference - Array");
            assert.end();
        });
});