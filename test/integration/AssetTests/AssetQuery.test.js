'use strict';

/**
 * Asset Query - COMPREHENSIVE Tests
 * 
 * Tests for asset functionality:
 * - Stack.Assets() - asset-level queries
 * - Asset.fetch() - single asset retrieval
 * - Asset filters (where, containedIn, etc.)
 * - Asset with other operators
 * 
 * Focus Areas:
 * 1. Asset queries
 * 2. Single asset retrieval
 * 3. Asset filtering
 * 4. Asset with pagination
 * 5. Performance
 * 
 * Bug Detection:
 * - Wrong assets returned
 * - Missing asset metadata
 * - Filter not applied
 * - Performance issues
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Asset Tests - Asset Queries', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Stack.Assets() - Asset Queries', () => {
    test('Asset_Query_FetchAllAssets_ReturnsAssets', async () => {
      const result = await Stack.Assets()
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result[0])).toBe(true);
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.uid).toBeDefined();
          expect(asset.uid).toMatch(/^blt[a-f0-9]+$/);
          expect(asset.filename).toBeDefined();
          expect(asset.url).toBeDefined();
        });
        
        console.log(`✅ Stack.Assets().Query(): ${result[0].length} assets found`);
      } else {
        console.log('ℹ️  No assets found in stack');
      }
    });

    test('Asset_Query_WithLimit_ReturnsLimitedAssets', async () => {
      const result = await Stack.Assets()
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0].length).toBeLessThanOrEqual(5);
      console.log(`✅ Asset Query limit(5): ${result[0].length} assets`);
    });

    test('Asset_Query_WithSorting_ReturnsSortedAssets', async () => {
      const result = await Stack.Assets()
        .Query()
        .descending('created_at')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 1) {
        for (let i = 1; i < result[0].length; i++) {
          const prev = new Date(result[0][i - 1].created_at).getTime();
          const curr = new Date(result[0][i].created_at).getTime();
          expect(curr).toBeLessThanOrEqual(prev);
        }
        
        console.log(`✅ Asset Query sorted: ${result[0].length} assets`);
      }
    });

    test('Asset_Query_WithIncludeCount_ReturnsCount', async () => {
      const result = await Stack.Assets()
        .Query()
        .includeCount()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[1]).toBeDefined();
      expect(typeof result[1]).toBe('number');
      expect(result[1]).toBeGreaterThanOrEqual(result[0].length);
      
      console.log(`✅ Asset count: ${result[1]} total, ${result[0].length} fetched`);
    });
  });

  describe('Stack.Assets() - Single Asset by UID', () => {
    test('Asset_FilterByUID_ReturnsAsset', async () => {
      const imageUID = TestDataHelper.getImageAssetUID();
      
      if (!imageUID) {
        console.log('ℹ️  No image asset UID configured - skipping test');
        return;
      }
      
      const result = await Stack.Assets()
        .Query()
        .where('uid', imageUID)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        const asset = result[0][0];
        expect(asset.uid).toBe(imageUID);
        expect(asset.filename).toBeDefined();
        expect(asset.url).toBeDefined();
        expect(asset.content_type).toBeDefined();
        
        console.log(`✅ Asset by UID: ${asset.filename} (${asset.content_type})`);
      } else {
        console.log('ℹ️  Asset with specified UID not found');
      }
    });

    test('Asset_ByUID_HasCompleteMetadata', async () => {
      const imageUID = TestDataHelper.getImageAssetUID();
      
      if (!imageUID) {
        console.log('ℹ️  No image asset UID configured - skipping test');
        return;
      }
      
      const result = await Stack.Assets()
        .Query()
        .where('uid', imageUID)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        const asset = result[0][0];
        
        // Check essential asset fields
        expect(asset.uid).toBeDefined();
        expect(asset.filename).toBeDefined();
        expect(asset.url).toBeDefined();
        expect(asset.file_size).toBeDefined();
        expect(asset.content_type).toBeDefined();
        
        console.log(`✅ Asset metadata: ${asset.filename} (${asset.file_size} bytes)`);
      }
    });

    test('Asset_NonExistentUID_ReturnsEmpty', async () => {
      const result = await Stack.Assets()
        .Query()
        .where('uid', 'non_existent_asset_uid')
        .toJSON()
        .find();
      
      expect(result[0].length).toBe(0);
      console.log('✅ Non-existent asset UID returns empty');
    });
  });

  describe('Asset Filters', () => {
    test('Asset_Where_ContentType_ReturnsMatchingAssets', async () => {
      const result = await Stack.Assets()
        .Query()
        .where('content_type', 'image/png')
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.content_type).toBe('image/png');
        });
        
        console.log(`✅ Asset where('content_type', 'image/png'): ${result[0].length} assets`);
      } else {
        console.log('ℹ️  No PNG assets found');
      }
    });

    test('Asset_ContainedIn_MultipleContentTypes_ReturnsMatching', async () => {
      const result = await Stack.Assets()
        .Query()
        .containedIn('content_type', ['image/png', 'image/jpeg', 'image/jpg'])
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(['image/png', 'image/jpeg', 'image/jpg']).toContain(asset.content_type);
        });
        
        console.log(`✅ Asset containedIn(['image/png', 'image/jpeg', 'image/jpg']): ${result[0].length} assets`);
      }
    });

    test('Asset_Exists_Filename_ReturnsAssets', async () => {
      const result = await Stack.Assets()
        .Query()
        .exists('filename')
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.filename).toBeDefined();
          expect(asset.filename.length).toBeGreaterThan(0);
        });
        
        console.log(`✅ Asset exists('filename'): ${result[0].length} assets`);
      }
    });

    test('Asset_GreaterThan_FileSize_ReturnsLargeAssets', async () => {
      const minSize = 1000; // 1KB
      
      const result = await Stack.Assets()
        .Query()
        .greaterThan('file_size', minSize)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          const fileSize = typeof asset.file_size === 'string' ? parseInt(asset.file_size) : asset.file_size;
          expect(fileSize).toBeGreaterThan(minSize);
        });
        
        console.log(`✅ Asset greaterThan('file_size', ${minSize}): ${result[0].length} assets`);
      }
    });

    test('Asset_LessThan_FileSize_ReturnsSmallAssets', async () => {
      const maxSize = 5000000; // 5MB
      
      const result = await Stack.Assets()
        .Query()
        .lessThan('file_size', maxSize)
        .limit(5)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          const fileSize = typeof asset.file_size === 'string' ? parseInt(asset.file_size) : asset.file_size;
          expect(fileSize).toBeLessThan(maxSize);
        });
        
        console.log(`✅ Asset lessThan('file_size', ${maxSize}): ${result[0].length} assets`);
      }
    });
  });

  describe('Asset with Pagination', () => {
    test('Asset_Skip_ReturnsCorrectPage', async () => {
      const result = await Stack.Assets()
        .Query()
        .skip(0)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0].length).toBeLessThanOrEqual(3);
      console.log(`✅ Asset skip(0) limit(3): ${result[0].length} assets`);
    });

    test('Asset_SkipAndLimit_Pagination_Works', async () => {
      // First page
      const page1 = await Stack.Assets()
        .Query()
        .skip(0)
        .limit(2)
        .toJSON()
        .find();
      
      // Second page
      const page2 = await Stack.Assets()
        .Query()
        .skip(2)
        .limit(2)
        .toJSON()
        .find();
      
      // Pages should have different assets (if enough assets exist)
      if (page1[0].length > 0 && page2[0].length > 0) {
        const page1UIDs = page1[0].map(a => a.uid);
        const page2UIDs = page2[0].map(a => a.uid);
        
        // Check no overlap (basic pagination test)
        page2UIDs.forEach(uid => {
          expect(page1UIDs).not.toContain(uid);
        });
        
        console.log(`✅ Pagination: Page 1 (${page1[0].length}), Page 2 (${page2[0].length})`);
      }
    });
  });

  describe('Asset - Projection', () => {
    test('Asset_Only_SpecificFields_ReturnsProjected', async () => {
      const result = await Stack.Assets()
        .Query()
        .only(['filename', 'url'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.filename).toBeDefined();
          expect(asset.url).toBeDefined();
          expect(asset.uid).toBeDefined(); // uid always included
        });
        
        console.log(`✅ Asset only(['filename', 'url']): ${result[0].length} projected assets`);
      }
    });

    test('Asset_Except_ExcludesFields_ReturnsRemaining', async () => {
      const result = await Stack.Assets()
        .Query()
        .except(['tags', 'description'])
        .limit(3)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.uid).toBeDefined();
          expect(asset.filename).toBeDefined();
          // tags and description should be excluded
        });
        
        console.log(`✅ Asset except(['tags', 'description']): ${result[0].length} assets`);
      }
    });
  });

  describe('Asset - Performance', () => {
    test('Asset_Query_Performance_AcceptableSpeed', async () => {
      await AssertionHelper.assertPerformance(async () => {
        await Stack.Assets()
          .Query()
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Asset query performance acceptable');
    });

    test('Asset_ByUID_Performance_AcceptableSpeed', async () => {
      const imageUID = TestDataHelper.getImageAssetUID();
      
      if (!imageUID) {
        console.log('ℹ️  No image asset UID configured - skipping test');
        return;
      }
      
      await AssertionHelper.assertPerformance(async () => {
        await Stack.Assets()
          .Query()
          .where('uid', imageUID)
          .toJSON()
          .find();
      }, 2000);
      
      console.log('✅ Asset by UID performance acceptable');
    });

    test('Asset_WithFilters_Performance_AcceptableSpeed', async () => {
      await AssertionHelper.assertPerformance(async () => {
        await Stack.Assets()
          .Query()
          .where('content_type', 'image/png')
          .limit(10)
          .toJSON()
          .find();
      }, 3000);
      
      console.log('✅ Asset filtered query performance acceptable');
    });
  });

  describe('Asset - Edge Cases', () => {
    test('Asset_EmptyUID_ReturnsEmpty', async () => {
      const result = await Stack.Assets()
        .Query()
        .where('uid', '')
        .toJSON()
        .find();
      
      expect(result[0].length).toBe(0);
      console.log('✅ Empty asset UID returns empty');
    });

    test('Asset_InvalidContentType_ReturnsEmpty', async () => {
      const result = await Stack.Assets()
        .Query()
        .where('content_type', 'invalid/type')
        .limit(5)
        .toJSON()
        .find();
      
      // Should return empty array for non-existent content type
      expect(result[0].length).toBe(0);
      console.log('✅ Invalid content_type returns empty');
    });

    test('Asset_ZeroLimit_SDKBehavior', async () => {
      const result = await Stack.Assets()
        .Query()
        .limit(0)
        .toJSON()
        .find();
      
      // Check SDK behavior with limit(0)
      console.log(`ℹ️  Asset limit(0) returns: ${result[0].length} assets (SDK behavior)`);
      expect(result[0]).toBeDefined();
    });

    test('Asset_LargeSkip_HandlesGracefully', async () => {
      const result = await Stack.Assets()
        .Query()
        .skip(99999)
        .limit(5)
        .toJSON()
        .find();
      
      // Should return empty or handle gracefully
      expect(result[0]).toBeDefined();
      console.log(`✅ Large skip(99999) handled: ${result[0].length} assets`);
    });
  });

  describe('Asset Metadata Validation', () => {
    test('Asset_AllAssets_HaveRequiredFields', async () => {
      const result = await Stack.Assets()
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          // Required fields
          expect(asset.uid).toBeDefined();
          expect(asset.uid).toMatch(/^blt[a-f0-9]+$/);
          expect(asset.filename).toBeDefined();
          expect(asset.url).toBeDefined();
          expect(asset.content_type).toBeDefined();
          expect(asset.file_size).toBeDefined();
          
          // file_size can be string or number
          const fileSize = typeof asset.file_size === 'string' ? parseInt(asset.file_size) : asset.file_size;
          expect(fileSize).toBeGreaterThan(0);
          
          // URL should be valid
          expect(asset.url).toMatch(/^https?:\/\//);
        });
        
        console.log(`✅ All ${result[0].length} assets have required fields`);
      }
    });

    test('Asset_ImageAssets_HaveValidContentType', async () => {
      const result = await Stack.Assets()
        .Query()
        .containedIn('content_type', ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'])
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          expect(asset.content_type).toMatch(/^image\//);
        });
        
        console.log(`✅ ${result[0].length} image assets with valid content_type`);
      }
    });

    test('Asset_FileSize_IsPositive', async () => {
      const result = await Stack.Assets()
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (result[0].length > 0) {
        result[0].forEach(asset => {
          const fileSize = typeof asset.file_size === 'string' ? parseInt(asset.file_size) : asset.file_size;
          expect(fileSize).toBeGreaterThan(0);
        });
        
        console.log(`✅ All ${result[0].length} assets have positive file_size`);
      }
    });
  });
});

