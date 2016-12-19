'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('./../contentstack.js');
var Utils = require('./utils.js');
var init = require('./config');

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
    var Query = Stack.ContentType('blog').Query();
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
    var Query = Stack.ContentType('blog').Query(),
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
    var Query = Stack.ContentType('blog').Query(),
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
    var Query = Stack.ContentType('numbers_content_type').Query(),
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
    var Query = Stack.ContentType('numbers_content_type').Query(),
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
    var Query = Stack.ContentType('numbers_content_type').Query(),
        field = 'num_field',
        value = 6;

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
    var Query = Stack.ContentType('numbers_content_type').Query(),
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
    var Query = Stack.ContentType('numbers_content_type').Query(),
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
    var Query = Stack.ContentType('multiple_assets').Query(),
        _in = ["Multiple Assets", "Multiple Assets 2"];

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
    var Query = Stack.ContentType('multiple_assets').Query(),
        _in = ["Multiple Assets", "Multiple Assets 2"];

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
    var Query = Stack.ContentType('multiple_assets').Query(),
        queryField = "assets";

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
    var Query = Stack.ContentType('multiple_assets').Query(),
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
    var Query = Stack.ContentType('source').Query();

    Query
        .toJSON().find()
        .then(function success(allEntries) {
            assert.ok(allEntries.length, 'entry key present in the resultset');
            Stack
                .ContentType('source')
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

// Navigation
// test('findOne:  .beforeUid()', function(assert) {
//     var Query = Stack.ContentType('source').Query(),
//         uid = "blt5cbb9523685c42bf";

//     Query
//         .beforeUid(uid)
//         .toJSON().findOne()
//         .then(function success(entry) {
//             assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
//             assert.end();
//         }, function error(err) {
//             console.error("Error :",err);
//             assert.fail("findOne:  .beforeUid()");
//             assert.end();
//         })
// });

// test('findOne:  .afterUid()', function(assert) {
//     var Query = Stack.ContentType('source').Query(),
//         uid = "blt5cbb9523685c42bf";

//     Query
//         .afterUid(uid)
//         .toJSON().findOne()
//         .then(function success(entry) {
//             assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
//             assert.end();
//         }, function error(err) {
//             console.error("Error :",err);
//             assert.deepEqual(err,  {error_code: 141, error_message: 'The requested entry doesn\'t exist.'}, "No entry found");
//             assert.end();
//         })
// });


// Logical
test('findOne:  .or() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt02e485ce0a3aef14']);
    var Query2 = Stack.ContentType('source').Query().containedIn('other_reference', ['blted2d2fa1f02c4981']);
    var Query = Stack.ContentType('source').Query();

    Query
        .or(Query1, Query2)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && (~entry.reference.indexOf('blt02e485ce0a3aef14') || ~entry.other_reference.indexOf('blted2d2fa1f02c4981'))), 'Entry satisfies the $OR condition');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .or() - Query Objects");
            assert.end();
        });
});

test('findOne:  .or() - Raw queries', function(assert) {
    var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt02e485ce0a3aef14']).getQuery();
    var Query2 = Stack.ContentType('source').Query().containedIn('other_reference', ['blted2d2fa1f02c4981']).getQuery();
    var Query = Stack.ContentType('source').Query();

    Query
        .or(Query1, Query2)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && (~entry.reference.indexOf('blt02e485ce0a3aef14') || ~entry.other_reference.indexOf('blted2d2fa1f02c4981'))), 'Entry satisfies the $OR condition');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .or() - Raw queries");
            assert.end();
        });
});

test('findOne:  .and() - Query Objects', function(assert) {
    var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']);
    var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']);
    var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']);
    var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']);
    var Query = Stack.ContentType('source').Query();

    Query
        .and(Query1, Query2, Query3, Query4)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6')), 'Entry satisfies the $AND operation.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .and() - Query Objects");
            assert.end();
        });
});

test('findOne:  .and() - Raw queries', function(assert) {
    var Query1 = Stack.ContentType('source').Query().containedIn('reference', ['blt1ce8bb666a834bfb']).getQuery();
    var Query2 = Stack.ContentType('source').Query().containedIn('group.sub_group.reference', ['blt1ce8bb666a834bfb']).getQuery();
    var Query3 = Stack.ContentType('source').Query().containedIn('other_reference', ['blt594c88859c50fdb6']).getQuery();
    var Query4 = Stack.ContentType('source').Query().containedIn('group.sub_group.sub_sub_group.other_reference', ['blt594c88859c50fdb6']).getQuery();
    var Query = Stack.ContentType('source').Query();

    Query
        .and(Query1, Query2, Query3, Query4)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && ~entry.reference.indexOf('blt1ce8bb666a834bfb') && ~entry.group[0].sub_group[0].reference.indexOf('blt1ce8bb666a834bfb') && ~entry.other_reference.indexOf('blt594c88859c50fdb6') && ~entry.group[0].sub_group[0].sub_sub_group.other_reference.indexOf('blt594c88859c50fdb6')),'Entry satisfies the $AND operation.');
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .and() - Raw queries");
            assert.end();
        });
});


// Custom query
test('findOne:  .query() - Raw query', function(assert) {
    var Query = Stack.ContentType('source').Query();

    Query
        .query({"$or": [{"reference": {"$in": ["blt1ce8bb666a834bfb"]}}, {"other_reference" : {"$in": ["blted2d2fa1f02c4981"]}}]})
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.ok((~entry.reference.indexOf('blt1ce8bb666a834bfb') || ~entry.other_reference.indexOf('blted2d2fa1f02c4981')), '$OR condition satisfied');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .query() - Raw query");
            assert.end();
        });
});


// tags
test('findOne:  .tags()', function(assert) {
    var Query = Stack.ContentType('source').Query(),
        tags = ["tag1", "tag2"];

    Query
        .tags(tags)
        .toJSON().findOne()
        .then(function success(entry) {
            assert.ok((entry && entry.uid && entry.locale && entry.publish_details), 'Entry should have publish_details, uid, locale.');
            assert.equal((Utils.arrayPresentInArray(tags, entry.tags) > 0), true, 'Tags specified are found in result set');
            assert.end();
        }, function error(err) {
            console.error("Error :",err);
            assert.fail("findOne:  .tags()");
            assert.end();
        });
});


// search
test('findOne:  .search()', function(assert) {
    var Query = Stack.ContentType('home').Query();

    Query
        .search('Welcome Back')
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
    var Query = Stack.ContentType('source').Query(),
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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('home').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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
    var Query = Stack.ContentType('source').Query();

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