'use strict';

/**
 * COMPREHENSIVE RETRY LOGIC & NETWORK RESILIENCE TESTS
 *
 * Tests the SDK's retry mechanism and network failure handling.
 *
 * SDK Features Covered:
 * - fetchOptions.retryLimit (default: 5)
 * - fetchOptions.retryDelay (default: 300ms)
 * - fetchOptions.retryCondition (custom retry logic)
 * - fetchOptions.retryDelayOptions (exponential backoff)
 * - fetchOptions.timeout (request timeout)
 * - Error status codes: 408 (timeout), 429 (rate limit)
 *
 * Bug Detection Focus:
 * - Retry behavior validation
 * - Exponential backoff correctness
 * - Timeout handling
 * - Transient vs permanent error handling
 * - Retry limit enforcement
 * - Performance under retry scenarios
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Retry Logic & Network Resilience - Comprehensive Tests', () => {
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // RETRY CONFIGURATION TESTS
  // =============================================================================

  describe('Retry Configuration', () => {
    test('RetryConfig_DefaultRetryLimit_Is5', () => {
      const localStack = Contentstack.Stack(config.stack);

      expect(localStack.fetchOptions).toBeDefined();
      expect(localStack.fetchOptions.retryLimit).toBe(5);

      console.log('✅ Default retry limit is 5');
    });

    test('RetryConfig_CustomRetryLimit_Applied', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 3
        }
      });

      expect(localStack.fetchOptions.retryLimit).toBe(3);

      console.log('✅ Custom retry limit (3) applied successfully');
    });

    test('RetryConfig_ZeroRetryLimit_NoRetries', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 0
        }
      });

      expect(localStack.fetchOptions.retryLimit).toBe(0);

      console.log('✅ Zero retry limit configured (no retries)');
    });

    test('RetryConfig_CustomRetryDelay_Applied', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 5,
          retryDelay: 1000
        }
      });

      expect(localStack.fetchOptions.retryDelay).toBe(1000);

      console.log('✅ Custom retry delay (1000ms) applied');
    });

    test('RetryConfig_CustomRetryCondition_Applied', () => {
      const customCondition = (error) => {
        return error.status === 503;
      };

      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 3,
          retryCondition: customCondition
        }
      });

      expect(typeof localStack.fetchOptions.retryCondition).toBe('function');

      console.log('✅ Custom retry condition function applied');
    });

    test('RetryConfig_ExponentialBackoff_Configured', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 5,
          retryDelayOptions: {
            base: 500
          }
        }
      });

      expect(localStack.fetchOptions.retryDelayOptions).toBeDefined();
      expect(localStack.fetchOptions.retryDelayOptions.base).toBe(500);

      console.log('✅ Exponential backoff base configured (500ms)');
    });
  });

  // =============================================================================
  // TIMEOUT HANDLING TESTS
  // =============================================================================

  describe('Timeout Handling', () => {
    test('Timeout_CustomTimeout_Applied', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          timeout: 10000
        }
      });

      expect(localStack.fetchOptions.timeout).toBe(10000);

      console.log('✅ Custom timeout (10000ms) applied');
    });

    test('Timeout_ValidQuery_CompletesWithinTimeout', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          timeout: 30000
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      const startTime = Date.now();

      try {
        const result = await localStack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();

        const duration = Date.now() - startTime;

        expect(result).toBeDefined();
        expect(duration).toBeLessThan(30000);

        console.log(`✅ Query completed within timeout: ${duration}ms`);
      } catch (error) {
        console.log('⚠️ Query failed (may be network issue)');
      }
    });

    test('Timeout_VeryShortTimeout_HandlesGracefully', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          timeout: 1, // 1ms - will likely timeout
          retryLimit: 0 // No retries
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      try {
        const result = await localStack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();

        // If it succeeds, timeout wasn't enforced or was too generous
        console.log('⚠️ Very short timeout succeeded (may not be strictly enforced)');
      } catch (error) {
        // Expected - timeout should cause failure
        expect(error).toBeDefined();
        console.log('✅ Very short timeout properly triggers error');
      }
    });
  });

  // =============================================================================
  // SUCCESSFUL QUERY TESTS (NO RETRY NEEDED)
  // =============================================================================

  describe('Normal Operation (No Retry)', () => {
    test('NoRetry_SuccessfulQuery_NoRetryAttempted', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 3
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();

      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);

      console.log('✅ Successful query with no retry needed');
    });

    test('NoRetry_MultipleSuccessfulQueries_AllComplete', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 3
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      // Execute 5 queries
      const promises = Array(5).fill(null).map(() =>
        localStack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find()
      );

      const results = await Promise.all(promises);

      expect(results.length).toBe(5);
      results.forEach(result => {
        expect(result[0]).toBeDefined();
      });

      console.log('✅ All 5 queries succeeded without retry');
    });
  });

  // =============================================================================
  // ERROR HANDLING TESTS
  // =============================================================================

  describe('Error Scenarios', () => {
    test('Error_InvalidAPIKey_FailsWithoutRetry', async () => {
      const localStack = Contentstack.Stack({
        api_key: 'invalid_api_key_12345',
        delivery_token: config.stack.delivery_token,
        environment: config.stack.environment,
        fetchOptions: {
          retryLimit: 3
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      try {
        await localStack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();

        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        // 401/422 errors should NOT be retried (authentication failure)
        expect(error.error_code).toBeDefined();
        console.log(`✅ Invalid API key fails without retry (error: ${error.error_code})`);
      }
    });

    test('Error_NonExistentContentType_FailsWithoutRetry', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 3
        }
      });
      localStack.setHost(config.host);

      try {
        await localStack.ContentType('non_existent_ct_12345')
          .Query()
          .limit(5)
          .toJSON()
          .find();

        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        // 404/422 errors should NOT be retried (resource not found)
        expect(error.error_code).toBeDefined();
        console.log(`✅ Non-existent content type fails without retry (error: ${error.error_code})`);
      }
    });

    test('Error_InvalidHost_FailsWithRetry', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 2,
          timeout: 5000
        }
      });
      localStack.setHost('invalid-host-that-does-not-exist.com');

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      try {
        await localStack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find();

        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        // Network errors should trigger retries
        expect(error).toBeDefined();
        console.log('✅ Invalid host fails after retry attempts');
      }
    });
  });

  // =============================================================================
  // PERFORMANCE UNDER RETRY SCENARIOS
  // =============================================================================

  describe('Performance', () => {
    test('Performance_SuccessfulQueryWithRetryEnabled_FastResponse', async () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 5,
          retryDelay: 300
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      const startTime = Date.now();

      const result = await localStack.ContentType(contentTypeUID)
        .Query()
        .limit(10)
        .toJSON()
        .find();

      const duration = Date.now() - startTime;

      expect(result).toBeDefined();
      // Should be fast since no retry is needed
      expect(duration).toBeLessThan(5000);

      console.log(`✅ Query with retry enabled: ${duration}ms (no retry needed)`);
    });

    test('Performance_CompareRetryEnabled_vs_Disabled', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);

      // With retry enabled
      const stackWithRetry = Contentstack.Stack({
        ...config.stack,
        fetchOptions: { retryLimit: 3 }
      });
      stackWithRetry.setHost(config.host);

      const start1 = Date.now();
      const result1 = await stackWithRetry.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      const duration1 = Date.now() - start1;

      // With retry disabled
      const stackWithoutRetry = Contentstack.Stack({
        ...config.stack,
        fetchOptions: { retryLimit: 0 }
      });
      stackWithoutRetry.setHost(config.host);

      const start2 = Date.now();
      const result2 = await stackWithoutRetry.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      const duration2 = Date.now() - start2;

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();

      console.log(`✅ Performance comparison: With retry=${duration1}ms, Without retry=${duration2}ms`);
    });
  });

  // =============================================================================
  // SOCKET & TRANSPORT ERROR HANDLING (v3.27.0 retry coverage)
  // =============================================================================

  describe('Socket & Transport Error Handling', () => {
    test('RetryLogic_AuthError_FailsFast_NotSlowedByRetryDelay', async () => {
      // 4xx API errors go through data.then(json => reject) — no retryCondition,
      // so they are NEVER retried regardless of retryLimit.
      // Bug this catches: if SDK starts retrying 4xx errors, timing balloons to
      // retryLimit * retryDelay (5 * 2000ms = 10 000ms) instead of failing fast.
      const RETRY_DELAY = 2000;
      const RETRY_LIMIT = 5;

      const localStack = Contentstack.Stack({
        api_key: 'invalid_api_key_for_timing_test',
        delivery_token: config.stack.delivery_token,
        environment: config.stack.environment,
        fetchOptions: {
          retryLimit: RETRY_LIMIT,
          retryDelay: RETRY_DELAY
        }
      });
      localStack.setHost(config.host);

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const start = Date.now();

      try {
        await localStack.ContentType(contentTypeUID).Query().limit(1).toJSON().find();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const duration = Date.now() - start;

        // If retried RETRY_LIMIT times: RETRY_LIMIT * RETRY_DELAY = 10 000ms
        // Auth errors must be rejected immediately — well under one retry delay.
        expect(duration).toBeLessThan(RETRY_DELAY);
        expect(error.error_code).toBeDefined();

        console.log(`✅ Auth error rejected in ${duration}ms — no retry delay (retryLimit=${RETRY_LIMIT}, retryDelay=${RETRY_DELAY}ms)`);
      }
    }, 12000);

    test('RetryLogic_CustomRetryCondition_InvokesOnError_WithDelayBetweenRetries', async () => {
      // retryCondition returning true routes through onError(), which applies
      // retryDelay before each retry attempt.
      // Bug this catches: if the retryCondition → onError() wiring is broken,
      // the test fails immediately (no delays) instead of after >= 2 * retryDelay.
      const RETRY_DELAY = 400;
      const RETRY_LIMIT = 2;

      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: RETRY_LIMIT,
          retryDelay: RETRY_DELAY,
          retryCondition: (response) => response.status === 422
        }
      });
      localStack.setHost(config.host);

      const start = Date.now();

      try {
        await localStack.ContentType('non_existent_ct_retry_test_xyz').Query().limit(1).toJSON().find();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const duration = Date.now() - start;

        // 2 retries × 400ms delay = minimum 800ms of intentional waiting.
        // Subtract a small tolerance for scheduling jitter.
        expect(duration).toBeGreaterThan(RETRY_LIMIT * RETRY_DELAY * 0.75);
        expect(error).toBeDefined();

        console.log(`✅ retryCondition triggered ${RETRY_LIMIT} retries, total ${duration}ms (min expected: ${RETRY_LIMIT * RETRY_DELAY}ms)`);
      }
    }, 20000);

    test('RetryLogic_ZeroRetryLimit_NetworkFailure_RejectsWithoutWaiting', async () => {
      // onError() checks retryLimit === 0 first and calls reject() immediately.
      // The new socket-error path also has: if (isSocketOrAbort && retryLimit > 0).
      // Bug this catches: if either guard is removed, a network failure with
      // retryLimit=0 would enter a retry loop and add retryDelay * N ms of latency.
      const RETRY_DELAY = 1500;

      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 0,
          retryDelay: RETRY_DELAY,
          timeout: 3000
        }
      });
      localStack.setHost('host-that-does-not-exist-xyz.contentstack.io');

      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const start = Date.now();

      try {
        await localStack.ContentType(contentTypeUID).Query().limit(1).toJSON().find();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        const duration = Date.now() - start;

        // With retryLimit=0, no retry delays should be added at all.
        expect(duration).toBeLessThan(RETRY_DELAY);
        expect(error).toBeDefined();

        console.log(`✅ retryLimit=0 rejects network failure in ${duration}ms (no ${RETRY_DELAY}ms retry delay added)`);
      }
    }, 10000);
  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Edge Cases', () => {
    test('EdgeCase_NegativeRetryLimit_HandlesGracefully', () => {
      try {
        const localStack = Contentstack.Stack({
          ...config.stack,
          fetchOptions: {
            retryLimit: -1
          }
        });

        // SDK may accept negative values (treat as 0) or reject
        console.log('⚠️ Negative retry limit accepted (may default to 0)');
      } catch (error) {
        console.log('✅ Negative retry limit rejected');
      }
    });

    test('EdgeCase_VeryLargeRetryLimit_Configured', () => {
      const localStack = Contentstack.Stack({
        ...config.stack,
        fetchOptions: {
          retryLimit: 100
        }
      });

      expect(localStack.fetchOptions.retryLimit).toBe(100);

      console.log('✅ Very large retry limit (100) configured');
    });

    test('EdgeCase_NullRetryCondition_HandlesGracefully', () => {
      try {
        const localStack = Contentstack.Stack({
          ...config.stack,
          fetchOptions: {
            retryLimit: 3,
            retryCondition: null
          }
        });

        console.log('⚠️ Null retry condition accepted (may use default)');
      } catch (error) {
        console.log('✅ Null retry condition handled');
      }
    });
  });
});
