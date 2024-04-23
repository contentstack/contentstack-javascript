
'use strict';

const test = require('tape');
const Contentstack = require('../../dist/node/contentstack.js');

test('should check for values initialized', function(assert) {
    const stack = Contentstack.Stack({
        'api_key': process.env.API_KEY, 
        'delivery_token': process.env.DELIVERY_TOKEN, 
        'environment': process.env.ENVIRONMENT
    });
    const livePreviewObject = stack.config.live_preview;
    assert.equal(livePreviewObject.enable, false);
    assert.equal(stack.config.host, 'cdn.contentstack.io'); // rest-preview.contentstack.com
    assert.end();
});

test('should check host when live preview is enabled and management token is provided', function(assert) {
    const stack = Contentstack.Stack({
        'api_key': process.env.API_KEY, 
        'delivery_token': process.env.DELIVERY_TOKEN, 
        'environment': process.env.ENVIRONMENT,
        live_preview: {
            enable: true,
            management_token: 'management_token'
        }
    });
    const livePreviewObject = stack.config.live_preview;
    assert.notEqual(livePreviewObject, 'undefined');
    assert.notEqual(livePreviewObject.enable, 'undefined');
    assert.notEqual(livePreviewObject.host, 'undefined');
    assert.equal(stack.config.host, 'cdn.contentstack.io'); // rest-preview.contentstack.com
    assert.end();
});

test('should check host when live preview is disabled and management token is provided', function(assert) {
    const stack = Contentstack.Stack({
        'api_key': process.env.API_KEY, 
        'delivery_token': process.env.DELIVERY_TOKEN, 
        'environment': process.env.ENVIRONMENT,
        live_preview: {
            enable: false,
            management_token: 'management_token'
        }
    });
    const livePreviewObject = stack.config.live_preview;
    assert.notEqual(livePreviewObject, 'undefined');
    assert.equal(livePreviewObject.enable, false);
    assert.notEqual(livePreviewObject.host, 'undefined');
    assert.end();
});

test('should check host when live preview is enabled and preview token is provided', function(assert) {
    const stack = Contentstack.Stack({
        'api_key': process.env.API_KEY, 
        'delivery_token': process.env.DELIVERY_TOKEN, 
        'environment': process.env.ENVIRONMENT,
        live_preview: {
            enable: true,
            preview_token: 'preview_token'
        }
    });
    const livePreviewObject = stack.config.live_preview;
    assert.notEqual(livePreviewObject, 'undefined');
    assert.notEqual(livePreviewObject.enable, 'undefined');
    assert.notEqual(livePreviewObject.host, 'undefined');
    assert.notEqual(livePreviewObject.preview_token, 'undefined');
    assert.equal(stack.config.host, 'cdn.contentstack.io');
    assert.end();
});

test('should check host when live preview is disabled and preview token is provided', function(assert) {
    const stack = Contentstack.Stack({
        'api_key': process.env.API_KEY, 
        'delivery_token': process.env.DELIVERY_TOKEN, 
        'environment': process.env.ENVIRONMENT,
        live_preview: {
            enable: false,
            preview_token: 'preview_token'
        }
    });
    const livePreviewObject = stack.config.live_preview;
    assert.notEqual(livePreviewObject, 'undefined');
    assert.notEqual(livePreviewObject.enable, 'undefined');
    assert.notEqual(livePreviewObject.host, 'undefined');
    assert.notEqual(livePreviewObject.preview_token, 'undefined');
    assert.equal(stack.config.host, 'cdn.contentstack.io');
    assert.end();
});

