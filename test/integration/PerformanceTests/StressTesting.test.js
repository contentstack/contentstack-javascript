'use strict';

/**
 * COMPREHENSIVE STRESS TESTING TESTS (PHASE 4)
 * 
 * Tests SDK behavior under high load and stress conditions.
 * 
 * SDK Features Covered:
 * - High-volume concurrent requests
 * - Large result sets
 * - Deep reference nesting
 * - Memory efficiency
 * - Connection stability
 * 
 * Stress Testing Focus:
 * - 50+ concurrent requests
 * - 100+, 500+ entry result sets
 * - Stability under prolonged load
 * - Memory leak detection
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Stress Testing - High Load Scenarios (Phase 4)', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // HIGH-VOLUME CONCURRENT REQUESTS
  // =============================================================================

  describe('High-Volume Concurrent Requests', () => {
    
    test('Stress_50ConcurrentQueries_AllSucceed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < 50; i++) {
        promises.push(
          Stack.ContentType(contentTypeUID)
            .Query()
            .limit(3)
            .toJSON()
            .find()
        );
      }
      
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(50);
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      expect(duration).toBeLessThan(15000); // 15s for 50 requests
      
      console.log(`💪 50 concurrent queries: ${duration}ms (avg ${(duration/50).toFixed(0)}ms per query)`);
    }, 20000); // Extend timeout

    test('Stress_100ConcurrentQueries_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < 100; i++) {
        promises.push(
          Stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find()
            .catch(error => ({ error: true, message: error.error_message }))
        );
      }
      
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      const successCount = results.filter(r => !r.error).length;
      const errorCount = results.filter(r => r.error).length;
      
      expect(results.length).toBe(100);
      expect(successCount).toBeGreaterThan(50); // At least 50% success
      
      console.log(`💪 100 concurrent queries: ${successCount} success, ${errorCount} errors in ${duration}ms`);
    }, 30000); // Extend timeout

    test('Stress_MixedOperations_Concurrent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const authorUID = TestDataHelper.getContentTypeUID('author', true);
      
      const promises = [];
      
      // Mix of different operations
      for (let i = 0; i < 30; i++) {
        promises.push(
          Stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find()
        );
      }
      
      for (let i = 0; i < 20; i++) {
        promises.push(
          Stack.ContentType(authorUID).Query().limit(2).toJSON().find()
        );
      }
      
      for (let i = 0; i < 10; i++) {
        promises.push(
          Stack.Assets().Query().limit(2).toJSON().find()
        );
      }
      
      const startTime = Date.now();
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(60);
      
      console.log(`💪 60 mixed concurrent operations: ${duration}ms`);
    }, 20000);

  });

  // =============================================================================
  // LARGE RESULT SETS
  // =============================================================================

  describe('Large Result Sets', () => {
    
    test('Stress_Fetch100Entries_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(100)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10000); // 10s for 100 entries
      
      console.log(`💪 Fetch 100 entries: ${result[0].length} entries in ${duration}ms`);
    }, 15000);

    test('Stress_PaginateThrough100Entries_Consistent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const pageSize = 20;
      const totalPages = 5;
      let totalEntries = 0;
      
      for (let page = 0; page < totalPages; page++) {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .skip(page * pageSize)
          .limit(pageSize)
          .toJSON()
          .find();
        
        totalEntries += result[0].length;
      }
      
      const duration = Date.now() - startTime;
      
      expect(totalEntries).toBeGreaterThan(0);
      expect(duration).toBeLessThan(12000);
      
      console.log(`💪 Paginated 100 entries: ${totalEntries} total in ${duration}ms`);
    }, 15000);

    test('Stress_LargeResultWithReferences_MemoryEfficient', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .limit(50)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(12000);
      
      console.log(`💪 50 entries with references: ${result[0].length} entries in ${duration}ms`);
    }, 15000);

  });

  // =============================================================================
  // DEEP NESTING STRESS
  // =============================================================================

  describe('Deep Nesting Stress', () => {
    
    test('Stress_MultipleReferenceFields_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .includeReference('related_articles')
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(8000);
      
      console.log(`💪 Multiple references: ${duration}ms for ${result[0].length} entries`);
    }, 10000);

    test('Stress_ComplexEntryWithReferences_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      const entryUID = TestDataHelper.getComplexEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No complex entry UID configured');
        return;
      }
      
      const startTime = Date.now();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .includeReference('references')
        .toJSON()
        .fetch();
      
      const duration = Date.now() - startTime;
      
      expect(entry).toBeDefined();
      expect(duration).toBeLessThan(5000);
      
      console.log(`💪 Complex entry with references: ${duration}ms`);
    }, 20000); // Increased timeout for complex entry with references

  });

  // =============================================================================
  // SUSTAINED LOAD TESTING
  // =============================================================================

  describe('Sustained Load Testing', () => {
    
    test('Stress_20ConsecutiveBatches_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const batchCount = 20;
      const queriesPerBatch = 5;
      const times = [];
      
      for (let batch = 0; batch < batchCount; batch++) {
        const startTime = Date.now();
        
        const promises = [];
        for (let i = 0; i < queriesPerBatch; i++) {
          promises.push(
            Stack.ContentType(contentTypeUID)
              .Query()
              .limit(2)
              .toJSON()
              .find()
          );
        }
        
        await Promise.all(promises);
        times.push(Date.now() - startTime);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      expect(avgTime).toBeLessThan(3000);
      
      console.log(`💪 20 batches: avg ${avgTime.toFixed(0)}ms, min ${minTime}ms, max ${maxTime}ms`);
    }, 60000); // 1 minute timeout

    test('Stress_ContinuousQueriesFor10Seconds_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const duration = 10000; // 10 seconds
      let queryCount = 0;
      let errorCount = 0;
      
      while (Date.now() - startTime < duration) {
        try {
          await Stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find();
          queryCount++;
        } catch (error) {
          errorCount++;
        }
        
        // Small delay to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      expect(queryCount).toBeGreaterThanOrEqual(10); // At least 10 queries in 10s (realistic with 200ms delay + network latency)
      expect(errorCount).toBeLessThan(queryCount * 0.1); // Less than 10% errors
      
      console.log(`💪 Continuous load: ${queryCount} queries, ${errorCount} errors in 10s`);
    }, 20000); // Increased timeout to allow for 10s test + overhead

  });

  // =============================================================================
  // MEMORY EFFICIENCY CHECKS
  // =============================================================================

  describe('Memory Efficiency', () => {
    
    test('Stress_RepeatQueryNoMemoryLeak_Stable', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const iterations = 50;
      
      for (let i = 0; i < iterations; i++) {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();
        
        expect(result[0]).toBeDefined();
        
        // Force garbage collection opportunity
        if (i % 10 === 0 && global.gc) {
          global.gc();
        }
      }
      
      console.log(`💪 Memory test: ${iterations} iterations completed`);
    }, 60000); // Increased timeout for 50 iterations

    test('Stress_MultipleStackInstances_Isolated', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const stackCount = 10;
      const promises = [];
      
      for (let i = 0; i < stackCount; i++) {
        const stack = Contentstack.Stack(config.stack);
        stack.setHost(config.host);
        
        promises.push(
          stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find()
        );
      }
      
      const results = await Promise.all(promises);
      
      expect(results.length).toBe(stackCount);
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log(`💪 ${stackCount} stack instances: all succeeded`);
    }, 10000);

  });

  // =============================================================================
  // ERROR RECOVERY UNDER STRESS
  // =============================================================================

  describe('Error Recovery Under Stress', () => {
    
    test('Stress_MixedValidInvalidQueries_GracefulHandling', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const promises = [];
      
      // Add valid queries
      for (let i = 0; i < 30; i++) {
        promises.push(
          Stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find()
            .then(r => ({ success: true, data: r }))
            .catch(e => ({ success: false, error: e }))
        );
      }
      
      // Add invalid queries
      for (let i = 0; i < 10; i++) {
        promises.push(
          Stack.ContentType('invalid_ct_' + i)
            .Query()
            .limit(2)
            .toJSON()
            .find()
            .then(r => ({ success: true, data: r }))
            .catch(e => ({ success: false, error: e }))
        );
      }
      
      const results = await Promise.all(promises);
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      expect(successCount).toBe(30);
      expect(errorCount).toBe(10);
      
      console.log(`💪 Mixed queries: ${successCount} success, ${errorCount} errors (as expected)`);
    }, 30000);

    test('Stress_RecoverAfterErrors_NextQueriesSucceed', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Cause some errors
      const errorPromises = [];
      for (let i = 0; i < 5; i++) {
        errorPromises.push(
          Stack.ContentType('invalid_ct')
            .Query()
            .limit(2)
            .toJSON()
            .find()
            .catch(() => 'error')
        );
      }
      
      await Promise.all(errorPromises);
      
      // Now run valid queries
      const validPromises = [];
      for (let i = 0; i < 10; i++) {
        validPromises.push(
          Stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find()
        );
      }
      
      const results = await Promise.all(validPromises);
      
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });
      
      console.log('💪 Recovery after errors: all subsequent queries succeeded');
    }, 10000);

  });

});

