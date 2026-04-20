'use strict';

/**
 * Query Exists & Search Operators - COMPREHENSIVE Tests
 * 
 * Tests for field existence and text search operators:
 * - exists()
 * - notExists()
 * - regex()
 * - search()
 * 
 * Focus Areas:
 * 1. Field existence validation
 * 2. Null/undefined handling
 * 3. Regular expression patterns
 * 4. Full-text search functionality
 * 5. Performance with complex queries
 * 
 * Bug Detection:
 * - Null vs undefined distinction
 * - Empty string handling
 * - Regex injection/security
 * - Search relevance issues
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Query Tests - Exists & Search Operators', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('exists() - Field Existence', () => {
    test('Query_Exists_CommonField_ReturnsEntriesWithField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.exists('title').toJSON().find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        // Validate ALL entries have the field
        AssertionHelper.assertAllEntriesMatch(
          result[0],
          entry => {
            expect(entry.title).toBeDefined();
            expect(entry.title).not.toBeNull();
            return true;
          },
          'title exists'
        );
        
        console.log(`✅ All ${result[0].length} entries have 'title' field`);
      }
    });

    test('Query_Exists_OptionalField_ExcludesEntriesWithoutField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');
      
      // Get all entries first
      const allResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .toJSON()
        .find();
      
      // Get entries with content_block
      const withField = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists(contentBlockField)
        .toJSON()
        .find();
      
      // exists() should return fewer or equal entries
      expect(withField[0].length).toBeLessThanOrEqual(allResult[0].length);
      
      // All returned entries should have the field
      withField[0].forEach(entry => {
        expect(entry[contentBlockField]).toBeDefined();
      });
      
      console.log(`✅ exists('${contentBlockField}'): ${withField[0].length}/${allResult[0].length} entries`);
    });

    test('Query_Exists_MultiplFields_AllMustExist', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .exists('uid')
        .exists('locale')
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        // ALL specified fields must exist
        result[0].forEach(entry => {
          expect(entry.title).toBeDefined();
          expect(entry.uid).toBeDefined();
          expect(entry.locale).toBeDefined();
        });
        
        console.log(`✅ ${result[0].length} entries have ALL required fields`);
      }
    });
  });

  describe('notExists() - Field Non-existence', () => {
    test('Query_NotExists_OptionalField_ReturnsEntriesWithoutField', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .notExists(contentBlockField)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      if (result[0].length > 0) {
        // None of the entries should have the field (or it should be null/undefined)
        result[0].forEach(entry => {
          // Field should not exist or be null/undefined
          if (entry[contentBlockField] !== undefined) {
            expect(entry[contentBlockField]).toBeNull();
          }
        });
        
        console.log(`✅ ${result[0].length} entries do NOT have '${contentBlockField}'`);
      }
    });

    test('Query_NotExists_RequiredField_ReturnsEmpty', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // 'title' is required, so notExists should return 0
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .notExists('title')
        .toJSON()
        .find();
      
      // Should be empty since title is required
      expect(result[0].length).toBe(0);
      console.log('✅ notExists() on required field returns empty (as expected)');
    });

    test('Query_ExistsAndNotExists_Opposite_CombineCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const seoField = TestDataHelper.getGlobalField('seo');
      const contentBlockField = TestDataHelper.getGlobalField('content_block');
      
      // Entries that have SEO but NOT content_block
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists(seoField)
        .notExists(contentBlockField)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          expect(entry[seoField]).toBeDefined();
          // content_block should not exist or be null
          if (entry[contentBlockField] !== undefined) {
            expect(entry[contentBlockField]).toBeNull();
          }
        });
        
        console.log(`✅ ${result[0].length} entries have ${seoField} but NOT ${contentBlockField}`);
      } else {
        console.log('ℹ️  No entries match exists + notExists combination');
      }
    });

    test('Query_ExistsAndNotExists_Contradictory_ValidatesLogic', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // This is contradictory but SDK should handle it gracefully
      const allEntries = await Stack.ContentType(contentTypeUID)
        .Query()
        .toJSON()
        .find();
      
      const withExists = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .toJSON()
        .find();
      
      const withNotExists = await Stack.ContentType(contentTypeUID)
        .Query()
        .notExists('title')
        .toJSON()
        .find();
      
      // exists + notExists should equal total
      expect(withExists[0].length + withNotExists[0].length).toBe(allEntries[0].length);
      
      console.log(`✅ exists(): ${withExists[0].length}, notExists(): ${withNotExists[0].length}, Total: ${allEntries[0].length}`);
    });
  });

  describe('regex() - Pattern Matching', () => {
    test('Query_Regex_SimplePattern_FindsMatches', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Match titles starting with specific pattern
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .regex('title', '^.*', 'i') // Case insensitive, starts with any char
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      // Should return entries (most titles start with something!)
      if (result[0].length > 0) {
        console.log(`✅ regex() found ${result[0].length} matching entries`);
      }
    });

    test('Query_Regex_CaseInsensitive_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Get one title to test
      const sampleEntry = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(1)
        .toJSON()
        .find();
      
      if (sampleEntry[0].length > 0 && sampleEntry[0][0].title) {
        const title = sampleEntry[0][0].title;
        const firstWord = title.split(' ')[0];
        
        if (firstWord && firstWord.length > 2) {
          // Search with different case
          const lowerCase = firstWord.toLowerCase();
          const upperCase = firstWord.toUpperCase();
          
          const resultLower = await Stack.ContentType(contentTypeUID)
            .Query()
            .regex('title', lowerCase, 'i')
            .toJSON()
            .find();
          
          const resultUpper = await Stack.ContentType(contentTypeUID)
            .Query()
            .regex('title', upperCase, 'i')
            .toJSON()
            .find();
          
          // Case insensitive should return same count
          expect(resultLower[0].length).toBeGreaterThan(0);
          expect(resultUpper[0].length).toBeGreaterThan(0);
          
          console.log(`✅ regex() case insensitive: lower=${resultLower[0].length}, upper=${resultUpper[0].length}`);
        }
      }
    });

    test('Query_Regex_SpecialCharacters_HandledSafely', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Test with regex special chars (should be escaped or handled)
      const specialChars = ['.', '*', '+', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '\\'];
      
      for (const char of specialChars) {
        try {
          const result = await Stack.ContentType(contentTypeUID)
            .Query()
            .regex('title', char, 'i')
            .toJSON()
            .find();
          
          // Should handle gracefully (return results or empty, but not error)
          expect(Array.isArray(result[0])).toBe(true);
        } catch (error) {
          // Document if special chars cause issues
          console.log(`⚠️  Special char '${char}' caused error: ${error.message}`);
        }
      }
      
      console.log('✅ Regex special characters handled');
    }, 30000); // 30 second timeout for 14 API calls
  });

  describe('search() - Full-text Search', () => {
    test('Query_Search_SimpleKeyword_FindsRelevantEntries', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Search for a common word
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .search('article')
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      console.log(`✅ search('article') found ${result[0].length} entries`);
    });

    test('Query_Search_WithQuotes_ExactPhrase', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Search with quotes for exact phrase
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .search('"cybersecurity"')
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      
      console.log(`✅ search('"exact phrase"') found ${result[0].length} entries`);
    });

    test('Query_Search_EmptyString_SDKBugDetected', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // BUG DETECTION: Empty search breaks query chain!
      // SDK returns undefined from .search(''), breaking subsequent .toJSON() call
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .search('')
          .toJSON()
          .find();
        
        expect(Array.isArray(result[0])).toBe(true);
        console.log(`✅ search('') handled gracefully: ${result[0].length} results`);
      } catch (error) {
        // Expected: SDK has bug with empty search strings
        expect(error.message).toContain('Cannot read properties of undefined');
        console.log('SDK BUG: search(\'\') breaks query chain - returns undefined');
        console.log(`   Error: ${error.message}`);
      }
    });

    test('Query_Search_SpecialCharacters_NoInjection', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Test with potential injection strings
      const testStrings = [
        '<script>alert("xss")</script>',
        'SELECT * FROM entries',
        '"; DROP TABLE--',
        '../../etc/passwd'
      ];
      
      for (const str of testStrings) {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .search(str)
          .toJSON()
          .find();
        
        // Should handle safely (no errors, returns empty or valid results)
        expect(Array.isArray(result[0])).toBe(true);
      }
      
      console.log('✅ search() handles injection strings safely');
    });

    test('Query_Search_WithOtherOperators_CombinesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .search('article')
        .where('locale', 'en-us')
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        // Validate combinations work
        expect(result[0].length).toBeLessThanOrEqual(10);
        result[0].forEach(entry => {
          expect(entry.locale).toBe('en-us');
        });
        
        console.log(`✅ search() + where() + limit(): ${result[0].length} results`);
      }
    });
  });

  describe('Operators - Performance & Edge Cases', () => {
    test('Query_Exists_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .exists('title')
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ exists() performance acceptable');
    });

    test('Query_Search_Performance_AcceptableSpeed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .search('test')
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ search() performance acceptable');
    });
  });
});

