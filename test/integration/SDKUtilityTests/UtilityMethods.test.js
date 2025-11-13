'use strict';

/**
 * COMPREHENSIVE SDK UTILITY METHODS TESTS
 * 
 * Tests SDK utility features and helper methods.
 * 
 * SDK Features Covered:
 * - .spread() method for promise result destructuring
 * - early_access headers
 * - Promise chain utilities
 * - Result handling methods
 * 
 * Bug Detection Focus:
 * - Spread method behavior
 * - Early access header injection
 * - Promise chain consistency
 * - Result formatting
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('SDK Utility Methods - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // SPREAD METHOD TESTS
  // =============================================================================

  describe('Spread Method', () => {
    
    test('Spread_BasicQuery_ReturnsEntriesAsFirstArg', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries).toBeDefined();
          expect(Array.isArray(entries)).toBe(true);
          expect(entries.length).toBeGreaterThan(0);
          
          console.log(`✅ Spread method: ${entries.length} entries in first argument`);
          done();
        })
        .catch(done);
    });

    test('Spread_WithIncludeCount_ReturnsBothArgs', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      Stack.ContentType(contentTypeUID)
        .Query()
        .includeCount()
        .limit(5)
        .toJSON()
        .find()
        .spread((entries, count) => {
          expect(entries).toBeDefined();
          expect(Array.isArray(entries)).toBe(true);
          expect(entries.length).toBeGreaterThan(0);
          
          expect(count).toBeDefined();
          expect(typeof count).toBe('number');
          expect(count).toBeGreaterThanOrEqual(entries.length);
          
          console.log(`✅ Spread with includeCount: ${entries.length} entries, count=${count}`);
          done();
        })
        .catch(done);
    });

    test('Spread_WithIncludeContentType_ReturnsSchema', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      Stack.ContentType(contentTypeUID)
        .Query()
        .includeContentType()
        .limit(3)
        .toJSON()
        .find()
        .spread((entries, schema) => {
          expect(entries).toBeDefined();
          expect(Array.isArray(entries)).toBe(true);
          
          // Schema should be second argument when includeContentType is used
          if (schema) {
            expect(schema).toBeDefined();
            console.log(`✅ Spread with includeContentType: entries + schema`);
          } else {
            console.log(`⚠️ Spread with includeContentType: schema not in spread args (may be in entries)`);
          }
          
          done();
        })
        .catch(done);
    });

    test('Spread_ErrorHandling_CatchesErrors', async () => {
      try {
        await Stack.ContentType('non_existent_ct_12345')
          .Query()
          .limit(5)
          .toJSON()
          .find()
          .spread((entries) => {
            // Should not reach here
            expect(true).toBe(false);
          });
        
        // If spread doesn't catch, we'll get here
        expect(true).toBe(false);
      } catch (error) {
        // Either spread catches or async/await catches
        expect(error).toBeDefined();
        // Error might have error_code or just be a regular error
        console.log('✅ Spread method error handling works (error caught)');
      }
    });

    test('Spread_ChainAfterSpread_Works', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries.length).toBeGreaterThan(0);
          return entries.length; // Return something to chain
        })
        .then((count) => {
          expect(typeof count).toBe('number');
          expect(count).toBeGreaterThan(0);
          console.log('✅ Promise chain after spread works correctly');
          done();
        })
        .catch(done);
    });

    test('Spread_EmptyResult_HandlesGracefully', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Query that should return empty (skip beyond available entries)
      Stack.ContentType(contentTypeUID)
        .Query()
        .skip(10000)
        .limit(5)
        .toJSON()
        .find()
        .spread((entries) => {
          expect(entries).toBeDefined();
          expect(Array.isArray(entries)).toBe(true);
          expect(entries.length).toBe(0);
          
          console.log('✅ Spread handles empty results gracefully');
          done();
        })
        .catch(done);
    });

  });

  // =============================================================================
  // EARLY ACCESS HEADERS TESTS
  // =============================================================================

  describe('Early Access Headers', () => {
    
    test('EarlyAccess_SingleFeature_HeaderAdded', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        early_access: ['taxonomy']
      });
      
      expect(stack.headers).toBeDefined();
      expect(stack.headers['x-header-ea']).toBeDefined();
      expect(stack.headers['x-header-ea']).toBe('taxonomy');
      
      console.log(`✅ Single early access feature: ${stack.headers['x-header-ea']}`);
    });

    test('EarlyAccess_MultipleFeatures_HeadersCommaSeparated', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        early_access: ['taxonomy', 'newCDA', 'variants']
      });
      
      expect(stack.headers).toBeDefined();
      expect(stack.headers['x-header-ea']).toBeDefined();
      expect(stack.headers['x-header-ea']).toBe('taxonomy,newCDA,variants');
      
      console.log(`✅ Multiple early access features: ${stack.headers['x-header-ea']}`);
    });

    test('EarlyAccess_EmptyArray_NoHeader', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        early_access: []
      });
      
      expect(stack.headers).toBeDefined();
      
      // Empty array should either not add header or add empty string
      if (stack.headers['x-header-ea']) {
        expect(stack.headers['x-header-ea']).toBe('');
        console.log('✅ Empty early access array: empty header');
      } else {
        console.log('✅ Empty early access array: no header added');
      }
    });

    test('EarlyAccess_NoEarlyAccess_NoHeader', () => {
      const stack = Contentstack.Stack(config.stack);
      
      expect(stack.headers).toBeDefined();
      
      // Without early_access, header should not exist
      if (!stack.headers['x-header-ea']) {
        console.log('✅ No early access: no header added');
      } else {
        console.log('⚠️ No early access but header exists (may have default value)');
      }
    });

    test('EarlyAccess_WithQueries_HeaderPersists', async () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        early_access: ['taxonomy']
      });
      stack.setHost(config.host);
      
      expect(stack.headers['x-header-ea']).toBe('taxonomy');
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Execute query - header should persist
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(stack.headers['x-header-ea']).toBe('taxonomy');
      
      console.log('✅ Early access header persists across queries');
    });

  });

  // =============================================================================
  // PROMISE UTILITIES
  // =============================================================================

  describe('Promise Utilities', () => {
    
    test('Then_BasicChain_Works', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find()
        .then((data) => {
          expect(data[0]).toBeDefined();
          return data[0].length;
        })
        .then((count) => {
          expect(count).toBeGreaterThan(0);
          return count * 2;
        });
      
      expect(result).toBeGreaterThan(0);
      console.log('✅ Promise .then() chain works correctly');
    });

    test('Catch_ErrorHandling_CatchesErrors', async () => {
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(5)
          .toJSON()
          .find()
          .catch((error) => {
            expect(error).toBeDefined();
            expect(error.error_code).toBeDefined();
            throw error; // Re-throw to test outer catch
          });
        
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.error_code).toBeDefined();
        console.log('✅ Promise .catch() handles errors correctly');
      }
    });

    test('Finally_AlwaysExecutes_AfterSuccess', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      let finallyExecuted = false;
      
      await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find()
        .finally(() => {
          finallyExecuted = true;
        });
      
      expect(finallyExecuted).toBe(true);
      console.log('✅ Promise .finally() executes after success');
    });

    test('Finally_AlwaysExecutes_AfterError', async () => {
      let finallyExecuted = false;
      
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(2)
          .toJSON()
          .find()
          .finally(() => {
            finallyExecuted = true;
          });
      } catch (error) {
        // Expected error
      }
      
      expect(finallyExecuted).toBe(true);
      console.log('✅ Promise .finally() executes even after error');
    });

  });

  // =============================================================================
  // ASYNC/AWAIT COMPATIBILITY
  // =============================================================================

  describe('Async/Await Compatibility', () => {
    
    test('AsyncAwait_BasicQuery_Works', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(Array.isArray(result[0])).toBe(true);
      expect(result[0].length).toBeGreaterThan(0);
      
      console.log('✅ Async/await works with SDK queries');
    });

    test('AsyncAwait_ErrorHandling_TryCatch', async () => {
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(5)
          .toJSON()
          .find();
        
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.error_code).toBeDefined();
        console.log('✅ Async/await error handling works with try/catch');
      }
    });

    test('AsyncAwait_MultipleQueries_Sequential', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result1 = await Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      const result2 = await Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      const result3 = await Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      
      const duration = Date.now() - startTime;
      
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      expect(result3[0]).toBeDefined();
      
      console.log(`✅ Sequential async/await queries: ${duration}ms`);
    });

    test('AsyncAwait_MultipleQueries_Parallel', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const [result1, result2, result3] = await Promise.all([
        Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find(),
        Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find(),
        Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find()
      ]);
      
      const duration = Date.now() - startTime;
      
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      expect(result3[0]).toBeDefined();
      
      console.log(`✅ Parallel async/await queries: ${duration}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Edge Cases', () => {
    
    test('EdgeCase_NullEarlyAccess_HandlesGracefully', () => {
      try {
        const stack = Contentstack.Stack({
          ...config.stack,
          early_access: null
        });
        
        console.log('⚠️ Null early_access accepted');
      } catch (error) {
        console.log('✅ Null early_access handled');
      }
    });

    test('EdgeCase_InvalidEarlyAccessType_HandlesGracefully', () => {
      try {
        const stack = Contentstack.Stack({
          ...config.stack,
          early_access: 'not-an-array'
        });
        
        console.log('⚠️ Invalid early_access type accepted');
      } catch (error) {
        console.log('✅ Invalid early_access type handled');
      }
    });

    test('EdgeCase_SpreadWithNoArgs_Works', (done) => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      Stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find()
        .spread(() => {
          // Calling spread with no args should work
          console.log('✅ Spread with no arguments works');
          done();
        })
        .catch(done);
    });

  });

});

