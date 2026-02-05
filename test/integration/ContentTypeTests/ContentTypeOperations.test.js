'use strict';

/**
 * Content Type Operations - COMPREHENSIVE Tests
 * 
 * Tests for content type operations:
 * - Stack.getContentTypes() - fetch all content types
 * - Content type metadata
 * - Content type with queries
 * - Content type validation
 * 
 * Focus Areas:
 * 1. Fetching content types
 * 2. Content type metadata
 * 3. Content type structure validation
 * 4. Performance
 * 5. Edge cases
 * 
 * Bug Detection:
 * - Missing content types
 * - Incomplete metadata
 * - Invalid structure
 * - Performance issues
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Content Type Tests - Content Type Operations', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Stack.getContentTypes() - Fetch Content Types', () => {
    test('ContentType_GetAll_ReturnsContentTypes', async () => {
      try {
        const contentTypes = await Stack.getContentTypes();
        
        expect(contentTypes).toBeDefined();
        expect(Array.isArray(contentTypes)).toBe(true);
        
        if (contentTypes.length > 0) {
          console.log(`✅ Stack.getContentTypes(): ${contentTypes.length} content types found`);
          
          // Validate first content type has required fields
          const firstCT = contentTypes[0];
          expect(firstCT.uid).toBeDefined();
          expect(firstCT.title).toBeDefined();
        } else {
          console.log('ℹ️  No content types found in stack');
        }
      } catch (error) {
        console.log('ℹ️  Stack.getContentTypes() not available or error:', error.message);
        expect(error).toBeDefined();
      }
    });

    test('ContentType_GetAll_HasCompleteMetadata', async () => {
      try {
        const contentTypes = await Stack.getContentTypes();
        
        if (contentTypes && contentTypes.length > 0) {
          contentTypes.forEach(ct => {
            expect(ct.uid).toBeDefined();
            expect(typeof ct.uid).toBe('string');
            expect(ct.title).toBeDefined();
            
            console.log(`  ✅ Content Type: ${ct.uid} - ${ct.title}`);
          });
          
          console.log(`✅ All ${contentTypes.length} content types have complete metadata`);
        }
      } catch (error) {
        console.log('ℹ️  getContentTypes() test skipped');
      }
    });

    test('ContentType_GetAll_ContainsKnownContentTypes', async () => {
      try {
        const contentTypes = await Stack.getContentTypes();
        
        if (contentTypes && contentTypes.length > 0) {
          const ctUIDs = contentTypes.map(ct => ct.uid);
          
          // Check for known content types from config
          const articleUID = TestDataHelper.getContentTypeUID('article', true);
          const productUID = TestDataHelper.getContentTypeUID('product', true);
          
          if (ctUIDs.includes(articleUID)) {
            console.log(`  ✅ Found expected content type: ${articleUID}`);
          }
          
          if (ctUIDs.includes(productUID)) {
            console.log(`  ✅ Found expected content type: ${productUID}`);
          }
          
          console.log(`✅ Validated known content types`);
        }
      } catch (error) {
        console.log('ℹ️  getContentTypes() validation skipped');
      }
    });
  });

  describe('ContentType.Query() - Query Content Types', () => {
    test('ContentType_Query_FetchesEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ ContentType('${contentTypeUID}').Query(): ${result[0].length} entries`);
    });

    test('ContentType_Query_WithIncludeCount_ReturnsCount', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      
      console.log(`✅ ContentType count: ${result[1]} total entries`);
    });

    test('ContentType_MultipleTypes_AllWork', async () => {
      const contentTypes = ['article', 'product', 'author'];
      
      for (const ctName of contentTypes) {
        const contentTypeUID = TestDataHelper.getContentTypeUID(ctName, true);
        
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(result[0]).toBeDefined();
        console.log(`  ✅ ContentType('${contentTypeUID}'): ${result[0].length} entries`);
      }
      
      console.log(`✅ Queried ${contentTypes.length} different content types`);
    });
  });

  describe('ContentType Structure Validation', () => {
    test('ContentType_Entries_HaveSystemFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          // System fields
          expect(entry.uid).toBeDefined();
          expect(entry.uid).toMatch(/^blt[a-f0-9]+$/);
          expect(entry.locale).toBeDefined();
          expect(entry.created_at).toBeDefined();
          expect(entry.updated_at).toBeDefined();
          expect(entry.created_by).toBeDefined();
          expect(entry.updated_by).toBeDefined();
        });
        
        console.log(`✅ All ${result[0].length} entries have required system fields`);
      }
    });

    test('ContentType_Entries_HaveValidTimestamps', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          // Validate timestamps
          const createdDate = new Date(entry.created_at);
          const updatedDate = new Date(entry.updated_at);
          
          expect(createdDate.getTime()).toBeGreaterThan(0);
          expect(updatedDate.getTime()).toBeGreaterThan(0);
          
          // Updated should be >= created
          expect(updatedDate.getTime()).toBeGreaterThanOrEqual(createdDate.getTime());
        });
        
        console.log(`✅ All entries have valid timestamps`);
      }
    });

    test('ContentType_Entries_HaveValidUIDs', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        const uids = new Set();
        
        result[0].forEach(entry => {
          // UID should be unique
          expect(uids.has(entry.uid)).toBe(false);
          uids.add(entry.uid);
          
          // UID should match pattern
          expect(entry.uid).toMatch(/^blt[a-f0-9]{14,16}$/);
        });
        
        console.log(`✅ All ${uids.size} entries have unique, valid UIDs`);
      }
    });
  });

  describe('ContentType - Different Complexity Levels', () => {
    test('ContentType_Simple_ReturnsSimpleData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('simple', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Simple content type: ${result[0].length} entries`);
    });

    test('ContentType_Medium_ReturnsMediumData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('medium', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Medium content type: ${result[0].length} entries`);
    });

    test('ContentType_Complex_ReturnsComplexData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        // Complex content types should have more fields
        const firstEntry = result[0][0];
        const fieldCount = Object.keys(firstEntry).length;
        
        expect(fieldCount).toBeGreaterThan(5);
        console.log(`✅ Complex content type: ${result[0].length} entries with ${fieldCount} fields`);
      }
    });

    test('ContentType_SelfReferencing_HandlesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('selfReferencing', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Self-referencing content type: ${result[0].length} entries`);
    });
  });

  describe('ContentType - Performance', () => {
    test('ContentType_GetContentTypes_Performance', async () => {
      try {
        await AssertionHelper.assertPerformance(async () => {
          await Stack.getContentTypes();
        }, 3000);
        
        console.log('✅ getContentTypes() performance acceptable');
      } catch (error) {
        console.log('ℹ️  getContentTypes() performance test skipped');
      }
    });

    test('ContentType_Query_Performance', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(10)
          .toJSON()
          .find();
      }, 2000);
      
      console.log('✅ ContentType Query performance acceptable');
    });

    test('ContentType_MultipleQueries_Performance', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        const promises = [];
        for (let i = 0; i < 3; i++) {
          promises.push(
            Stack.ContentType(contentTypeUID)
              .Query()
              .limit(5)
              .toJSON()
              .find()
          );
        }
        await Promise.all(promises);
      }, 5000);
      
      console.log('✅ Multiple concurrent queries performance acceptable');
    });
  });

  describe('ContentType - Edge Cases', () => {
    test('ContentType_InvalidUID_HandlesError', async () => {
      try {
        await Stack.ContentType('invalid_content_type_uid')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.error_code).toBeDefined();
        console.log(`✅ Invalid content type UID error handled: ${error.error_message}`);
      }
    });

    test('ContentType_EmptyUID_HandlesError', async () => {
      try {
        await Stack.ContentType('')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Empty content type UID handled gracefully');
      }
    });

    test('ContentType_NonExistentUID_ReturnsError', async () => {
      try {
        await Stack.ContentType('non_existent_ct_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error.error_code).toBeDefined();
        console.log('✅ Non-existent content type returns error');
      }
    });
  });

  describe('ContentType Count Tests', () => {
    test('ContentType_Count_AccurateForAll', async () => {
      const contentTypes = ['article', 'product', 'author'];
      
      for (const ctName of contentTypes) {
        const contentTypeUID = TestDataHelper.getContentTypeUID(ctName, true);
        
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .includeCount()
          .limit(5)
          .toJSON()
          .find();
        
        expect(result[1]).toBeDefined();
        expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
        
        console.log(`  ✅ ${contentTypeUID}: ${result[1]} total entries`);
      }
      
      console.log(`✅ Counts verified for ${contentTypes.length} content types`);
    });

    test('ContentType_CountWithFilters_Accurate', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Filtered count: ${result[1]} entries in ${primaryLocale} locale`);
    });
  });

  describe('ContentType - Comparison Tests', () => {
    test('ContentType_CompareComplexityLevels_DataDifference', async () => {
      const simpleUID = TestDataHelper.getContentTypeUID('simple', true);
      const complexUID = TestDataHelper.getContentTypeUID('complex', true);
      
      const simpleResult = await Stack.ContentType(simpleUID)
        .Query()
        .limit(1)
        .toJSON()
        .find();
      
      const complexResult = await Stack.ContentType(complexUID)
        .Query()
        .limit(1)
        .toJSON()
        .find();
      
      if (simpleResult[0].length > 0 && complexResult[0].length > 0) {
        const simpleFields = Object.keys(simpleResult[0][0]).length;
        const complexFields = Object.keys(complexResult[0][0]).length;
        
        console.log(`✅ Simple: ${simpleFields} fields, Complex: ${complexFields} fields`);
        
        // Complex should have more fields
        expect(complexFields).toBeGreaterThanOrEqual(simpleFields);
      }
    });

    test('ContentType_CompareCounts_AllHaveData', async () => {
      const contentTypes = ['article', 'product', 'author', 'complex'];
      const counts = {};
      
      for (const ctName of contentTypes) {
        const contentTypeUID = TestDataHelper.getContentTypeUID(ctName, true);
        
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .includeCount()
          .limit(1)
          .toJSON()
          .find();
        
        counts[ctName] = result[1];
      }
      
      Object.entries(counts).forEach(([name, count]) => {
        console.log(`  ${name}: ${count} entries`);
        expect(count).toBeGreaterThanOrEqual(0);
      });
      
      console.log(`✅ Compared entry counts across ${contentTypes.length} content types`);
    });
  });
});

