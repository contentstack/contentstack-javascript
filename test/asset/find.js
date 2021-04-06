'use strict';
/*
 * Module Dependencies.
 */
var test = require('tape');
var Contentstack = require('../../dist/node/contentstack.js');
var init = require('../config.js');
var Utils = require('../entry/utils.js')

const config = require('../config.json')
Object.assign(init, config)
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


test('default .find() No fallback', function(assert) {
    var _in = ['ja-jp']
    Stack.Assets().Query().language('ja-jp').toJSON().find()
        .then((assets) => {
            assert.ok(assets[0].length, 'Assets present in the resultset');
            assert.notok(assets[1], 'Count should not be present');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    return (_in.indexOf(asset['publish_details']['locale']) != -1);
                });
                assert.equal(_assets, true, "Publish content fallback" );
            }
            assert.end();
        }).catch((error) => {
            assert.fail("asset default .find() fallback catch", error.toString());
            assert.end();
        })
})

test('default .find() fallback', function(assert) {
    var _in = ['ja-jp', 'en-us']
    Stack.Assets().Query().language('ja-jp').includeFallback().toJSON().find()
        .then((assets) => {
            assert.ok(assets[0].length, 'Assets present in the resultset');
            assert.notok(assets[1], 'Count should not be present');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    return (_in.indexOf(asset['publish_details']['locale']) != -1);
                });
                assert.equal(_assets, true, "Publish content fallback" );
            }
            assert.end();
        }).catch((error) => {
            assert.fail("asset default .find() fallback catch", error.toString());
            assert.end();
        })
})

test('default .find()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';
    Query
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'Assets present in the resultset');
            assert.notok(assets[1], 'Count should not be present');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    prev = asset[field];
                    return (asset[field] <= prev);
                });
                assert.equal(_assets, true, "default sorting of descending 'updated_at'");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail("asset default .find()");
            assert.end();
        });
});

/*!
 * SORTING
 * !*/
test('.ascending()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .ascending(field)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] <= prev);
                    prev = asset[field];
                    return (asset[field] >= prev);
                });
                assert.equal(_assets, true, "assets sorted ascending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".ascending()");
            assert.end();
        });
});

test('.descending()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'created_at';
    Query
        .descending(field)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] <= prev);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".descending()");
            assert.end();
        });
});

// addparam
test('.addParam()', function(assert) {
    var Query = Stack.Assets().Query();
    Query
        .addParam('include_dimension', 'true')
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0][0].hasOwnProperty('dimension'), 'dimension present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".addParam()");
            assert.end();
        });
});


/*!
 * COMPARISION
 * !*/
test('.lessThan()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'file_size',
        value = 5122;
    Query
        .lessThan('file_size', value)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 1, '1 asset present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].slice(1).every(function(asset) {
                    var flag = (asset[field] < value);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error('Error : ', err);
            assert.fail(".lessThan()");
            assert.end();
        });
});

test('.lessThanOrEqualTo()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at',
        value = 5122;
    Query
        .lessThanOrEqualTo('file_size', 5122)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 2, 'two assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] <= prev);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".lessThanOrEqualTo()");
            assert.end();
        }).catch(function(err) {
            console.log("error is this: ", err);
        });
});

test('.greaterThan()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'file_size',
        value = 5122;

    Query
        .greaterThan('file_size', value)
        .ascending(field)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 3, 'three assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].slice(1).every(function(asset) {
                    var flag = (asset[field] > value);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted ascending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            assert.fail(".greaterThan()");
            assert.end();
        });
});

test('.greaterThanOrEqualTo()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'file_size',
        value = 5122;

    Query
        .greaterThanOrEqualTo('file_size', 5122)
        .descending(field)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 4, 'four assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] >= value);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".greaterThanOrEqualTo()");
            assert.end();
        });
});

test('.notEqualTo()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'file_size',
        value = 5122;

    Query
        .notEqualTo('file_size', value)
        .descending(field)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] != value);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".notEqualTo()");
            assert.end();
        });
});

test('.where()', function(assert) {
    var Query = Stack.Assets().Query();
    Query
        .where('title', "image1")
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.equal(assets[0].length, 1, 'one asset present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".where()");
            assert.end();
        });
});


test('.equalTo() compare boolean value (true)', function(assert) {
    var Query = Stack.Assets().Query();

    Query
        .language('en-us')
        .equalTo('is_dir', false)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.equal(assets[0].length, 5, ' five asset present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".where()");
            assert.end();
        });
});

test('.equalTo() compare boolean value (false)', function(assert) {
    var Query = Stack.Assets().Query();
    Query
        .equalTo('is_dir', true)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.notok(assets[0].length, 'assets not present in the resultset');
            assert.equal(assets[0].length, 0, ' three assets present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".where() boolean value having false");
            assert.end();
        });
});

/*!
 * Array/Subset
 * !*/

test('.containedIn()', function(assert) {
    var Query = Stack.Assets().Query(),
        _in = ["image1", "image2"],
        field = 'updated_at';

    Query
        .containedIn('title', _in)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.ok(assets[0].length, 2, 'two assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    return (_in.indexOf(asset['title']) != -1);
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".containedIn()");
            assert.end();
        });
});

test('.notContainedIn()', function(assert) {
    var Query = Stack.Assets().Query(),
        _in = ["image1", "image2"];

    Query
        .notContainedIn('title', _in)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, ' Assets present in the resultset');
            assert.ok(assets[0].length, 3, 'three assets present in the resultset');
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
    var Query = Stack.Assets().Query(),
        queryField = "is_dir",
        field = 'updated_at';

    Query
        .exists(queryField)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    var flag = (asset[field] <= prev);
                    prev = asset[field];
                    return flag;
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".exists()");
            assert.end();
        });
});

test('.notExists()', function(assert) {
    var Query = Stack.Assets().Query(),
        queryField = "is_dir",
        field = 'updated_at';

    Query
        .notExists(queryField)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.notok(assets[0].length, 'No asset present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var prev = assets[0][0][field];
                var _assets = assets[0].every(function(asset) {
                    return (asset[field] <= prev);
                });
                assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
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
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .toJSON()
        .find()
        .then(function success(allassets) {
            Stack
                .Assets()
                .Query()
                .skip(1)
                .toJSON()
                .find()
                .then(function success(assets) {
                    assert.ok((assets[0].length >= 2), '2 or more assets present in the resultset');
                    assert.deepEqual(allassets[0].slice(1), assets[0], 'All elements matched.');
                    if (assets && assets.length && assets[0].length) {
                        var prev = assets[0][0][field];
                        var _assets = assets[0].every(function(asset) {
                            var flag = (asset[field] <= prev);
                            prev = asset[field];
                            return flag;
                        });
                        assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
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

test('.limit()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .toJSON()
        .find()
        .then(function success(allassets) {
            Stack
                .Assets()
                .Query()
                .limit(2)
                .toJSON()
                .find()
                .then(function success(assets) {
                    assert.ok(assets[0].length, 'assets present in the resultset');
                    assert.deepEqual(allassets[0].slice(0, 2), assets[0], 'All elements matched.');
                    if (assets && assets.length && assets[0] && assets[0].length) {
                        var prev = assets[0][0][field];
                        var _assets = assets[0].every(function(asset) {
                            var flag = (asset[field] <= prev);
                            prev = asset[field];
                            return flag;
                        });
                        assert.equal(_assets, true, "assets sorted descending on '" + field + "' field");
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
    var Query = Stack.Assets().Query();

    Query
        .count()
        .toJSON()
        .find()
        .then(function success(count) {
            // assert.ok("assets" in result, 'assets key present in the resultset');
            assert.ok(count, 'assets present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".count()");
            assert.end();
        });
});


// Logical
test('.or() - Query Objects', function(assert) {
    var Query1 = Stack.Assets().Query().where('title', 'image1');
    var Query2 = Stack.Assets().Query().where('is_dir', true);
    var Query = Stack.Assets().Query();

    Query
        .or(Query1, Query2)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.ok(assets[0].length, 1, 'one asset present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    return (~(asset.title === 'source1' || asset.is_dir === true));
                });
                assert.ok(_assets, '$OR condition satisfied');
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".or() - Query Objects");
            assert.end();
        });
});

test('.and() - Query Objects', function(assert) {
    var Query1 = Stack.Assets().Query().where('title', 'image1');
    var Query2 = Stack.Assets().Query().where('is_dir', true);
    var Query = Stack.Assets().Query();

    Query
        .and(Query1, Query2)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.notok(assets[0].length, ' asset not  present in the resultset');
            if (assets && assets.length && assets[0].length) {
                // console.log("\n\n\n\n",JSON.stringify(assets));
                var _assets = assets[0].every(function(asset) {
                    return (~(asset.title === 'image1' && asset.is_dir === true));
                });
                assert.ok(_assets, '$AND condition satisfied');
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".and() - Query Objects");
            assert.end();
        });
});

// Custom query
test('.query() - Raw query', function(assert) {
    var Query = Stack.Assets().Query();

    Query
        .query({ "$or": [{ "title": "image2" }, { "is_dir": "true" }] })
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.ok(assets[0].length, 1, 'one asset present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    if (asset.title === 'image2' || asset.is_dir === false) {
                        return true;
                    } else {
                        return false;
                    }
                    // return (asset.reference.indexOf('blt1ce8bb666a834bfb') || asset.other_reference.indexOf('blted2d2fa1f02c4981') ? true : false);
                });
                assert.ok(_assets, '$OR condition satisfied');
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".query() - Raw query");
            assert.end();
        });
});


test('.tags()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'tags',
        tags = ["asset3"];

    Query
        .tags(tags)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok((assets.length >= 1), '1 or more asset/assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                assert.equal(assets[0].length, 0, 'Non refernce tags count should be zero');
            }
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".tags()");
            assert.end();
        });
});
// tags
test('.tags()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'tags',
        tags = ["asset1", "asset2"];

    Query
        .tags(tags)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok((assets.length >= 1), '1 or more asset/assets present in the resultset');
            if (assets && assets.length && assets[0].length) {
                var _assets = assets[0].every(function(asset) {
                    return (Utils.arrayPresentInArray(tags, asset[field]));
                });
                assert.equal(_assets, true, 'Tags specified are found in result set');
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
    var Query = Stack.Assets().Query();
    Query
        .toJSON()
        .search('image1')
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, '1 asset present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".search()");
            assert.end();
        });
});

// regex
test('.regex()', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'title',
        regex = {
            pattern: '^image',
            options: 'i'
        },
        regexpObj = new RegExp(regex.pattern, regex.options);

    Query
        .regex(field, regex.pattern, regex.options)
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok((assets.length >= 1), '1 or more asset/assets present in the resultset');
            var flag = assets[0].every(function(asset) {
                return regexpObj.test(asset[field]);
            });
            assert.ok(flag, "regexp satisfied for all the assets in the resultset");
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".regex()");
            assert.end();
        });
});


// includeCount
test('.includeCount()', function(assert) {
    var Query = Stack.Assets().Query();

    Query
        .includeCount()
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            assert.ok(assets[1], 'Count present in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".includeCount()");
            assert.end();
        });
});


// only
test('.only() - Single String Parameter', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .only('title')
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            var flag = assets[0].every(function(asset) {
                return (asset && Object.keys(asset).length === 5 && "title" in asset && "uid" in asset && 'url' in asset);
            });
            assert.ok(flag, 'assets with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".only() - Single String Parameter");
            assert.end();
        });
});

test('.only() - Multiple String Parameter', function(assert) {
    var Query = Stack.Assets().Query(),
        field = 'updated_at';

    Query
        .only('BASE', 'title')
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            var flag = assets[0].every(function(asset) {
                return (asset && Object.keys(asset).length === 5 && "title" in asset && "uid" in asset && 'url' in asset);
            });
            assert.ok(flag, 'assets with the field title in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".only() - Multiple String Parameter");
            assert.end();
        });
});

test('.only() - Array Parameter', function(assert) {
    var Query = Stack.Assets().Query();

    Query
        .only(['title', 'filename'])
        .toJSON()
        .find()
        .then(function success(assets) {
            assert.ok(assets[0].length, 'assets present in the resultset');
            var flag = assets[0].every(function(asset) {
                return (asset && Object.keys(asset).length === 5 && "title" in asset && "filename" in asset && "uid" in asset && "url" in asset);
            });
            assert.ok(flag, 'assets with the field title,filename in the resultset');
            assert.end();
        }, function error(err) {
            console.error("error :", err);
            assert.fail(".only() - Array Parameter");
            assert.end();
        });
});