import * as Contentstack from '../..';

const stack = Contentstack.Stack({ api_key: 'api_key', delivery_token: 'delivery_token', environment: 'environment', fetchOptions: {
    logHandler: () => {

    }
}});

describe('Sync Test', () => {
    test('Sync init test', done => {
        const response = makeSync({"init": true})
        expect(response).not.toEqual(undefined)
        done();
    });

    test('Sync with startdate test', done => {
        const response = makeSync({"init": true, "start_from": "2025-04-02"})
        expect(response).not.toEqual(undefined)
        done();
    });

    test('Sync with locale test', done => {
        const response = makeSync({"init": true, "locale": "en-us"})
        expect(response).not.toEqual(undefined)
        done();
    });

    test('Sync with contentTypeUid test', done => {
        const response = makeSync({"init": true, "content_type_uid": "ct_uid"})
        expect(response).not.toEqual(undefined)
        done();
    });
});

function makeSync(params: any) {
    return stack.sync(params)
}