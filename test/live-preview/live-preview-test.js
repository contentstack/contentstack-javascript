'use strict';
const init = require('../config.js');

const Contentstack = require('../../dist/node/contentstack.js');

describe('Contentstack Live Preview Tests', () => {
  test('should check for values initialized', () => {
    const stack1 = Contentstack.Stack(init.stack);
    const stack = Contentstack.Stack({
      api_key: process.env.API_KEY,
      delivery_token: process.env.DELIVERY_TOKEN,
      environment: process.env.ENVIRONMENT
    });

    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject.enable).toBe(false);
    expect(stack.config.host).toBe('cdn.contentstack.io'); // rest-preview.contentstack.com
  });

  test('should check host when live preview is enabled and management token is provided', () => {
    init.stack.live_preview = init.stack.live_preview || {};
    init.stack.live_preview.enable = true;
    init.stack.live_preview.management_token = 'management_token';
    const stack = Contentstack.Stack(init.stack);

    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io'); // rest-preview.contentstack.com
  });

  test('should check host when live preview is disabled and management token is provided', () => {
    init.stack.live_preview.enable = false;
    init.stack.live_preview.management_token = 'management_token';
    const stack = Contentstack.Stack(init.stack);

    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).toBe(false);
    expect(livePreviewObject.host).not.toBe('undefined');
  });

  test('should check host when live preview is enabled and preview token is provided', () => {
    init.stack.live_preview.enable = true;
    init.stack.live_preview.preview_token = 'preview_token';
    const stack = Contentstack.Stack(init.stack);

    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(livePreviewObject.preview_token).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io');
  });

  test('should check host when live preview is disabled and preview token is provided', () => {
    init.stack.live_preview.enable = false;
    init.stack.live_preview.preview_token = 'preview_token';
    const stack = Contentstack.Stack(init.stack);

    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(livePreviewObject.preview_token).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io');
  });
});
