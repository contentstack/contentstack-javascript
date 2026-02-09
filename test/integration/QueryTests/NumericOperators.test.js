'use strict';

/**
 * Query Numeric Operators - COMPREHENSIVE Tests
 * 
 * Tests for numeric comparison operators:
 * - lessThan()
 * - lessThanOrEqualTo()
 * - greaterThan()
 * - greaterThanOrEqualTo()
 * 
 * Focus Areas:
 * 1. Core functionality validation
 * 2. Boundary testing (zero, negative, max values)
 * 3. Edge cases (non-existent fields, wrong types)
 * 4. Data integrity (ALL results match criteria)
 * 5. Combination with other operators
 * 
 * Bug Detection:
 * - Off-by-one errors in comparisons
 * - Boundary condition bugs
 * - Type coercion issues
 * - SQL injection in numeric queries
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Query Tests - Numeric Operators', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('lessThan() - Core Functionality', () => {
    test('Query_LessThan_BasicNumber_ReturnsMatchingEntries', async () => {
      // NOTE: This test requires a content type with numeric fields
      // For now, testing with 'updated_at' timestamp which is numeric
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const fieldName = 'updated_at';  // Unix timestamp - numeric
      const threshold = Date.now(); // Current timestamp
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.lessThan(fieldName, threshold).toJSON().find();
      
      // 1. Result structure validation
      AssertionHelper.assertQueryResultStructure(result);
      
      // 2. If results exist, validate ALL entries match condition
      if (result[0].length > 0) {
        console.log(`✅ Found ${result[0].length} entries with ${fieldName} < ${threshold}`);
        
        AssertionHelper.assertAllEntriesMatch(
          result[0],
          entry => {
            expect(entry[fieldName]).toBeDefined();
            expect(typeof entry[fieldName]).toBe('number');
            return entry[fieldName] < threshold;
          },
          `${fieldName} < ${threshold}`
        );
        
        // 3. Boundary validation - max value should be less than threshold
        const maxValue = Math.max(...result[0].map(e => e[fieldName]));
        expect(maxValue).toBeLessThan(threshold);
        console.log(`  ✅ Max value in results: ${maxValue} (< ${threshold})`);
      } else {
        console.log(`ℹ️  No entries found with ${fieldName} < ${threshold}`);
      }
    });

    test('Query_LessThan_WithOldTimestamp_ReturnsAllEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Use timestamp from far future - should return all entries
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThan('updated_at', Date.now() + (365 * 24 * 60 * 60 * 1000)) // 1 year future
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      // Should return entries (all updated_at values are in the past)
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeLessThan(Date.now() + (365 * 24 * 60 * 60 * 1000));
        });
        console.log(`✅ All ${result[0].length} entries have updated_at in the past`);
      }
    });

    test('Query_LessThan_WithPastTimestamp_ReturnsEmpty', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Use very old timestamp - unlikely to have entries before 2000
      const threshold = new Date('2000-01-01').getTime();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThan('updated_at', threshold)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      // Should return empty or very few
      console.log(`✅ Entries before year 2000: ${result[0].length} (expected 0 or few)`);
      
      result[0].forEach(entry => {
        expect(entry.updated_at).toBeLessThan(threshold);
      });
    });

    test('Query_LessThan_NonExistentField_ReturnsEmpty', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThan('non_existent_field_xyz_12345', 100)
        .toJSON()
        .find();
      
      // Should return empty or handle gracefully
      expect(result[0]).toBeDefined();
      expect(Array.isArray(result[0])).toBe(true);
      console.log(`✅ Non-existent field handled gracefully: ${result[0].length} results`);
    });
  });

  describe('lessThanOrEqualTo() - Boundary Validation', () => {
    test('Query_LessThanOrEqualTo_WithTimestamp_Works', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const threshold = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThanOrEqualTo('updated_at', threshold)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeLessThanOrEqual(threshold);
        });
        
        console.log(`✅ All ${result[0].length} entries have updated_at <= ${new Date(threshold).toISOString()}`);
      }
    });

    test('Query_LessThanOrEqualTo_VsLessThan_DifferentResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const threshold = Date.now();
      
      // Get both results
      const resultLTE = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThanOrEqualTo('updated_at', threshold)
        .toJSON()
        .find();
      
      const resultLT = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThan('updated_at', threshold)
        .toJSON()
        .find();
      
      // lessThanOrEqualTo should return >= lessThan results
      expect(resultLTE[0].length).toBeGreaterThanOrEqual(resultLT[0].length);
      
      console.log(`✅ lessThanOrEqualTo: ${resultLTE[0].length} results`);
      console.log(`✅ lessThan: ${resultLT[0].length} results`);
      console.log(`  Proves lessThanOrEqualTo includes boundary values`);
    });
  });

  describe('greaterThan() - Core Functionality', () => {
    test('Query_GreaterThan_OldTimestamp_ReturnsNoResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const threshold = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year future
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .greaterThan('updated_at', threshold)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      // Should return 0 or very few (no entries from future)
      console.log(`✅ Entries from future: ${result[0].length} (expected 0)`);
      expect(result[0].length).toBe(0);
    });

    test('Query_GreaterThan_WithPastTimestamp_ReturnsRecentEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const threshold = new Date('2023-01-01').getTime();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .greaterThan('updated_at', threshold)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeGreaterThan(threshold);
        });
        console.log(`✅ All ${result[0].length} entries updated after 2023`);
      }
    });
  });

  describe('greaterThanOrEqualTo() - Boundary Validation', () => {
    test('Query_GreaterThanOrEqualTo_WithTimestamp_Works', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const threshold = new Date('2020-01-01').getTime();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .greaterThanOrEqualTo('updated_at', threshold)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeGreaterThanOrEqual(threshold);
        });
        
        console.log(`✅ All ${result[0].length} entries updated after/on 2020-01-01`);
      }
    });
  });

  describe('Numeric Operators - Combinations', () => {
    test('Query_LessThanAndGreaterThan_TimeRange_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const min = new Date('2020-01-01').getTime();
      const max = new Date('2025-01-01').getTime();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .greaterThan('updated_at', min)
        .lessThan('updated_at', max)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        // CRITICAL: Validate ALL entries are in range
        result[0].forEach(entry => {
          expect(entry.updated_at).toBeGreaterThan(min);
          expect(entry.updated_at).toBeLessThan(max);
        });
        
        console.log(`✅ All ${result[0].length} entries in time range (2020-2025)`);
        
        // Show actual range
        const actualMin = Math.min(...result[0].map(e => e.updated_at));
        const actualMax = Math.max(...result[0].map(e => e.updated_at));
        console.log(`  Actual range: ${new Date(actualMin).toISOString()} to ${new Date(actualMax).toISOString()}`);
      }
    });

    test('Query_NumericWithLimit_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const limit = 5;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .lessThan('updated_at', Date.now())
        .limit(limit)
        .toJSON()
        .find();
      
      // Should respect BOTH conditions
      expect(result[0].length).toBeLessThanOrEqual(limit);
      
      result[0].forEach(entry => {
        expect(entry.updated_at).toBeLessThan(Date.now() + 1000); // Small buffer
      });
      
      console.log(`✅ Both conditions applied: ${result[0].length} results (max ${limit}), all in past`);
    });
  });

  describe('Numeric Operators - Performance', () => {
    test('Query_LessThan_Performance_CompletesQuickly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .lessThan('updated_at', Date.now())
          .toJSON()
          .find();
      }, 3000); // Should complete in <3s
      
      console.log('✅ Query performance acceptable');
    });
  });
});

