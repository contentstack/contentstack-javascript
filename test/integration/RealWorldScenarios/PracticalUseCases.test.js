'use strict';

/**
 * COMPREHENSIVE REAL-WORLD SCENARIOS TESTS
 * 
 * Tests practical real-world use cases combining multiple SDK features.
 * 
 * Scenarios Covered:
 * - Blog/article listing and detail pages
 * - E-commerce product catalogs
 * - Multi-language content delivery
 * - Search and filtering
 * - Content previews
 * - Progressive loading
 * 
 * Bug Detection Focus:
 * - Real-world workflow validity
 * - Feature combination stability
 * - Performance in practical scenarios
 * - Edge cases in production patterns
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');

const config = TestDataHelper.getConfig();
let Stack;

describe('Real-World Scenarios - Practical Use Cases', () => {
  
  beforeAll(() => {
    Stack = Contentstack.Stack(config.stack);
    Stack.setHost(config.host);
  });

  // =============================================================================
  // BLOG/ARTICLE SCENARIOS
  // =============================================================================

  describe('Blog/Article Workflows', () => {
    
    test('RealWorld_BlogListing_WithPaginationAndSorting', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Simulate blog listing page: get latest 10 articles
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .descending('updated_at')
        .only(['title', 'uid', 'updated_at', 'author'])
        .includeCount()
        .limit(10)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined(); // Count
      
      console.log(`✅ Blog listing: ${result[0].length} articles, total: ${result[1]}`);
    });

    test('RealWorld_ArticleDetail_WithAuthorAndRelated', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      // Simulate article detail page
      const entry = await Stack.ContentType(contentTypeUID)
        .Entry(entryUID)
        .includeReference('author')
        .includeReference('related_articles')
        .toJSON()
        .fetch();
      
      expect(entry).toBeDefined();
      expect(entry.uid).toBe(entryUID);
      
      console.log('✅ Article detail with author and related articles');
    });

    test('RealWorld_FeaturedArticles_FilteredAndSorted', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Get featured articles (using exists as a proxy for featured flag)
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title')
        .descending('updated_at')
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[0].length).toBeGreaterThan(0);
      
      console.log(`✅ Featured articles: ${result[0].length} found`);
    });

  });

  // =============================================================================
  // E-COMMERCE SCENARIOS
  // =============================================================================

  describe('E-Commerce Workflows', () => {
    
    test('RealWorld_ProductCatalog_WithPaginationAndSort', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('product', true);
      
      // Simulate product catalog: paginated, sorted
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .ascending('updated_at') // Could be price, name, etc.
        .skip(0)
        .limit(12) // Typical grid layout
        .only(['title', 'uid', 'updated_at'])
        .includeCount()
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log(`✅ Product catalog: ${result[0].length} products displayed`);
    });

    test('RealWorld_ProductSearch_WithFilters', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('product', true);
      
      // Simulate product search with filters
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .search('product') // Search term
        .exists('title')
        .limit(20)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log(`✅ Product search: ${result[0].length} results`);
    });

  });

  // =============================================================================
  // MULTI-LANGUAGE SCENARIOS
  // =============================================================================

  describe('Multi-Language Workflows', () => {
    
    test('RealWorld_MultiLanguageSite_LocaleSwitch', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const primaryLocale = TestDataHelper.getLocale('primary');
      const secondaryLocale = TestDataHelper.getLocale('secondary');
      
      // Get content in primary language
      const primaryResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(primaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      // Get content in secondary language
      const secondaryResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(secondaryLocale)
        .limit(5)
        .toJSON()
        .find();
      
      expect(primaryResult[0]).toBeDefined();
      expect(secondaryResult[0]).toBeDefined();
      
      console.log(`✅ Multi-language: ${primaryResult[0].length} in ${primaryLocale}, ${secondaryResult[0].length} in ${secondaryLocale}`);
    });

    test('RealWorld_LocalizedContent_WithFallback', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const locale = TestDataHelper.getLocale('primary');
      
      // Request with locale and fallback
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .language(locale)
        .includeFallback()
        .limit(10)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Localized content with fallback');
    });

  });

  // =============================================================================
  // SEARCH & FILTER SCENARIOS
  // =============================================================================

  describe('Search & Filter Workflows', () => {
    
    test('RealWorld_SiteSearch_FullText', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Simulate site-wide search
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .search('content')
        .includeCount()
        .limit(20)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log(`✅ Site search: ${result[0].length} results`);
    });

    test('RealWorld_CategoryFilter_WithCount', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Filter by category/tag
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .exists('title') // Proxy for category filter
        .includeCount()
        .limit(15)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      
      console.log(`✅ Category filter: ${result[0].length} items, ${result[1]} total`);
    });

    test('RealWorld_DateRangeFilter_RecentContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Get content from last 30 days (simulated)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .greaterThan('updated_at', thirtyDaysAgo.toISOString())
        .descending('updated_at')
        .limit(10)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log(`✅ Recent content (30 days): ${result[0].length} items`);
    });

  });

  // =============================================================================
  // PREVIEW & DRAFT SCENARIOS
  // =============================================================================

  describe('Preview & Draft Workflows', () => {
    
    test('RealWorld_LivePreview_ContentDrafts', async () => {
      const livePreviewConfig = TestDataHelper.getLivePreviewConfig();
      
      if (!livePreviewConfig.enable) {
        console.log('⚠️ Skipping: Live preview not enabled');
        return;
      }
      
      const stack = Contentstack.Stack({
        ...config.stack,
        live_preview: livePreviewConfig
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Live preview query executed');
    });

  });

  // =============================================================================
  // PROGRESSIVE LOADING SCENARIOS
  // =============================================================================

  describe('Progressive Loading Workflows', () => {
    
    test('RealWorld_InfiniteScroll_MultiplePages', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const pageSize = 10;
      const pages = 3;
      const allResults = [];
      
      for (let page = 0; page < pages; page++) {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .skip(page * pageSize)
          .limit(pageSize)
          .toJSON()
          .find();
        
        allResults.push(...result[0]);
        
        if (result[0].length < pageSize) {
          break; // No more content
        }
      }
      
      expect(allResults.length).toBeGreaterThan(0);
      
      console.log(`✅ Infinite scroll: ${allResults.length} items loaded across ${pages} pages`);
    });

    test('RealWorld_LazyLoading_LoadMoreButton', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Initial load
      const initialResult = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(5)
        .includeCount()
        .toJSON()
        .find();
      
      const totalCount = initialResult[1];
      const loadedCount = initialResult[0].length;
      const hasMore = loadedCount < totalCount;
      
      if (hasMore) {
        // Load more
        const moreResult = await Stack.ContentType(contentTypeUID)
          .Query()
          .skip(loadedCount)
          .limit(5)
          .toJSON()
          .find();
        
        expect(moreResult[0]).toBeDefined();
        
        console.log(`✅ Lazy loading: ${loadedCount} initial, ${moreResult[0].length} more loaded`);
      } else {
        console.log('✅ Lazy loading: all content loaded initially');
      }
    });

  });

  // =============================================================================
  // PERFORMANCE-CRITICAL SCENARIOS
  // =============================================================================

  describe('Performance-Critical Workflows', () => {
    
    test('RealWorld_Homepage_MinimalData', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      // Homepage: only essential fields, cached
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'uid'])
        .limit(5)
        .toJSON()
        .find();
      
      const duration = Date.now() - startTime;
      
      expect(result[0]).toBeDefined();
      expect(duration).toBeLessThan(2000); // Fast homepage load
      
      console.log(`⚡ Homepage load: ${duration}ms`);
    });

    test('RealWorld_APIEndpoint_BatchRequest', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const startTime = Date.now();
      
      // Batch multiple content types
      const promises = [
        Stack.ContentType(contentTypeUID).Query().limit(5).toJSON().find(),
        Stack.ContentType(contentTypeUID).Query().limit(5).toJSON().find(),
        Stack.Assets().Query().limit(5).toJSON().find()
      ];
      
      const results = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(results.length).toBe(3);
      expect(duration).toBeLessThan(3000);
      
      console.log(`⚡ Batch request: ${duration}ms for 3 queries`);
    });

  });

  // =============================================================================
  // COMPLEX REAL-WORLD COMBINATIONS
  // =============================================================================

  describe('Complex Real-World Combinations', () => {
    
    test('RealWorld_AuthorPage_ArticlesAndBio', async () => {
      const articleCT = TestDataHelper.getContentTypeUID('article', true);
      const authorCT = TestDataHelper.getContentTypeUID('author', true);
      
      // Get author bio and their articles
      const [authorResult, articlesResult] = await Promise.all([
        Stack.ContentType(authorCT).Query().limit(1).toJSON().find(),
        Stack.ContentType(articleCT)
          .Query()
          .includeReference('author')
          .limit(10)
          .toJSON()
          .find()
      ]);
      
      expect(authorResult[0]).toBeDefined();
      expect(articlesResult[0]).toBeDefined();
      
      console.log('✅ Author page: bio + articles loaded');
    });

    test('RealWorld_RelatedContent_SmartRecommendations', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      const entryUID = TestDataHelper.getMediumEntryUID();
      
      if (!entryUID) {
        console.log('⚠️ Skipping: No entry UID configured');
        return;
      }
      
      // Get current article and related content
      const [currentArticle, relatedArticles] = await Promise.all([
        Stack.ContentType(contentTypeUID).Entry(entryUID).toJSON().fetch(),
        Stack.ContentType(contentTypeUID)
          .Query()
          .limit(5)
          .toJSON()
          .find()
      ]);
      
      expect(currentArticle).toBeDefined();
      expect(relatedArticles[0]).toBeDefined();
      
      console.log('✅ Related content recommendations loaded');
    });

    test('RealWorld_SitemapGeneration_AllPublishedContent', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // Get all published content for sitemap
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['uid', 'updated_at', 'url'])
        .limit(100)
        .includeCount()
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeDefined();
      
      console.log(`✅ Sitemap generation: ${result[0].length} URLs, ${result[1]} total`);
    });

  });

});

