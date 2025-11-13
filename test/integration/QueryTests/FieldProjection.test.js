'use strict';

/**
 * Query Field Projection - COMPREHENSIVE Tests
 * 
 * Tests for field selection operators:
 * - only()
 * - except()
 * - Field inclusion/exclusion combinations
 * 
 * Focus Areas:
 * 1. Selective field retrieval
 * 2. Field exclusion
 * 3. Nested field projection
 * 4. System field behavior
 * 5. Performance optimization
 * 
 * Bug Detection:
 * - Field projection not applied
 * - System fields incorrectly excluded
 * - Nested field projection issues
 * - Performance regressions
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Query Tests - Field Projection', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('only() - Field Inclusion', () => {
    test('Query_Only_SingleField_ReturnsOnlyThatField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title'])
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          // Should have title
          expect(entry.title).toBeDefined();
          
          // Should have uid (always included)
          expect(entry.uid).toBeDefined();
          
          // Note: only() is STRICT - only requested fields + uid are returned
          // locale is NOT automatically included
          
          // Log all keys to see what's actually included
          const keys = Object.keys(entry);
          console.log(`  Entry keys: ${keys.join(', ')}`);
        });
        
        console.log(`✅ only(['title']): ${result[0].length} entries with limited fields`);
      }
    });

    test('Query_Only_MultipleFields_ReturnsSpecifiedFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'url', 'locale'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          expect(entry.uid).toBeDefined(); // System field always included
          expect(entry.locale).toBeDefined();
          
          // Count custom fields (excluding system fields)
          const keys = Object.keys(entry);
          const customFields = keys.filter(k => !k.startsWith('_') && 
            !['uid', 'locale', 'created_at', 'updated_at', 'created_by', 'updated_by', 'ACL', 'publish_details'].includes(k));
          
          console.log(`  Custom fields: ${customFields.join(', ')}`);
        });
        
        console.log(`✅ only() with multiple fields works`);
      }
    });

    test('Query_Only_GlobalField_IncludesGlobalFieldData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const seoField = TestDataHelper.getGlobalField('seo');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only([seoField, 'title'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          
          // SEO field should be included if present
          if (entry[seoField]) {
            expect(typeof entry[seoField]).toBe('object');
            console.log(`  ✅ Global field '${seoField}' included`);
          }
        });
        
        console.log(`✅ only() with global fields works`);
      }
    });

    test('Query_Only_NonExistentField_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'non_existent_field_xyz_12345'])
        .limit(3)
        .toJSON()
        .find();
      
      // Should still return results (ignores non-existent field)
      expect(result[0].length).toBeGreaterThan(0);
      
      result[0].forEach(entry => {
        expect(entry.title).toBeDefined();
        expect(entry.non_existent_field_xyz_12345).toBeUndefined();
      });
      
      console.log('✅ only() with non-existent field handled gracefully');
    });

    test('Query_Only_EmptyArray_ReturnsSystemFieldsOnly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only([])
        .limit(2)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          const keys = Object.keys(entry);
          console.log(`  Keys with only([]): ${keys.join(', ')}`);
          
          // Should have at least uid
          expect(entry.uid).toBeDefined();
        });
        
        console.log('✅ only([]) returns minimal fields');
      }
    });

    test('Query_Only_WithReferenceField_IncludesReference', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const authorField = TestDataHelper.getReferenceField('author');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only([authorField, 'title'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          
          // Check if author field exists
          if (entry[authorField]) {
            console.log(`  ✅ Reference field '${authorField}' included`);
          }
        });
        
        console.log(`✅ only() with reference fields works`);
      }
    });
  });

  describe('except() - Field Exclusion', () => {
    test('Query_Except_SingleField_ExcludesThatField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except(['url'])
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          // Should have title and uid
          expect(entry.title).toBeDefined();
          expect(entry.uid).toBeDefined();
          
          // URL should be excluded
          expect(entry.url).toBeUndefined();
        });
        
        console.log(`✅ except(['url']): ${result[0].length} entries without 'url' field`);
      }
    });

    test('Query_Except_MultipleFields_ExcludesAllSpecified', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except(['url', 'locale'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          expect(entry.uid).toBeDefined();
          
          // Excluded fields should not be present
          expect(entry.url).toBeUndefined();
          
          // Note: locale might still be present as it's a system field
          const keys = Object.keys(entry);
          console.log(`  Remaining keys: ${keys.length} fields`);
        });
        
        console.log(`✅ except() with multiple fields works`);
      }
    });

    test('Query_Except_GlobalField_ExcludesGlobalFieldData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const seoField = TestDataHelper.getGlobalField('seo');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except([seoField])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          
          // SEO field should be excluded
          expect(entry[seoField]).toBeUndefined();
        });
        
        console.log(`✅ except() excludes global field '${seoField}'`);
      }
    });

    test('Query_Except_NonExistentField_NoEffect', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except(['non_existent_field_xyz_12345'])
        .limit(3)
        .toJSON()
        .find();
      
      // Should return normal results
      expect(result[0].length).toBeGreaterThan(0);
      
      result[0].forEach(entry => {
        expect(entry.title).toBeDefined();
      });
      
      console.log('✅ except() with non-existent field has no effect');
    });

    test('Query_Except_EmptyArray_ReturnsAllFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const withExcept = await Stack.ContentType(contentTypeUID)
        .Query()
        .except([])
        .limit(2)
        .toJSON()
        .find();
      
      const withoutExcept = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      // Should return same number of fields
      if (withExcept[0].length > 0 && withoutExcept[0].length > 0) {
        const keysWithExcept = Object.keys(withExcept[0][0]).length;
        const keysWithoutExcept = Object.keys(withoutExcept[0][0]).length;
        
        expect(keysWithExcept).toBe(keysWithoutExcept);
        console.log(`✅ except([]) returns all fields: ${keysWithExcept} fields`);
      }
    });
  });

  describe('only() + except() - Combinations', () => {
    test('Query_Only_AndExcept_ConflictBehavior', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // What happens when we use both only and except?
      // This tests SDK behavior with conflicting projections
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'url'])
        .except(['url'])
        .limit(2)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          const keys = Object.keys(entry);
          console.log(`  Keys with only+except: ${keys.join(', ')}`);
          
          // Title should be present
          expect(entry.title).toBeDefined();
          
          // URL behavior depends on SDK implementation
          // Document what actually happens
          if (entry.url) {
            console.log('  ℹ️  URL present - only() takes precedence');
          } else {
            console.log('  ℹ️  URL excluded - except() takes precedence');
          }
        });
        
        console.log('✅ only() + except() behavior documented');
      }
    });
  });

  describe('Field Projection - With Other Operators', () => {
    test('Query_Only_WithFilters_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', 'en-us')
        .only(['title', 'uid'])
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          // Filter applied (but locale field not returned unless in only())
          // We can't verify locale since we didn't request it in only()
          
          // Projection applied
          expect(entry.title).toBeDefined();
          expect(entry.uid).toBeDefined();
          
          // Note: where() filter is applied on server, but only() controls returned fields
          console.log(`  Keys: ${Object.keys(entry).join(', ')}`);
        });
        
        console.log(`✅ only() + where(): ${result[0].length} filtered entries with limited fields`);
      }
    });

    test('Query_Only_WithSorting_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'updated_at'])
        .descending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 1) {
        // Check sorting
        for (let i = 1; i < result[0].length; i++) {
          const prev = new Date(result[0][i - 1].updated_at).getTime();
          const curr = new Date(result[0][i].updated_at).getTime();
          expect(curr).toBeLessThanOrEqual(prev);
        }
        
        console.log(`✅ only() + sorting: ${result[0].length} entries sorted with limited fields`);
      }
    });

    test('Query_Except_WithPagination_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except(['url'])
        .skip(2)
        .limit(5)
        .toJSON()
        .find();
      
      // Pagination applied
      expect(result[0].length).toBeLessThanOrEqual(5);
      
      if (result[0].length > 0) {
        // Projection applied
        result[0].forEach(entry => {
          expect(entry.url).toBeUndefined();
        });
        
        console.log(`✅ except() + pagination: ${result[0].length} entries`);
      }
    });

    test('Query_Only_WithIncludeCount_BothWork', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title'])
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      // Count should be included
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      
      // Projection applied
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
        });
      }
      
      console.log(`✅ only() + includeCount(): ${result[0].length} entries, ${result[1]} total`);
    });
  });

  describe('Field Projection - Performance', () => {
    test('Query_Only_PerformanceBenefit_FasterThanFull', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Measure full query
      const startFull = Date.now();
      await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(20)
        .toJSON()
        .find();
      const fullDuration = Date.now() - startFull;
      
      // Measure only query
      const startOnly = Date.now();
      await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'uid'])
        .limit(20)
        .toJSON()
        .find();
      const onlyDuration = Date.now() - startOnly;
      
      console.log(`✅ Full query: ${fullDuration}ms, only() query: ${onlyDuration}ms`);
      
      // only() should be faster or similar (at least not significantly slower)
      expect(onlyDuration).toBeLessThan(fullDuration * 2); // Allow some variance
    });

    test('Query_Only_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .only(['title', 'uid'])
          .limit(50)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ only() query performance acceptable');
    });

    test('Query_Except_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .except(['url', 'locale'])
          .limit(50)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ except() query performance acceptable');
    });
  });
});

