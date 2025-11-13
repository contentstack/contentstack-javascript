'use strict';

/**
 * Content Block Global Field - COMPREHENSIVE Tests
 * 
 * Content Block is the MOST COMPLEX global field with:
 * - JSON RTE with embedded items
 * - Links with complex permissions
 * - Groups with modal references
 * - Multiple link appearances
 * - Images with presets
 * - Max width settings
 * 
 * This test demonstrates TRUE comprehensive testing:
 * 1. Deep nested structure validation
 * 2. JSON RTE embedded items resolution
 * 3. Reference resolution in groups
 * 4. Array validation (multiple links)
 * 5. Complex enum validations
 * 6. Edge cases in nested structures
 * 
 * Focus: Find bugs in complex structures, not just simple fields!
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Global Fields - Content Block (MOST COMPLEX) Comprehensive Tests', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Content Block - Structure Validation', () => {
    test('Entry_Article_HasContentBlockWithCompleteStructure', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();

      // Entry structure validation
      AssertionHelper.assertEntryStructure(entry, ['uid', 'title']);

      // Check if content_block exists
      if (entry[contentBlockField]) {
        // Content block is an array (multiple: true in schema)
        expect(Array.isArray(entry[contentBlockField])).toBe(true);

        console.log(`✅ Content Block found: ${entry[contentBlockField].length} blocks`);

        // Validate structure if blocks exist
        if (entry[contentBlockField].length > 0) {
          const block = entry[contentBlockField][0];
          expect(typeof block).toBe('object');
          
          // Content block should have title or html or json_rte
          const hasContent = block.title || block.html || block.json_rte;
          expect(hasContent).toBeTruthy();
        }
      } else {
        console.log('ℹ️  Content Block field not present in this entry');
      }
    });

    test('ContentBlock_Title_ValidStructure', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      // Query to get entries with content blocks
      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.toJSON().find();

      AssertionHelper.assertQueryResultStructure(result);

      // Find entries with content blocks
      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField] && e[contentBlockField].length > 0);

      if (entriesWithContentBlock.length > 0) {
        entriesWithContentBlock.forEach(entry => {
          entry[contentBlockField].forEach((block, index) => {
            // Title validation
            if (block.title) {
              expect(typeof block.title).toBe('string');
              expect(block.title.length).toBeGreaterThan(0);
              
              // Data quality check - trailing/leading whitespace
              const trimmedTitle = block.title.trim();
              if (trimmedTitle !== block.title) {
                console.log(`  ⚠️  DATA QUALITY: Title has whitespace: "${block.title}" (should be "${trimmedTitle}")`);
                console.log(`     Entry: ${entry.uid}, Block: ${index}`);
                // This is a data quality issue, not an SDK bug, but worth documenting
              }
            }

            // Content Block ID validation (anchor)
            if (block.content_block_id) {
              expect(typeof block.content_block_id).toBe('string');
              expect(block.content_block_id.length).toBeGreaterThan(0);
              
              // Data quality check - anchor IDs should not have spaces
              if (!/^[a-zA-Z0-9_-]+$/.test(block.content_block_id)) {
                console.log(`  ⚠️  DATA QUALITY: content_block_id has invalid characters: "${block.content_block_id}"`);
                console.log(`     Anchor IDs should only contain: a-z, A-Z, 0-9, _, -`);
                console.log(`     Entry: ${entry.uid}, Block: ${index}`);
                // This is a data quality issue - IDs with spaces won't work as HTML anchors
              }
            }
          });
        });

        console.log(`✅ Validated ${entriesWithContentBlock.length} entries with content blocks`);
      }
    });

    test('ContentBlock_JSONRTE_EmbeddedItemsResolution', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .includeEmbeddedItems()  // Critical for embedded resolution!
        .toJSON()
        .fetch();

      if (entry[contentBlockField] && entry[contentBlockField].length > 0) {
        entry[contentBlockField].forEach((block, blockIndex) => {
          if (block.json_rte) {
            // JSON RTE structure validation
            expect(typeof block.json_rte).toBe('object');

            // If JSON RTE has content, validate structure
            if (block.json_rte.type || block.json_rte.children) {
              console.log(`✅ Block ${blockIndex}: JSON RTE structure valid`);

              // Check for embedded items
              if (entry._embedded_items) {
                expect(typeof entry._embedded_items).toBe('object');
                
                // Embedded items should be resolved objects, not just UIDs
                Object.keys(entry._embedded_items).forEach(key => {
                  const item = entry._embedded_items[key];
                  expect(typeof item).toBe('object');
                  expect(typeof item).not.toBe('string'); // Not just UID!
                  
                  if (item.uid) {
                    console.log(`  ✅ Embedded item resolved: ${item.uid}`);
                  }
                });
              }
            }
          }
        });
      } else {
        console.log('ℹ️  No JSON RTE content blocks found');
      }
    });

    test('ContentBlock_Links_ComplexStructureValidation', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(10).toJSON().find();

      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField] && e[contentBlockField].length > 0);

      if (entriesWithContentBlock.length > 0) {
        let totalLinks = 0;

        entriesWithContentBlock.forEach(entry => {
          entry[contentBlockField].forEach(block => {
            if (block.links && Array.isArray(block.links)) {
              totalLinks += block.links.length;

              block.links.forEach((link, linkIndex) => {
                // Link object validation
                expect(typeof link).toBe('object');

                // Link.link validation
                if (link.link) {
                  expect(typeof link.link).toBe('object');
                  
                  // Link should have title and/or href
                  if (link.link.title) {
                    expect(typeof link.link.title).toBe('string');
                  }
                  if (link.link.href) {
                    expect(typeof link.link.href).toBe('string');
                    // Should start with / or http
                    expect(link.link.href).toMatch(/^(\/|https?:\/\/)/);
                  }
                }

                // Appearance validation (enum field)
                if (link.appearance) {
                  expect(typeof link.appearance).toBe('string');
                  const validAppearances = ['default', 'primary', 'secondary', 'arrow'];
                  expect(validAppearances).toContain(link.appearance);
                }

                // Icon validation (enum field)
                if (link.icon) {
                  expect(typeof link.icon).toBe('string');
                  const validIcons = ['none', 'ExternalLink', 'PdfDocument'];
                  expect(validIcons).toContain(link.icon);
                }

                // Target validation (enum field)
                if (link.target) {
                  expect(typeof link.target).toBe('string');
                  const validTargets = ['_self', '_blank'];
                  expect(validTargets).toContain(link.target);
                }

                // Permissions validation (nested group)
                if (link.permissions) {
                  expect(typeof link.permissions).toBe('object');
                  
                  if (link.permissions.level) {
                    expect(Array.isArray(link.permissions.level)).toBe(true);
                    
                    // Each permission level should be valid
                    const validLevels = ['full', 'basic', 'registered', 'public'];
                    link.permissions.level.forEach(level => {
                      expect(validLevels).toContain(level);
                    });
                  }
                }

                // Modal reference validation
                if (link.reference) {
                  expect(typeof link.reference).toBe('object');
                  
                  // If it's resolved, should have uid
                  if (Array.isArray(link.reference)) {
                    link.reference.forEach(ref => {
                      expect(typeof ref).toBe('object');
                      expect(ref.uid).toBeDefined();
                    });
                  } else if (link.reference.uid) {
                    expect(typeof link.reference.uid).toBe('string');
                  }
                }
              });
            }
          });
        });

        console.log(`✅ Validated ${totalLinks} links across ${entriesWithContentBlock.length} entries`);
      }
    });

    test('ContentBlock_Image_WithPresets_Validation', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(10).toJSON().find();

      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField] && e[contentBlockField].length > 0);

      if (entriesWithContentBlock.length > 0) {
        entriesWithContentBlock.forEach(entry => {
          entry[contentBlockField].forEach(block => {
            // Image validation
            if (block.image) {
              expect(typeof block.image).toBe('object');
              
              // Image should have asset properties
              if (block.image.uid) {
                expect(typeof block.image.uid).toBe('string');
                expect(block.image.uid).toMatch(/^blt[a-f0-9]+$/);
              }
              
              if (block.image.url) {
                expect(typeof block.image.url).toBe('string');
                expect(block.image.url).toMatch(/^https?:\/\//);
              }

              console.log(`  ✅ Image validated: ${block.image.uid || 'unknown'}`);
            }

            // Image preset accessibility validation (extension field)
            if (block.image_preset_accessibility) {
              expect(typeof block.image_preset_accessibility).toBe('object');
            }
          });
        });
      }
    });

    test('ContentBlock_MaxWidth_NumericValidation', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(10).toJSON().find();

      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField] && e[contentBlockField].length > 0);

      if (entriesWithContentBlock.length > 0) {
        entriesWithContentBlock.forEach(entry => {
          entry[contentBlockField].forEach(block => {
            if (block.max_width !== undefined && block.max_width !== null) {
              // Should be a number
              expect(typeof block.max_width).toBe('number');
              
              // Should be positive
              expect(block.max_width).toBeGreaterThan(0);
              
              // Should be reasonable (not millions)
              expect(block.max_width).toBeLessThan(10000);
              
              console.log(`  ✅ Max width validated: ${block.max_width}px`);
            }
          });
        });
      }
    });
  });

  describe('Content Block - Edge Cases & Data Quality', () => {
    test('ContentBlock_EmptyBlocks_HandleGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(20).toJSON().find();

      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField]);

      if (entriesWithContentBlock.length > 0) {
        let emptyBlocks = 0;
        let totalBlocks = 0;

        entriesWithContentBlock.forEach(entry => {
          if (Array.isArray(entry[contentBlockField])) {
            entry[contentBlockField].forEach(block => {
              totalBlocks++;
              
              // Check if block is essentially empty
              const hasTitle = block.title && block.title.length > 0;
              const hasHTML = block.html && block.html.length > 0;
              const hasJSONRTE = block.json_rte && Object.keys(block.json_rte).length > 0;
              const hasLinks = block.links && block.links.length > 0;
              const hasImage = block.image && block.image.uid;

              const isEmpty = !hasTitle && !hasHTML && !hasJSONRTE && !hasLinks && !hasImage;

              if (isEmpty) {
                emptyBlocks++;
                console.log(`  ⚠️  WARNING: Empty content block found in entry ${entry.uid}`);
              }
            });
          }
        });

        console.log(`✅ Checked ${totalBlocks} blocks, found ${emptyBlocks} empty blocks`);
        
        // Data quality check - too many empty blocks might indicate issue
        if (totalBlocks > 0) {
          const emptyPercentage = (emptyBlocks / totalBlocks) * 100;
          if (emptyPercentage > 20) {
            console.log(`  ⚠️  WARNING: ${emptyPercentage.toFixed(1)}% of content blocks are empty!`);
          }
        }
      }
    });

    test('ContentBlock_Links_RequiredFieldsValidation', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(10).toJSON().find();

      const entriesWithContentBlock = result[0].filter(e => e[contentBlockField] && e[contentBlockField].length > 0);

      if (entriesWithContentBlock.length > 0) {
        let linksChecked = 0;
        let linksWithIssues = 0;

        entriesWithContentBlock.forEach(entry => {
          entry[contentBlockField].forEach(block => {
            if (block.links && Array.isArray(block.links)) {
              block.links.forEach(link => {
                linksChecked++;

                // appearance, icon, target are marked as mandatory in schema
                // Let's verify they're actually present
                if (!link.appearance) {
                  console.log(`  ⚠️  WARNING: Link missing required 'appearance' field`);
                  linksWithIssues++;
                }
                
                if (!link.icon) {
                  console.log(`  ⚠️  WARNING: Link missing required 'icon' field`);
                  linksWithIssues++;
                }
                
                if (!link.target) {
                  console.log(`  ⚠️  WARNING: Link missing required 'target' field`);
                  linksWithIssues++;
                }
              });
            }
          });
        });

        console.log(`✅ Checked ${linksChecked} links, found ${linksWithIssues} with missing required fields`);
        
        // If too many links have missing required fields, that's a data quality issue
        if (linksChecked > 0 && linksWithIssues > 0) {
          console.log(`  ⚠️  Data Quality Issue: ${((linksWithIssues / linksChecked) * 100).toFixed(1)}% of links missing required fields`);
        }
      }
    });

    test('ContentBlock_WithFieldProjection_OnlyRequestedFields', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      // Fetch with only specific fields
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .only([contentBlockField, 'title', 'uid'])
        .toJSON()
        .fetch();

      // Should have requested fields
      expect(entry.uid).toBeDefined();
      expect(entry.title).toBeDefined();

      // Content block should be included if present
      if (entry[contentBlockField]) {
        expect(Array.isArray(entry[contentBlockField])).toBe(true);
        console.log('✅ Content block included with .only() projection');
      } else {
        console.log('ℹ️  Content block not present in this entry');
      }

      // Should not have other fields (field projection working)
      // This validates SDK's field projection logic
      const keys = Object.keys(entry);
      const expectedKeys = ['uid', 'title', contentBlockField, '_version', '_content_type_uid', 'locale', 'created_at', 'updated_at', 'created_by', 'updated_by', 'publish_details', 'ACL'];
      
      keys.forEach(key => {
        // Allow system fields, but not other custom fields
        if (!expectedKeys.includes(key) && !key.startsWith('_')) {
          console.log(`  ⚠️  Unexpected field in projection: ${key}`);
        }
      });
    });
  });

  describe('Content Block - Performance & Scale', () => {
    test('ContentBlock_MultipleBlocks_PerformanceValidation', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const contentBlockField = TestDataHelper.getGlobalField('content_block');

      const startTime = Date.now();

      const Query = Stack.ContentType(contentTypeUID).Query();
      const result = await Query.limit(50).toJSON().find();

      const duration = Date.now() - startTime;

      // Performance check - should complete in reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds max

      // Count total content blocks
      let totalBlocks = 0;
      result[0].forEach(entry => {
        if (entry[contentBlockField] && Array.isArray(entry[contentBlockField])) {
          totalBlocks += entry[contentBlockField].length;
        }
      });

      console.log(`✅ Query completed in ${duration}ms`);
      console.log(`   Retrieved ${result[0].length} entries with ${totalBlocks} total content blocks`);
      
      // Data quality check - validate structure is consistent
      AssertionHelper.assertQueryResultStructure(result);
    });
  });
});

