import * as Contentstack from '../..';



const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
describe('ContentType Test', () => {
    test('ContentType without UID', done => {
        const contentType = stack.ContentType('uid');
        expect(contentType.content_type_uid).toEqual('uid');
        expect(contentType.Entry).not.toEqual(undefined);
        expect(contentType.Query).not.toEqual(undefined);
        done()
    })

    test('ContentType without UID', done => {
        const contentType = stack.ContentType('uid');
        expect(contentType.content_type_uid).toEqual('uid');
        expect(contentType.Entry).not.toEqual(undefined);
        expect(contentType.Query).not.toEqual(undefined);
        done()
    })

    // test('Get all ContentTypes test', done => {
    //     stack.getContentTypes().then((response) => {
    //         console.log(response);
    //         done();
    //     }).catch(done);
    // })
})
