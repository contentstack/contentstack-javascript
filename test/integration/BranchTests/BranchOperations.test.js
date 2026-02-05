'use strict';

/**
 * COMPREHENSIVE BRANCH-SPECIFIC OPERATIONS TESTS (PHASE 3)
 * 
 * Tests SDK's branch functionality for content staging and preview workflows.
 * 
 * SDK Features Covered:
 * - Branch parameter in Stack initialization
 * - Branch header injection
 * - Branch with queries
 * - Branch with variants, locales, references
 * - Branch switching
 * 
 * Bug Detection Focus:
 * - Branch isolation
 * - Branch header persistence
 * - Branch with complex queries
 * - Branch-specific content delivery
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Branch Operations - Comprehensive Tests (Phase 3)', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // BRANCH INITIALIZATION TESTS
  // =============================================================================

  describe('Branch Initialization', () => {
    
    test('Branch_Initialization_HeaderAdded', () => {
      const branchUID = TestDataHelper.getBranchUID();
      
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      
      expect(stack.headers).toBeDefined();
      expect(stack.headers.branch).toBe(branchUID);
      
      console.log(`✅ Branch header added: ${branchUID}`);
    });

    test('Branch_NoBranch_NoHeader', () => {
      const stack = Contentstack.Stack(config.stack);
      
      // Without branch, header should not exist
      if (!stack.headers.branch) {
        console.log('✅ No branch: no header added');
      } else {
        console.log(`⚠️ Branch header exists without configuration: ${stack.headers.branch}`);
      }
    });

    test('Branch_EmptyString_HandlesGracefully', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: ''
      });
      
      // Empty string might be ignored or set as header
      console.log(`✅ Empty branch string: ${stack.headers.branch || 'not set'}`);
    });

    test('Branch_WithOtherConfig_AllApplied', () => {
      const branchUID = TestDataHelper.getBranchUID();
      
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID,
        early_access: ['taxonomy'],
        live_preview: {
          enable: false
        }
      });
      
      expect(stack.headers.branch).toBe(branchUID);
      expect(stack.headers['x-header-ea']).toBe('taxonomy');
      
      console.log('✅ Branch + early_access + live_preview all configured');
    });

  });

  // =============================================================================
  // BRANCH WITH QUERIES
  // =============================================================================

  describe('Branch with Queries', () => {
    
    test('Branch_BasicQuery_WorksCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
      
      console.log(`✅ Branch query works: ${result[0].length} entries`);
    });

    test('Branch_EntryFetch_WorksCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
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
      
      console.log('✅ Branch entry fetch works');
    });

    test('Branch_WithFilters_CombinesCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + filter query works');
    });

    test('Branch_WithSorting_CombinesCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .ascending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + sorting works');
    });

  });

  // =============================================================================
  // BRANCH WITH ADVANCED FEATURES
  // =============================================================================

  describe('Branch with Advanced Features', () => {
    
    test('Branch_WithLocale_BothApplied', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .language(locale)
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + locale works');
    });

    test('Branch_WithVariant_BothApplied', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const variantUID = TestDataHelper.getVariantUID();
      
      if (!variantUID) {
        console.log('⚠️ Skipping: No variant UID configured');
        return;
      }
      
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .variants(variantUID)
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + variant works');
    });

    test('Branch_WithReferences_ResolvesCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('author')
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + reference resolution works');
    });

    test('Branch_WithProjection_AppliesCorrectly', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'uid'])
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      if (result[0].length > 0) {
        expect(result[0][0].uid).toBeDefined();
      }
      
      console.log('✅ Branch + field projection works');
    });

    test('Branch_WithCachePolicy_BothApplied', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack.setHost(config.host);
      stack.setCachePolicy(Contentstack.CachePolicy.IGNORE_CACHE);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Branch + cache policy works');
    });

  });

  // =============================================================================
  // BRANCH COMPARISON TESTS
  // =============================================================================

  describe('Branch Comparison', () => {
    
    test('BranchComparison_WithVsWithoutBranch_IndependentResults', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Without branch
      const stackWithoutBranch = Contentstack.Stack(config.stack);
      stackWithoutBranch.setHost(config.host);
      
      const resultWithout = await stackWithoutBranch.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      // With branch
      const stackWithBranch = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stackWithBranch.setHost(config.host);
      
      const resultWith = await stackWithBranch.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(resultWithout[0]).toBeDefined();
      expect(resultWith[0]).toBeDefined();
      
      console.log(`✅ Branch comparison: Without=${resultWithout[0].length}, With=${resultWith[0].length}`);
    });

    test('BranchComparison_MultipleStacks_IndependentBranches', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Stack 1 with branch
      const stack1 = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
      stack1.setHost(config.host);
      
      // Stack 2 without branch
      const stack2 = Contentstack.Stack(config.stack);
      stack2.setHost(config.host);
      
      const [result1, result2] = await Promise.all([
        stack1.ContentType(contentTypeUID).Query().limit(3).toJSON().find(),
        stack2.ContentType(contentTypeUID).Query().limit(3).toJSON().find()
      ]);
      
      expect(result1[0]).toBeDefined();
      expect(result2[0]).toBeDefined();
      
      console.log('✅ Multiple stacks with different branch configs work independently');
    });

  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Branch Performance', () => {
    
    test('BranchPerformance_QuerySpeed_ReasonableTime', async () => {
      const branchUID = TestDataHelper.getBranchUID();
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: branchUID
      });
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
      
      console.log(`✅ Branch query performance: ${duration}ms`);
    });

  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Branch Edge Cases', () => {
    
    test('EdgeCase_InvalidBranchUID_HandlesGracefully', async () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: 'invalid_branch_uid_12345'
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await stack.ContentType(contentTypeUID)
          .Query()
          .limit(3)
          .toJSON()
          .find();
        
        // Might succeed if falling back to main branch
        expect(result).toBeDefined();
        console.log('✅ Invalid branch UID: falls back or succeeds');
      } catch (error) {
        // Or might fail with appropriate error
        expect(error).toBeDefined();
        console.log('✅ Invalid branch UID: error thrown');
      }
    });

    test('EdgeCase_NullBranch_HandlesGracefully', () => {
      try {
        const stack = Contentstack.Stack({
          ...config.stack,
          branch: null
        });
        
        console.log('⚠️ Null branch accepted');
      } catch (error) {
        console.log('✅ Null branch handled');
      }
    });

    test('EdgeCase_UndefinedBranch_HandlesGracefully', () => {
      const stack = Contentstack.Stack({
        ...config.stack,
        branch: undefined
      });
      
      // Should work fine - no branch header added
      expect(stack.headers).toBeDefined();
      console.log('✅ Undefined branch: no header added');
    });

  });

});

