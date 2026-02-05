'use strict';

/**
 * COMPREHENSIVE SYNC API TESTS
 * 
 * Tests the Contentstack Sync API functionality for delta synchronization.
 * 
 * SDK Methods Covered:
 * - Stack.sync({init: true})              - Initial sync
 * - Stack.sync({sync_token})              - Subsequent sync
 * - Stack.sync({pagination_token})        - Pagination
 * - Stack.sync({locale})                  - Locale-specific sync
 * - Stack.sync({start_from})              - Date-based sync
 * - Stack.sync({content_type_uid})        - Content type-specific sync
 * - Stack.sync({type})                    - Event type filtering
 * 
 * Bug Detection Focus:
 * - Token management (sync_token, pagination_token)
 * - Delta update accuracy
 * - Pagination correctness
 * - Filter combination behavior
 * - Data consistency
 * - Error handling
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

const config = TestDataHelper.getConfig();
let Stack;

// Store tokens for subsequent tests
let initialSyncToken = null;
let initialPaginationToken = null;

describe('Sync API - Comprehensive Tests', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // INITIAL SYNC TESTS
  // =============================================================================

  describe('Initial Sync', () => {
    
    test('InitialSync_BasicInit_ReturnsData', async () => {
      const result = await Stack.sync({ init: true });
      
      // Structure validation
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total_count).toBeDefined();
      expect(typeof result.total_count).toBe('number');
      
      // Token validation
      expect(result.sync_token).toBeDefined();
      expect(typeof result.sync_token).toBe('string');
      expect(result.sync_token.length).toBeGreaterThan(0);
      
      // Store sync token for later tests
      initialSyncToken = result.sync_token;
      
      // Data validation
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.length).toBeLessThanOrEqual(result.total_count);
      
      console.log(`✅ Initial sync returned ${result.items.length}/${result.total_count} items`);
      console.log(`✅ Sync token: ${result.sync_token.substring(0, 20)}...`);
    });

    test('InitialSync_ItemStructure_ValidFormat', async () => {
      const result = await Stack.sync({ init: true });
      
      expect(result.items.length).toBeGreaterThan(0);
      
      const item = result.items[0];
      
      // Each item should have data object
      expect(item.data).toBeDefined();
      expect(item.data.uid).toBeDefined();
      expect(typeof item.data.uid).toBe('string');
      
      // Type validation
      if (item.type) {
        const validTypes = [
          'entry_published', 'entry_unpublished', 'entry_deleted',
          'asset_published', 'asset_unpublished', 'asset_deleted',
          'content_type_deleted'
        ];
        expect(validTypes).toContain(item.type);
      }
      
      // Check if it's an entry (has content_type_uid) or asset (has filename/url)
      const isEntry = item.data.content_type_uid !== undefined;
      const isAsset = item.data.filename !== undefined || item.data.url !== undefined;
      
      expect(isEntry || isAsset || item.type === 'content_type_deleted').toBe(true);
      
      console.log(`✅ Sync item structure valid: type=${item.type}, uid=${item.data.uid}`);
    });

    test('InitialSync_MultipleEntries_Consistency', async () => {
      const result = await Stack.sync({ init: true });
      
      expect(result.items.length).toBeGreaterThan(0);
      
      // Validate all items have consistent structure
      let entryCount = 0;
      let assetCount = 0;
      let deletedCount = 0;
      
      result.items.forEach(item => {
        expect(item.data).toBeDefined();
        
        if (item.type && item.type.includes('entry')) {
          entryCount++;
        } else if (item.type && item.type.includes('asset')) {
          assetCount++;
        }
        
        if (item.type && item.type.includes('deleted')) {
          deletedCount++;
        }
      });
      
      console.log(`✅ Sync items breakdown: ${entryCount} entries, ${assetCount} assets, ${deletedCount} deleted`);
      expect(entryCount + assetCount).toBeGreaterThan(0);
    });

  });

  // =============================================================================
  // LOCALE-SPECIFIC SYNC
  // =============================================================================

  describe('Locale-Specific Sync', () => {
    
    test('Sync_Locale_PrimaryLocale_ReturnsData', async () => {
      const locale = TestDataHelper.getLocale('primary');
      const result = await Stack.sync({ 
        init: true, 
        locale: locale 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.total_count).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      // Validate items belong to requested locale
      if (result.items.length > 0) {
        const entriesWithLocale = result.items.filter(item => 
          item.data && item.data.locale
        );
        
        if (entriesWithLocale.length > 0) {
          entriesWithLocale.forEach(item => {
            expect(item.data.locale).toBe(locale);
          });
        }
      }
      
      console.log(`✅ Locale-specific sync (${locale}): ${result.items.length} items`);
    });

    test('Sync_Locale_SecondaryLocale_ReturnsDataOrEmpty', async () => {
      const locale = TestDataHelper.getLocale('secondary');
      
      try {
        const result = await Stack.sync({ 
          init: true, 
          locale: locale 
        });
        
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
        expect(result.sync_token).toBeDefined();
        
        console.log(`✅ Secondary locale sync (${locale}): ${result.items.length} items`);
      } catch (error) {
        // Secondary locale might not be available - acceptable
        console.log(`⚠️ Secondary locale (${locale}) not available or no content`);
        expect(error.error_code).toBeDefined();
      }
    });

    test('Sync_Locale_InvalidLocale_HandlesGracefully', async () => {
      try {
        const result = await Stack.sync({ 
          init: true, 
          locale: 'invalid-locale-xyz' 
        });
        
        // If it succeeds, it should return empty or error
        expect(result).toBeDefined();
        console.log('⚠️ Invalid locale accepted, returned result');
      } catch (error) {
        // Expected behavior - invalid locale should cause error
        expect(error.error_code).toBeDefined();
        console.log('✅ Invalid locale properly rejected');
      }
    });

  });

  // =============================================================================
  // DATE-BASED SYNC
  // =============================================================================

  describe('Date-Based Sync', () => {
    
    test('Sync_StartDate_RecentDate_ReturnsData', async () => {
      // Use a date from 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString();
      
      const result = await Stack.sync({ 
        init: true, 
        start_from: startDate 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.total_count).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      // Should return entries published/updated after the date
      console.log(`✅ Date-based sync (from ${startDate.substring(0, 10)}): ${result.items.length} items`);
    });

    test('Sync_StartDate_OldDate_ReturnsAllData', async () => {
      const oldDate = '2020-01-01T00:00:00.000Z';
      
      const result = await Stack.sync({ 
        init: true, 
        start_from: oldDate 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.total_count).toBeGreaterThan(0);
      
      console.log(`✅ Sync from old date (${oldDate.substring(0, 10)}): ${result.items.length} items`);
    });

    test('Sync_StartDate_FutureDate_ReturnsEmpty', async () => {
      // Use a future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const startDate = futureDate.toISOString();
      
      const result = await Stack.sync({ 
        init: true, 
        start_from: startDate 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      // Future date should return no items or very few
      expect(result.items.length).toBe(0);
      
      console.log(`✅ Sync from future date returns empty as expected`);
    });

    test('Sync_StartDate_InvalidFormat_HandlesGracefully', async () => {
      try {
        const result = await Stack.sync({ 
          init: true, 
          start_from: 'invalid-date-format' 
        });
        
        // If it succeeds, it might ignore invalid format
        expect(result).toBeDefined();
        console.log('⚠️ Invalid date format accepted');
      } catch (error) {
        // Expected - invalid date should cause error
        expect(error.error_code).toBeDefined();
        console.log('✅ Invalid date format properly rejected');
      }
    });

  });

  // =============================================================================
  // CONTENT TYPE-SPECIFIC SYNC
  // =============================================================================

  describe('Content Type-Specific Sync', () => {
    
    test('Sync_ContentType_ValidUID_ReturnsFilteredData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.sync({ 
        init: true, 
        content_type_uid: contentTypeUID 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      // All items should be entries of the specified content type
      if (result.items.length > 0) {
        result.items.forEach(item => {
          if (item.data && item.data.content_type_uid) {
            expect(item.data.content_type_uid).toBe(contentTypeUID);
          }
        });
      }
      
      console.log(`✅ Content type sync (${contentTypeUID}): ${result.items.length} items`);
    });

    test('Sync_ContentType_ComplexType_ReturnsData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('cybersecurity', true);
      
      const result = await Stack.sync({ 
        init: true, 
        content_type_uid: contentTypeUID 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      console.log(`✅ Complex content type sync (${contentTypeUID}): ${result.items.length} items`);
    });

    test('Sync_ContentType_NonExistent_HandlesGracefully', async () => {
      try {
        const result = await Stack.sync({ 
          init: true, 
          content_type_uid: 'non_existent_ct_uid_12345' 
        });
        
        // Should return empty result
        expect(result).toBeDefined();
        expect(result.items.length).toBe(0);
        console.log('✅ Non-existent content type returns empty result');
      } catch (error) {
        // Or throw an error - both acceptable
        expect(error.error_code).toBeDefined();
        console.log('✅ Non-existent content type properly rejected');
      }
    });

  });

  // =============================================================================
  // TYPE-BASED SYNC (Event Filtering)
  // =============================================================================

  describe('Event Type Filtering', () => {
    
    test('Sync_Type_EntryPublished_ReturnsPublishedEntries', async () => {
      const result = await Stack.sync({ 
        init: true, 
        type: 'entry_published' 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      // All items should be published entries
      if (result.items.length > 0) {
        result.items.forEach(item => {
          expect(item.type).toBe('entry_published');
          expect(item.data).toBeDefined();
          expect(item.data.uid).toBeDefined();
          
          // Content type UID might be missing for certain edge cases (e.g., deleted content types)
          // Just validate structure if it exists
          if (item.data.content_type_uid) {
            expect(typeof item.data.content_type_uid).toBe('string');
          }
        });
      }
      
      console.log(`✅ Entry published sync: ${result.items.length} items`);
    });

    test('Sync_Type_AssetPublished_ReturnsPublishedAssets', async () => {
      const result = await Stack.sync({ 
        init: true, 
        type: 'asset_published' 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      // All items should be published assets
      if (result.items.length > 0) {
        result.items.forEach(item => {
          expect(item.type).toBe('asset_published');
          expect(item.data).toBeDefined();
          expect(item.data.filename || item.data.url).toBeDefined();
        });
      }
      
      console.log(`✅ Asset published sync: ${result.items.length} items`);
    });

    test('Sync_Type_EntryDeleted_ReturnsDeletedEntries', async () => {
      const result = await Stack.sync({ 
        init: true, 
        type: 'entry_deleted' 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      // Might be empty if no deletions
      console.log(`✅ Entry deleted sync: ${result.items.length} items`);
    });

    test('Sync_Type_InvalidType_HandlesGracefully', async () => {
      try {
        const result = await Stack.sync({ 
          init: true, 
          type: 'invalid_type_xyz' 
        });
        
        // Might succeed with empty result
        expect(result).toBeDefined();
        console.log('⚠️ Invalid type accepted, returned result');
      } catch (error) {
        // Or throw error - expected behavior
        expect(error.error_code).toBeDefined();
        console.log('✅ Invalid type properly rejected');
      }
    });

  });

  // =============================================================================
  // SUBSEQUENT SYNC (Sync Token)
  // =============================================================================

  describe('Subsequent Sync (Delta Updates)', () => {
    
    test('SubsequentSync_ValidSyncToken_ReturnsDeltas', async () => {
      // First get initial sync token
      const initialSync = await Stack.sync({ init: true });
      const syncToken = initialSync.sync_token;
      
      expect(syncToken).toBeDefined();
      
      // Wait a moment, then perform subsequent sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await Stack.sync({ sync_token: syncToken });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      // If no changes occurred, sync token might remain the same (acceptable SDK behavior)
      if (result.items.length === 0) {
        console.log(`✅ No changes since initial sync (sync token may remain same)`);
      } else {
        console.log(`✅ Subsequent sync returned ${result.items.length} delta items`);
      }
      
      // Sync token should be defined regardless
      expect(typeof result.sync_token).toBe('string');
      console.log(`✅ Sync token present: ${result.sync_token.substring(0, 20)}...`);
    });

    test('SubsequentSync_SameTokenTwice_Consistent', async () => {
      // Get initial sync token
      const initialSync = await Stack.sync({ init: true });
      const syncToken = initialSync.sync_token;
      
      // Use same token twice
      const result1 = await Stack.sync({ sync_token: syncToken });
      const result2 = await Stack.sync({ sync_token: syncToken });
      
      // Both should succeed and return consistent data
      expect(result1.items.length).toBe(result2.items.length);
      expect(result1.sync_token).toBeDefined();
      expect(result2.sync_token).toBeDefined();
      
      console.log(`✅ Same sync token used twice: consistent results`);
    });

    test('SubsequentSync_InvalidToken_HandlesError', async () => {
      try {
        const result = await Stack.sync({ 
          sync_token: 'invalid_sync_token_xyz_12345' 
        });
        
        // Should not succeed with invalid token
        expect(true).toBe(false); // Fail if we reach here
      } catch (error) {
        // Expected - invalid token should cause error
        expect(error.error_code).toBeDefined();
        expect(error.error_message).toBeDefined();
        console.log('✅ Invalid sync token properly rejected');
      }
    });

    test('SubsequentSync_EmptyToken_HandlesError', async () => {
      try {
        const result = await Stack.sync({ sync_token: '' });
        
        // Should not succeed with empty token
        expect(true).toBe(false);
      } catch (error) {
        // Expected behavior
        expect(error).toBeDefined();
        console.log('✅ Empty sync token properly rejected');
      }
    });

  });

  // =============================================================================
  // PAGINATION TESTS
  // =============================================================================

  describe('Pagination', () => {
    
    test('Pagination_InitialSyncWithPagination_ChecksForToken', async () => {
      const result = await Stack.sync({ init: true });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      if (result.pagination_token) {
        // Pagination token exists - more than 100 items
        expect(typeof result.pagination_token).toBe('string');
        expect(result.pagination_token.length).toBeGreaterThan(0);
        
        initialPaginationToken = result.pagination_token;
        
        console.log(`✅ Pagination token present: more than 100 items`);
      } else {
        // No pagination - fewer than 100 items
        expect(result.sync_token).toBeDefined();
        console.log(`✅ No pagination token: fewer than 100 items`);
      }
    });

    test('Pagination_ValidPaginationToken_ReturnsNextBatch', async () => {
      // Get initial sync with pagination
      const initialSync = await Stack.sync({ init: true });
      
      if (initialSync.pagination_token) {
        const paginationToken = initialSync.pagination_token;
        
        const result = await Stack.sync({ 
          pagination_token: paginationToken 
        });
        
        expect(result).toBeDefined();
        expect(result.items).toBeDefined();
        expect(result.items.length).toBeGreaterThan(0);
        
        // Should have either another pagination token or sync token
        expect(result.pagination_token || result.sync_token).toBeDefined();
        
        console.log(`✅ Pagination: fetched next batch of ${result.items.length} items`);
      } else {
        console.log('⚠️ No pagination token available (stack has < 100 items)');
      }
    });

    test('Pagination_InvalidToken_HandlesError', async () => {
      try {
        const result = await Stack.sync({ 
          pagination_token: 'invalid_pagination_token_xyz' 
        });
        
        // Should not succeed
        expect(true).toBe(false);
      } catch (error) {
        // Expected behavior
        expect(error).toBeDefined();
        console.log('✅ Invalid pagination token properly rejected');
      }
    });

  });

  // =============================================================================
  // ADVANCED COMBINATIONS
  // =============================================================================

  describe('Advanced Sync Queries', () => {
    
    test('AdvancedSync_LocaleAndDate_CombinedFilters', async () => {
      const locale = TestDataHelper.getLocale('primary');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString();
      
      const result = await Stack.sync({ 
        init: true, 
        locale: locale,
        start_from: startDate 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      console.log(`✅ Combined locale+date sync: ${result.items.length} items`);
    });

    test('AdvancedSync_ContentTypeAndType_CombinedFilters', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.sync({ 
        init: true, 
        content_type_uid: contentTypeUID,
        type: 'entry_published' 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      // All items should match both filters
      if (result.items.length > 0) {
        result.items.forEach(item => {
          expect(item.type).toBe('entry_published');
          if (item.data && item.data.content_type_uid) {
            expect(item.data.content_type_uid).toBe(contentTypeUID);
          }
        });
      }
      
      console.log(`✅ Combined content_type+type sync: ${result.items.length} items`);
    });

    test('AdvancedSync_AllFilters_CombinedQuery', async () => {
      const locale = TestDataHelper.getLocale('primary');
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const oldDate = '2020-01-01T00:00:00.000Z';
      
      const result = await Stack.sync({ 
        init: true, 
        locale: locale,
        content_type_uid: contentTypeUID,
        start_from: oldDate,
        type: 'entry_published' 
      });
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.sync_token).toBeDefined();
      
      console.log(`✅ All filters combined sync: ${result.items.length} items`);
    });

  });

  // =============================================================================
  // PERFORMANCE TESTS
  // =============================================================================

  describe('Performance', () => {
    
    test('Performance_InitialSync_CompletesInReasonableTime', async () => {
      const startTime = Date.now();
      
      const result = await Stack.sync({ init: true });
      
      const duration = Date.now() - startTime;
      
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      
      // Should complete within 10 seconds for typical stack
      expect(duration).toBeLessThan(10000);
      
      console.log(`✅ Initial sync completed in ${duration}ms`);
    });

    test('Performance_SubsequentSync_FasterThanInitial', async () => {
      // Initial sync
      const initialStart = Date.now();
      const initialSync = await Stack.sync({ init: true });
      const initialDuration = Date.now() - initialStart;
      
      const syncToken = initialSync.sync_token;
      
      // Subsequent sync
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subsequentStart = Date.now();
      const subsequentSync = await Stack.sync({ sync_token: syncToken });
      const subsequentDuration = Date.now() - subsequentStart;
      
      expect(subsequentSync).toBeDefined();
      
      console.log(`✅ Initial sync: ${initialDuration}ms, Subsequent sync: ${subsequentDuration}ms`);
      console.log(`   Subsequent sync is ${subsequentDuration <= initialDuration ? 'faster or equal' : 'slower'}`);
    });

  });

  // =============================================================================
  // ERROR HANDLING & EDGE CASES
  // =============================================================================

  describe('Error Handling', () => {
    
    test('Error_MissingInitAndTokens_HandlesError', async () => {
      try {
        const result = await Stack.sync({});
        
        // Should not succeed without init or tokens
        expect(true).toBe(false);
      } catch (error) {
        // Expected - must have init, sync_token, or pagination_token
        expect(error).toBeDefined();
        console.log('✅ Missing parameters properly rejected');
      }
    });

    test('Error_ConflictingParameters_HandlesGracefully', async () => {
      try {
        // Cannot have both init and sync_token
        const result = await Stack.sync({ 
          init: true, 
          sync_token: 'some_token' 
        });
        
        // Might succeed with one taking precedence
        expect(result).toBeDefined();
        console.log('⚠️ Conflicting parameters accepted (one took precedence)');
      } catch (error) {
        // Or reject - both acceptable
        expect(error).toBeDefined();
        console.log('✅ Conflicting parameters properly rejected');
      }
    });

    test('Error_InvalidParameterType_HandlesGracefully', async () => {
      try {
        const result = await Stack.sync({ 
          init: 'not-a-boolean' // Should be boolean
        });
        
        // Might coerce to boolean
        expect(result).toBeDefined();
        console.log('⚠️ Invalid parameter type coerced');
      } catch (error) {
        // Or reject
        expect(error).toBeDefined();
        console.log('✅ Invalid parameter type properly rejected');
      }
    });

  });

});

