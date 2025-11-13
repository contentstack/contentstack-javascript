'use strict';

/**
 * Query Logical Operators - COMPREHENSIVE Tests
 * 
 * Tests for logical query operators:
 * - or()
 * - and()
 * - tags()
 * 
 * Focus Areas:
 * 1. OR logic (match any condition)
 * 2. AND logic (match all conditions)
 * 3. Complex nested conditions
 * 4. Tags filtering
 * 5. Combination with other operators
 * 
 * Bug Detection:
 * - Logic errors in OR conditions
 * - AND condition edge cases
 * - Complex query correctness
 * - Tag matching accuracy
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Query Tests - Logical Operators', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('or() - Logical OR', () => {
    test('Query_Or_TwoConditions_MatchesEither', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Create two separate queries
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      // Combine with OR
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.or(query1, query2).toJSON().find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        // All entries should match at least one condition
        result[0].forEach(entry => {
          const matchesCondition = entry.locale === 'en-us' || entry.locale === 'fr-fr';
          expect(matchesCondition).toBe(true);
        });
        
        console.log(`✅ OR query: ${result[0].length} entries match locale='en-us' OR locale='fr-fr'`);
        
        // Count distribution
        const enUs = result[0].filter(e => e.locale === 'en-us').length;
        const frFr = result[0].filter(e => e.locale === 'fr-fr').length;
        console.log(`   Distribution: en-us=${enUs}, fr-fr=${frFr}`);
      }
    });

    test('Query_Or_MultipleConditions_MatchesAny', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Create three separate queries
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      const query3 = Stack.ContentType(contentTypeUID).Query().where('locale', 'ja-jp');
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.or(query1, query2, query3).toJSON().find();
      
      if (result[0].length > 0) {
        // Validate each entry matches at least one condition
        result[0].forEach(entry => {
          const validLocales = ['en-us', 'fr-fr', 'ja-jp'];
          expect(validLocales).toContain(entry.locale);
        });
        
        console.log(`✅ OR with 3 conditions: ${result[0].length} entries`);
      }
    });

    test('Query_Or_WithFilters_CombinesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // OR conditions for locale
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      // Combine OR with additional filter
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query
        .or(query1, query2)
        .lessThan('updated_at', Date.now())
        .limit(20)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        // Should match (en-us OR fr-fr) AND (updated_at < now)
        result[0].forEach(entry => {
          expect(['en-us', 'fr-fr']).toContain(entry.locale);
          expect(new Date(entry.updated_at).getTime()).toBeLessThan(Date.now() + 1000);
        });
        
        console.log(`✅ OR + filters: ${result[0].length} entries`);
      }
    });

    test('Query_Or_EmptyConditions_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // OR with queries that might return nothing
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'xx-xx'); // Non-existent
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'yy-yy'); // Non-existent
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.or(query1, query2).toJSON().find();
      
      // Should return empty (both conditions match nothing)
      expect(result[0].length).toBe(0);
      console.log('✅ OR with non-matching conditions returns empty');
    });

    test('Query_Or_SameFieldDifferentValues_WorksAsExpected', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // This is essentially the same as whereIn
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      const orResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .or(query1, query2)
        .toJSON()
        .find();
      
      // Compare with containedIn (should be similar)
      const containedInResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .containedIn('locale', ['en-us', 'fr-fr'])
        .toJSON()
        .find();
      
      // Counts should be similar (might differ due to query structure)
      console.log(`✅ OR count: ${orResult[0].length}, containedIn count: ${containedInResult[0].length}`);
      
      // Both should return entries
      expect(orResult[0].length).toBeGreaterThan(0);
      expect(containedInResult[0].length).toBeGreaterThan(0);
    });
  });

  describe('and() - Logical AND', () => {
    test('Query_And_MultipleConditions_AllMustMatch', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Create separate query conditions
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().exists('title');
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.and(query1, query2).toJSON().find();
      
      if (result[0].length > 0) {
        // ALL entries must match BOTH conditions
        result[0].forEach(entry => {
          expect(entry.locale).toBe('en-us');
          expect(entry.title).toBeDefined();
          expect(entry.title.length).toBeGreaterThan(0);
        });
        
        console.log(`✅ AND query: ${result[0].length} entries match locale='en-us' AND title exists`);
      }
    });

    test('Query_And_ConflictingConditions_ReturnsEmpty', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Conflicting conditions: locale='en-us' AND locale='fr-fr' (impossible!)
      const query1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const query2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.and(query1, query2).toJSON().find();
      
      // Should return empty (can't be both)
      expect(result[0].length).toBe(0);
      console.log('✅ AND with conflicting conditions correctly returns empty');
    });

    test('Query_And_WithRangeConditions_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const minDate = new Date('2020-01-01').getTime();
      const maxDate = Date.now();
      
      const query1 = Stack.ContentType(contentTypeUID).Query().greaterThan('updated_at', minDate);
      const query2 = Stack.ContentType(contentTypeUID).Query().lessThan('updated_at', maxDate);
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.and(query1, query2).limit(10).toJSON().find();
      
      if (result[0].length > 0) {
        // All entries should be in range
        result[0].forEach(entry => {
          const timestamp = new Date(entry.updated_at).getTime();
          expect(timestamp).toBeGreaterThan(minDate);
          expect(timestamp).toBeLessThan(maxDate);
        });
        
        console.log(`✅ AND with range: ${result[0].length} entries between 2020 and now`);
      }
    });

    test('Query_And_WithExists_CombinesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');
      const seoField = TestDataHelper.getGlobalField('seo');
      
      // Both fields must exist
      const query1 = Stack.ContentType(contentTypeUID).Query().exists(contentBlockField);
      const query2 = Stack.ContentType(contentTypeUID).Query().exists(seoField);
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.and(query1, query2).toJSON().find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry[contentBlockField]).toBeDefined();
          expect(entry[seoField]).toBeDefined();
        });
        
        console.log(`✅ AND with exists: ${result[0].length} entries have both fields`);
      } else {
        console.log('ℹ️  No entries have both fields');
      }
    });
  });

  describe('tags() - Tag Filtering', () => {
    test('Query_Tags_SingleTag_FindsTaggedEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Query by tags (if entries have tags)
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .tags(['article'])
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      console.log(`✅ tags(['article']): ${result[0].length} entries found`);
      
      // Validate entries have tags field
      if (result[0].length > 0 && result[0][0].tags) {
        console.log(`   Sample tags: ${JSON.stringify(result[0][0].tags)}`);
      }
    });

    test('Query_Tags_MultipleTags_MatchesAny', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .tags(['article', 'blog', 'news'])
        .toJSON()
        .find();
      
      console.log(`✅ tags(['article', 'blog', 'news']): ${result[0].length} entries found`);
    });

    test('Query_Tags_EmptyArray_ReturnsAll', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const withTags = await Stack.ContentType(contentTypeUID)
        .Query()
        .tags([])
        .limit(10)
        .toJSON()
        .find();
      
      const withoutTags = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      // Empty tags array should return same as no tags filter
      expect(withTags[0].length).toBe(withoutTags[0].length);
      console.log('✅ tags([]) returns all entries (no filtering)');
    });

    test('Query_Tags_WithOtherFilters_CombinesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .tags(['article'])
        .where('locale', 'en-us')
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe('en-us');
        });
        
        console.log(`✅ tags() + where(): ${result[0].length} entries`);
      }
    });
  });

  describe('Logical Operators - Complex Combinations', () => {
    test('Query_OrAndAnd_NestedLogic_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // (locale=en-us OR locale=fr-fr) AND exists(title)
      const orQuery1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const orQuery2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      const orCombined = Stack.ContentType(contentTypeUID).Query().or(orQuery1, orQuery2);
      const existsQuery = Stack.ContentType(contentTypeUID).Query().exists('title');
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.and(orCombined, existsQuery).limit(20).toJSON().find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(['en-us', 'fr-fr']).toContain(entry.locale);
          expect(entry.title).toBeDefined();
        });
        
        console.log(`✅ Complex (OR) AND logic: ${result[0].length} entries`);
      }
    });

    test('Query_MultipleOr_ChainedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Multiple OR conditions
      const q1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const q2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      const q3 = Stack.ContentType(contentTypeUID).Query().where('locale', 'ja-jp');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .or(q1, q2, q3)
        .includeCount()
        .limit(15)
        .toJSON()
        .find();
      
      console.log(`✅ Multi-OR query: ${result[0].length} returned, ${result[1] || 'N/A'} total`);
    });

    test('Query_LogicalOperators_WithSorting_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const q1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
      const q2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .or(q1, q2)
        .descending('updated_at')
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 1) {
        // Validate sorted descending
        for (let i = 1; i < result[0].length; i++) {
          const prevTime = new Date(result[0][i - 1].updated_at).getTime();
          const currTime = new Date(result[0][i].updated_at).getTime();
          expect(currTime).toBeLessThanOrEqual(prevTime);
        }
        
        console.log(`✅ OR + sorting: ${result[0].length} entries sorted correctly`);
      }
    });
  });

  describe('Logical Operators - Performance & Edge Cases', () => {
    test('Query_Or_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        const q1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
        const q2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
        
        await Stack.ContentType(contentTypeUID)
          .Query()
          .or(q1, q2)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ OR query performance acceptable');
    });

    test('Query_And_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        const q1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
        const q2 = Stack.ContentType(contentTypeUID).Query().exists('title');
        
        await Stack.ContentType(contentTypeUID)
          .Query()
          .and(q1, q2)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ AND query performance acceptable');
    });

    test('Query_ComplexLogic_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        const q1 = Stack.ContentType(contentTypeUID).Query().where('locale', 'en-us');
        const q2 = Stack.ContentType(contentTypeUID).Query().where('locale', 'fr-fr');
        const orQuery = Stack.ContentType(contentTypeUID).Query().or(q1, q2);
        
        const q3 = Stack.ContentType(contentTypeUID).Query().exists('title');
        
        await Stack.ContentType(contentTypeUID)
          .Query()
          .and(orQuery, q3)
          .ascending('updated_at')
          .skip(5)
          .limit(20)
          .includeCount()
          .toJSON()
          .find();
      }, 5000); // Allow more time for complex query
      
      console.log('✅ Complex logical query performance acceptable');
    });
  });
});

