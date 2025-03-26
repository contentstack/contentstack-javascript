'use strict';

const Contentstack = require('../../dist/node/contentstack.js');

describe('Contentstack Live Preview Tests', () => {
  test('should check for values initialized', () => {
    const stack = Contentstack.Stack({
      'api_key': process.env.region_API_KEY, 
      'delivery_token': process.env.DELIVERY_TOKEN, 
      'environment': process.env.ENVIRONMENT
    });
    
    const livePreviewObject = stack.config.live_preview;
    expect(livePreviewObject.enable).toBe(false);
    expect(stack.config.host).toBe('cdn.contentstack.io'); // rest-preview.contentstack.com
  });

  test('should check host when live preview is enabled and management token is provided', () => {
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
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io'); // rest-preview.contentstack.com
  });

  test('should check host when live preview is disabled and management token is provided', () => {
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
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).toBe(false);
    expect(livePreviewObject.host).not.toBe('undefined');
  });

  test('should check host when live preview is enabled and preview token is provided', () => {
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
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(livePreviewObject.preview_token).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io');
  });

  test('should check host when live preview is disabled and preview token is provided', () => {
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
    expect(livePreviewObject).not.toBe('undefined');
    expect(livePreviewObject.enable).not.toBe('undefined');
    expect(livePreviewObject.host).not.toBe('undefined');
    expect(livePreviewObject.preview_token).not.toBe('undefined');
    expect(stack.config.host).toBe('cdn.contentstack.io');
  });
});