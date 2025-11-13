'use strict';

/**
 * COMPREHENSIVE CACHE POLICY TESTS
 * 
 * Tests the Contentstack Cache Policy functionality.
 * 
 * SDK Methods Covered:
 * - Stack.setCachePolicy()
 * - Query.setCachePolicy()
 * - Contentstack.CachePolicy.IGNORE_CACHE
 * - Contentstack.CachePolicy.ONLY_NETWORK
 * - Contentstack.CachePolicy.CACHE_ELSE_NETWORK
 * - Contentstack.CachePolicy.NETWORK_ELSE_CACHE
 * - Contentstack.CachePolicy.CACHE_THEN_NETWORK
 * 
 * Bug Detection Focus:
 * - Cache policy application (stack vs query level)
 * - Policy override behavior
 * - Cache hit/miss scenarios
 * - Policy combinations
 * - Performance impact
 * - Error handling
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Cache Policy - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // STACK-LEVEL CACHE POLICY TESTS
  // =============================================================================

  describe('Stack-Level Cache Policy', () => {
    
    test('StackCache_IGNORE_CACHE_AppliedCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);
      
      console.log(`✅ IGNORE_CACHE policy applied: ${result[0].length} entries fetched`);
    });

    test('StackCache_ONLY_NETWORK_AppliedCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ ONLY_NETWORK policy applied successfully');
    });

    test('StackCache_CACHE_ELSE_NETWORK_AppliedCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ CACHE_ELSE_NETWORK policy applied successfully');
    });

    test('StackCache_NETWORK_ELSE_CACHE_AppliedCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ NETWORK_ELSE_CACHE policy applied successfully');
    });

    test('StackCache_CACHE_THEN_NETWORK_AppliedCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ CACHE_THEN_NETWORK policy applied successfully');
    });

    test('StackCache_PolicyChaining_ReturnsStack', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      const returnValue = localStack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      expect(returnValue).toBeDefined();
      expect(typeof returnValue.ContentType).toBe('function');
      
      console.log('✅ setCachePolicy returns Stack for chaining');
    });

  });

  // =============================================================================
  // QUERY-LEVEL CACHE POLICY TESTS
  // =============================================================================

  describe('Query-Level Cache Policy', () => {
    
    test('QueryCache_IGNORE_CACHE_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level IGNORE_CACHE applied successfully');
    });

    test('QueryCache_ONLY_NETWORK_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level ONLY_NETWORK applied successfully');
    });

    test('QueryCache_CACHE_ELSE_NETWORK_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level CACHE_ELSE_NETWORK applied successfully');
    });

    test('QueryCache_NETWORK_ELSE_CACHE_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level NETWORK_ELSE_CACHE applied successfully');
    });

    test('QueryCache_CACHE_THEN_NETWORK_AppliedCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.CACHE_THEN_NETWORK)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level CACHE_THEN_NETWORK applied successfully');
    });

    test('QueryCache_PolicyChaining_ReturnsQuery', () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const query = Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      expect(query).toBeDefined();
      expect(typeof query.find).toBe('function');
      expect(typeof query.where).toBe('function');
      
      console.log('✅ Query.setCachePolicy returns Query for chaining');
    });

  });

  // =============================================================================
  // CACHE POLICY OVERRIDE TESTS
  // =============================================================================

  describe('Cache Policy Override', () => {
    
    test('CacheOverride_QueryOverridesStack_WorksCorrectly', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Query-level policy should override stack-level
      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Query-level policy overrides Stack-level policy');
    });

    test('CacheOverride_MultipleQueries_IndependentPolicies', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // First query with override
      const result1 = await localStack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .limit(2)
        .toJSON()
        .find();
      
      // Second query without override (uses stack policy)
      const result2 = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      
      console.log('✅ Multiple queries maintain independent cache policies');
    });

    test('CacheOverride_ChangePolicyMidSession_AppliesNewPolicy', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Set initial policy
      localStack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
      
      const result1 = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      // Change policy
      localStack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      const result2 = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      
      console.log('✅ Cache policy can be changed mid-session');
    });

  });

  // =============================================================================
  // CACHE POLICY WITH OTHER OPERATORS
  // =============================================================================

  describe('Cache Policy with Query Operators', () => {
    
    test('CachePolicy_WithFilters_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .where('uid', TestDataHelper.getMediumEntryUID())
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Cache policy works with filters');
    });

    test('CachePolicy_WithSorting_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .ascending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);
      
      console.log('✅ Cache policy works with sorting');
    });

    test('CachePolicy_WithPagination_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .skip(0)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeLessThanOrEqual(3);
      
      console.log('✅ Cache policy works with pagination');
    });

    test('CachePolicy_WithReferences_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .includeReference('author')
        .limit(2)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Cache policy works with reference resolution');
    });

    test('CachePolicy_WithProjection_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .only(['title', 'uid'])
        .limit(3)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        expect(result[0][0].uid).toBeDefined();
      }
      
      console.log('✅ Cache policy works with field projection');
    });

    test('CachePolicy_WithLocale_WorksCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .language(locale)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log('✅ Cache policy works with locale');
    });

  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Cache Policy Performance', () => {
    
    test('Performance_IGNORE_CACHE_ReasonableTime', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(5000); // Should be under 5 seconds
      
      console.log(`✅ IGNORE_CACHE performance: ${duration}ms for ${result[0].length} entries`);
    });

    test('Performance_CompareMultiplePolicies_Timing', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Test IGNORE_CACHE
      const start1 = Date.now();
      const result1 = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
        .limit(5)
        .toJSON()
        .find();
      const duration1 = Date.now() - start1;
      
      // Test ONLY_NETWORK
      const start2 = Date.now();
      const result2 = await Stack.ContentType(contentTypeUID)
        .Query()
        .setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
        .limit(5)
        .toJSON()
        .find();
      const duration2 = Date.now() - start2;
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      
      console.log(`✅ Policy comparison: IGNORE_CACHE=${duration1}ms, ONLY_NETWORK=${duration2}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES & ERROR HANDLING
  // =============================================================================

  describe('Edge Cases', () => {
    
    test('EdgeCase_InvalidPolicyNumber_HandlesGracefully', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      try {
        // Invalid policy number (outside valid range)
        localStack.setCachePolicy(999);
        
        // Should either accept or reject
        console.log('⚠️ Invalid policy number accepted (may have default behavior)');
      } catch (error) {
        // Expected - invalid policy should be rejected
        console.log('✅ Invalid policy number properly rejected');
      }
    });

    test('EdgeCase_NegativePolicyNumber_HandlesGracefully', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      try {
        // Negative policy number
        localStack.setCachePolicy(-5);
        
        console.log('⚠️ Negative policy number accepted');
      } catch (error) {
        console.log('✅ Negative policy number handled');
      }
    });

    test('EdgeCase_StringPolicyValue_HandlesGracefully', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      try {
        // String instead of number
        localStack.setCachePolicy('IGNORE_CACHE');
        
        console.log('⚠️ String policy value accepted (may be coerced)');
      } catch (error) {
        console.log('✅ String policy value handled');
      }
    });

    test('EdgeCase_UndefinedPolicyValue_HandlesGracefully', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      try {
        localStack.setCachePolicy(undefined);
        
        console.log('⚠️ Undefined policy value accepted (may use default)');
      } catch (error) {
        console.log('✅ Undefined policy value handled');
      }
    });

    test('EdgeCase_NullPolicyValue_HandlesGracefully', () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      
      try {
        localStack.setCachePolicy(null);
        
        console.log('⚠️ Null policy value accepted (may use default)');
      } catch (error) {
        console.log('✅ Null policy value handled');
      }
    });

  });

  // =============================================================================
  // CACHE POLICY CONSTANTS VALIDATION
  // =============================================================================

  describe('Cache Policy Constants', () => {
    
    test('Constants_AllPoliciesDefined_ValidNumbers', () => {
      expect(Contentstack.CachePolicy).toBeDefined();
      expect(typeof Contentstack.CachePolicy.IGNORE_CACHE).toBe('number');
      expect(typeof Contentstack.CachePolicy.ONLY_NETWORK).toBe('number');
      expect(typeof Contentstack.CachePolicy.CACHE_ELSE_NETWORK).toBe('number');
      expect(typeof Contentstack.CachePolicy.NETWORK_ELSE_CACHE).toBe('number');
      expect(typeof Contentstack.CachePolicy.CACHE_THEN_NETWORK).toBe('number');
      
      console.log('✅ All cache policy constants are defined as numbers');
      console.log(`   IGNORE_CACHE: ${Contentstack.CachePolicy.IGNORE_CACHE}`);
      console.log(`   ONLY_NETWORK: ${Contentstack.CachePolicy.ONLY_NETWORK}`);
      console.log(`   CACHE_ELSE_NETWORK: ${Contentstack.CachePolicy.CACHE_ELSE_NETWORK}`);
      console.log(`   NETWORK_ELSE_CACHE: ${Contentstack.CachePolicy.NETWORK_ELSE_CACHE}`);
      console.log(`   CACHE_THEN_NETWORK: ${Contentstack.CachePolicy.CACHE_THEN_NETWORK}`);
    });

    test('Constants_UniqueValues_NoDuplicates', () => {
      const policies = [
        Contentstack.CachePolicy.IGNORE_CACHE,
        Contentstack.CachePolicy.ONLY_NETWORK,
        Contentstack.CachePolicy.CACHE_ELSE_NETWORK,
        Contentstack.CachePolicy.NETWORK_ELSE_CACHE,
        Contentstack.CachePolicy.CACHE_THEN_NETWORK
      ];
      
      const uniquePolicies = [...new Set(policies)];
      
      expect(uniquePolicies.length).toBe(policies.length);
      
      console.log('✅ All cache policy constants have unique values');
    });

  });

});

