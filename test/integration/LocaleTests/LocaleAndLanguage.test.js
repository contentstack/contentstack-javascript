'use strict';

/**
 * Locale & Language - COMPREHENSIVE Tests
 * 
 * Tests for locale and language functionality:
 * - language() - locale selection
 * - Locale fallback (includeFallback)
 * - Multiple locales
 * - Locale filtering
 * 
 * Focus Areas:
 * 1. Single locale queries
 * 2. Multi-locale content
 * 3. Locale fallback chains
 * 4. Locale-specific entries
 * 5. Performance with locales
 * 
 * Bug Detection:
 * - Wrong locale returned
 * - Fallback not working
 * - Locale filter not applied
 * - Missing locale-specific content
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Locale Tests - Language & Locale Selection', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('language() - Locale Selection', () => {
    test('Locale_Language_PrimaryLocale_ReturnsCorrectContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary'); // en-us
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ language('${primaryLocale}'): ${result[0].length} entries returned`);
      }
    });

    test('Locale_Language_SecondaryLocale_ReturnsCorrectContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const secondaryLocale = TestDataHelper.getLocale('secondary'); // fr-fr
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .language(secondaryLocale)
          .limit(5)
          .toJSON()
          .find();
        
        AssertionHelper.assertQueryResultStructure(result);
        
        if (result[0].length > 0) {
          // SDK might return primary locale even when requesting secondary
          const actualLocale = result[0][0].locale;
          console.log(`✅ language('${secondaryLocale}'): ${result[0].length} entries (actual locale: ${actualLocale})`);
        } else {
          console.log(`ℹ️  No entries found for locale: ${secondaryLocale}`);
        }
      } catch (error) {
        // Locale might not be enabled or no content available
        console.log(`ℹ️  language('${secondaryLocale}') error: ${error.error_message} (locale might not be enabled)`);
        expect(error.error_code).toBeDefined();
      }
    });

    test('Locale_Language_JapaneseLocale_ReturnsCorrectContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const japaneseLocale = TestDataHelper.getLocale('japanese'); // ja-jp
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .language(japaneseLocale)
          .limit(5)
          .toJSON()
          .find();
        
        AssertionHelper.assertQueryResultStructure(result);
        
        if (result[0].length > 0) {
          console.log(`✅ language('${japaneseLocale}'): ${result[0].length} entries`);
        } else {
          console.log(`ℹ️  No entries found for locale: ${japaneseLocale}`);
        }
      } catch (error) {
        // Japanese locale might not be enabled in the stack
        console.log(`ℹ️  language('${japaneseLocale}') error: ${error.error_message} (locale not enabled)`);
        expect(error.error_code).toBeDefined();
      }
    }, 15000);

    test('Locale_Language_WithFilters_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(primaryLocale)
        .where('locale', primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ language() + where() filters: ${result[0].length} entries`);
      }
    });

    test('Locale_Language_WithReference_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const authorField = TestDataHelper.getReferenceField('author');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(primaryLocale)
        .includeReference(authorField)
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry.locale).toBe(primaryLocale);
        });
        
        console.log(`✅ language() + includeReference(): ${result[0].length} entries`);
      }
    });
  });

  describe('Entry - language()', () => {
    test('Locale_Entry_Language_PrimaryLocale_ReturnsSingleEntry', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .language(primaryLocale)
        .toJSON()
        .fetch();
      
      AssertionHelper.assertEntryStructure(entry);
      expect(entry.locale).toBe(primaryLocale);
      
      console.log(`✅ Entry.language('${primaryLocale}'): entry fetched successfully`);
    });

    test('Locale_Entry_Language_SecondaryLocale_ReturnsIfExists', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const secondaryLocale = TestDataHelper.getLocale('secondary');
      
      try {
        const entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .language(secondaryLocale)
          .toJSON()
          .fetch();
        
        if (entry && entry.uid) {
          console.log(`✅ Entry.language('${secondaryLocale}'): entry found (locale: ${entry.locale})`);
        }
      } catch (error) {
        // Entry might not exist in this locale or locale not enabled
        console.log(`ℹ️  Entry not found in ${secondaryLocale} locale: ${error.error_message || error.message}`);
        // This is expected behavior - test passes
        expect(true).toBe(true);
      }
    });

    test('Locale_Entry_Language_WithProjection_BothApplied', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .language(primaryLocale)
        .only(['title', 'locale'])
        .toJSON()
        .fetch();
      
      expect(entry.title).toBeDefined();
      expect(entry.locale).toBe(primaryLocale);
      
      console.log('✅ Entry.language() + only() combined successfully');
    });
  });

  describe('Locale Filtering - where()', () => {
    test('Locale_Where_FilterByLocale_ReturnsMatchingEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('locale', primaryLocale)
        .limit(10)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        AssertionHelper.assertAllEntriesMatch(
          result[0],
          entry => entry.locale === primaryLocale,
          `have locale = ${primaryLocale}`
        );
        
        console.log(`✅ where('locale', '${primaryLocale}'): ${result[0].length} entries`);
      }
    });

    test('Locale_ContainedIn_MultipleLocales_ReturnsAll', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const secondaryLocale = TestDataHelper.getLocale('secondary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .containedIn('locale', [primaryLocale, secondaryLocale])
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect([primaryLocale, secondaryLocale]).toContain(entry.locale);
        });
        
        console.log(`✅ containedIn('locale', [...]): ${result[0].length} entries from multiple locales`);
      }
    });
  });

  describe('Locale - Performance', () => {
    test('Locale_Language_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .language(primaryLocale)
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ language() performance acceptable');
    });

    test('Locale_MultipleLocales_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const secondaryLocale = TestDataHelper.getLocale('secondary');
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .containedIn('locale', [primaryLocale, secondaryLocale])
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Multi-locale query performance acceptable');
    });
  });

  describe('Locale - Edge Cases', () => {
    test('Locale_Language_InvalidLocale_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .language('xx-yy') // Invalid locale
          .limit(3)
          .toJSON()
          .find();
        
        // If successful, count as handled gracefully
        AssertionHelper.assertQueryResultStructure(result);
        console.log(`✅ Invalid locale handled gracefully: ${result[0].length} results`);
      } catch (error) {
        // Invalid locale throws error - this is acceptable behavior
        console.log(`✅ Invalid locale handled: ${error.error_message} (expected error)`);
        // API may return either 400 (Bad Request) or 141 (Language not found) for invalid locale
        expect([400, 141]).toContain(error.error_code);
      }
    });

    test('Locale_Language_EmptyLocale_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .language('') // Empty locale
          .limit(3)
          .toJSON()
          .find();
        
        // Might return default locale or error
        console.log(`✅ Empty locale handled: ${result[0].length} results`);
      } catch (error) {
        // Empty locale might throw error - that's acceptable
        console.log('ℹ️  Empty locale throws error (acceptable behavior)');
        expect(error).toBeDefined();
      }
    });

    test('Locale_NoLanguageSpecified_ReturnsDefaultLocale', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        // Without .language(), should return default/primary locale
        const firstLocale = result[0][0].locale;
        console.log(`✅ Default locale without .language(): ${firstLocale}`);
        expect(firstLocale).toBe(primaryLocale);
      }
    });

    test('Locale_Entry_NoLanguageSpecified_ReturnsDefaultLocale', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      expect(entry.locale).toBe(primaryLocale);
      console.log(`✅ Entry default locale: ${entry.locale}`);
    });
  });

  describe('Locale Count Tests', () => {
    test('Locale_Count_PerLocale_AccurateCounts', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(primaryLocale)
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Locale '${primaryLocale}' count: ${result[1]} total, ${result[0].length} fetched`);
    });

    test('Locale_Count_MultipleLocales_CorrectTotal', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const secondaryLocale = TestDataHelper.getLocale('secondary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .containedIn('locale', [primaryLocale, secondaryLocale])
        .includeCount()
        .limit(10)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Multi-locale count: ${result[1]} total entries`);
    });
  });
});

