// =============================================================================
// NEW INTEGRATION TESTS (Using TestDataHelper & AssertionHelper)
// =============================================================================

// Global Fields Tests
require('./integration/GlobalFieldsTests/SEOGlobalField.test.js');
require('./integration/GlobalFieldsTests/ContentBlockGlobalField.test.js');
require('./integration/GlobalFieldsTests/AdditionalGlobalFields.test.js');

// Query Tests
require('./integration/QueryTests/NumericOperators.test.js');
require('./integration/QueryTests/WhereOperators.test.js');
require('./integration/QueryTests/ExistsSearchOperators.test.js');
require('./integration/QueryTests/SortingPagination.test.js');
require('./integration/QueryTests/LogicalOperators.test.js');
require('./integration/QueryTests/FieldProjection.test.js');

// Entry Tests
require('./integration/EntryTests/SingleEntryFetch.test.js');

// Reference Tests
require('./integration/ReferenceTests/ReferenceResolution.test.js');

// Metadata Tests
require('./integration/MetadataTests/SchemaAndMetadata.test.js');

// Locale Tests
require('./integration/LocaleTests/LocaleAndLanguage.test.js');

// Variant Tests
require('./integration/VariantTests/VariantQuery.test.js');

// Taxonomy Tests
require('./integration/TaxonomyTests/TaxonomyQuery.test.js');

// Asset Tests
require('./integration/AssetTests/AssetQuery.test.js');
require('./integration/AssetTests/ImageTransformation.test.js');

// Content Type Tests
require('./integration/ContentTypeTests/ContentTypeOperations.test.js');

// Advanced Tests
require('./integration/AdvancedTests/CustomParameters.test.js');

// Error Handling Tests
require('./integration/ErrorTests/ErrorHandling.test.js');

// Sync API Tests
require('./integration/SyncTests/SyncAPI.test.js');

// Live Preview Tests
require('./integration/LivePreviewTests/LivePreview.test.js');

// Cache Policy Tests
require('./integration/CachePolicyTests/CachePolicy.test.js');

// Network Resilience Tests
require('./integration/NetworkResilienceTests/RetryLogic.test.js');
require('./integration/NetworkResilienceTests/ConcurrentRequests.test.js');

// Region Tests
require('./integration/RegionTests/RegionConfiguration.test.js');

// SDK Utility Tests
require('./integration/SDKUtilityTests/UtilityMethods.test.js');

// Branch Tests (Phase 3)
require('./integration/BranchTests/BranchOperations.test.js');

// Plugin Tests (Phase 3)
require('./integration/PluginTests/PluginSystem.test.js');

// Complex Scenarios (Phase 3)
require('./integration/ComplexScenarios/ComplexQueryCombinations.test.js');
require('./integration/ComplexScenarios/AdvancedEdgeCases.test.js');

// Performance Tests (Phase 4)
require('./integration/PerformanceTests/PerformanceBenchmarks.test.js');
require('./integration/PerformanceTests/StressTesting.test.js');

// Utility Tests (Phase 4)
require('./integration/UtilityTests/VersionUtility.test.js');

// JSON RTE Tests (Phase 4)
require('./integration/JSONRTETests/JSONRTEParsing.test.js');

// Modular Blocks Tests (Phase 4)
require('./integration/ModularBlocksTests/ModularBlocksHandling.test.js');

// Real-World Scenarios (Phase 4)
require('./integration/RealWorldScenarios/PracticalUseCases.test.js');

// Add more integration tests here as they are created...

// =============================================================================
// LEGACY TESTS (Commented out - being migrated to integration/)
// Many of these fail due to hardcoded 'source' content type from old stack
// =============================================================================

// Legacy Entries - COMMENTED OUT (386 tests fail with new stack)
// require('./legacy/entry/find');
// require('./legacy/entry/find-result-wrapper');
// require('./legacy/entry/findone');
// require('./legacy/entry/findone-result-wrapper');
// require('./legacy/entry/spread');

// Legacy Sync - COMMENTED OUT (needs migration)
// require('./legacy/sync/sync-testcases');

// Legacy Assets - COMMENTED OUT (needs migration)
// require('./legacy/asset/find');
// require('./legacy/asset/find-result-wrapper');
// require('./legacy/asset/spread');
// require('./legacy/asset/image-transformation.js');

// Legacy Live-preview - COMMENTED OUT (needs migration)
// require('./legacy/live-preview/live-preview-test.js');

// Note: Legacy tests will be gradually migrated to integration/ directory
// with TestDataHelper for config values and comprehensive assertions
