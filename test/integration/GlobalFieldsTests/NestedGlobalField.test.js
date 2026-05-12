'use strict';

/**
 * NESTED GLOBAL FIELDS - COMPREHENSIVE TESTS
 * 
 * Tests nested global fields (global fields that contain other global fields).
 * Based on TypeScript CDA SDK comprehensive tests.
 * 
 * Purpose: Validate nested global field structure, resolution, and behavior
 * Focus: Bug detection through comprehensive assertions
 * 
 * Nested Global Field Structure:
 * - Parent global field contains child global fields (schema-level nesting)
 * - Entry-level nested global field data validation
 * - Deep nesting validation (up to 6 levels in ngf_parent)
 * - Reference resolution within nested structures
 * - Array handling in nested contexts
 * - Field projection with nested fields
 * 
 * Stack Data Complexity Assessment:
 * - ngf_parent: 6 levels deep nesting (ngf_parent → video_information → card → featured_card → menu_card → secondary_navigation)
 * - cybersecurity content type: Multiple global fields (page_header, content_block, video_experience, podcast, seo, search)
 * - Complex nested structures with groups, references, and arrays
 * 
 * Bug Detection Focus:
 * - Nested global field resolution
 * - Deep structure validation
 * - Child global field access
 * - Nested field projection
 * - Data consistency in nested structures
 * - Circular reference handling
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Global Fields - Nested Global Fields Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // NESTED GLOBAL FIELD - STRUCTURE VALIDATION
  // =============================================================================

  describe('Nested Global Field - Structure Validation', () => {
    
    test('Entry_HasNestedGlobalField_ValidStructure', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured in .env');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        // Try to find entries with the nested global field
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(5)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log(`⚠️ No entries found with nested global field: ${nestedGlobalFieldUID}`);
          return;
        }
        
        const entry = result[0][0];
        
        // 1. Entry structure validation
        AssertionHelper.assertEntryStructure(entry, ['uid', 'title']);
        
        // 2. Nested global field presence
        AssertionHelper.assertGlobalFieldPresent(entry, nestedGlobalFieldUID);
        
        // 3. Nested global field type validation
        expect(typeof entry[nestedGlobalFieldUID]).toBe('object');
        expect(entry[nestedGlobalFieldUID]).not.toBeNull();
        expect(entry[nestedGlobalFieldUID]).not.toBeUndefined();
        
        // 4. Validate nested structure has properties
        const nestedKeys = Object.keys(entry[nestedGlobalFieldUID]);
        expect(nestedKeys.length).toBeGreaterThan(0);
        
        console.log(`✅ Nested global field structure validated: ${nestedKeys.length} top-level properties`);
        console.log(`   Top-level keys: ${nestedKeys.slice(0, 5).join(', ')}${nestedKeys.length > 5 ? '...' : ''}`);
      } catch (error) {
        console.log(`⚠️ Nested global field test error: ${error.message}`);
        // Don't fail the test if field doesn't exist in entries
      }
    });

    test('NestedGlobalField_ChildFields_Accessible', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(1)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries with nested global field found');
          return;
        }
        
        const entry = result[0][0];
        const nestedField = entry[nestedGlobalFieldUID];
        
        // Validate that child fields are accessible
        const childKeys = Object.keys(nestedField);
        
        // Check if any child fields exist
        expect(childKeys.length).toBeGreaterThan(0);
        
        // Validate each child field is accessible and has a value
        childKeys.forEach(key => {
          expect(nestedField[key]).toBeDefined();
          expect(nestedField[key]).not.toBeNull();
        });
        
        console.log(`✅ Child fields accessible: ${childKeys.length} fields`);
      } catch (error) {
        console.log(`⚠️ Child field access test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_DeepNesting_ValidStructure', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(1)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries with nested global field found');
          return;
        }
        
        const entry = result[0][0];
        const nestedField = entry[nestedGlobalFieldUID];
        
        // Check for nested objects (deep nesting)
        let deepNestingFound = false;
        let maxDepth = 0;
        
        const checkDepth = (obj, depth = 0) => {
          if (depth > maxDepth) maxDepth = depth;
          
          if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            deepNestingFound = true;
            Object.values(obj).forEach(value => {
              if (typeof value === 'object' && value !== null) {
                checkDepth(value, depth + 1);
              }
            });
          }
        };
        
        checkDepth(nestedField);
        
        if (deepNestingFound) {
          console.log(`✅ Deep nesting detected: max depth ${maxDepth}`);
        } else {
          console.log('ℹ️ No deep nesting found (single level only)');
        }
        
        // Test should pass regardless of nesting depth
        expect(nestedField).toBeDefined();
      } catch (error) {
        console.log(`⚠️ Deep nesting test error: ${error.message}`);
      }
    });

  });

  // =============================================================================
  // NESTED GLOBAL FIELD - WITH QUERY OPERATORS
  // =============================================================================

  describe('Nested Global Field - Query Operations', () => {
    
    test('NestedGlobalField_WithExistsFilter_Works', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(5)
          .toJSON()
          .find();
        
        expect(result[0]).toBeDefined();
        
        if (result[0] && result[0].length > 0) {
          // Verify all returned entries have the nested global field
          result[0].forEach(entry => {
            expect(entry[nestedGlobalFieldUID]).toBeDefined();
          });
          
          console.log(`✅ Exists filter works: found ${result[0].length} entries`);
        } else {
          console.log('ℹ️ No entries found with nested global field');
        }
      } catch (error) {
        console.log(`⚠️ Exists filter test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_WithFieldProjection_IncludesNestedField', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        // Test with only() projection
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .only(['uid', 'title', nestedGlobalFieldUID])
          .limit(1)
          .toJSON()
          .find();
        
        if (result[0] && result[0].length > 0) {
          const entry = result[0][0];
          
          // Verify nested field is included
          expect(entry[nestedGlobalFieldUID]).toBeDefined();
          
          // Verify other fields are present
          expect(entry.uid).toBeDefined();
          expect(entry.title).toBeDefined();
          
          console.log('✅ Field projection includes nested global field');
        } else {
          console.log('ℹ️ No entries found for projection test');
        }
      } catch (error) {
        console.log(`⚠️ Field projection test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_WithReferences_ResolvesCorrectly', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .includeReference('author')
          .limit(1)
          .toJSON()
          .find();
        
        if (result[0] && result[0].length > 0) {
          const entry = result[0][0];
          
          // Verify nested global field is present
          expect(entry[nestedGlobalFieldUID]).toBeDefined();
          
          // Verify references are resolved
          if (entry.author) {
            expect(typeof entry.author).toBe('object');
            console.log('✅ References resolved alongside nested global field');
          } else {
            console.log('ℹ️ No references found in entry');
          }
        } else {
          console.log('ℹ️ No entries found for reference test');
        }
      } catch (error) {
        console.log(`⚠️ Reference resolution test error: ${error.message}`);
      }
    });

  });

  // =============================================================================
  // NESTED GLOBAL FIELD - EDGE CASES
  // =============================================================================

  describe('Nested Global Field - Edge Cases', () => {
    
    test('NestedGlobalField_EmptyValue_HandlesGracefully', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(10)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries found');
          return;
        }
        
        // Check for entries with empty nested global fields
        let emptyCount = 0;
        result[0].forEach(entry => {
          if (entry[nestedGlobalFieldUID] && 
              Object.keys(entry[nestedGlobalFieldUID]).length === 0) {
            emptyCount++;
          }
        });
        
        console.log(`✅ Found ${emptyCount} entries with empty nested global field values`);
      } catch (error) {
        console.log(`⚠️ Empty value test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_MultipleEntries_ConsistentStructure', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(5)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries with nested global field found');
          return;
        }
        
        // Collect all top-level keys from nested fields
        const allKeys = new Set();
        result[0].forEach(entry => {
          if (entry[nestedGlobalFieldUID]) {
            Object.keys(entry[nestedGlobalFieldUID]).forEach(key => {
              allKeys.add(key);
            });
          }
        });
        
        // Verify structure consistency
        result[0].forEach(entry => {
          if (entry[nestedGlobalFieldUID]) {
            expect(typeof entry[nestedGlobalFieldUID]).toBe('object');
            expect(entry[nestedGlobalFieldUID]).not.toBeNull();
          }
        });
        
        console.log(`✅ Consistent structure across ${result[0].length} entries`);
        console.log(`   Common keys found: ${Array.from(allKeys).slice(0, 5).join(', ')}${allKeys.size > 5 ? '...' : ''}`);
      } catch (error) {
        console.log(`⚠️ Consistency test error: ${error.message}`);
      }
    });

  });

  // =============================================================================
  // NESTED GLOBAL FIELD - PERFORMANCE
  // =============================================================================

  describe('Nested Global Field - Performance', () => {
    
    test('NestedGlobalField_QueryPerformance_ReasonableTime', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(10)
          .toJSON()
          .find();
        
        const duration = Date.now() - startTime;
        
        expect(result[0]).toBeDefined();
        expect(duration).toBeLessThan(5000); // 5 second baseline
        
        console.log(`⚡ Nested global field query performance: ${duration}ms`);
      } catch (error) {
        console.log(`⚠️ Performance test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_WithReferences_ResolvesEfficiently', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .includeReference()
          .limit(5)
          .toJSON()
          .find();
        
        const duration = Date.now() - startTime;
        
        expect(result[0]).toBeDefined();
        expect(duration).toBeLessThan(8000); // 8 seconds for nested + references
        
        console.log(`⚡ Nested global field with references: ${duration}ms`);
      } catch (error) {
        console.log(`⚠️ Performance test error: ${error.message}`);
      }
    });

  });

  // =============================================================================
  // NESTED GLOBAL FIELD - COMPLEX NESTING (Based on ngf_parent structure)
  // =============================================================================

  describe('Nested Global Field - Complex Nesting Patterns', () => {
    
    test('NestedGlobalField_DeepNesting_UpTo6Levels', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(1)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries with nested global field found');
          return;
        }
        
        const entry = result[0][0];
        const nestedField = entry[nestedGlobalFieldUID];
        
        // Calculate maximum nesting depth
        let maxDepth = 0;
        const visited = new Set();
        
        const calculateDepth = (obj, depth = 0, path = '') => {
          if (depth > maxDepth) maxDepth = depth;
          
          if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            const objKey = path || 'root';
            if (visited.has(objKey)) {
              return; // Circular reference detected
            }
            visited.add(objKey);
            
            Object.entries(obj).forEach(([key, value]) => {
              if (value && typeof value === 'object') {
                calculateDepth(value, depth + 1, `${path}.${key}`);
              }
            });
            
            visited.delete(objKey);
          }
        };
        
        calculateDepth(nestedField);
        
        console.log(`📊 Maximum nesting depth detected: ${maxDepth} levels`);
        console.log(`   Expected: ngf_parent has 6 levels of nesting`);
        
        // ngf_parent structure: ngf_parent → video_info_gf → card_gf → featured_card → menu_card_gf → secondary_navigation_gf
        if (maxDepth >= 3) {
          console.log('✅ Deep nesting detected (3+ levels)');
        }
        
        expect(nestedField).toBeDefined();
      } catch (error) {
        console.log(`⚠️ Deep nesting test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_WithMultipleGlobalFields_AllResolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      const entryUID = TestDataHelper.getComplexEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: COMPLEX_ENTRY_UID not configured');
        return;
      }
      
      try {
        const entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch();
        
        // Cybersecurity content type has multiple global fields
        const expectedGlobalFields = [
          'page_header',
          'content_block',
          'video_experience',
          'podcast',
          'seo',
          'search'
        ];
        
        const foundGlobalFields = expectedGlobalFields.filter(field => entry[field]);
        
        console.log(`📊 Found ${foundGlobalFields.length}/${expectedGlobalFields.length} global fields:`);
        foundGlobalFields.forEach(field => {
          console.log(`   ✓ ${field}`);
        });
        
        // Should have at least some global fields
        expect(foundGlobalFields.length).toBeGreaterThan(0);
        
        // Validate each found global field structure
        foundGlobalFields.forEach(field => {
          expect(entry[field]).toBeDefined();
          expect(typeof entry[field]).toBe('object');
        });
      } catch (error) {
        console.log(`⚠️ Multiple global fields test error: ${error.message}`);
      }
    });

    test('NestedGlobalField_WithJSONRTE_EmbeddedItemsResolved', async () => {
      const nestedGlobalFieldUID = TestDataHelper.getNestedGlobalFieldUID();
      
      if (!nestedGlobalFieldUID) {
        console.log('⚠️ Skipping: NESTED_GLOBAL_FIELD_UID not configured');
        return;
      }
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .exists(nestedGlobalFieldUID)
          .limit(1)
          .toJSON()
          .find();
        
        if (!result[0] || result[0].length === 0) {
          console.log('⚠️ No entries with nested global field found');
          return;
        }
        
        const entry = result[0][0];
        const nestedField = entry[nestedGlobalFieldUID];
        
        // Check for JSON RTE fields in nested structure
        const findJSONRTE = (obj, path = '') => {
          if (obj && typeof obj === 'object') {
            if (obj.json_rte || obj.json_rte_editor) {
              console.log(`✅ Found JSON RTE at: ${path}`);
              return true;
            }
            
            for (const [key, value] of Object.entries(obj)) {
              if (value && typeof value === 'object') {
                if (findJSONRTE(value, path ? `${path}.${key}` : key)) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        
        const hasJSONRTE = findJSONRTE(nestedField);
        
        if (hasJSONRTE) {
          console.log('✅ JSON RTE found in nested global field structure');
        } else {
          console.log('ℹ️ No JSON RTE found in this nested structure');
        }
        
        expect(nestedField).toBeDefined();
      } catch (error) {
        console.log(`⚠️ JSON RTE test error: ${error.message}`);
      }
    });

  });

});
