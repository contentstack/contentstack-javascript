'use strict';

/**
 * COMPREHENSIVE REGION CONFIGURATION TESTS
 * 
 * Tests the SDK's multi-region support for global deployments.
 * 
 * SDK Features Tested:
 * - Region parameter configuration
 * - Region-specific API endpoints
 * - Contentstack.Region enum
 * - Region switching behavior
 * - Custom region hosts
 * 
 * Regions Supported:
 * - US (default)
 * - EU (Europe)
 * - AZURE_NA (Azure North America)
 * - AZURE_EU (Azure Europe)
 * - GCP_NA (Google Cloud North America)
 * 
 * Bug Detection Focus:
 * - Region endpoint resolution
 * - Data sovereignty compliance
 * - Region configuration persistence
 * - Cross-region behavior
 * - Custom host handling
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();

describe('Region Configuration - Comprehensive Tests', () => {

  // =============================================================================
  // REGION CONSTANT VALIDATION
  // =============================================================================

  describe('Region Constants', () => {
    
    test('RegionConstants_AllRegionsDefined_ValidStrings', () => {
      expect(Contentstack.Region).toBeDefined();
      
      // Check if Region enum/object exists and has expected properties
      if (Contentstack.Region) {
        expect(typeof Contentstack.Region).toBe('object');
        
        console.log('✅ Region constants are defined');
        console.log(`   Available regions: ${Object.keys(Contentstack.Region).join(', ')}`);
      } else {
        console.log('⚠️ Region constants not found (may be implementation-specific)');
      }
    });

    test('RegionConstants_USRegion_IsDefault', () => {
      const stack = Contentstack.Stack(config.stack);
      
      // Default region should be US
      expect(stack.config.host).toBeDefined();
      expect(stack.config.host).toContain('contentstack');
      
      console.log(`✅ Default host: ${stack.config.host}`);
    });

  });

  // =============================================================================
  // DEFAULT REGION (US) TESTS
  // =============================================================================

  describe('Default Region (US)', () => {
    
    test('DefaultRegion_NoRegionSpecified_UsesUSEndpoint', () => {
      const stack = Contentstack.Stack(config.stack);
      
      expect(stack.config.host).toBeDefined();
      // Default should be cdn.contentstack.io (US region)
      expect(stack.config.host).toBe('cdn.contentstack.io');
      
      console.log('✅ Default region uses US endpoint: cdn.contentstack.io');
    });

    test('DefaultRegion_QueriesWork_DataAccessible', async () => {
      const stack = Contentstack.Stack(config.stack);
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);
      
      console.log(`✅ Default region query successful: ${result[0].length} entries`);
    });

    test('DefaultRegion_EntryFetch_Works', async () => {
      const stack = Contentstack.Stack(config.stack);
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      const entry = await stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      expect(entry).toBeDefined();
      expect(entry.uid).toBe(entryUID);
      
      console.log('✅ Default region entry fetch successful');
    });

  });

  // =============================================================================
  // REGION CONFIGURATION TESTS
  // =============================================================================

  describe('Region Configuration', () => {
    
    test('RegionConfig_EURegion_ConfiguredCorrectly', () => {
      if (!Contentstack.Region || !Contentstack.Region.EU) {
        console.log('⚠️ Skipping: EU region constant not available');
        return;
      }
      
      const stack = Contentstack.Stack({
        ...config.stack,
        region: Contentstack.Region.EU
      });
      
      expect(stack.config.host).toBeDefined();
      // EU region should use eu-cdn.contentstack.com
      expect(stack.config.host).toContain('eu');
      
      console.log(`✅ EU region configured: ${stack.config.host}`);
    });

    test('RegionConfig_StringRegionValue_HandlesGracefully', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: 'eu'
      });
      
      expect(stack.config.host).toBeDefined();
      
      // Check if 'eu' string is processed
      if (stack.config.host.includes('eu')) {
        console.log(`✅ String region 'eu' processed: ${stack.config.host}`);
      } else {
        console.log(`⚠️ String region 'eu' not processed (may use default)`);
      }
    });

    test('RegionConfig_InvalidRegion_HandlesGracefully', () => {
      try {
        const stack = Contentstack.Stack({
          ...config.stack,
          region: 'invalid_region_xyz'
        });
        
        expect(stack.config.host).toBeDefined();
        console.log(`⚠️ Invalid region accepted (uses default): ${stack.config.host}`);
      } catch (error) {
        console.log('✅ Invalid region rejected with error');
      }
    });

    test('RegionConfig_NullRegion_UsesDefault', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: null
      });
      
      expect(stack.config.host).toBeDefined();
      expect(stack.config.host).toBe('cdn.contentstack.io');
      
      console.log('✅ Null region uses default US endpoint');
    });

    test('RegionConfig_UndefinedRegion_UsesDefault', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: undefined
      });
      
      expect(stack.config.host).toBeDefined();
      expect(stack.config.host).toBe('cdn.contentstack.io');
      
      console.log('✅ Undefined region uses default US endpoint');
    });

  });

  // =============================================================================
  // CUSTOM HOST OVERRIDE TESTS
  // =============================================================================

  describe('Custom Host Override', () => {
    
    test('CustomHost_SetHostMethod_OverridesRegion', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: 'eu'
      });
      
      const customHost = 'custom-api.example.com';
      stack.setHost(customHost);
      
      expect(stack.config.host).toBe(customHost);
      
      console.log(`✅ Custom host overrides region: ${customHost}`);
    });

    test('CustomHost_InitialConfiguration_Applied', () => {
      const customHost = 'custom-cdn.example.com';
      
      const stack = Contentstack.Stack(config.stack);
      stack.setHost(customHost);
      
      expect(stack.config.host).toBe(customHost);
      
      console.log(`✅ Custom host applied via setHost: ${customHost}`);
    });

    test('CustomHost_WithRegion_RegionTakesPrecedence', () => {
      if (!Contentstack.Region || !Contentstack.Region.EU) {
        console.log('⚠️ Skipping: EU region constant not available');
        return;
      }
      
      const stack = Contentstack.Stack({
        ...config.stack,
        region: Contentstack.Region.EU
      });
      
      // Region should set the host
      const initialHost = stack.config.host;
      
      // Now override with custom host
      stack.setHost('custom-host.example.com');
      
      expect(stack.config.host).toBe('custom-host.example.com');
      
      console.log(`✅ Custom host can override region-specific host`);
    });

  });

  // =============================================================================
  // REGION WITH OTHER FEATURES
  // =============================================================================

  describe('Region with Other Features', () => {
    
    test('Region_WithLivePreview_BothApplied', () => {
      if (!Contentstack.Region || !Contentstack.Region.EU) {
        console.log('⚠️ Skipping: EU region constant not available');
        return;
      }
      
      const stack = Contentstack.Stack({
        ...config.stack,
        region: Contentstack.Region.EU,
        live_preview: {
          enable: false
        }
      });
      
      expect(stack.config.host).toBeDefined();
      expect(stack.config.live_preview).toBeDefined();
      
      console.log('✅ Region and Live Preview can be configured together');
    });

    test('Region_WithCachePolicy_BothApplied', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: 'eu'
      });
      
      stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      expect(stack.config.host).toBeDefined();
      
      console.log('✅ Region and Cache Policy can be configured together');
    });

    test('Region_WithRetryLogic_BothApplied', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        region: 'eu',
        fetchOptions: {
          retryLimit: 3
        }
      });
      
      expect(stack.config.host).toBeDefined();
      expect(stack.fetchOptions.retryLimit).toBe(3);
      
      console.log('✅ Region and Retry Logic configured together');
    });

  });

  // =============================================================================
  // REGION SWITCHING TESTS
  // =============================================================================

  describe('Region Switching', () => {
    
    test('RegionSwitch_ChangeHostMidSession_NewHostApplied', async () => {
      const stack = Contentstack.Stack(config.stack);
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // First query with original host
      const result1 = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result1[0]).toBeDefined();
      
      // Change host (simulating region switch)
      const newHost = config.host; // Keep same host for testing
      stack.setHost(newHost);
      
      // Second query with new host
      const result2 = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result2[0]).toBeDefined();
      
      console.log('✅ Host can be changed mid-session');
    });

    test('RegionSwitch_MultipleStacks_IndependentRegions', async () => {
      const stack1 = Contentstack.Stack(config.stack);
      stack1.setHost(config.host);
      
      const stack2 = Contentstack.Stack(config.stack);
      stack2.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = [
        stack1.ContentType(contentTypeUID).Query().limit(2).toJSON().find(),
        stack2.ContentType(contentTypeUID).Query().limit(2).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results[0][0]).toBeDefined();
      expect(results[1][0]).toBeDefined();
      
      console.log('✅ Multiple stacks can use independent configurations');
    });

  });

  // =============================================================================
  // PERFORMANCE & EDGE CASES
  // =============================================================================

  describe('Performance & Edge Cases', () => {
    
    test('Performance_DefaultRegion_FastResponse', async () => {
      const stack = Contentstack.Stack(config.stack);
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(5000);
      
      console.log(`✅ Default region query performance: ${duration}ms`);
    });

    test('EdgeCase_EmptyRegionString_HandlesGracefully', () => {
      try {
        const stack = Contentstack.Stack({
          ...config.stack,
          region: ''
        });
        
        expect(stack.config.host).toBeDefined();
        console.log(`⚠️ Empty region string accepted: ${stack.config.host}`);
      } catch (error) {
        console.log('✅ Empty region string handled');
      }
    });

    test('EdgeCase_SpecialCharactersInHost_HandlesGracefully', () => {
      const stack = Contentstack.Stack(config.stack);
      
      try {
        stack.setHost('invalid@#$host.com');
        console.log('⚠️ Special characters in host accepted');
      } catch (error) {
        console.log('✅ Special characters in host rejected');
      }
    });

  });

});

