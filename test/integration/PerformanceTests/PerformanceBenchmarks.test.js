'use strict';

/**
 * COMPREHENSIVE PERFORMANCE BENCHMARKING TESTS (PHASE 4)
 * 
 * Tests SDK performance characteristics and establishes baselines.
 * 
 * SDK Features Covered:
 * - Query response times
 * - Asset loading performance
 * - Reference resolution speed
 * - Pagination performance
 * - Cache performance impact
 * 
 * Performance Focus:
 * - Response time baselines (< 2s for simple, < 5s for complex)
 * - Throughput measurements
 * - Memory efficiency
 * - Cache effectiveness
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Performance Benchmarking - Comprehensive Tests (Phase 4)', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // QUERY PERFORMANCE BENCHMARKS
  // =============================================================================

  describe('Query Performance Baselines', () => {
    
    test('Perf_SimpleQuery_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000); // 2 second baseline
      
      console.log(`⚡ Simple query performance: ${duration}ms (baseline: <2000ms)`);
    });

    test('Perf_QueryWithFilter_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000);
      
      console.log(`⚡ Filtered query performance: ${duration}ms`);
    });

    test('Perf_QueryWithSorting_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .ascending('updated_at')
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000);
      
      console.log(`⚡ Sorted query performance: ${duration}ms`);
    });

    test('Perf_QueryWithPagination_ConsistentTiming', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const times = [];
      
      for (let page = 0; page < 5; page++) {
        const startTime = Date.now();
        
        await Stack.ContentType(contentTypeUID)
          .Query()
          .skip(page * 10)
          .limit(10)
          .toJSON()
          .find();
        
        times.push(Date.now() - startTime);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      const variance = maxTime - minTime;
      
      expect(avgTime).toBeLessThan(5000);
      expect(variance).toBeLessThan(5000); // Consistent performance
      
      console.log(`⚡ Pagination performance: avg ${avgTime.toFixed(0)}ms, variance ${variance}ms`);
    });

    test('Perf_ComplexQuery_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .language(locale)
        .ascending('updated_at')
        .includeCount()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(3000); // 3s for complex
      
      console.log(`⚡ Complex query performance: ${duration}ms (baseline: <3000ms)`);
    });

  });

  // =============================================================================
  // REFERENCE RESOLUTION PERFORMANCE
  // =============================================================================

  describe('Reference Resolution Performance', () => {
    
    test('Perf_SingleReference_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .limit(5)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(3000);
      
      console.log(`⚡ Single reference resolution: ${duration}ms`);
    });

    test('Perf_MultipleReferences_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .includeReference('related_articles')
        .limit(3)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(4000);
      
      console.log(`⚡ Multiple reference resolution: ${duration}ms`);
    });

    test('Perf_ReferenceVsNoReference_Comparison', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Without reference
      const startTime1 = Date.now();
      const result1 = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();
      const duration1 = Date.now() - startTime1;
      
      // With reference
      const startTime2 = Date.now();
      const result2 = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .limit(10)
        .toJSON()
        .find();
      const duration2 = Date.now() - startTime2;
      
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      
      const overhead = duration2 - duration1;
      
      console.log(`⚡ Reference overhead: ${duration1}ms → ${duration2}ms (+${overhead}ms)`);
    });

  });

  // =============================================================================
  // ASSET LOADING PERFORMANCE
  // =============================================================================

  describe('Asset Loading Performance', () => {
    
    test('Perf_AssetQuery_UnderBaseline', async () => {
      const startTime = Date.now();
      
      const result = await Stack.Assets()
        .Query()
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000);
      
      console.log(`⚡ Asset query performance: ${duration}ms`);
    });

    test('Perf_AssetWithFilters_UnderBaseline', async () => {
      const startTime = Date.now();
      
      const result = await Stack.Assets()
        .Query()
        .exists('filename')
        .limit(10)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000);
      
      console.log(`⚡ Filtered asset query: ${duration}ms`);
    });

    test('Perf_ImageTransform_Fast', async () => {
      const imageUID = TestDataHelper.getImageAssetUID();
      
      if (!imageUID) {
        console.log('⚠️ Skipping: No image UID configured');
        return;
      }
      
      const startTime = Date.now();
      
      const assets = await Stack.Assets()
        .Query()
        .where('uid', imageUID)
        .toJSON()
        .find();
      
      if (assets[0].length > 0) {
        const transformedURL = Stack.imageTransform(assets[0][0].url, {
          width: 300,
          height: 300,
          fit: 'crop'
        });
        
        expect(transformedURL).toBeDefined();
      }
      
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(1000); // Transform should be instant
      
      console.log(`⚡ Image transform: ${duration}ms`);
    });

  });

  // =============================================================================
  // CACHE PERFORMANCE IMPACT
  // =============================================================================

  describe('Cache Performance Impact', () => {
    
    test('Perf_WithCache_FasterOnSecondRequest', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const stackWithCache = Contentstack.Stack(config.stack);
      stackWithCache.setHost(config.host);
      stackWithCache.setCachePolicy(Contentstack.CachePolicy.CACHE_ELSE_NETWORK);
      
      // First request (cold)
      const startTime1 = Date.now();
      await stackWithCache.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      const duration1 = Date.now() - startTime1;
      
      // Second request (potentially cached)
      const startTime2 = Date.now();
      await stackWithCache.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      const duration2 = Date.now() - startTime2;
      
      console.log(`⚡ Cache impact: ${duration1}ms (cold) vs ${duration2}ms (warm)`);
      
      // Second request should be faster or equal
      expect(duration2).toBeLessThanOrEqual(duration1 + 100); // Allow small variance
    });

    test('Perf_IgnoreCache_ConsistentTiming', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const stackNoCache = Contentstack.Stack(config.stack);
      stackNoCache.setHost(config.host);
      stackNoCache.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      const times = [];
      
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        await stackNoCache.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();
        times.push(Date.now() - startTime);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      console.log(`⚡ No cache timing: ${times.map(t => `${t}ms`).join(', ')} (avg: ${avgTime.toFixed(0)}ms)`);
      
      expect(avgTime).toBeLessThan(2000);
    });

  });

  // =============================================================================
  // ENTRY FETCH PERFORMANCE
  // =============================================================================

  describe('Entry Fetch Performance', () => {
    
    test('Perf_SingleEntryFetch_Fast', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      const startTime = Date.now();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .toJSON()
        .fetch();
      
      const duration = Date.now() - startTime;
      
      expect(entry).toBeDefined();
      expect(duration).toBeLessThan(1500); // Single entry should be fast
      
      console.log(`⚡ Single entry fetch: ${duration}ms`);
    });

    test('Perf_EntryWithReferences_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      const startTime = Date.now();
      
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .includeReference('author')
        .toJSON()
        .fetch();
      
      const duration = Date.now() - startTime;
      
      expect(entry).toBeDefined();
      expect(duration).toBeLessThan(2500);
      
      console.log(`⚡ Entry with references: ${duration}ms`);
    });

  });

  // =============================================================================
  // CONTENT TYPE OPERATIONS PERFORMANCE
  // =============================================================================

  describe('Content Type Operations Performance', () => {
    
    test('Perf_GetAllContentTypes_UnderBaseline', async () => {
      const startTime = Date.now();
      
      const contentTypes = await Stack.getContentTypes();
      
      const duration = Date.now() - startTime;
      
      expect(contentTypes).toBeDefined();
      expect(duration).toBeLessThan(3000);
      
      console.log(`⚡ Get all content types: ${duration}ms (${contentTypes.length} types)`);
    });

    test('Perf_ContentTypeQuery_UnderBaseline', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(1)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(1500);
      
      console.log(`⚡ Content type query: ${duration}ms`);
    });

  });

  // =============================================================================
  // THROUGHPUT MEASUREMENTS
  // =============================================================================

  describe('Throughput Measurements', () => {
    
    test('Perf_SequentialQueries_Throughput', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const queryCount = 10;
      
      for (let i = 0; i < queryCount; i++) {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find();
      }
      
      const duration = Date.now() - startTime;
      const throughput = (queryCount / duration) * 1000; // queries per second
      
      expect(throughput).toBeGreaterThan(0.5); // At least 0.5 queries/sec
      
      console.log(`⚡ Sequential throughput: ${throughput.toFixed(2)} queries/sec (${duration}ms for ${queryCount} queries)`);
    });

    test('Perf_ParallelQueries_Throughput', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      const queryCount = 10;
      
      const promises = [];
      for (let i = 0; i < queryCount; i++) {
        promises.push(
          Stack.ContentType(contentTypeUID)
            .Query()
            .limit(2)
            .toJSON()
            .find()
        );
      }
      
      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      const throughput = (queryCount / duration) * 1000;
      
      expect(throughput).toBeGreaterThan(1); // Parallel should be faster
      
      console.log(`⚡ Parallel throughput: ${throughput.toFixed(2)} queries/sec (${duration}ms for ${queryCount} queries)`);
    });

  });

});

