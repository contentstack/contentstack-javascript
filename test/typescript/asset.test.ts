import * as Contentstack from '../..';

const stack = Contentstack.Stack({ api_key: 'api_key', delivery_token: 'delivery_token', environment: 'environment'});

describe('Asset Test', () => {
    test('Asset with UID', done => {
        const asset = makeAsset();  
        expect(asset.asset_uid).toEqual('uid')      
        expect(asset.addParam).not.toEqual(undefined)
        expect(asset.fetch).not.toEqual(undefined)
        expect(asset.includeFallback).not.toEqual(undefined)
        done()
    });

    test('Entry include fallback test', done => {
        const asset = makeAsset().includeFallback()
        expect(asset._query).toEqual({"include_fallback": true});
        done()
    });

    test('Asset fetch test', done => {
        makeAsset().fetch().then((response) => done()).catch((error) => done());
    });
});

function makeAsset() {
    return stack.Assets('uid')
}