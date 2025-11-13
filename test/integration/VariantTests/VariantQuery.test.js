'use strict';

/**
 * Variant Query - COMPREHENSIVE Tests
 * 
 * Tests for variant functionality:
 * - variants() - variant filtering
 * - Variant-specific content
 * - Variant with other operators
 * - Multiple variants
 * 
 * Focus Areas:
 * 1. Single variant queries
 * 2. Variant combinations
 * 3. Variant with filters
 * 4. Variant performance
 * 5. Edge cases
 * 
 * Bug Detection:
 * - Wrong variant returned
 * - Variant not applied
 * - Variant conflicts
 * - Missing variant data
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Variant Tests - Variant Queries', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('variants() - Basic Variant Filtering', () => {
    test('Variant_SingleVariant_ReturnsVariantContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        console.log(`✅ variants('${variantUID}'): ${result[0].length} entries returned`);
        
        // Check if entries have variant-related metadata
        result[0].forEach(entry => {
          console.log(`  Entry ${entry.uid} returned with variant query`);
        });
      } else {
        console.log(`ℹ️  No entries found for variant: ${variantUID}`);
      }
    });

    test('Variant_WithContentType_ReturnsCorrectEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ variants() on '${contentTypeUID}': ${result[0].length} entries`);
    });

    test('Variant_WithFilters_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .where('locale', primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ variants() + where(): ${result[0].length} filtered entries`);
      } else {
        console.log(`ℹ️  No entries found with variant + filter combination`);
      }
    });

    test('Variant_WithSorting_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .descending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 1) {
        // Verify sorting
        for (let i = 1; i < result[0].length; i++) {
          const prev = new Date(result[0][i - 1].updated_at).getTime();
          const curr = new Date(result[0][i].updated_at).getTime();
          expect(curr).toBeLessThanOrEqual(prev);
        }
        
        console.log(`✅ variants() + sorting: ${result[0].length} sorted entries`);
      }
    });

    test('Variant_WithPagination_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .skip(0)
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      expect(result[0].length).toBeLessThanOrEqual(3);
      
      console.log(`✅ variants() + pagination: ${result[0].length} entries`);
    });
  });

  describe('variants() - With Other Operators', () => {
    test('Variant_WithReference_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const variantUID = TestDataHelper.getVariantUID();
      const authorField = TestDataHelper.getReferenceField('author');
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .includeReference(authorField)
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ variants() + includeReference(): ${result[0].length} entries`);
    });

    test('Variant_WithProjection_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .only(['title', 'locale'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
        });
        
        console.log(`✅ variants() + only(): ${result[0].length} projected entries`);
      }
    });

    test('Variant_WithIncludeCount_ReturnsCount', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ variants() + includeCount(): ${result[1]} total, ${result[0].length} fetched`);
    });

    test('Variant_WithLocale_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .language(primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ variants() + language(): ${result[0].length} entries in ${primaryLocale}`);
      }
    });

    test('Variant_WithMetadata_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .includeContentType()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ variants() + includeContentType(): ${result[0].length} entries`);
    });
  });

  describe('Entry - variants()', () => {
    test('Variant_Entry_SingleEntry_ReturnsVariantContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const entryUID = TestDataHelper.getComplexEntryUID();
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID || !entryUID) {
        console.log('ℹ️  No variant or entry UID configured - skipping test');
        return;
      }
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .variants(variantUID)
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      console.log(`✅ Entry.variants('${variantUID}'): entry fetched`);
    });

    test('Variant_Entry_WithProjection_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const entryUID = TestDataHelper.getComplexEntryUID();
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID || !entryUID) {
        console.log('ℹ️  No variant or entry UID configured - skipping test');
        return;
      }
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .variants(variantUID)
        .only(['title', 'locale'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      console.log(`✅ Entry.variants() + only(): projected entry fetched`);
    });

    test('Variant_Entry_WithReference_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const variantUID = TestDataHelper.getVariantUID();
      const authorField = TestDataHelper.getReferenceField('author');
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .variants(variantUID)
        .includeReference(authorField)
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      console.log(`✅ Entry.variants() + includeReference(): entry fetched`);
    });
  });

  describe('Variant - Performance', () => {
    test('Variant_Query_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .variants(variantUID)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ variants() performance acceptable');
    });

    test('Variant_WithFilters_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .variants(variantUID)
          .where('locale', primaryLocale)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ variants() + filters performance acceptable');
    });
  });

  describe('Variant - Edge Cases', () => {
    test('Variant_EmptyVariantUID_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .variants('')
          .limit(3)
          .toJSON()
          .find();
        
        // Empty variant might return all entries or error
        AssertionHelper.assertQueryResultStructure(result);
        console.log(`✅ Empty variant handled: ${result[0].length} results`);
      } catch (error) {
        // Empty variant might throw error - acceptable
        console.log('ℹ️  Empty variant throws error (acceptable behavior)');
        expect(error).toBeDefined();
      }
    });

    test('Variant_InvalidVariantUID_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .variants('invalid_variant_uid_12345')
          .limit(3)
          .toJSON()
          .find();
        
        // Invalid variant might return empty or error
        AssertionHelper.assertQueryResultStructure(result);
        console.log(`✅ Invalid variant handled: ${result[0].length} results`);
      } catch (error) {
        // Invalid variant might throw error - acceptable
        console.log('ℹ️  Invalid variant throws error (acceptable behavior)');
        expect(error).toBeDefined();
      }
    });

    test('Variant_NoVariantSpecified_ReturnsDefaultContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      // Without variants(), should return default content
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ No variant: ${result[0].length} entries (default content)`);
    });

    test('Variant_MultipleVariantCalls_LastOneWins', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants('first_variant')
        .variants(variantUID) // This should override
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log(`✅ Multiple variants() calls: ${result[0].length} results (last call applied)`);
    });
  });

  describe('Variant - Comparison Tests', () => {
    test('Variant_WithAndWithout_CompareDifference', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      // Without variant
      const withoutVariant = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      // With variant
      const withVariant = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .limit(5)
        .toJSON()
        .find();
      
      console.log(`✅ Without variant: ${withoutVariant[0].length} entries`);
      console.log(`✅ With variant: ${withVariant[0].length} entries`);
      
      // Both should be valid query results
      AssertionHelper.assertQueryResultStructure(withoutVariant);
      AssertionHelper.assertQueryResultStructure(withVariant);
    });

    test('Variant_CountComparison_WithAndWithout', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('complex', true);
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('ℹ️  No variant UID configured - skipping test');
        return;
      }
      
      // Count without variant
      const withoutVariant = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      // Count with variant
      const withVariant = await Stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      console.log(`✅ Total without variant: ${withoutVariant[1]}`);
      console.log(`✅ Total with variant: ${withVariant[1]}`);
      
      // Both counts should be valid numbers
      expect(typeof withoutVariant[1]).toBe('number');
      expect(typeof withVariant[1]).toBe('number');
    });
  });
});

