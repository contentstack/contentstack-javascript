import * as Contentstack from '../..';

const stack = Contentstack.Stack({ api_key: 'api_key', delivery_token: 'delivery_token', environment: 'environment', fetchOptions: {
    logHandler: () => {

    }
}});

describe("Taxonomy Tests", () => {
    test("Get all taxonomies", done => {
        done()
    })
})

function createTaxonomyQuery() {
    return stack.taxonomies()
}