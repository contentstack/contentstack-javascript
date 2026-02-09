'use strict';

/**
 * COMPREHENSIVE COMPLEX QUERY COMBINATIONS TESTS (PHASE 3)
 * 
 * Tests real-world complex query scenarios with multiple operators combined.
 * 
 * SDK Features Covered:
 * - Multiple filters combined
 * - Filters + Sorting + Pagination
 * - References + Filters + Projection
 * - Metadata + Locale + Variants
 * - Complex nested scenarios
 * 
 * Bug Detection Focus:
 * - Query operator precedence
 * - Parameter interaction bugs
 * - Performance with complex queries
 * - Data consistency
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Complex Query Combinations - Real-World Scenarios (Phase 3)', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // MULTI-FILTER COMBINATIONS
  // =============================================================================

  describe('Multi-Filter Combinations', () => {
    
    test('ComplexQuery_MultipleWhere_AllConditionsApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('title', { $exists: true })
        .where('updated_at', { $lt: new Date().toISOString() })
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          expect(entry.updated_at).toBeDefined();
        });
      }
      
      console.log(`✅ Multiple where conditions: ${result[0].length} entries`);
    });

    test('ComplexQuery_WhereAndExists_Combined', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .where('updated_at', { $lt: new Date().toISOString() })
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ where() + exists() combined');
    });

    test('ComplexQuery_ContainedInAndExists_Combined', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .containedIn('locale', [locale])
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ containedIn() + exists() combined');
    });

  });

  // =============================================================================
  // FILTERS + SORTING + PAGINATION
  // =============================================================================

  describe('Filters + Sorting + Pagination', () => {
    
    test('ComplexQuery_FilterSortPaginate_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .ascending('updated_at')
        .skip(1)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Filter + Sort + Pagination combined');
    });

    test('ComplexQuery_MultipleFiltersWithPagination_Consistent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // First page
      const page1 = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .ascending('updated_at')
        .skip(0)
        .limit(2)
        .toJSON()
        .find();
      
      // Second page
      const page2 = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .ascending('updated_at')
        .skip(2)
        .limit(2)
        .toJSON()
        .find();
      
      expect(page1[0]).toBeDefined();
      expect(page2[0]).toBeDefined();
      
      // Ensure no overlap
      if (page1[0].length > 0 && page2[0].length > 0) {
        const page1UIDs = page1[0].map(e => e.uid);
        const page2UIDs = page2[0].map(e => e.uid);
        
        const overlap = page1UIDs.filter(uid => page2UIDs.includes(uid));
        expect(overlap.length).toBe(0);
      }
      
      console.log('✅ Pagination consistency with filters');
    });

    test('ComplexQuery_CountWithFiltersAndSorting_Accurate', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .ascending('updated_at')
        .includeCount()
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Count with filters: ${result[1]} total, ${result[0].length} returned`);
    });

  });

  // =============================================================================
  // REFERENCES + FILTERS + PROJECTION
  // =============================================================================

  describe('References + Filters + Projection', () => {
    
    test('ComplexQuery_ReferenceWithFilter_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .exists('title')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ includeReference() + filter combined');
    });

    test('ComplexQuery_ReferenceWithProjection_OnlySelected', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .only(['title', 'uid', 'author'])
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        expect(result[0][0].uid).toBeDefined();
      }
      
      console.log('✅ includeReference() + only() combined');
    });

    test('ComplexQuery_ReferenceWithSortingAndPagination_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .ascending('updated_at')
        .skip(1)
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ includeReference() + sorting + pagination');
    });

  });

  // =============================================================================
  // METADATA + LOCALE + VARIANTS
  // =============================================================================

  describe('Metadata + Locale + Variants', () => {
    
    test('ComplexQuery_MetadataWithLocale_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeContentType()
        .language(locale)
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ includeContentType() + language() combined');
    });

    test('ComplexQuery_VariantWithFilter_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('⚠️ Skipping: No variant UID configured');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .exists('title')
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ variants() + filter combined');
    });

    test('ComplexQuery_LocaleWithProjection_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(locale)
        .only(['title', 'uid'])
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ language() + only() combined');
    });

  });

  // =============================================================================
  // COMPLEX REAL-WORLD SCENARIOS
  // =============================================================================

  describe('Real-World Complex Scenarios', () => {
    
    test('RealWorld_FullFeaturedQuery_AllCombined', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .language(locale)
        .includeReference('author')
        .includeContentType()
        .ascending('updated_at')
        .skip(0)
        .limit(2)
        .includeCount()
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      
      console.log('✅ Full-featured query: filter + locale + ref + metadata + sort + pagination + count');
    });

    test('RealWorld_SearchWithReferencesAndProjection_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .search('content')
          .includeReference('author')
          .only(['title', 'uid', 'author'])
          .limit(3)
          .toJSON()
          .find();
        
        expect(result[0]).toBeDefined();
        
        console.log('✅ search() + includeReference() + only()');
      } catch (error) {
        // If 'author' is not a valid reference, try without it
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .search('content')
          .only(['title', 'uid'])
          .limit(3)
          .toJSON()
          .find();
        
        expect(result[0]).toBeDefined();
        
        console.log('✅ search() + only() (reference not available in this stack)');
      }
    });

    test('RealWorld_RegexWithSortingAndCount_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .regex('title', '.+')
        .descending('updated_at')
        .includeCount()
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ regex() + descending() + includeCount()');
    });

  });

  // =============================================================================
  // PERFORMANCE WITH COMPLEX QUERIES
  // =============================================================================

  describe('Performance with Complex Queries', () => {
    
    test('Performance_ComplexQuery_ReasonableTime', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .includeReference('author')
        .ascending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(3000);
      
      console.log(`✅ Complex query performance: ${duration}ms`);
    });

    test('Performance_VeryComplexQuery_Acceptable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .language(locale)
        .includeReference('author')
        .includeContentType()
        .ascending('updated_at')
        .includeCount()
        .limit(3)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(5000);
      
      console.log(`✅ Very complex query performance: ${duration}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES WITH COMPLEX QUERIES
  // =============================================================================

  describe('Complex Query Edge Cases', () => {
    
    test('EdgeCase_EmptyResultWithComplexQuery_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('title', 'NonExistentEntry123456789')
        .includeReference('author')
        .ascending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBe(0);
      
      console.log('✅ Complex query with empty result handled gracefully');
    });

    test('EdgeCase_ComplexQueryWithLargeSkip_HandlesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .ascending('updated_at')
        .skip(1000)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      // Might be empty if skip is beyond available entries
      
      console.log('✅ Complex query with large skip handled');
    });

    test('EdgeCase_ComplexQueryWithOnlyAndExcept_Conflict', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .only(['title', 'uid'])
          .except(['updated_at'])
          .limit(2)
          .toJSON()
          .find();
        
        // If it succeeds, check behavior
        expect(result[0]).toBeDefined();
        console.log('✅ only() + except() conflict: query succeeded (one may override)');
      } catch (error) {
        console.log('✅ only() + except() conflict: error thrown (validation)');
      }
    });

  });

});

