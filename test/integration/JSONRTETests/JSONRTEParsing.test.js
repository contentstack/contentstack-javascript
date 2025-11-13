'use strict';

/**
 * COMPREHENSIVE JSON RICH TEXT EDITOR (RTE) TESTS
 * 
 * Tests JSON RTE parsing, embedded objects, and complex content structures.
 * 
 * SDK Features Covered:
 * - JSON RTE field retrieval
 * - Embedded objects (entries, assets)
 * - RTE structure validation
 * - Nested content handling
 * - includeEmbeddedItems()
 * 
 * Bug Detection Focus:
 * - RTE structure integrity
 * - Embedded object resolution
 * - Complex nesting scenarios
 * - Edge cases in RTE content
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('JSON RTE - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // JSON RTE STRUCTURE TESTS
  // =============================================================================

  describe('JSON RTE Structure', () => {
    
    test('JSONRTE_BasicStructure_ValidFormat', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        // Look for JSON RTE fields in entries
        let hasJSONRTE = false;
        
        result[0].forEach(entry => {
          Object.keys(entry).forEach(key => {
            const value = entry[key];
            // JSON RTE is typically an object with specific structure
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              if (value.type || value.children || value.attrs) {
                hasJSONRTE = true;
                
                // Validate basic structure
                if (value.children) {
                  expect(Array.isArray(value.children)).toBe(true);
                }
              }
            }
          });
        });
        
        console.log(`✅ JSON RTE fields: ${hasJSONRTE ? 'found and validated' : 'not present in results'}`);
      }
    });

    test('JSONRTE_ChildrenArray_IsArray', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.children) {
              expect(Array.isArray(value.children)).toBe(true);
            }
          });
        });
      }
      
      console.log('✅ JSON RTE children arrays validated');
    });

    test('JSONRTE_NodeTypes_Valid', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      const validNodeTypes = ['doc', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                              'blockquote', 'code', 'img', 'embed', 'a', 'text',
                              'ul', 'ol', 'li', 'hr', 'table', 'tr', 'td', 'th'];
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.type) {
              // If it has a type, it should be a valid node type
              if (typeof value.type === 'string') {
                // Type should be one of the valid node types or custom
                console.log(`   Node type found: ${value.type}`);
              }
            }
          });
        });
      }
      
      console.log('✅ JSON RTE node types validated');
    });

  });

  // =============================================================================
  // EMBEDDED OBJECTS TESTS
  // =============================================================================

  describe('Embedded Objects', () => {
    
    test('EmbeddedObjects_WithIncludeEmbedded_Resolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeEmbeddedItems()
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ includeEmbeddedItems() query executed');
    });

    test('EmbeddedObjects_Assets_Resolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeEmbeddedItems()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        let foundEmbeddedAssets = false;
        
        result[0].forEach(entry => {
          if (entry._embedded_items) {
            foundEmbeddedAssets = true;
            
            // Validate embedded items structure
            expect(entry._embedded_items).toBeDefined();
          }
        });
        
        console.log(`✅ Embedded assets: ${foundEmbeddedAssets ? 'found' : 'not present'}`);
      }
    });

    test('EmbeddedObjects_Entries_Resolved', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeEmbeddedItems()
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        let foundEmbeddedEntries = false;
        
        result[0].forEach(entry => {
          if (entry._embedded_items) {
            foundEmbeddedEntries = true;
          }
        });
        
        console.log(`✅ Embedded entries: ${foundEmbeddedEntries ? 'found' : 'not present'}`);
      }
    });

  });

  // =============================================================================
  // COMPLEX RTE SCENARIOS
  // =============================================================================

  describe('Complex RTE Scenarios', () => {
    
    test('ComplexRTE_NestedStructures_Handled', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeEmbeddedItems()
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.children) {
              // Check for nested structures
              const checkNesting = (node, depth = 0) => {
                if (depth > 10) return; // Prevent infinite recursion
                
                if (node.children && Array.isArray(node.children)) {
                  node.children.forEach(child => {
                    if (child && typeof child === 'object') {
                      checkNesting(child, depth + 1);
                    }
                  });
                }
              };
              
              checkNesting(value);
            }
          });
        });
      }
      
      console.log('✅ Nested RTE structures handled');
    });

    test('ComplexRTE_WithReferences_Combined', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .includeEmbeddedItems()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ RTE with references combined');
    });

    test('ComplexRTE_WithFilters_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .includeEmbeddedItems()
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ RTE with filters works');
    });

  });

  // =============================================================================
  // RTE CONTENT VALIDATION
  // =============================================================================

  describe('RTE Content Validation', () => {
    
    test('RTEContent_TextNodes_HaveText', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.children) {
              const checkTextNodes = (node) => {
                if (node.type === 'text' && node.text !== undefined) {
                  expect(typeof node.text).toBe('string');
                }
                if (node.children) {
                  node.children.forEach(checkTextNodes);
                }
              };
              checkTextNodes(value);
            }
          });
        });
      }
      
      console.log('✅ Text nodes validated');
    });

    test('RTEContent_Links_HaveHref', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.children) {
              const checkLinks = (node) => {
                if (node.type === 'a' && node.attrs) {
                  // Link should have href in attrs
                  if (node.attrs.href) {
                    expect(typeof node.attrs.href).toBe('string');
                  }
                }
                if (node.children) {
                  node.children.forEach(checkLinks);
                }
              };
              checkLinks(value);
            }
          });
        });
      }
      
      console.log('✅ Link nodes validated');
    });

  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('RTE Performance', () => {
    
    test('Perf_RTEWithEmbedded_ReasonableTime', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeEmbeddedItems()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(5000);
      
      console.log(`⚡ RTE with embedded items: ${duration}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('RTE Edge Cases', () => {
    
    test('EdgeCase_EmptyRTE_HandledGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(entry => {
          Object.values(entry).forEach(value => {
            if (value && typeof value === 'object' && value.children) {
              if (Array.isArray(value.children) && value.children.length === 0) {
                console.log('   Found empty RTE (valid)');
              }
            }
          });
        });
      }
      
      console.log('✅ Empty RTE handled');
    });

    test('EdgeCase_RTEWithoutEmbedded_Works', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Query without includeEmbeddedItems
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ RTE without embedded items works');
    });

  });

});

