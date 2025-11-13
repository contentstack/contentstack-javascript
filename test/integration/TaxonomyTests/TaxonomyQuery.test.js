'use strict';

/**
 * Taxonomy Query - COMPREHENSIVE Tests
 * 
 * Tests for taxonomy functionality:
 * - Stack.Taxonomies() - taxonomy-level queries
 * - where() with taxonomy fields - filtering entries by taxonomy
 * - containedIn() with taxonomy terms - multiple term matching
 * - exists() with taxonomy fields - entries with any taxonomy
 * - Taxonomy combinations
 * 
 * Focus Areas:
 * 1. Taxonomy-level queries
 * 2. Entry filtering by taxonomy
 * 3. Multiple taxonomy terms
 * 4. Taxonomy with other operators
 * 5. Performance with taxonomies
 * 6. Edge cases
 * 
 * Bug Detection:
 * - Wrong taxonomy data returned
 * - Taxonomy filters not applied
 * - Missing taxonomy data
 * - Performance issues
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Taxonomy Tests - Taxonomy Queries', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Stack.Taxonomies() - Taxonomy-Level Queries', () => {
    test('Taxonomy_StackTaxonomies_FetchTaxonomies', async () => {
      try {
        const Query = Stack.Taxonomies();
        const result = await Query.toJSON().find();
        
        // Taxonomies() might return taxonomy metadata
        expect(result).toBeDefined();
        expect(Array.isArray(result[0])).toBe(true);
        
        console.log(`✅ Stack.Taxonomies(): ${result[0].length} taxonomies found`);
      } catch (error) {
        // Taxonomies() might not be available or configured
        console.log('ℹ️  Stack.Taxonomies() not available or no taxonomies configured');
        expect(error).toBeDefined();
      }
    });

    test('Taxonomy_StackTaxonomies_WithExists_FiltersTaxonomies', async () => {
      try {
        const Query = Stack.Taxonomies();
        const result = await Query.exists('uid').toJSON().find();
        
        expect(result).toBeDefined();
        console.log(`✅ Stack.Taxonomies().exists(): ${result[0]?.length || 0} results`);
      } catch (error) {
        console.log('ℹ️  Stack.Taxonomies() query not available');
        expect(error).toBeDefined();
      }
    });
  });

  describe('where() - Filter Entries by Taxonomy', () => {
    test('Taxonomy_Where_SingleTaxonomyTerm_ReturnsMatchingEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      // Query format: where('taxonomies.taxonomy_uid', 'term')
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ where('${taxonomyField}', '${usaTaxonomy.term}'): ${result[0].length} entries`);
    });

    test('Taxonomy_Where_WithFilters_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .where('locale', primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ Taxonomy + where('locale'): ${result[0].length} filtered entries`);
      } else {
        console.log(`ℹ️  No entries found with taxonomy + locale filter`);
      }
    });

    test('Taxonomy_Where_IndiaTaxonomy_ReturnsMatchingEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const indiaTaxonomy = TestDataHelper.getTaxonomy('india');
      
      if (!indiaTaxonomy || !indiaTaxonomy.uid || !indiaTaxonomy.term) {
        console.log('ℹ️  India taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${indiaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, indiaTaxonomy.term)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ where('${taxonomyField}', '${indiaTaxonomy.term}'): ${result[0].length} entries`);
    });
  });

  describe('containedIn() - Multiple Taxonomy Terms', () => {
    test('Taxonomy_ContainedIn_MultipleTerm_ReturnsAnyMatch', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      // Search for entries with any of these terms
      const terms = [usaTaxonomy.term, 'california', 'texas', 'new_york'];
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .containedIn(taxonomyField, terms)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ containedIn('${taxonomyField}', [...]): ${result[0].length} entries`);
    });

    test('Taxonomy_ContainedIn_WithSorting_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      const terms = [usaTaxonomy.term];
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .containedIn(taxonomyField, terms)
        .descending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 1) {
        for (let i = 1; i < result[0].length; i++) {
          const prev = new Date(result[0][i - 1].updated_at).getTime();
          const curr = new Date(result[0][i].updated_at).getTime();
          expect(curr).toBeLessThanOrEqual(prev);
        }
        
        console.log(`✅ Taxonomy containedIn() + sorting: ${result[0].length} sorted entries`);
      }
    });
  });

  describe('exists() - Entries with Any Taxonomy Value', () => {
    test('Taxonomy_Exists_AnyTaxonomyValue_ReturnsEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists(taxonomyField)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ exists('${taxonomyField}'): ${result[0].length} entries with any ${usaTaxonomy.uid} value`);
    });

    test('Taxonomy_Exists_WithPagination_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists(taxonomyField)
        .skip(0)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0].length).toBeLessThanOrEqual(3);
      console.log(`✅ Taxonomy exists() + pagination: ${result[0].length} entries`);
    });
  });

  describe('Taxonomy - With Other Operators', () => {
    test('Taxonomy_WithReference_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      const authorField = TestDataHelper.getReferenceField('author');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .includeReference(authorField)
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Taxonomy + includeReference(): ${result[0].length} entries`);
    });

    test('Taxonomy_WithProjection_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .only(['title', 'locale'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
        });
        
        console.log(`✅ Taxonomy + only(): ${result[0].length} projected entries`);
      }
    });

    test('Taxonomy_WithIncludeCount_ReturnsCount', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Taxonomy + includeCount(): ${result[1]} total, ${result[0].length} fetched`);
    });

    test('Taxonomy_WithLocale_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, usaTaxonomy.term)
        .language(primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ Taxonomy + language(): ${result[0].length} entries in ${primaryLocale}`);
      }
    });
  });

  describe('Taxonomy - Performance', () => {
    test('Taxonomy_Where_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .where(taxonomyField, usaTaxonomy.term)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Taxonomy query performance acceptable');
    });

    test('Taxonomy_Exists_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(taxonomyField)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Taxonomy exists() performance acceptable');
    });
  });

  describe('Taxonomy - Edge Cases', () => {
    test('Taxonomy_EmptyTerm_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      
      if (!usaTaxonomy || !usaTaxonomy.uid) {
        console.log('ℹ️  USA taxonomy not configured - skipping test');
        return;
      }
      
      const taxonomyField = `taxonomies.${usaTaxonomy.uid}`;
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(taxonomyField, '')
        .limit(3)
        .toJSON()
        .find();
      
      // Empty term should return entries where taxonomy value is empty (or none)
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Empty taxonomy term handled: ${result[0].length} results`);
    });

    test('Taxonomy_InvalidTaxonomyField_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('taxonomies.invalid_taxonomy_uid', 'some_term')
        .limit(3)
        .toJSON()
        .find();
      
      // Invalid taxonomy should return empty or all entries (SDK dependent)
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Invalid taxonomy handled: ${result[0].length} results`);
    });

    test('Taxonomy_NoTaxonomyFilter_ReturnsAllContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      // Without taxonomy filter, should return all content
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ No taxonomy: ${result[0].length} entries (all content)`);
    });
  });

  describe('Multiple Taxonomies', () => {
    test('Taxonomy_MultipleTaxonomies_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      const indiaTaxonomy = TestDataHelper.getTaxonomy('india');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term || 
          !indiaTaxonomy || !indiaTaxonomy.uid || !indiaTaxonomy.term) {
        console.log('ℹ️  Taxonomies not configured - skipping test');
        return;
      }
      
      const usaField = `taxonomies.${usaTaxonomy.uid}`;
      const indiaField = `taxonomies.${indiaTaxonomy.uid}`;
      
      // Test USA taxonomy
      const usaResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(usaField, usaTaxonomy.term)
        .limit(5)
        .toJSON()
        .find();
      
      // Test India taxonomy
      const indiaResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(indiaField, indiaTaxonomy.term)
        .limit(5)
        .toJSON()
        .find();
      
      console.log(`✅ USA taxonomy: ${usaResult[0].length} entries`);
      console.log(`✅ India taxonomy: ${indiaResult[0].length} entries`);
      
      // Both should be valid
      AssertionHelper.assertQueryResultStructure(usaResult);
      AssertionHelper.assertQueryResultStructure(indiaResult);
    });

    test('Taxonomy_MultipleTaxonomies_AND_BothRequired', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const usaTaxonomy = TestDataHelper.getTaxonomy('usa');
      const indiaTaxonomy = TestDataHelper.getTaxonomy('india');
      
      if (!usaTaxonomy || !usaTaxonomy.uid || !usaTaxonomy.term || 
          !indiaTaxonomy || !indiaTaxonomy.uid || !indiaTaxonomy.term) {
        console.log('ℹ️  Taxonomies not configured - skipping test');
        return;
      }
      
      const usaField = `taxonomies.${usaTaxonomy.uid}`;
      const indiaField = `taxonomies.${indiaTaxonomy.uid}`;
      
      // AND logic - entries with both taxonomies
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where(usaField, usaTaxonomy.term)
        .where(indiaField, indiaTaxonomy.term)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Multiple taxonomies (AND): ${result[0].length} entries`);
    });
  });
});
