'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('./../config.js');
const Utils = require('./../entry/utils.js');

const Regexp = new RegExp('\\\?', 'g');

let Stack;
let Asset;

describe('Image Transformation Tests', () => {
  // Setup - runs before all tests
  beforeAll(done => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  // Get assets for testing
  describe('Get All Assets', () => {
    beforeAll(async () => {
      try {
        const assets = await Stack.Assets().Query().toJSON().find();
        Asset = assets[0][0];
      } catch (error) {
        console.error('error:', error);
        throw new Error('Failed to get assets');
      }
    });

    test('Should have assets in the resultset', () => {
      expect(Asset).toBeDefined();
    });
  });

  describe('Valid URL: single parameter testing', () => {
    let Image;
    const Params = {
      quality: 50
    };

    beforeAll(() => {
      const URL = Asset.url;
      Image = Stack.imageTransform(URL, Params);
    });

    test('Should generate valid URL', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });

    test('Should include quality parameter', () => {
      expect(Image.includes('?quality=50')).toBe(true);
    });

    test('Should verify URL is valid again', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });
  });

  describe('Valid URL: multiple parameter testing', () => {
    let Image;
    const Params = {
      quality: 50,
      auto: 'webp',
      format: 'jpg'
    };

    beforeAll(() => {
      const URL = Asset.url;
      Image = Stack.imageTransform(URL, Params);
    });

    test('Should generate valid URL', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });

    test('Should include quality parameter', () => {
      expect(Image.includes('quality=50')).toBe(true);
    });

    test('Should include auto parameter', () => {
      expect(Image.includes('auto=webp')).toBe(true);
    });

    test('Should include format parameter', () => {
      expect(Image.includes('format=jpg')).toBe(true);
    });

    test('Should verify URL is valid again', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });
  });

  describe('Invalid URL: single parameter testing', () => {
    let Image;
    const Params = {
      quality: 50
    };

    beforeAll(() => {
      const URL = Asset.url + '?';
      Image = Stack.imageTransform(URL, Params);
    });

    test('Should generate valid URL', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });

    test('Should include quality parameter', () => {
      expect(Image.includes('quality=50')).toBe(true);
    });

    test('Should verify URL is valid again', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });
  });

  describe('Invalid URL: multiple parameter testing', () => {
    let Image;
    const Params = {
      quality: 50,
      auto: 'webp',
      format: 'jpg'
    };

    beforeAll(() => {
      const URL = Asset.url + '?';
      Image = Stack.imageTransform(URL, Params);
    });

    test('Should generate valid URL', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });

    test('Should include quality parameter', () => {
      expect(Image.includes('quality=50')).toBe(true);
    });

    test('Should include auto parameter', () => {
      expect(Image.includes('auto=webp')).toBe(true);
    });

    test('Should include format parameter', () => {
      expect(Image.includes('format=jpg')).toBe(true);
    });

    test('Should verify URL is valid again', () => {
      expect(Image.match(Regexp).length).toBe(1);
    });
  });
});
