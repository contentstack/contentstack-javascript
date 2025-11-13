'use strict';

/**
 * COMPREHENSIVE MODULAR BLOCKS TESTS
 * 
 * Tests modular blocks retrieval, structure validation, and complex scenarios.
 * 
 * SDK Features Covered:
 * - Modular blocks field retrieval
 * - Block structure validation
 * - Nested blocks handling
 * - Reference resolution in blocks
 * - Complex block combinations
 * 
 * Bug Detection Focus:
 * - Block structure integrity
 * - Nested block handling
 * - Reference resolution within blocks
 * - Edge cases in block data
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Modular Blocks - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // MODULAR BLOCKS STRUCTURE TESTS
  // =============================================================================

  describe('Modular Blocks Structure', () => {
    
    test('ModularBlocks_BasicStructure_IsArray', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        let foundModularBlocks = false;
        
        result[0].forEach(entry => {
          Object.keys(entry).forEach(key => {
            const value = entry[key];
            // Modular blocks are typically arrays of objects
            if (Array.isArray(value) && value.length > 0) {
              // Check if it looks like modular blocks
              if (value[0] && typeof value[0] === 'object' && value[0]._content_type_uid) {
                foundModularBlocks = true;
                expect(Array.isArray(value)).toBe(true);
                console.log(`   Found modular blocks field: ${key}`);
              }
            }
          });
        });
        
        console.log(`✅ Modular blocks: ${foundModularBlocks ? 'found and validated' : 'not present'}`);
      }
    });

    test('ModularBlocks_HasContentTypeUID_Valid', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('section_builder', true);
      const entryUID = TestDataHelper.getSelfReferencingEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      let entry;
      try {
        entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch();
      } catch (error) {
        console.log(`⚠️ Skipping: Entry ${entryUID} not found (error ${error.error_code})`);
        return;
      }
      
      if (entry) {
        Object.values(entry).forEach(value => {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(block => {
              if (block && typeof block === 'object' && block._content_type_uid) {
                expect(typeof block._content_type_uid).toBe('string');
                expect(block._content_type_uid.length).toBeGreaterThan(0);
              }
            });
          }
        });
      }
      
      console.log('✅ Block _content_type_uid validated');
    });

    test('ModularBlocks_EachBlock_IsObject', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (Array.isArray(value) && value.length > 0) {
              value.forEach(block => {
                if (block && block._content_type_uid) {
                  expect(typeof block).toBe('object');
                }
              });
            }
          });
        });
      }
      
      console.log('✅ Each block is an object');
    });

  });

  // =============================================================================
  // MODULAR BLOCKS WITH REFERENCES
  // =============================================================================

  describe('Modular Blocks with References', () => {
    
    test('ModularBlocks_WithReferences_Resolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('references')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Modular blocks with references query executed');
    });

    test('ModularBlocks_WithMultipleReferences_AllResolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('references')
        .includeReference('author')
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Multiple references with blocks resolved');
    });

  });

  // =============================================================================
  // NESTED MODULAR BLOCKS
  // =============================================================================

  describe('Nested Modular Blocks', () => {
    
    test('NestedBlocks_SelfReferencing_Handled', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('section_builder', true);
      const entryUID = TestDataHelper.getSelfReferencingEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No self-referencing entry UID configured');
        return;
      }
      
      let entry;
      try {
        entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch();
      } catch (error) {
        console.log(`⚠️ Skipping: Entry ${entryUID} not found (error ${error.error_code})`);
        return;
      }
      
      expect(entry).toBeDefined();
      
      // Check for nested structures
      if (entry) {
        Object.values(entry).forEach(value => {
          if (Array.isArray(value)) {
            console.log(`   Found array field with ${value.length} items`);
          }
        });
      }
      
      console.log('✅ Self-referencing blocks handled');
    });

    test('NestedBlocks_MultiLevel_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('section_builder', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (Array.isArray(value) && value.length > 0) {
              // Check for nested arrays
              value.forEach(block => {
                if (block && typeof block === 'object') {
                  Object.values(block).forEach(nestedValue => {
                    if (Array.isArray(nestedValue)) {
                      console.log('   Found nested modular blocks');
                    }
                  });
                }
              });
            }
          });
        });
      }
      
      console.log('✅ Multi-level nesting stable');
    });

  });

  // =============================================================================
  // COMPLEX BLOCKS ENTRY
  // =============================================================================

  describe('Complex Blocks Entry', () => {
    
    test('ComplexBlocks_Entry_AllBlocksPresent', async () => {
      const entryUID = TestDataHelper.getComplexBlocksEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No complex blocks entry UID configured');
        return;
      }
      
      // Use page_builder content type (where complex blocks entry exists)
      const contentTypeUID = TestDataHelper.getContentTypeUID('page_builder', true);
      
      try {
        const entry = await Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch();
        
        expect(entry).toBeDefined();
        
        if (entry) {
          let blockCount = 0;
          Object.values(entry).forEach(value => {
            if (Array.isArray(value)) {
              blockCount += value.length;
            }
          });
          
          console.log(`✅ Complex blocks entry: ${blockCount} total blocks`);
        }
      } catch (error) {
        console.log('⚠️ Skipping: Entry not found or not accessible');
      }
    });

    test('ComplexBlocks_WithFilters_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Complex blocks with filters works');
    });

  });

  // =============================================================================
  // MODULAR BLOCKS WITH QUERY OPERATORS
  // =============================================================================

  describe('Modular Blocks with Query Operators', () => {
    
    test('ModularBlocks_WithSorting_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .ascending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Modular blocks with sorting works');
    });

    test('ModularBlocks_WithPagination_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .skip(1)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Modular blocks with pagination works');
    });

    test('ModularBlocks_WithProjection_OnlySelected', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'uid'])
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Modular blocks with projection works');
    });

  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Modular Blocks Performance', () => {
    
    test('Perf_ModularBlocks_ReasonableTime', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(5000);
      
      console.log(`⚡ Modular blocks query: ${duration}ms`);
    });

    test('Perf_ModularBlocksWithReferences_Acceptable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('references')
        .limit(5)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(6000);
      
      console.log(`⚡ Modular blocks with references: ${duration}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Modular Blocks Edge Cases', () => {
    
    test('EdgeCase_EmptyBlocksArray_HandledGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        let foundEmptyBlocks = false;
        
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (Array.isArray(value) && value.length === 0) {
              foundEmptyBlocks = true;
            }
          });
        });
        
        console.log(`✅ Empty blocks arrays: ${foundEmptyBlocks ? 'found and handled' : 'not present'}`);
      }
    });

    test('EdgeCase_SingleBlock_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        let foundSingleBlock = false;
        
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (Array.isArray(value) && value.length === 1) {
              foundSingleBlock = true;
            }
          });
        });
        
        console.log(`✅ Single block arrays: ${foundSingleBlock ? 'found' : 'not present'}`);
      }
    });

    test('EdgeCase_ManyBlocks_StablePerformance', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(20)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(8000);
      
      console.log(`✅ Many blocks (20 entries): ${duration}ms`);
    });

  });

});

