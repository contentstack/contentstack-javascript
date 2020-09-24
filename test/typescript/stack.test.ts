import * as Contentstack from '../..';

describe('Stack tests', () => {

    test('Stack initialization test', done => {
        const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
        expect(stack.ContentType).not.toEqual(undefined)
        expect(stack.Assets).not.toEqual(undefined)

        expect(stack.clearByQuery).not.toEqual(undefined)
        expect(stack.clearByContentType).not.toEqual(undefined)
        expect(stack.clearAll).not.toEqual(undefined)
        expect(stack.getContentTypes).not.toEqual(undefined)
        expect(stack.imageTransform).not.toEqual(undefined)

        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('cdn.contentstack.io');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.protocol).toEqual("https");
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.retryLimit).toEqual(5);
        expect(stack.fetchOptions.retryCondition).not.toEqual(undefined);
        done();
    });
    
    test('Stack set methods test', done => {
        const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment');
        stack.setHost('localehost');
        stack.setPort(344);
        stack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK);
        stack.setProtocol("http");
        stack.setCacheProvider({});
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.CACHE_THEN_NETWORK);
        expect(stack.config.host).toEqual('localehost');
        expect(stack.config.port).toEqual(344);
        expect(stack.config.protocol).toEqual("http");
        expect(stack.getCacheProvider()).toEqual({});
        done();
    });

    test('Stack initialization with fetchOptions test', done => {
        const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment', undefined, {
            timeout: 2000
        });
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('cdn.contentstack.io');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.timeout).toEqual(2000);

        done();
    });

    test('Stack initialization with Contentstack Config test', done => {
        const config : Contentstack.Config = {
            api_key: 'api_key', 
            delivery_token: 'deliverytoken', 
            environment: 'environment'
        };
        const stack = Contentstack.Stack(config);
        
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('cdn.contentstack.io');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.retryLimit).toEqual(5);

        done();
    });

    test('Stack initialization with Contentstack Config with fetchOptions test', done => {
        const config : Contentstack.Config = {
            api_key: 'api_key', 
            delivery_token: 'deliverytoken', 
            environment: 'environment',
            fetchOptions:{
                timeout: 2000,
                retryLimit: 4,
                retryDelay: 40
            }
        };
        const stack = Contentstack.Stack(config);
        
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('cdn.contentstack.io');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.timeout).toEqual(2000);
        expect(stack.fetchOptions.retryLimit).toEqual(4);
        expect(stack.fetchOptions.retryDelay).toEqual(40);
        done();
    });
    
    test('Stack initialization with Contentstack Config with fetchOptions, EU region test', done => {
        const config : Contentstack.Config = {
            api_key: 'api_key', 
            delivery_token: 'deliverytoken', 
            environment: 'environment',
            region: Contentstack.Region.EU,
            fetchOptions:{
                timeout: 2000,
                retryLimit: 4,
                retryDelay: 40
            }
        };
        const stack = Contentstack.Stack(config);
        
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('eu-cdn.contentstack.com');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.timeout).toEqual(2000);
        expect(stack.fetchOptions.retryLimit).toEqual(4);
        expect(stack.fetchOptions.retryDelay).toEqual(40);
        done();
    });
    
    test('Stack initialization with region EU test', done => {
        const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment', Contentstack.Region.EU);
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('eu-cdn.contentstack.com');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        done();
    });

    test('Stack initialization with region EU and fetchOptions test', done => {
        const stack = Contentstack.Stack('api_key', 'delivery_token', 'environment', Contentstack.Region.EU, {
            timeout: 2000
        });
        expect(stack.cachePolicy).toEqual(Contentstack.CachePolicy.IGNORE_CACHE);
        expect(stack.environment).toEqual('environment');
        expect(stack.config.host).toEqual('eu-cdn.contentstack.com');
        expect(stack.config.port).toEqual(443);
        expect(stack.config.version).toEqual("v3");
        expect(stack.fetchOptions.timeout).toEqual(2000);

        done();
    });
});
