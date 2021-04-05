import * as Contentstack from '../..';

const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');

describe('Entry Test', () => {
    test('Entry with UID', done => {
        const entry = makeEntry();        
        expect(entry.entry_uid).toEqual('entryUID');
        expect(entry.content_type_uid).toEqual('uid');
        expect(entry.except).not.toEqual(undefined);
        expect(entry.only).not.toEqual(undefined);
        expect(entry.setCacheProvider).not.toEqual(undefined);
        expect(entry.setCachePolicy).not.toEqual(undefined);
        expect(entry.includeReference).not.toEqual(undefined);
        expect(entry.language).not.toEqual(undefined);
        expect(entry.addQuery).not.toEqual(undefined);
        expect(entry.includeSchema).not.toEqual(undefined);
        expect(entry.includeReference).not.toEqual(undefined);
        expect(entry.includeReferenceContentTypeUID).not.toEqual(undefined);
        expect(entry.includeContentType).not.toEqual(undefined);
        expect(entry.includeOwner).not.toEqual(undefined);
        expect(entry.toJSON).not.toEqual(undefined);
        expect(entry.addParam).not.toEqual(undefined);
        done();
    });
    
    test('Entry fetch test', done => {
        makeEntry().fetch().then((response) => done()).catch((error) => done());
    });

    test('Entry only test', done => {
        const entry = makeEntry().only('fieldUID');
        expect(entry._query).toEqual({ "only": { "BASE": ["fieldUID"]}});
        const entry1 = makeEntry().only('BASE','fieldUID');
        expect(entry1._query).toEqual({ "only": { "BASE": ["fieldUID"]}});
        const entry2 = makeEntry().only(['fieldUID', 'fieldUID1']);
        expect(entry2._query).toEqual({ "only": { "BASE": ["fieldUID", "fieldUID1"]}});
        const entry3 = makeEntry().only('referenceUID', 'fieldUID');
        expect(entry3._query).toEqual({ "only": { "referenceUID": ["fieldUID"]}});
        const entry4 = makeEntry().only('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(entry4._query).toEqual({ "only": { "referenceUID": ["fieldUID", "fieldUID1"]}});
        done();
    });

    test('Entry except test', done => {
        const entry = makeEntry().except('fieldUID');
        expect(entry._query).toEqual({ "except": { "BASE": ["fieldUID"]}});
        const entry1 = makeEntry().except('BASE','fieldUID');
        expect(entry1._query).toEqual({ "except": { "BASE": ["fieldUID"]}});
        const entry2 = makeEntry().except(['fieldUID', 'fieldUID1']);
        expect(entry2._query).toEqual({ "except": { "BASE": ["fieldUID", "fieldUID1"]}});
        const entry3 = makeEntry().except('referenceUID', 'fieldUID');
        expect(entry3._query).toEqual({ "except": { "referenceUID": ["fieldUID"]}});
        const entry4 = makeEntry().except('referenceUID', ['fieldUID', 'fieldUID1']);
        expect(entry4._query).toEqual({ "except": { "referenceUID": ["fieldUID", "fieldUID1"]}});
        done();
    });

    test('Entry Cache Provider test', done => {
        const entry = makeEntry().setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        expect(entry.queryCachePolicy).toEqual(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
        done()
    });

    test('Entry include reference test', done => {
        const entry = makeEntry().includeReference('referenceUID');
        expect(entry._query).toEqual({"include": ["referenceUID"]});

        const entry1 = makeEntry().includeReference(['referenceUID', 'referenceUID1']);
        expect(entry1._query).toEqual({"include": ["referenceUID", 'referenceUID1']});
        done()
    });

    test('Entry locale test', done => {
        const entry = makeEntry().language('en-us');
        expect(entry._query).toEqual({"locale": 'en-us'});
        done()
    });

    test('Entry add param test', done => {
        const entry = makeEntry().addQuery('key', 'value')
        expect(entry._query).toEqual({"key": 'value'});
        done()
    });

    test('Entry add param test', done => {
        const entry = makeEntry().addParam('key', 'value')
        expect(entry._query).toEqual({"key": 'value'});
        done()
    });


    test('Entry include schema test', done => {
        const entry = makeEntry().includeEmbeddedItems()
        expect(entry._query).toEqual({"include_embedded_items": ['BASE']});
        done()
    });

    test('Entry include schema test', done => {
        const entry = makeEntry().includeSchema()
        expect(entry._query).toEqual({"include_schema": true});
        done()
    });

    test('Entry include content type test', done => {
        const entry = makeEntry().includeContentType()
        expect(entry._query).toEqual({"include_content_type": true});
        done()
    });

    test('Entry include reference content type test', done => {
        const entry = makeEntry().includeReferenceContentTypeUID()
        expect(entry._query).toEqual({"include_reference_content_type_uid": true});
        done()
    });

    test('Entry include fallback test', done => {
        const entry = makeEntry().includeFallback()
        expect(entry._query).toEqual({"include_fallback": true});
        done()
    });

    test('Entry include owner test', done => {
        const entry = makeEntry().includeOwner()
        expect(entry._query).toEqual({"include_owner": true});
        done()
    });
});

function makeEntry() {
    return stack.ContentType('uid').Entry('entryUID')
}