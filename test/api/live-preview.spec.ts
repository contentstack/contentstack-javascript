import * as contentstack from '../../src/lib/contentstack';
import { TEntry } from './types';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY as string
const deliveryToken = process.env.DELIVERY_TOKEN as string
const environment = process.env.ENVIRONMENT as string

describe('Live preview tests', () => {
    test('should check for values initialized', () => {
        const stack = contentstack.stack({
            apiKey: apiKey,
            deliveryToken: deliveryToken,
            environment: environment,
        });
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).toBeUndefined();
        expect(stack.config.host).toBe('cdn.contentstack.io');
    });

    test('should check host when live preview is enabled and management token is provided', () => {
        const stack = contentstack.stack({
            apiKey: apiKey,
            deliveryToken: deliveryToken,
            environment: environment,
            live_preview: {
                enable: true,
                management_token: 'management_token'
            }
        })
        const livePreviewObject = stack.config.live_preview
        expect(livePreviewObject).not.toBeUndefined();
        expect(livePreviewObject).toHaveProperty('enable');
        expect(livePreviewObject).toHaveProperty('host');
        expect(livePreviewObject).not.toHaveProperty('preview');
        expect(stack.config.host).toBe('api.contentstack.io');
    });

    test('should check host when live preview is disabled and management token is provided', () => {
        const stack = contentstack.stack({
            apiKey: apiKey,
            deliveryToken: deliveryToken,
            environment: environment,
            live_preview: {
                enable: false,
                management_token: 'management_token'
            }
        })
        const livePreviewObject = stack.config.live_preview
        expect(livePreviewObject).not.toBeUndefined();
        expect(livePreviewObject).toHaveProperty('enable');
        expect(livePreviewObject).not.toHaveProperty('host');
        expect(livePreviewObject).not.toHaveProperty('preview');
        expect(stack.config.host).toBe('cdn.contentstack.io');
    });

    test('should check host when live preview is enabled and preview token is provided', () => {
        const stack = contentstack.stack({
            apiKey: apiKey,
            deliveryToken: deliveryToken,
            environment: environment,
            live_preview: {
                enable: true,
                preview_token: 'preview_token'
            }
        })
        const livePreviewObject = stack.config.live_preview
        expect(livePreviewObject).not.toBeUndefined();
        expect(livePreviewObject).toHaveProperty('enable');
        expect(livePreviewObject).toHaveProperty('host');
        expect(livePreviewObject).not.toHaveProperty('preview');
        expect(stack.config.host).toBe('rest-preview.contentstack.com');
    });

    test('should check host when live preview is disabled and preview token is provided', () => {
        const stack = contentstack.stack({
            apiKey: apiKey,
            deliveryToken: deliveryToken,
            environment: environment,
            live_preview: {
                enable: false,
                preview_token: 'preview_token'
            }
        })
        const livePreviewObject = stack.config.live_preview
        expect(livePreviewObject).not.toBeUndefined();
        expect(livePreviewObject).toHaveProperty('enable');
        expect(livePreviewObject).not.toHaveProperty('host');
        expect(livePreviewObject).not.toHaveProperty('preview');
        expect(stack.config.host).toBe('cdn.contentstack.io');
    });
});

describe('Live preview query Entry API tests', () => {
    it('should check for entry is when live preview is enabled with managemenet token', async () => {
        const stack = contentstack.stack({
            apiKey: process.env.API_KEY as string,
            deliveryToken: process.env.DELIVERY_TOKEN as string,
            environment: process.env.ENVIRONMENT as string,
            live_preview: {
                enable: true,
                management_token: 'management_token'
            }
        })
        stack.livePreviewQuery({
            contentTypeUid: 'contentTypeUid',
            live_preview: 'ser',
        })
        const result = await stack.contentType('contentTypeUid').entry('entryUid').fetch<TEntry>();
        expect(result).toBeDefined();
        expect(result._version).toBeDefined();
        expect(result.locale).toEqual('en-us');
        expect(result.uid).toBeDefined();
        expect(result.created_by).toBeDefined();
        expect(result.updated_by).toBeDefined();
    });

    it('should check for entry is when live preview is disabled with managemenet token', async () => {
        const stack = contentstack.stack({
            apiKey: process.env.API_KEY as string,
            deliveryToken: process.env.DELIVERY_TOKEN as string,
            environment: process.env.ENVIRONMENT as string,
            live_preview: {
                enable: false,
                management_token: 'management_token'
            }
        })
        stack.livePreviewQuery({
            contentTypeUid: 'contentTypeUid',
            live_preview: 'ser',
        })
        const result = await stack.contentType('contentTypeUid').entry('entryUid').fetch<TEntry>();
        expect(result).toBeDefined();
        expect(result._version).toBeDefined();
        expect(result.locale).toEqual('en-us');
        expect(result.uid).toBeDefined();
        expect(result.created_by).toBeDefined();
        expect(result.updated_by).toBeDefined();
    });

    it('should check for entry is when live preview is disabled with preview token', async () => {
        const stack = contentstack.stack({
            apiKey: process.env.API_KEY as string,
            deliveryToken: process.env.DELIVERY_TOKEN as string,
            environment: process.env.ENVIRONMENT as string,
            live_preview: {
                enable: false,
                preview_token: 'preview_token'
            }
        })
        stack.livePreviewQuery({
            contentTypeUid: 'contentTypeUid',
            live_preview: 'ser',
        })
        const result = await stack.contentType('contentTypeUid').entry('entryUid').fetch<TEntry>();
        expect(result).toBeDefined();
        expect(result._version).toBeDefined();
        expect(result.locale).toEqual('en-us');
        expect(result.uid).toBeDefined();
        expect(result.created_by).toBeDefined();
        expect(result.updated_by).toBeDefined();
    });
})