'use strict';
/*
 * Module Dependencies.
 */
const Contentstack = require('../../dist/node/contentstack.js');
const init = require('../config.js');

let Stack;
let sync_token = '';
let pagination_token = '';

describe('ContentStack SDK Sync Tests', () => {
  // Initialize the Contentstack Stack Instance
  beforeAll(() => {
    return new Promise((resolve) => {
      // Initialize Stack with proper configuration
      Stack = Contentstack.Stack(init.stack);
      Stack.setHost(init.host);
      setTimeout(resolve, 1000);
    });
  });

  describe('default .Init()', () => {
    test('should initialize sync with correct total count', async () => {
      const data = await Stack.sync({ init: true });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .startdate()', () => {
    test('should filter entries by start date', async () => {
      const data = await Stack.sync({
        init: 'true',
        start_from: '2018-10-22T00:00:00.000Z'
      });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .locale()', () => {
    test('should filter entries by locale', async () => {
      const data = await Stack.sync({
        init: 'true',
        locale: 'en-us'
      });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .localeDate()', () => {
    test('should filter entries by locale and date', async () => {
      const data = await Stack.sync({
        init: 'true',
        locale: 'en-us',
        start_from: '2018-10-22T00:00:00.000Z'
      });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .pagination_token()', () => {
    test('should handle pagination correctly', async () => {
      // This works only when it contains more than 100 records else sync token will be generated

      const initialData = await Stack.sync({ init: 'true' });
      pagination_token = initialData.pagination_token;
      expect(pagination_token).toBeUndefined();
      try {
        await Stack.sync({ pagination_token });
      } catch (error) {
        expect(error.message).toBe('Invalid parameter value for key "pagination_token": must be a string, number, object, boolean, or RegExp.');
      }
    });
  });

  describe('default .contentTypeUid()', () => {
    test('should filter entries by content type', async () => {
      const data = await Stack.sync({
        init: 'true',
        content_type_uid: 'source'
      });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .type()', () => {
    test('should filter entries by type', async () => {
      const data = await Stack.sync({
        init: 'true',
        type: 'asset_published'
      });
      expect(data.total_count).toBeDefined();
    });
  });

  describe('default .sync_token()', () => {
    test('should handle sync token correctly', async () => {
      // First get a valid sync token
      const initialData = await Stack.sync({ init: 'true' });
      sync_token = initialData.sync_token;

      const result = await Stack.sync({ sync_token });
      expect(result.total_count).toBeDefined();
    });
  });
});
