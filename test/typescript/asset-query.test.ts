import * as Contentstack from '../..';

const stack = Contentstack.Stack({ api_key: 'api_key', delivery_token: 'delivery_token', environment: 'environment', fetchOptions: {
    logHandler: () => {

    }
}});

describe('Asset Query Test', () => {
    test('Asset Query with UID', done => {
        const assetQuery = makeAssetQuery();        
        expect(assetQuery.except).not.toEqual(undefined);
        expect(assetQuery.only).not.toEqual(undefined);
        expect(assetQuery.setCacheProvider).not.toEqual(undefined);
        expect(assetQuery.setCachePolicy).not.toEqual(undefined);
        expect(assetQuery.includeReference).not.toEqual(undefined);
        expect(assetQuery.includeFallback).not.toEqual(undefined);
        expect(assetQuery.language).not.toEqual(undefined);
        expect(assetQuery.addQuery).not.toEqual(undefined);
        expect(assetQuery.includeSchema).not.toEqual(undefined);
        expect(assetQuery.includeReferenceContentTypeUID).not.toEqual(undefined);
        expect(assetQuery.includeContentType).not.toEqual(undefined);
        expect(assetQuery.includeOwner).not.toEqual(undefined);
        expect(assetQuery.toJSON).not.toEqual(undefined);
        expect(assetQuery.addParam).not.toEqual(undefined);
        done();
    });
    
    test('Asset Query find test', done => {
        makeAssetQuery().find().then((response) => done()).catch((error) => done());
    });

    test('Asset Query find test', done => {
        makeAssetQuery().findOne().then((response) => done()).catch((error) => done());
    });

    test('Asset Query only test', done => {
        const assetQuery = makeAssetQuery().only('fieldUID');
        expect(assetQuery._query).toEqual({ "only": { "BASE": ["fieldUID"]}, query:{} });
        const assetQuery1 = makeAssetQuery().only('BASE','fieldUID');
        expect(assetQuery1._query).toEqual({ "only": { "BASE": ["fieldUID"]}, query:{} });;
        const assetQuery2 = makeAssetQuery().only(['fieldUID', 'fieldUID1']);
        expect(assetQuery2._query).toEqual({ "only": { "BASE": ["fieldUID", "fieldUID1"]}, query:{} });
        const assetQuery3 = makeAssetQuery().only('referenceUID', 'fieldUID');
        expect(assetQuery3._query).toEqual({ "only": { "referenceUID": ["fieldUID"]}, query:{} });
        const assetQuery4 = makeAssetQuery().only('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(assetQuery4._query).toEqual({ "only": { "referenceUID": ["fieldUID", "fieldUID1"]}, query:{} });
        done();
    });

    test('Asset Query exept test', done => {
        const assetQuery = makeAssetQuery().except('fieldUID');
        expect(assetQuery._query).toEqual({ "except": { "BASE": ["fieldUID"]}, query:{} });
        const assetQuery1 = makeAssetQuery().except('BASE','fieldUID');
        expect(assetQuery1._query).toEqual({ "except": { "BASE": ["fieldUID"]}, query:{} });
        const assetQuery2 = makeAssetQuery().except(['fieldUID', 'fieldUID1']);
        expect(assetQuery2._query).toEqual({ "except": { "BASE": ["fieldUID", "fieldUID1"]}, query:{} });
        const assetQuery3 = makeAssetQuery().except('referenceUID', 'fieldUID');
        expect(assetQuery3._query).toEqual({ "except": { "referenceUID": ["fieldUID"]}, query:{} });
        const assetQuery4 = makeAssetQuery().except('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(assetQuery4._query).toEqual({ "except": { "referenceUID": ["fieldUID", "fieldUID1"]}, query:{} });
        done();
    });

    test('Asset Query Cache Provider test', done => {
        const assetQuery = makeAssetQuery().setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        expect(assetQuery.queryCachePolicy).toEqual(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        done()
    });

    test('Asset Query include reference test', done => {
        const assetQuery = makeAssetQuery().includeReference('referenceUID');
        expect(assetQuery._query).toEqual({"include": ["referenceUID"], query:{} });

        const assetQuery1 = makeAssetQuery().includeReference(['referenceUID', 'referenceUID1']);
        expect(assetQuery1._query).toEqual({"include": ["referenceUID", 'referenceUID1'], query:{} });
        done()
    });

    test('Asset Query locale test', done => {
        const assetQuery = makeAssetQuery().language('en-us');
        expect(assetQuery._query).toEqual({"locale": 'en-us', query:{} });
        done()
    });

    test('Asset Query add param test', done => {
        const assetQuery = makeAssetQuery().addQuery('key', 'value')
        expect(assetQuery._query).toEqual({"key": 'value', query:{} });
        done()
    });

    test('Asset Query add param test', done => {
        const assetQuery = makeAssetQuery().addParam('key', 'value')
        expect(assetQuery._query).toEqual({"key": 'value', query:{} });
        done()
    });

    test('Asset Query include schema test', done => {
        const assetQuery = makeAssetQuery().includeSchema()
        expect(assetQuery._query).toEqual({"include_schema": true, query:{} });
        done()
    });

    test('Entry include fallback test', done => {
        const assetQuery = makeAssetQuery().includeFallback()
        expect(assetQuery._query).toEqual({"include_fallback": true, query:{} });
        done()
    });

    test('Asset Query include content type test', done => {
        const assetQuery = makeAssetQuery().includeContentType()
        expect(assetQuery._query).toEqual({"include_content_type": true, query:{} });
        done()
    });

    test('Asset Query include reference content type test', done => {
        const assetQuery = makeAssetQuery().includeReferenceContentTypeUID()
        expect(assetQuery._query).toEqual({"include_reference_content_type_uid": true, query:{} });
        done()
    });
    // The includeOwner function is deprecated.
    test.skip('Asset Query include owner test', done => {
        const assetQuery = makeAssetQuery().includeOwner()
        expect(assetQuery._query).toEqual({"include_owner": true, query:{} });
        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().lessThan('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Asset Query less than equal to test', done => {
        const assetQuery = makeAssetQuery().lessThanOrEqualTo('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$lte": "value" }}});
        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().lessThan('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Asset Query greter than test', done => {
        const assetQuery = makeAssetQuery().greaterThan('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$gt": "value" }}});
        done()
    });

    test('Asset Query greter than equal to test', done => {
        const assetQuery = makeAssetQuery().greaterThanOrEqualTo('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$gte": "value" }}});
        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().lessThan('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Asset Query not equal test', done => {
        const assetQuery = makeAssetQuery().notEqualTo('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$ne": "value" }}});
        done()
    });

    test('Asset Query contain in  test', done => {
        var assetQuery = makeAssetQuery().containedIn('fieldUID', ['value'])
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$in": ["value"] }}});

        assetQuery= makeAssetQuery().containedIn('fieldUID', ['value1' , 3])
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$in": ['value1' , 3] }}});

        done()
    });

    test('Asset Query not contains in test', done => {
        var assetQuery = makeAssetQuery().notContainedIn('fieldUID', ['value'])
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$nin": ["value"] }}});

        assetQuery= makeAssetQuery().notContainedIn('fieldUID', ['value1' , 3])
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$nin": ['value1' , 3] }}});
        done()
    });

    test('Asset Query exists test', done => {
        const assetQuery = makeAssetQuery().exists('fieldUID')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$exists": true }}});
        done()
    });

    test('Asset Query not exists test', done => {
        const assetQuery = makeAssetQuery().notExists('fieldUID')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$exists": false }}});
        done()
    });

    test('Asset Query ascending test', done => {
        const assetQuery = makeAssetQuery().ascending('fieldUID')
        expect(assetQuery._query).toEqual({ asc: "fieldUID", query: {}});
        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().descending('fieldUID')
        expect(assetQuery._query).toEqual({ desc: "fieldUID", query: {}});

        done()
    });

    test('Asset Query before uid test', done => {
        const assetQuery = makeAssetQuery().beforeUid('fieldUID')
        expect(assetQuery._query).toEqual({ before_uid: "fieldUID", query: {}});
        done()
    });

    test('Asset Query after uid test', done => {
        const assetQuery = makeAssetQuery().afterUid('fieldUID')
        expect(assetQuery._query).toEqual({ after_uid: "fieldUID", query: {}});
        done()
    });

    test('Asset Query skip test', done => {
        const assetQuery = makeAssetQuery().skip(5)
        expect(assetQuery._query).toEqual({ skip: 5, query: {}});
        done()
    });

    test('Asset Query limit test', done => {
        const assetQuery = makeAssetQuery().limit(100)
        expect(assetQuery._query).toEqual({ limit: 100, query: {}});
        done()
    });

    test('Asset Query or test', done => {
        const query1 = makeAssetQuery().where('title', 'Demo')
        const query2 = makeAssetQuery().lessThan('comments', 10)
        const assetQuery = makeAssetQuery().or(query1, query2)
        expect(assetQuery._query).toEqual({query:{ "$or" : [{"title": 'Demo'}, {'comments': { '$lt': 10 }}] }});
        done()
    });

    test('Asset Query and test', done => {
        const query1 = makeAssetQuery().where('title', 'Demo')
        const query2 = makeAssetQuery().lessThan('comments', 10)
        const assetQuery = makeAssetQuery().and(query1, query2)
        expect(assetQuery._query).toEqual({query:{ "$and" : [{"title": 'Demo'}, {'comments': { '$lt': 10 }}] }});
        done()
    });

    test('Asset Query equal to test', done => {
        const assetQuery = makeAssetQuery().equalTo('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : "value" }});
        done()
    });

    test('Asset Query where equal to test', done => {
        const assetQuery = makeAssetQuery().where('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : "value" }});
        done()
    });

    test('Asset Query count test', done => {
        const assetQuery = makeAssetQuery().count()
        expect(assetQuery._query).toEqual({count: true, query:{}});
        done()
    });

    test('Asset Query query function test', done => {
        const assetQuery = makeAssetQuery().query({ "fieldUID" : { "$lt": "value" }})
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$lt": "value" }}});
        done()
    });

    test('Asset Query reference in test', done => {
        var assetQuery = makeAssetQuery().referenceIn('referenceUID', { "fieldUID" : { "$lt": "value" }})
        expect(assetQuery._query).toEqual({query:{ "referenceUID" : { "$in_query": { "fieldUID" : { "$lt": "value" }} }}});

        const query1 = makeAssetQuery().where('fieldUID', 'value')
        assetQuery = makeAssetQuery().referenceIn('referenceUID', query1)
        expect(assetQuery._query).toEqual({query:{ "referenceUID" : { "$in_query": { "fieldUID" : "value" }} }});

        done()
    });

    test('Asset Query reference not in test', done => {
        var assetQuery = makeAssetQuery().referenceNotIn('referenceUID', { "fieldUID" : { "$lt": "value" }})
        expect(assetQuery._query).toEqual({query:{ "referenceUID" : { "$nin_query": { "fieldUID" : { "$lt": "value" }} }}});

        const query1 = makeAssetQuery().where('fieldUID', 'value')
        assetQuery = makeAssetQuery().referenceNotIn('referenceUID', query1)
        expect(assetQuery._query).toEqual({query:{ "referenceUID" : { "$nin_query": { "fieldUID" : "value" }} }});

        done()
    });
    test('Asset Query tag test', done => {
        const assetQuery = makeAssetQuery().tags(['tag 1', 'tag 2'])
        expect(assetQuery._query).toEqual({tags: ['tag 1', 'tag 2'], query:{}});
        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().includeCount()
        expect(assetQuery._query).toEqual({include_count: true, query:{}});
        done()
    });

    test('Asset Query less than test', done => {
        var assetQuery = makeAssetQuery().regex('fieldUID', 'value')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$regex": "value" }}});

        assetQuery = makeAssetQuery().regex('fieldUID', 'value', 'i')
        expect(assetQuery._query).toEqual({query:{ "fieldUID" : { "$regex": "value", "$options": "i" }}});

        done()
    });

    test('Asset Query less than test', done => {
        const assetQuery = makeAssetQuery().search('value')
        expect(assetQuery._query).toEqual({"typeahead" : "value", query:{}});
        done()
    });

});

function makeAssetQuery() {
    return stack.Assets().Query()
}