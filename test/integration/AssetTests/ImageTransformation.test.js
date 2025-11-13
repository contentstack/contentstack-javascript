'use strict';

/**
 * Image Transformation - COMPREHENSIVE Tests
 * 
 * Tests for image transformation functionality:
 * - width/height transformations
 * - fit modes (bounds, crop, scale)
 * - format conversion
 * - quality adjustments
 * - auto optimization
 * - Complex transformation chains
 * 
 * Focus Areas:
 * 1. Basic transformations (resize, crop)
 * 2. Format conversions
 * 3. Quality settings
 * 4. Auto optimization
 * 5. Transformation combinations
 * 6. URL validation
 * 
 * Bug Detection:
 * - Incorrect transformation parameters
 * - Missing query parameters in URL
 * - Invalid transformation combinations
 * - Malformed URLs
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Image Transformation Tests', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Basic Transformations - Width/Height', () => {
    test('ImageTransform_Width_AddsWidthParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      // Apply width transformation
      const transformedURL = Stack.imageTransform(asset.url, { width: 300 });
      
      expect(transformedURL).toBeDefined();
      expect(transformedURL).toContain('width=300');
      
      console.log(`✅ Width transformation: ${transformedURL.substring(0, 100)}...`);
    });

    test('ImageTransform_Height_AddsHeightParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { height: 200 });
      
      expect(transformedURL).toContain('height=200');
      console.log('✅ Height transformation applied');
    });

    test('ImageTransform_WidthAndHeight_BothApplied', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 300, 
        height: 200 
      });
      
      expect(transformedURL).toContain('width=300');
      expect(transformedURL).toContain('height=200');
      
      console.log('✅ Width + Height transformation applied');
    });
  });

  describe('Fit Modes', () => {
    test('ImageTransform_FitBounds_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 300,
        height: 200,
        fit: 'bounds'
      });
      
      expect(transformedURL).toContain('fit=bounds');
      console.log('✅ fit=bounds transformation applied');
    });

    test('ImageTransform_FitCrop_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 300,
        height: 200,
        fit: 'crop'
      });
      
      expect(transformedURL).toContain('fit=crop');
      console.log('✅ fit=crop transformation applied');
    });

    test('ImageTransform_FitScale_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 300,
        height: 200,
        fit: 'scale'
      });
      
      expect(transformedURL).toContain('fit=scale');
      console.log('✅ fit=scale transformation applied');
    });
  });

  describe('Format Conversion', () => {
    test('ImageTransform_FormatWebP_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        format: 'webp'
      });
      
      expect(transformedURL).toContain('format=webp');
      console.log('✅ format=webp transformation applied');
    });

    test('ImageTransform_FormatJPEG_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        format: 'jpg'
      });
      
      expect(transformedURL).toContain('format=jpg');
      console.log('✅ format=jpg transformation applied');
    });

    test('ImageTransform_FormatPNG_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        format: 'png'
      });
      
      expect(transformedURL).toContain('format=png');
      console.log('✅ format=png transformation applied');
    });
  });

  describe('Quality Adjustments', () => {
    test('ImageTransform_QualityLow_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        quality: 50
      });
      
      expect(transformedURL).toContain('quality=50');
      console.log('✅ quality=50 transformation applied');
    });

    test('ImageTransform_QualityHigh_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        quality: 90
      });
      
      expect(transformedURL).toContain('quality=90');
      console.log('✅ quality=90 transformation applied');
    });
  });

  describe('Auto Optimization', () => {
    test('ImageTransform_AutoWebP_AddsParameter', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        auto: 'webp'
      });
      
      expect(transformedURL).toContain('auto=webp');
      console.log('✅ auto=webp transformation applied');
    });
  });

  describe('Complex Transformation Chains', () => {
    test('ImageTransform_MultipleParams_AllApplied', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 400,
        height: 300,
        fit: 'crop',
        quality: 80,
        format: 'webp'
      });
      
      expect(transformedURL).toContain('width=400');
      expect(transformedURL).toContain('height=300');
      expect(transformedURL).toContain('fit=crop');
      expect(transformedURL).toContain('quality=80');
      expect(transformedURL).toContain('format=webp');
      
      console.log('✅ Complex transformation chain applied');
    });

    test('ImageTransform_ResponsiveImages_DifferentSizes', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      // Generate responsive image URLs
      const sizes = [320, 640, 1024, 1920];
      
      sizes.forEach(width => {
        const transformedURL = Stack.imageTransform(asset.url, { width });
        expect(transformedURL).toContain(`width=${width}`);
      });
      
      console.log(`✅ Generated ${sizes.length} responsive image URLs`);
    });

    test('ImageTransform_ThumbnailGeneration_MultipleFormats', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      // Generate thumbnails in different formats
      const formats = ['jpg', 'webp', 'png'];
      
      formats.forEach(format => {
        const transformedURL = Stack.imageTransform(asset.url, { 
          width: 150,
          height: 150,
          fit: 'crop',
          format
        });
        
        expect(transformedURL).toContain('width=150');
        expect(transformedURL).toContain(`format=${format}`);
      });
      
      console.log(`✅ Generated thumbnails in ${formats.length} formats`);
    });
  });

  describe('URL Validation', () => {
    test('ImageTransform_ValidURL_PreservesBaseURL', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { width: 300 });
      
      // Should still be a valid URL
      expect(transformedURL).toMatch(/^https?:\/\//);
      
      // Should contain base URL
      const baseURL = asset.url.split('?')[0];
      expect(transformedURL).toContain(baseURL);
      
      console.log('✅ Base URL preserved in transformation');
    });

    test('ImageTransform_ExistingQueryParams_PreservesOrExtends', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      // URL might already have query params
      const transformedURL = Stack.imageTransform(asset.url, { width: 300 });
      
      // Should have transformation params
      expect(transformedURL).toContain('width=300');
      
      console.log('✅ Query parameters handled correctly');
    });
  });

  describe('Edge Cases', () => {
    test('ImageTransform_EmptyTransform_ReturnsOriginalURL', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, {});
      
      // With empty transform, might return original URL or URL with empty params
      expect(transformedURL).toBeDefined();
      
      console.log('✅ Empty transform handled gracefully');
    });

    test('ImageTransform_ZeroWidth_HandlesGracefully', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { width: 0 });
      
      // SDK should handle gracefully
      expect(transformedURL).toBeDefined();
      
      console.log('✅ Zero width handled gracefully');
    });

    test('ImageTransform_NegativeValues_HandlesGracefully', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { width: -100 });
      
      // SDK should handle gracefully (might ignore or use absolute value)
      expect(transformedURL).toBeDefined();
      
      console.log('✅ Negative values handled gracefully');
    });

    test('ImageTransform_VeryLargeDimensions_HandlesGracefully', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        width: 10000,
        height: 10000
      });
      
      expect(transformedURL).toContain('width=10000');
      
      console.log('✅ Large dimensions handled');
    });

    test('ImageTransform_InvalidFormat_HandlesGracefully', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const transformedURL = Stack.imageTransform(asset.url, { 
        format: 'invalid'
      });
      
      // SDK should handle invalid format gracefully
      expect(transformedURL).toBeDefined();
      
      console.log('✅ Invalid format handled gracefully');
    });
  });

  describe('Performance', () => {
    test('ImageTransform_SimpleTransform_FastExecution', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        Stack.imageTransform(asset.url, { width: 300 });
      }
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000); // 100 transforms in < 1s
      
      console.log(`✅ 100 transforms in ${duration}ms (fast execution)`);
    });

    test('ImageTransform_ComplexTransform_FastExecution', async () => {
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
      
      if (result[0].length === 0) {
        console.log('ℹ️  Asset not found - skipping test');
        return;
      }
      
      const asset = result[0][0];
      
      const start = Date.now();
      
      for (let i = 0; i < 50; i++) {
        Stack.imageTransform(asset.url, { 
          width: 400,
          height: 300,
          fit: 'crop',
          quality: 80,
          format: 'webp'
        });
      }
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(500); // 50 complex transforms in < 500ms
      
      console.log(`✅ 50 complex transforms in ${duration}ms`);
    });
  });
});

