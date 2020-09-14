import * as Contentstack from '../..';

const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
describe('ContentType Test', () => {
    test('ContentType UID', done => {
        const contentType = stack.ContentType('uid');
        expect(contentType.content_type_uid).toEqual('uid');
        expect(contentType.Entry).not.toEqual(undefined);
        expect(contentType.Query).not.toEqual(undefined);
        done()
    });

    test('ContentType fetch test', done => {
        stack.ContentType('uid').fetch().then((response) => done()).catch((error) => done())
        done();
    });
})
