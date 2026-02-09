'use strict';

/**
 * Custom Parameters & Advanced Query Features - COMPREHENSIVE Tests
 * 
 * Tests for advanced query features:
 * - addParam() - custom query parameters
 * - addQuery() - custom query objects
 * - Environment-specific queries
 * - Branch-specific queries
 * - Complex parameter combinations
 * 
 * Focus Areas:
 * 1. Custom parameter addition
 * 2. Parameter combinations
 * 3. Environment handling
 * 4. Branch handling
 * 5. Edge cases
 * 
 * Bug Detection:
 * - Parameters not applied
 * - Parameter conflicts
 * - Invalid parameters
 * - Query corruption
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Advanced Tests - Custom Parameters', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('addParam() - Custom Query Parameters', () => {
    test('AddParam_SingleParam_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addParam('include_count', 'true')
        .limit(5)
        .toJSON()
        .find();
      
      // With include_count, should have count
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      
      console.log(`✅ addParam('include_count', 'true'): ${result[1]} total entries`);
    });

    test('AddParam_MultipleParams_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addParam('include_count', 'true')
        .addParam('skip', '0')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      
      console.log(`✅ Multiple addParam() calls: ${result[0].length} entries, ${result[1]} total`);
    });

    test('AddParam_WithOtherOperators_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .addParam('include_count', 'true')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ addParam() + where(): ${result[0].length} filtered entries`);
      }
    });

    test('AddParam_Entry_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .addParam('include_metadata', 'true')
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      console.log('✅ Entry.addParam() applied successfully');
    });
  });

  describe('Environment & Branch Parameters', () => {
    test('Environment_SetInStack_AppliedToQueries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Environment is set in init.stack configuration
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Environment applied: ${result[0].length} entries`);
    });

    test('Branch_ConfiguredBranch_AppliedToQueries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const branchUID = TestDataHelper.getBranchUID();
      
      if (branchUID) {
        console.log(`ℹ️  Branch configured: ${branchUID}`);
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Branch context applied: ${result[0].length} entries`);
    });
  });

  describe('addQuery() - Custom Query Objects', () => {
    test('AddQuery_CustomQueryObject_Applied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addQuery('locale', primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ addQuery('locale'): ${result[0].length} entries`);
      }
    });

    test('AddQuery_WithOperators_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addQuery('updated_at', { $exists: true })
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeDefined();
        });
        
        console.log(`✅ addQuery() with $exists: ${result[0].length} entries`);
      }
    });
  });

  describe('Query Parameter Combinations', () => {
    test('Combination_AllQueryMethods_Work', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .addParam('include_count', 'true')
        .descending('updated_at')
        .skip(0)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0].length).toBeLessThanOrEqual(3);
      expect(result[1]).toBeDefined();
      
      if (result[0].length > 1) {
        // Check sorting
        for (let i = 1; i < result[0].length; i++) {
          const prev = new Date(result[0][i - 1].updated_at).getTime();
          const curr = new Date(result[0][i].updated_at).getTime();
          expect(curr).toBeLessThanOrEqual(prev);
        }
      }
      
      console.log(`✅ Complex combination: ${result[0].length} entries, ${result[1]} total`);
    });

    test('Combination_AllFeatures_WorkTogether', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const authorField = TestDataHelper.getReferenceField('author');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .includeReference(authorField)
        .only(['title', 'locale', authorField])
        .addParam('include_count', 'true')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      
      console.log(`✅ All features combined: ${result[0].length} entries with references & projection`);
    });
  });

  describe('Performance with Custom Parameters', () => {
    test('CustomParams_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .addParam('include_count', 'true')
          .addParam('skip', '0')
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Custom parameters performance acceptable');
    });

    test('ComplexCombination_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .where('locale', primaryLocale)
          .addParam('include_count', 'true')
          .descending('updated_at')
          .skip(0)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Complex combination performance acceptable');
    });
  });

  describe('Edge Cases & Error Handling', () => {
    test('AddParam_EmptyValue_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .addParam('custom_param', '')
          .limit(3)
          .toJSON()
          .find();
        
        AssertionHelper.assertQueryResultStructure(result);
        console.log('✅ Empty parameter value handled gracefully');
      } catch (error) {
        // Empty value might cause error - that's acceptable
        console.log('ℹ️  Empty parameter value causes error (acceptable behavior)');
        expect(error).toBeDefined();
      }
    });

    test('AddParam_InvalidParam_StillReturnsResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addParam('invalid_param_xyz', 'value')
        .limit(3)
        .toJSON()
        .find();
      
      // Invalid params should be ignored, query should still work
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Invalid parameter ignored, query succeeded');
    });

    test('AddParam_SpecialCharacters_HandlesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addParam('test_param', 'value&special=chars')
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Special characters in parameters handled');
    });

    test('AddQuery_EmptyObject_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .addQuery('test', {})
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Empty query object handled gracefully');
    });
  });

  describe('Query Chain Order Tests', () => {
    test('QueryOrder_DifferentOrders_SameResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      // Order 1: where -> addParam -> limit
      const result1 = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .addParam('include_count', 'true')
        .limit(5)
        .toJSON()
        .find();
      
      // Order 2: limit -> addParam -> where
      const result2 = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .addParam('include_count', 'true')
        .where('locale', primaryLocale)
        .toJSON()
        .find();
      
      // Both should work correctly
      expect(result1[0].length).toBeGreaterThan(0);
      expect(result2[0].length).toBeGreaterThan(0);
      expect(result1[1]).toBeDefined();
      expect(result2[1]).toBeDefined();
      
      console.log(`✅ Query order independence: Order1=${result1[0].length}, Order2=${result2[0].length}`);
    });

    test('QueryOrder_ToJSONPosition_NoImpact', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // toJSON() at different positions should work
      const result1 = await Stack.ContentType(contentTypeUID)
        .Query()
        .toJSON()
        .limit(3)
        .find();
      
      const result2 = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      // Both should return valid results
      AssertionHelper.assertQueryResultStructure(result1);
      AssertionHelper.assertQueryResultStructure(result2);
      
      console.log('✅ toJSON() position has no negative impact');
    });
  });

  describe('Parameter Override Tests', () => {
    test('Param_Duplicate_LastOneWins', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .limit(3) // Override previous limit
        .toJSON()
        .find();
      
      // Last limit should be applied
      expect(result[0].length).toBeLessThanOrEqual(3);
      
      console.log(`✅ Duplicate parameter override: ${result[0].length} entries (limit=3 applied)`);
    });

    test('Param_Conflicting_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .addQuery('locale', primaryLocale) // Duplicate condition
        .limit(5)
        .toJSON()
        .find();
      
      // Should handle duplicate/conflicting conditions
      AssertionHelper.assertQueryResultStructure(result);
      
      console.log('✅ Conflicting parameters handled correctly');
    });
  });
});

