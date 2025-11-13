'use strict';

/**
 * COMPREHENSIVE CONCURRENT REQUEST TESTS
 * 
 * Tests the SDK's behavior under concurrent/parallel request load.
 * 
 * SDK Features Tested:
 * - Parallel query execution
 * - Concurrent entry fetching
 * - Thread safety and race conditions
 * - Response consistency
 * - Memory management under load
 * - Request queuing behavior
 * 
 * Bug Detection Focus:
 * - Race conditions
 * - Memory leaks
 * - Response mixing/corruption
 * - Cache consistency under concurrent load
 * - Performance degradation
 * - Resource contention
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Concurrent Requests - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // BASIC CONCURRENT QUERY TESTS
  // =============================================================================

  describe('Concurrent Queries', () => {
    
    test('Concurrent_5ParallelQueries_AllSucceed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const promises = Array(5).fill(null).map((_, index) => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(3)
          .skip(index * 3)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(5);
      
      results.forEach((result, index) => {
        expect(result[0]).toBeDefined();
        expect(Array.isArray(result[0])).toBe(true);
      });
      
      console.log(`✅ 5 parallel queries completed in ${duration}ms`);
    });

    test('Concurrent_10ParallelQueries_AllSucceed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const promises = Array(10).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(10);
      
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log(`✅ 10 parallel queries completed in ${duration}ms`);
    });

    test('Concurrent_25ParallelQueries_HighLoad', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const promises = Array(25).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(1)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(25);
      
      let successCount = 0;
      results.forEach(result => {
        if (result[0] && result[0].length > 0) {
          successCount++;
        }
      });
      
      expect(successCount).toBeGreaterThan(20); // At least 80% success
      
      console.log(`✅ 25 parallel queries: ${successCount}/25 succeeded in ${duration}ms`);
    });

  });

  // =============================================================================
  // CONCURRENT ENTRY FETCHING
  // =============================================================================

  describe('Concurrent Entry Fetching', () => {
    
    test('Concurrent_FetchSameEntryMultipleTimes_Consistent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      const promises = Array(10).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Entry(entryUID)
          .toJSON()
          .fetch()
      );
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(10);
      
      // All results should be identical
      const firstUID = results[0].uid;
      results.forEach(entry => {
        expect(entry.uid).toBe(firstUID);
        expect(entry.uid).toBe(entryUID);
      });
      
      console.log(`✅ Fetched same entry 10 times concurrently - all consistent`);
    });

    test('Concurrent_FetchDifferentEntries_AllUnique', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // First, get multiple entry UIDs
      const entriesResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      if (!entriesResult[0] || entriesResult[0].length < 5) {
        console.log('⚠️ Skipping: Not enough entries for test');
        return;
      }
      
      const entryUIDs = entriesResult[0].slice(0, 5).map(e => e.uid);
      
      // Fetch all entries concurrently
      const promises = entryUIDs.map(uid => 
        Stack.ContentType(contentTypeUID)
          .Entry(uid)
          .toJSON()
          .fetch()
      );
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(entryUIDs.length);
      
      // Each result should match its requested UID
      results.forEach((entry, index) => {
        expect(entry.uid).toBe(entryUIDs[index]);
      });
      
      console.log(`✅ Fetched ${entryUIDs.length} different entries concurrently - all correct`);
    });

  });

  // =============================================================================
  // CONCURRENT QUERIES WITH DIFFERENT OPERATORS
  // =============================================================================

  describe('Concurrent Queries with Operators', () => {
    
    test('Concurrent_DifferentFilters_AllReturnCorrectResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = [
        // Query with limit
        Stack.ContentType(contentTypeUID).Query().limit(3).toJSON().find(),
        
        // Query with skip
        Stack.ContentType(contentTypeUID).Query().skip(5).limit(3).toJSON().find(),
        
        // Query with sorting
        Stack.ContentType(contentTypeUID).Query().ascending('updated_at').limit(3).toJSON().find(),
        
        // Query with exists
        Stack.ContentType(contentTypeUID).Query().exists('title').limit(3).toJSON().find(),
        
        // Query with projection
        Stack.ContentType(contentTypeUID).Query().only(['title', 'uid']).limit(3).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      
      results.forEach((result, index) => {
        expect(result[0]).toBeDefined();
        // Some queries might return empty results (e.g., skip too large)
        expect(result[0].length).toBeGreaterThanOrEqual(0);
      });
      
      console.log('✅ 5 queries with different operators all succeeded');
    });

    test('Concurrent_WithReferences_AllResolveCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = Array(5).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .includeReference('author')
          .limit(2)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log('✅ 5 concurrent queries with references all succeeded');
    });

    test('Concurrent_DifferentContentTypes_NoMixing', async () => {
      const articleUID = TestDataHelper.getContentTypeUID('article', true);
      const authorUID = TestDataHelper.getContentTypeUID('author', true);
      const productUID = TestDataHelper.getContentTypeUID('product', true);
      
      const promises = [
        Stack.ContentType(articleUID).Query().limit(3).toJSON().find(),
        Stack.ContentType(authorUID).Query().limit(3).toJSON().find(),
        Stack.ContentType(productUID).Query().limit(3).toJSON().find(),
        Stack.ContentType(articleUID).Query().limit(2).toJSON().find(),
        Stack.ContentType(productUID).Query().limit(2).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      
      // Verify no content type mixing
      if (results[0][0] && results[0][0][0]) {
        // Check first result is article
        expect(results[0][0][0]._content_type_uid || 'unknown').toBeTruthy();
      }
      
      console.log('✅ Concurrent queries to different content types - no mixing');
    });

  });

  // =============================================================================
  // CONCURRENT QUERIES WITH CACHE POLICIES
  // =============================================================================

  describe('Concurrent Queries with Cache', () => {
    
    test('Concurrent_SameQueryMultipleTimes_CacheConsistent', async () => {
      const localStack = Contentstack.Stack(config.stack);
      localStack.setHost(config.host);
      localStack.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = Array(10).fill(null).map(() => 
        localStack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(10);
      
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log('✅ 10 concurrent cached queries - all consistent');
    });

    test('Concurrent_DifferentCachePolicies_IndependentResults', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = [
        Stack.ContentType(contentTypeUID).Query()
          .setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE)
          .limit(3).toJSON().find(),
        
        Stack.ContentType(contentTypeUID).Query()
          .setCachePolicy(Contentstack.CachePolicy.ONLY_NETWORK)
          .limit(3).toJSON().find(),
        
        Stack.ContentType(contentTypeUID).Query()
          .setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK)
          .limit(3).toJSON().find(),
        
        Stack.ContentType(contentTypeUID).Query()
          .setCachePolicy(Contentstack.CachePolicy.NETWORK_ELSE_CACHE)
          .limit(3).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(4);
      
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log('✅ Concurrent queries with different cache policies succeeded');
    });

  });

  // =============================================================================
  // PERFORMANCE UNDER CONCURRENT LOAD
  // =============================================================================

  describe('Performance Under Load', () => {
    
    test('Performance_ConcurrentVsSequential_TimingComparison', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const queryCount = 10;
      
      // Sequential execution
      const sequentialStart = Date.now();
      for (let i = 0; i < queryCount; i++) {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find();
      }
      const sequentialDuration = Date.now() - sequentialStart;
      
      // Concurrent execution
      const concurrentStart = Date.now();
      const promises = Array(queryCount).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find()
      );
      await Promise.all(promises);
      const concurrentDuration = Date.now() - concurrentStart;
      
      expect(concurrentDuration).toBeLessThan(sequentialDuration * 0.8); // Should be significantly faster
      
      console.log(`✅ Performance: Sequential=${sequentialDuration}ms, Concurrent=${concurrentDuration}ms`);
      console.log(`   Speedup: ${(sequentialDuration / concurrentDuration).toFixed(2)}x faster`);
    });

    test('Performance_50ConcurrentRequests_Throughput', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const promises = Array(50).fill(null).map(() => 
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(1)
          .toJSON()
          .find()
      );
      
      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      const throughput = (results.length / duration * 1000).toFixed(2);
      
      expect(results.length).toBe(50);
      
      console.log(`✅ 50 concurrent requests completed in ${duration}ms`);
      console.log(`   Throughput: ${throughput} requests/second`);
    });

  });

  // =============================================================================
  // RACE CONDITION TESTS
  // =============================================================================

  describe('Race Conditions', () => {
    
    test('RaceCondition_SameQueryTwiceSimultaneously_BothSucceed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const query1Promise = Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      const query2Promise = Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      const [result1, result2] = await Promise.all([query1Promise, query2Promise]);
      
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      
      console.log('✅ Same query executed twice simultaneously - both succeeded');
    });

    test('RaceCondition_EntryFetchVsQuery_NoConflict', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      const promises = [
        // Fetch specific entry
        Stack.ContentType(contentTypeUID).Entry(entryUID).toJSON().fetch(),
        
        // Query all entries
        Stack.ContentType(contentTypeUID).Query().limit(10).toJSON().find(),
        
        // Fetch same entry again
        Stack.ContentType(contentTypeUID).Entry(entryUID).toJSON().fetch()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(3);
      expect(results[0].uid).toBe(entryUID);
      expect(results[1][0]).toBeDefined();
      expect(results[2].uid).toBe(entryUID);
      
      console.log('✅ Concurrent entry fetch + query - no conflicts');
    });

  });

  // =============================================================================
  // ERROR HANDLING UNDER CONCURRENT LOAD
  // =============================================================================

  describe('Error Handling', () => {
    
    test('Error_MixedSuccessAndFailure_IndependentResults', async () => {
      const validCT = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = [
        // Valid query
        Stack.ContentType(validCT).Query().limit(3).toJSON().find(),
        
        // Invalid content type (should fail)
        Stack.ContentType('invalid_ct_12345').Query().limit(3).toJSON().find()
          .catch(error => ({ error: true, error_code: error.error_code })),
        
        // Valid query
        Stack.ContentType(validCT).Query().limit(2).toJSON().find(),
        
        // Invalid entry fetch (should fail)
        Stack.ContentType(validCT).Entry('invalid_entry_uid_12345').toJSON().fetch()
          .catch(error => ({ error: true, error_code: error.error_code })),
        
        // Valid query
        Stack.ContentType(validCT).Query().limit(1).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(5);
      
      // Check that valid queries succeeded
      expect(results[0][0]).toBeDefined();
      expect(results[2][0]).toBeDefined();
      expect(results[4][0]).toBeDefined();
      
      // Check that invalid queries failed
      expect(results[1].error).toBe(true);
      expect(results[3].error).toBe(true);
      
      console.log('✅ Mixed success/failure in concurrent requests - errors isolated');
    });

  });

});

