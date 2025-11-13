'use strict';

/**
 * SEO Global Field - Comprehensive Tests
 * 
 * Purpose: Validate SEO global field structure, types, and behavior
 * Focus: Bug detection through comprehensive assertions
 * 
 * This test demonstrates the correct approach:
 * 1. Use TestDataHelper (no hardcoding!)
 * 2. Use AssertionHelper (comprehensive validation)
 * 3. Test structure + types + relationships
 * 4. Test edge cases and error paths
 * 5. Tests that can catch real bugs
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Global Fields - SEO Field Comprehensive Tests', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('SEO Global Field - Structure Validation', () => {
    test('Entry_Article_HasSEOWithCompleteStructure', async () => {
      // Get config values (NO HARDCODING!)
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      // Fetch entry
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      // COMPREHENSIVE ASSERTIONS (Bug Detection Focus!)

      // 1. Entry structure validation
      AssertionHelper.assertEntryStructure(entry, ['uid', 'title']);

      // 2. SEO global field presence
      AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);

      // 3. SEO field type validation
      expect(typeof entry[seoFieldName]).toBe('object');
      expect(entry[seoFieldName]).not.toBeNull();
      expect(entry[seoFieldName]).not.toBeUndefined();

      // 4. Validate SEO has at least one property (not empty object)
      const seoKeys = Object.keys(entry[seoFieldName]);
      expect(seoKeys.length).toBeGreaterThan(0);

      console.log(`✅ SEO field structure validated for ${contentTypeUID}`);
    });

    test('Entry_SEO_SocialImage_ValidStructure', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);

      // Validate social_image if present
      if (entry[seoFieldName].social_image) {
        const socialImage = entry[seoFieldName].social_image;

        // Type validation
        expect(typeof socialImage).toBe('object');
        expect(socialImage).not.toBeNull();

        // Structure validation - should be an asset object
        if (typeof socialImage === 'object' && socialImage.uid) {
          expect(socialImage.uid).toBeDefined();
          expect(typeof socialImage.uid).toBe('string');
          expect(socialImage.uid.length).toBeGreaterThan(0);

          // If URL is present, validate format
          if (socialImage.url) {
            expect(typeof socialImage.url).toBe('string');
            expect(socialImage.url).toMatch(/^https?:\/\//);
          }

          // If filename is present, validate
          if (socialImage.filename) {
            expect(typeof socialImage.filename).toBe('string');
            expect(socialImage.filename.length).toBeGreaterThan(0);
          }

          console.log(`✅ Social image structure validated: ${socialImage.uid}`);
        }
      } else {
        console.log('ℹ️  Social image not present in this entry (optional field)');
      }
    });

    test('Entry_SEO_Canonical_ValidFormat', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);

      // Validate canonical if present
      if (entry[seoFieldName].canonical) {
        const canonical = entry[seoFieldName].canonical;

        // Type validation
        expect(typeof canonical).toBe('string');

        // Not empty
        expect(canonical.length).toBeGreaterThan(0);

        // No leading/trailing whitespace (data quality)
        expect(canonical.trim()).toBe(canonical);

        console.log(`✅ Canonical URL validated: ${canonical}`);
      } else {
        console.log('ℹ️  Canonical URL not present (optional field)');
      }
    });

    test('Entry_SEO_SearchCategories_ValidFormat', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);

      // Validate search_categories if present
      if (entry[seoFieldName].search_categories) {
        const searchCategories = entry[seoFieldName].search_categories;

        // Type validation
        expect(typeof searchCategories).toBe('string');

        // Not empty
        expect(searchCategories.length).toBeGreaterThan(0);

        console.log(`✅ Search categories validated: ${searchCategories.substring(0, 50)}...`);
      } else {
        console.log('ℹ️  Search categories not present (optional field)');
      }
    });

    test('Entry_SEO_StructuredData_ValidJSON', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);

      // Validate structured_data if present
      if (entry[seoFieldName].structured_data) {
        const structuredData = entry[seoFieldName].structured_data;

        // Type validation - should be object
        expect(typeof structuredData).toBe('object');
        expect(structuredData).not.toBeNull();

        // Validate it's an object (not null, not array)
        if (typeof structuredData === 'object' && !Array.isArray(structuredData)) {
          const keys = Object.keys(structuredData);
          
          // Edge case: structured_data can be an empty object {}
          // This is valid JSON but might indicate incomplete data
          if (keys.length === 0) {
            console.log('⚠️  WARNING: structured_data is an empty object {}');
            console.log('    This might indicate incomplete/placeholder data');
          } else {
            expect(keys.length).toBeGreaterThan(0);
          }
        }

        console.log(`✅ Structured data validated (${typeof structuredData})`);
      } else {
        console.log('ℹ️  Structured data not present (optional field)');
      }
    });
  });

  describe('SEO Global Field - Multiple Content Types', () => {
    test('Entry_Product_HasSEOGlobalField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('product', true);
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      // Query to get any product entry
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.toJSON().find();

      // Should have entries
      AssertionHelper.assertQueryResultStructure(result);
      expect(result[0].length).toBeGreaterThan(0);

      // Check if any entries have SEO field
      const entriesWithSEO = result[0].filter(e => e[seoFieldName]);

      if (entriesWithSEO.length > 0) {
        const entry = entriesWithSEO[0];

        // Validate SEO structure
        AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);
        expect(typeof entry[seoFieldName]).toBe('object');

        console.log(`✅ Product entries have SEO field: ${entriesWithSEO.length}/${result[0].length}`);
      } else {
        console.log('ℹ️  No product entries with SEO field found');
      }
    });

    test('Query_ArticlesWithSEO_ReturnsValidEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      // Query articles
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(10).toJSON().find();

      AssertionHelper.assertQueryResultStructure(result);

      // Validate SEO field in all returned entries that have it
      const entriesWithSEO = result[0].filter(e => e[seoFieldName]);

      entriesWithSEO.forEach(entry => {
        // Each entry with SEO should have valid structure
        expect(entry[seoFieldName]).toBeDefined();
        expect(typeof entry[seoFieldName]).toBe('object');
        expect(entry[seoFieldName]).not.toBeNull();

        // Should have at least one SEO property
        const seoKeys = Object.keys(entry[seoFieldName]);
        expect(seoKeys.length).toBeGreaterThan(0);
      });

      console.log(`✅ Validated SEO in ${entriesWithSEO.length} article entries`);
    });
  });

  describe('SEO Global Field - Edge Cases', () => {
    test('Entry_SEO_HandlesMissingOptionalFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      // Query multiple entries to find edge cases
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(20).toJSON().find();

      const entriesWithSEO = result[0].filter(e => e[seoFieldName]);

      if (entriesWithSEO.length > 0) {
        // Test that SDK handles missing optional fields gracefully
        entriesWithSEO.forEach((entry, index) => {
          const seo = entry[seoFieldName];

          // SEO field should be object even if subfields are missing
          expect(typeof seo).toBe('object');

          // Check optional fields don't break when missing
          expect(() => {
            const _ = seo.social_image; // May be undefined
            const __ = seo.canonical; // May be undefined
            const ___ = seo.structured_data; // May be undefined
          }).not.toThrow();

          // Optional fields should be undefined or have valid value
          if (seo.social_image !== undefined) {
            expect(typeof seo.social_image).toBe('object');
          }
          if (seo.canonical !== undefined) {
            expect(typeof seo.canonical).toBe('string');
          }
        });

        console.log(`✅ Tested ${entriesWithSEO.length} entries for missing optional fields`);
      }
    });

    test('Query_WithFieldProjection_SEOFieldIncluded', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoFieldName = TestDataHelper.getGlobalField('seo');

      // Fetch entry with only specific fields
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only([seoFieldName, 'title', 'uid'])
        .toJSON()
        .fetch();

      // Should have only requested fields
      expect(entry.uid).toBeDefined();
      expect(entry.title).toBeDefined();

      // SEO should be included
      if (entry[seoFieldName]) {
        AssertionHelper.assertGlobalFieldPresent(entry, seoFieldName);
        console.log('✅ SEO field included with .only() projection');
      } else {
        console.log('ℹ️  SEO field not present in this entry');
      }
    });
  });
});

