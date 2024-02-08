import * as Contentstack from '../../src/lib/contentstack';

describe('Live preview tests', () => {

    test('should check for values initialized', () => {
        const stack = Contentstack.Stack({
            apiKey: 'apiKey',
            deliveryToken: 'deliveryToken',
            environment: 'environment',
        });
        const livePreviewObject = stack.config.live_preview;
        expect(livePreviewObject).toBeUndefined();
        expect(stack.config.host).toBe('cdn.contentstack.io');
    });

    test('should check host when live preview is enabled and management token is provided', () => {
        const stack = Contentstack.Stack({
            apiKey: 'apiKey',
            deliveryToken: 'deliveryToken',
            environment: 'environment',
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
        expect(stack.config.host).toBe('api.contentstack.com');
    });

    test('should check host when live preview is disabled and management token is provided', () => {
        const stack = Contentstack.Stack({
            apiKey: 'apiKey',
            deliveryToken: 'deliveryToken',
            environment: 'environment',
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
        const stack = Contentstack.Stack({
            apiKey: 'apiKey',
            deliveryToken: 'deliveryToken',
            environment: 'environment',
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
        const stack = Contentstack.Stack({
            apiKey: 'apiKey',
            deliveryToken: 'deliveryToken',
            environment: 'environment',
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
