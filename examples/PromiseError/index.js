require('dotenv').config()

const Contentstack = require('../../dist/node/contentstack');
const { RequestInterceptor } = require('node-request-interceptor');
const { default: withDefaultInterceptors } = require('node-request-interceptor/lib/presets/default');

const interceptor = new RequestInterceptor(withDefaultInterceptors)

// Log any outgoing requests to contentstack and return a mock HTML response
// which will cause the SDK to throw an unhandled exception
interceptor.use((req) => {

    console.log('%s %s', req.method, req.url.href);

    return {
        status: 400,
        headers: {
            'x-powered-by': 'node-request-interceptor',
            'content-type': 'text/html'
        },
        body: `
        <html>
        <head></head>
        <body>
            <h1>Nodata</h1>
        </body>
        </html>
        `,
    }
});

const Stack = Contentstack.Stack(
    process.env.CONTENTSTACK_API_KEY,
    process.env.CONTENTSTACK_DELIVERY_TOKEN,
    process.env.CONTENTSTACK_ENVIRONMENT,
    { timeout: 5000,
        retryCondition: () => true
     });

Stack.setHost('dev15-api.contentstack.com');

const Query = Stack
    .ContentType(process.env.CONTENTSTACK_CONTENT_TYPE)
    .Query({})
    .language("en-us")
    .includeCount();

// Executing this async invocation cause an unhandled promise rejection
Query
    .toJSON()
    .find()
    .then((res) => {
        const [,count] = res;
        console.log(`${count} total blogs.`);
    })
    .catch((err) => {
        // Error is not caught
        console.error('ERRR Catch', err);
    });
