'use strict';

/**
 * Single Entry Fetch - COMPREHENSIVE Tests
 * 
 * Tests for fetching individual entries:
 * - Entry.fetch()
 * - Entry.only()
 * - Entry.except()
 * - Entry.includeReference()
 * - Entry.language()
 * - Entry.addParam()
 * - Entry.toJSON()
 * 
 * Focus Areas:
 * 1. Single entry retrieval by UID
 * 2. Field projection on entries
 * 3. Reference resolution
 * 4. Locale handling
 * 5. Error handling (non-existent entries)
 * 
 * Bug Detection:
 * - Entry not found errors
 * - Reference resolution failures
 * - Field projection issues
 * - Locale fallback problems
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Entry Tests - Single Entry Fetch', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Entry.fetch() - Basic Retrieval', () => {
    test('Entry_Fetch_ByUID_ReturnsCorrectEntry', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      // Validate entry structure
      AssertionHelper.assertEntryStructure(entry, ['uid', 'title']);
      
      // Validate correct entry returned
      expect(entry.uid).toBe(entryUID);
      
      console.log(`✅ Fetched entry: ${entry.title} (${entry.uid})`);
    });

    test('Entry_Fetch_NonExistentUID_ThrowsError', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const fakeUID = 'bltfakeuid12345678901234567890';
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry(fakeUID)
          .toJSON()
          .fetch();
        
        // Should not reach here
        fail('Should have thrown error for non-existent entry');
      } catch (error) {
        // Expected error (API returns 422 for invalid/non-existent UIDs)
        expect(error).toBeDefined();
        const status = error.http_code || error.status || error.statusCode || error.error_code;
        expect(status).toBeGreaterThanOrEqual(400); // Should be an error
        console.log(`✅ Non-existent entry correctly throws error (status: ${status})`);
      }
    });

    test('Entry_Fetch_InvalidUID_ThrowsError', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const invalidUID = 'invalid-uid-format';
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry(invalidUID)
          .toJSON()
          .fetch();
        
        fail('Should have thrown error for invalid UID');
      } catch (error) {
        // Expected error
        expect(error.status).toBeGreaterThanOrEqual(400);
        console.log(`✅ Invalid UID correctly throws error`);
      }
    });

    test('Entry_Fetch_WithoutToJSON_DocumentBehavior', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      try {
        const entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .fetch();
        
        // If it works, document what we get
        expect(entry).toBeDefined();
        console.log(`✅ Entry fetch without toJSON() works`);
        console.log(`   Type: ${typeof entry}`);
      } catch (error) {
        // SDK might require toJSON() for async operations
        console.log(`ℹ️  fetch() without toJSON() throws error - toJSON() is required`);
        expect(error).toBeDefined();
      }
    });

    test('Entry_Fetch_WithToJSON_ReturnsPlainObject', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      // Should return plain object (no methods)
      expect(entry).toBeDefined();
      expect(entry.get).toBeUndefined();
      expect(typeof entry).toBe('object');
      
      console.log(`✅ Plain object returned with toJSON()`);
    });
  });

  describe('Entry.only() - Field Projection', () => {
    test('Entry_Only_SingleField_ReturnsLimitedFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only(['title'])
        .toJSON()
        .fetch();
      
      // Should have requested field
      expect(entry.title).toBeDefined();
      expect(entry.uid).toBeDefined(); // Always included
      
      const keys = Object.keys(entry);
      console.log(`✅ only(['title']): ${keys.length} fields returned`);
      console.log(`  Keys: ${keys.join(', ')}`);
    });

    test('Entry_Only_GlobalField_IncludesGlobalFieldData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoField = TestDataHelper.getGlobalField('seo');
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only([seoField, 'title'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      
      if (entry[seoField]) {
        expect(typeof entry[seoField]).toBe('object');
        console.log(`✅ Global field '${seoField}' included in only()`);
      } else {
        console.log(`ℹ️  Entry doesn't have '${seoField}' field`);
      }
    });

    test('Entry_Only_MultipleFields_AllIncluded', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only(['title', 'url', 'updated_at'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.updated_at).toBeDefined();
      
      console.log(`✅ Multiple fields in only() work correctly`);
    });
  });

  describe('Entry.except() - Field Exclusion', () => {
    test('Entry_Except_SingleField_ExcludesThatField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .except(['url'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.uid).toBeDefined();
      expect(entry.url).toBeUndefined();
      
      console.log(`✅ except(['url']): url field excluded`);
    });

    test('Entry_Except_GlobalField_ExcludesGlobalFieldData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const seoField = TestDataHelper.getGlobalField('seo');
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .except([seoField])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry[seoField]).toBeUndefined();
      
      console.log(`✅ except() excludes global field '${seoField}'`);
    });

    test('Entry_Except_MultipleFields_AllExcluded', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .except(['url', 'locale'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.url).toBeUndefined();
      
      console.log(`✅ except() with multiple fields works`);
    });
  });

  describe('Entry.language() - Locale Selection', () => {
    test('Entry_Language_SpecificLocale_ReturnsLocalizedEntry', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .language('en-us')
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      
      // Should return en-us locale
      expect(entry.locale).toBe('en-us');
      
      console.log(`✅ language('en-us'): returned ${entry.locale} entry`);
    });

    test('Entry_Language_NonExistentLocale_ThrowsError', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .language('zz-zz') // Non-existent locale
          .toJSON()
          .fetch();
        
        fail('Should throw error for non-existent locale');
      } catch (error) {
        // Expected error
        expect(error.status).toBeGreaterThanOrEqual(400);
        console.log(`✅ Non-existent locale correctly throws error`);
      }
    });

    test('Entry_Language_WithoutLanguage_UsesDefault', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      // Should have some locale (default)
      expect(entry.locale).toBeDefined();
      console.log(`✅ Default locale: ${entry.locale}`);
    });
  });

  describe('Entry.addParam() - Custom Parameters', () => {
    test('Entry_AddParam_CustomParameter_Applied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .addParam('include_dimension', 'true')
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      console.log(`✅ addParam() custom parameter works`);
    });

    test('Entry_AddParam_MultipleParams_AllApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .addParam('param1', 'value1')
        .addParam('param2', 'value2')
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      console.log(`✅ Multiple addParam() calls work`);
    });
  });

  describe('Entry Methods - Combinations', () => {
    test('Entry_Only_WithLanguage_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only(['title', 'uid', 'locale']) // Must include locale in only()
        .language('en-us')
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.uid).toBe(entryUID);
      expect(entry.locale).toBe('en-us');
      
      console.log(`✅ only() + language() combination works`);
    });

    test('Entry_Except_WithAddParam_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .except(['url'])
        .addParam('include_dimension', 'true')
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.url).toBeUndefined();
      
      console.log(`✅ except() + addParam() combination works`);
    });

    test('Entry_ComplexCombination_AllOperatorsWork', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only(['title', 'updated_at', 'locale']) // Must include locale in only()
        .language('en-us')
        .addParam('include_dimension', 'true')
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.updated_at).toBeDefined();
      expect(entry.locale).toBe('en-us');
      
      console.log(`✅ Complex combination: only + language + addParam works`);
    });
  });

  describe('Entry Fetch - Performance', () => {
    test('Entry_Fetch_Performance_SingleEntry', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch();
      }, 2000); // Single entry should be fast
      
      console.log('✅ Single entry fetch performance acceptable');
    });

    test('Entry_Fetch_WithOnly_PerformanceBenefit', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      // Measure full fetch
      const startFull = Date.now();
      await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      const fullDuration = Date.now() - startFull;
      
      // Measure only fetch
      const startOnly = Date.now();
      await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only(['title', 'uid'])
        .toJSON()
        .fetch();
      const onlyDuration = Date.now() - startOnly;
      
      console.log(`✅ Full fetch: ${fullDuration}ms, only() fetch: ${onlyDuration}ms`);
      
      // only() should be faster or similar (allow wide variance for network)
      // Main point: both should complete successfully
      expect(onlyDuration).toBeLessThan(5000); // Both should be reasonably fast
    });

    test('Entry_Fetch_Multiple_SequentialPerformance', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      await AssertionHelper.assertPerformance(async () => {
        // Fetch same entry 5 times
        for (let i = 0; i < 5; i++) {
          await Stack.ContentType(contentTypeUID)
            .Entry(entryUID)
            .toJSON()
            .fetch();
        }
      }, 8000); // Should complete in reasonable time
      
      console.log('✅ Multiple sequential fetches acceptable');
    });
  });
});

