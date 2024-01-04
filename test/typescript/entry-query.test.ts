import * as Contentstack from '../..';

const stack = Contentstack.Stack({ api_key: 'api_key', delivery_token: 'delivery_token', environment: 'environment', fetchOptions: {
    logHandler: () => {

    }
}});

describe('Entry Query Test', () => {
    test('Entry Query with UID', done => {
        const entryQuery = makeEntryQuery();        
        expect(entryQuery.content_type_uid).toEqual('uid');
        expect(entryQuery.except).not.toEqual(undefined);
        expect(entryQuery.only).not.toEqual(undefined);
        expect(entryQuery.setCacheProvider).not.toEqual(undefined);
        expect(entryQuery.setCachePolicy).not.toEqual(undefined);
        expect(entryQuery.includeReference).not.toEqual(undefined);
        expect(entryQuery.language).not.toEqual(undefined);
        expect(entryQuery.addQuery).not.toEqual(undefined);
        expect(entryQuery.includeSchema).not.toEqual(undefined);
        expect(entryQuery.includeReference).not.toEqual(undefined);
        expect(entryQuery.includeReferenceContentTypeUID).not.toEqual(undefined);
        expect(entryQuery.includeContentType).not.toEqual(undefined);
        expect(entryQuery.includeOwner).not.toEqual(undefined);
        expect(entryQuery.toJSON).not.toEqual(undefined);
        expect(entryQuery.addParam).not.toEqual(undefined);
        done();
    });
    
    test('Entry Query find test', done => {
        makeEntryQuery().find().then((response) => done()).catch((error) => done());
    });

    test('Entry Query find test', done => {
        makeEntryQuery().findOne().then((response) => done()).catch((error) => done());
    });

    test('Entry Query only test', done => {
        const entryQuery = makeEntryQuery().only('fieldUID');
        expect(entryQuery._query).toEqual({ "only": { "BASE": ["fieldUID"]}, query:{} });
        const entryQuery1 = makeEntryQuery().only('BASE','fieldUID');
        expect(entryQuery1._query).toEqual({ "only": { "BASE": ["fieldUID"]}, query:{} });;
        const entryQuery2 = makeEntryQuery().only(['fieldUID', 'fieldUID1']);
        expect(entryQuery2._query).toEqual({ "only": { "BASE": ["fieldUID", "fieldUID1"]}, query:{} });
        const entryQuery3 = makeEntryQuery().only('referenceUID', 'fieldUID');
        expect(entryQuery3._query).toEqual({ "only": { "referenceUID": ["fieldUID"]}, query:{} });
        const entryQuery4 = makeEntryQuery().only('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(entryQuery4._query).toEqual({ "only": { "referenceUID": ["fieldUID", "fieldUID1"]}, query:{} });
        done();
    });

    test('Entry Query exept test', done => {
        const entryQuery = makeEntryQuery().except('fieldUID');
        expect(entryQuery._query).toEqual({ "except": { "BASE": ["fieldUID"]}, query:{} });
        const entryQuery1 = makeEntryQuery().except('BASE','fieldUID');
        expect(entryQuery1._query).toEqual({ "except": { "BASE": ["fieldUID"]}, query:{} });
        const entryQuery2 = makeEntryQuery().except(['fieldUID', 'fieldUID1']);
        expect(entryQuery2._query).toEqual({ "except": { "BASE": ["fieldUID", "fieldUID1"]}, query:{} });
        const entryQuery3 = makeEntryQuery().except('referenceUID', 'fieldUID');
        expect(entryQuery3._query).toEqual({ "except": { "referenceUID": ["fieldUID"]}, query:{} });
        const entryQuery4 = makeEntryQuery().except('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(entryQuery4._query).toEqual({ "except": { "referenceUID": ["fieldUID", "fieldUID1"]}, query:{} });
        done();
    });

    test('Entry Query Cache Provider test', done => {
        const entryQuery = makeEntryQuery().setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        expect(entryQuery.queryCachePolicy).toEqual(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        done()
    });

    test('Entry Query include reference test', done => {
        const entryQuery = makeEntryQuery().includeReference('referenceUID');
        expect(entryQuery._query).toEqual({"include": ["referenceUID"], query:{} });

        const entryQuery1 = makeEntryQuery().includeReference(['referenceUID', 'referenceUID1']);
        expect(entryQuery1._query).toEqual({"include": ["referenceUID", 'referenceUID1'], query:{} });
        done()
    });

    test('Entry Query locale test', done => {
        const entryQuery = makeEntryQuery().language('en-us');
        expect(entryQuery._query).toEqual({"locale": 'en-us', query:{} });
        done()
    });

    test('Entry Query add param test', done => {
        const entryQuery = makeEntryQuery().addQuery('key', 'value')
        expect(entryQuery._query).toEqual({"key": 'value', query:{} });
        done()
    });

    test('Entry Query add param test', done => {
        const entryQuery = makeEntryQuery().addParam('key', 'value')
        expect(entryQuery._query).toEqual({"key": 'value', query:{} });
        done()
    });

    test('Entry Query include schema test', done => {
        const entryQuery = makeEntryQuery().includeSchema()
        expect(entryQuery._query).toEqual({"include_schema": true, query:{} });
        done()
    });

    test('Entry include fallback test', done => {
        const entryQuery = makeEntryQuery().includeFallback()
        expect(entryQuery._query).toEqual({"include_fallback": true, query:{} });
        done()
    });

    test('Entry Query include content type test', done => {
        const entryQuery = makeEntryQuery().includeContentType()
        expect(entryQuery._query).toEqual({"include_content_type": true, query:{} });
        done()
    });

    test('Entry Query include reference content type test', done => {
        const entryQuery = makeEntryQuery().includeReferenceContentTypeUID()
        expect(entryQuery._query).toEqual({"include_reference_content_type_uid": true, query:{} });
        done()
    });

    test('Entry Query include owner test', done => {
        const entryQuery = makeEntryQuery().includeOwner()
        expect(entryQuery._query).toEqual({"include_owner": true, query:{} });
        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().lessThan('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Entry Query less than equal to test', done => {
        const entryQuery = makeEntryQuery().lessThanOrEqualTo('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$lte": "value" }}});
        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().lessThan('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Entry Query greter than test', done => {
        const entryQuery = makeEntryQuery().greaterThan('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$gt": "value" }}});
        done()
    });

    test('Entry Query greter than equal to test', done => {
        const entryQuery = makeEntryQuery().greaterThanOrEqualTo('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$gte": "value" }}});
        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().lessThan('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Entry Query not equal test', done => {
        const entryQuery = makeEntryQuery().notEqualTo('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$ne": "value" }}});
        done()
    });

    test('Entry Query contain in  test', done => {
        var entryQuery = makeEntryQuery().containedIn('fieldUID', ['value'])
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$in": ["value"] }}});

        entryQuery= makeEntryQuery().containedIn('fieldUID', ['value1' , 3])
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$in": ['value1' , 3] }}});

        done()
    });

    test('Entry Query not contains in test', done => {
        var entryQuery = makeEntryQuery().notContainedIn('fieldUID', ['value'])
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$nin": ["value"] }}});

        entryQuery= makeEntryQuery().notContainedIn('fieldUID', ['value1' , 3])
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$nin": ['value1' , 3] }}});
        done()
    });

    test('Entry Query exists test', done => {
        const entryQuery = makeEntryQuery().exists('fieldUID')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$exists": true }}});
        done()
    });

    test('Entry Query not exists test', done => {
        const entryQuery = makeEntryQuery().notExists('fieldUID')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$exists": false }}});
        done()
    });

    test('Entry Query ascending test', done => {
        const entryQuery = makeEntryQuery().ascending('fieldUID')
        expect(entryQuery._query).toEqual({ asc: "fieldUID", query: {}});
        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().descending('fieldUID')
        expect(entryQuery._query).toEqual({ desc: "fieldUID", query: {}});

        done()
    });

    test('Entry Query before uid test', done => {
        const entryQuery = makeEntryQuery().beforeUid('fieldUID')
        expect(entryQuery._query).toEqual({ before_uid: "fieldUID", query: {}});
        done()
    });

    test('Entry Query after uid test', done => {
        const entryQuery = makeEntryQuery().afterUid('fieldUID')
        expect(entryQuery._query).toEqual({ after_uid: "fieldUID", query: {}});
        done()
    });

    test('Entry Query skip test', done => {
        const entryQuery = makeEntryQuery().skip(5)
        expect(entryQuery._query).toEqual({ skip: 5, query: {}});
        done()
    });

    test('Entry Query limit test', done => {
        const entryQuery = makeEntryQuery().limit(100)
        expect(entryQuery._query).toEqual({ limit: 100, query: {}});
        done()
    });

    test('Entry Query or test', done => {
        const query1 = makeEntryQuery().where('title', 'Demo')
        const query2 = makeEntryQuery().lessThan('comments', 10)
        const entryQuery = makeEntryQuery().or(query1, query2)
        expect(entryQuery._query).toEqual({query:{ "$or" : [{"title": 'Demo'}, {'comments': { '$lt': 10 }}] }});
        done()
    });

    test('Entry Query and test', done => {
        const query1 = makeEntryQuery().where('title', 'Demo')
        const query2 = makeEntryQuery().lessThan('comments', 10)
        const entryQuery = makeEntryQuery().and(query1, query2)
        expect(entryQuery._query).toEqual({query:{ "$and" : [{"title": 'Demo'}, {'comments': { '$lt': 10 }}] }});
        done()
    });

    test('Entry Query equal to test', done => {
        const entryQuery = makeEntryQuery().equalTo('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : "value" }});
        done()
    });

    test('Entry Query where equal to test', done => {
        const entryQuery = makeEntryQuery().where('fieldUID', 'value').where('field1', 133).where('field2', false)
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : "value", 'field1': 133, 'field2': false }});
        done()
    });

    test('Entry Query count test', done => {
        const assetQuery = makeEntryQuery().count()
        expect(assetQuery._query).toEqual({count: true, query:{}});
        done()
    });

    test('Entry Query query function test', done => {
        const entryQuery = makeEntryQuery().query({ "fieldUID" : { "$lt": "value" }})
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Entry Query reference in test', done => {
        var entryQuery = makeEntryQuery().referenceIn('referenceUID', { "fieldUID" : { "$lt": "value" }})
        expect(entryQuery._query).toEqual({query:{ "referenceUID" : { "$in_query": { "fieldUID" : { "$lt": "value" }} }}});

        const query1 = makeEntryQuery().where('fieldUID', 'value')
        entryQuery = makeEntryQuery().referenceIn('referenceUID', query1)
        expect(entryQuery._query).toEqual({query:{ "referenceUID" : { "$in_query": { "fieldUID" : "value" }} }});

        done()
    });

    test('Entry Query reference not in test', done => {
        var entryQuery = makeEntryQuery().referenceNotIn('referenceUID', { "fieldUID" : { "$lt": "value" }})
        expect(entryQuery._query).toEqual({query:{ "referenceUID" : { "$nin_query": { "fieldUID" : { "$lt": "value" }} }}});

        const query1 = makeEntryQuery().where('fieldUID', 'value')
        entryQuery = makeEntryQuery().referenceNotIn('referenceUID', query1)
        expect(entryQuery._query).toEqual({query:{ "referenceUID" : { "$nin_query": { "fieldUID" : "value" }} }});

        done()
    });
    test('Entry Query tag test', done => {
        const entryQuery = makeEntryQuery().tags(['tag 1', 'tag 2'])
        expect(entryQuery._query).toEqual({tags: ['tag 1', 'tag 2'], query:{}});
        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().includeCount()
        expect(entryQuery._query).toEqual({include_count: true, query:{}});
        done()
    });

    test('Entry Query less than test', done => {
        var entryQuery = makeEntryQuery().regex('fieldUID', 'value')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$regex": "value" }}});

        entryQuery = makeEntryQuery().regex('fieldUID', 'value', 'i')
        expect(entryQuery._query).toEqual({query:{ "fieldUID" : { "$regex": "value", "$options": "i" }}});

        done()
    });

    test('Entry Query less than test', done => {
        const entryQuery = makeEntryQuery().search('value')
        expect(entryQuery._query).toEqual({"typeahead" : "value", query:{}});
        done()
    });

    test('Taxonomy Query: Get entries with one term', done => {
        const query = makeTaxonomyQuery().where("taxonomies.taxonomy_uid", "term_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": "term_uid"}});
        done();
    });

    test('Taxonomy Query: Get entries with any term ($in)', done => {
        const query = makeTaxonomyQuery().containedIn("taxonomies.taxonomy_uid", ["term_uid1", "term_uid2"]);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": { "$in": ["term_uid1", "term_uid2"] }}});
        done();
    });

    test('Taxonomy Query: Get entries with any term ($or)', done => {
        const query1 = makeTaxonomyQuery().where("taxonomies.taxonomy_uid1", "term_uid1");
        const query2 = makeTaxonomyQuery().where("taxonomies.taxonomy_uid2", "term_uid2");
        const query = makeTaxonomyQuery().or(query1, query2);
        expect(query._query).toEqual({"query": { $or: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ] }});
        done();
    });

    test('Taxonomy Query: Get entries with all term ($and)', done => {
        const query1 = makeTaxonomyQuery().where("taxonomies.taxonomy_uid1", "term_uid1");
        const query2 = makeTaxonomyQuery().where("taxonomies.taxonomy_uid2", "term_uid2");
        const query = makeTaxonomyQuery().and(query1, query2);
        expect(query._query).toEqual({"query": { $and: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ] }});
        done();
    });

    test('Taxonomy Query: Get entries with any taxonomy terms ($exists)', done => {
        const query = makeTaxonomyQuery().exists("taxonomies.taxonomy_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {$exists: true}}});
        done();
    });

    test('Taxonomy Query: Get entries with taxonomy terms and also matching its children terms ($eq_below, level)', done => {
        const query = makeTaxonomyQuery().equalAndBelow("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$eq_below": "term_uid", "levels": 4 }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Children\'s and Excluding the term itself ($below, level) ', done => {
        const query = makeTaxonomyQuery().below("taxonomies.taxonomy_uid", "term_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$below": "term_uid" }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)', done => {
        const query = makeTaxonomyQuery().equalAndAbove("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$eq_above": "term_uid", "levels": 4 }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)', done => {
        const query = makeTaxonomyQuery().above("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$above": "term_uid", "levels": 4 }}});
        done();
    });

    test('Taxonomy Query: Get All Entries With Taxonomy For One Content type', done => {
        const query = makeTaxonomyQuery().where("taxonomies.taxonomy_uid", "term_uid").where("_content_type", "ct1");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": "term_uid", "_content_type": "ct1"}});
        done();
    });

    test('Taxonomy Query: Get All Entries With Taxonomy For Multiple Content types', done => {
        const query = makeTaxonomyQuery().where("taxonomies.taxonomy_uid", "term_uid").containedIn("_content_type", ["ct1", "ct2"]);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": "term_uid", "_content_type": {$in: ["ct1", "ct2"]}}});
        done();
    });

    // ###########################################################

    test('CT Taxonomy Query: Get entries with one term', done => {
        const query = makeEntryQuery().where("taxonomies.taxonomy_uid", "term_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": "term_uid"}});
        done();
    });

    test('Taxonomy Query: Get entries with any term ($in)', done => {
        const query = makeEntryQuery().containedIn("taxonomies.taxonomy_uid", ["term_uid1", "term_uid2"]);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": { "$in": ["term_uid1", "term_uid2"] }}});
        done();
    });

    test('Taxonomy Query: Get entries with any term ($or)', done => {
        const query1 = makeEntryQuery().where("taxonomies.taxonomy_uid1", "term_uid1");
        const query2 = makeEntryQuery().where("taxonomies.taxonomy_uid2", "term_uid2");
        const query = makeEntryQuery().or(query1, query2);
        expect(query._query).toEqual({"query": { $or: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ] }});
        done();
    });

    test('Taxonomy Query: Get entries with all term ($and)', done => {
        const query1 = makeEntryQuery().where("taxonomies.taxonomy_uid1", "term_uid1");
        const query2 = makeEntryQuery().where("taxonomies.taxonomy_uid2", "term_uid2");
        const query = makeEntryQuery().and(query1, query2);
        expect(query._query).toEqual({"query": { $and: [ {"taxonomies.taxonomy_uid1": "term_uid1"}, {"taxonomies.taxonomy_uid2": "term_uid2"} ] }});
        done();
    });

    test('Taxonomy Query: Get entries with any taxonomy terms ($exists)', done => {
        const query = makeEntryQuery().exists("taxonomies.taxonomy_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {$exists: true}}});
        done();
    });

    test('Taxonomy Query: Get entries with taxonomy terms and also matching its children terms ($eq_below, level)', done => {
        const query = makeEntryQuery().equalAndBelow("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$eq_below": "term_uid", "levels": 4 }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Children\'s and Excluding the term itself ($below, level) ', done => {
        const query = makeEntryQuery().below("taxonomies.taxonomy_uid", "term_uid");
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$below": "term_uid" }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)', done => {
        const query = makeEntryQuery().equalAndAbove("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$eq_above": "term_uid", "levels": 4 }}});
        done();
    });

    test('Taxonomy Query: Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)', done => {
        const query = makeEntryQuery().above("taxonomies.taxonomy_uid", "term_uid", 4);
        expect(query._query).toEqual({"query": {"taxonomies.taxonomy_uid": {"$above": "term_uid", "levels": 4 }}});
        done();
    });
});

function makeEntryQuery() {
    return stack.ContentType('uid').Query()
}

function makeTaxonomyQuery() {
    return stack.Taxonomies().Query()
}