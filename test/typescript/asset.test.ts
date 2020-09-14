import * as Contentstack from '../..';

const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');

describe('Asset Test', () => {
    test('Asset with UID', done => {
        const asset = makeAsset();  
        expect(asset.asset_uid).toEqual('uid')      
        expect(asset.addParam).not.toEqual(undefined)
        expect(asset.fetch).not.toEqual(undefined)
        done()
    });

    test('Asset fetch test', done => {
        makeAsset().fetch().then((response) => done()).catch((error) => done());
    });
});

function makeAsset() {
    return stack.Assets('uid')
}