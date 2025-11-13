'use strict';
const config = require('../config');

/**
 * Helper class to access test data configuration from .env
 * ALL values come from environment variables via test/config.js
 * 
 * IMPORTANT: Never hardcode UIDs, content type names, field names, or any other values!
 * Always use this helper to get values from config.
 */
class TestDataHelper {
  /**
   * Get the full config object
   */
  static getConfig() {
    return config;
  }
  
  /**
   * Get content type UID by name
   * @param {string} name - Content type name
   * @param {boolean} useComplex - Use complex content type (default: false)
   * @returns {string} Content type UID
   */
  static getContentTypeUID(name, useComplex = false) {
    if (useComplex && config.complexContentTypes[name]) {
      return config.complexContentTypes[name];
    }
    return config.contentTypes[name] || config.complexContentTypes[name];
  }
  
  /**
   * Get test entry UID by complexity level or content type
   * @param {string} level - Complexity level ('complex', 'medium', 'simple') or content type name
   * @param {string} variant - Optional variant name
   * @returns {string|null} Entry UID from .env
   */
  static getTestEntryUID(level, variant = null) {
    // Try direct complexity level first
    if (config.testEntries[level] && !variant) {
      return config.testEntries[level];
    }
    
    // Try content type with variant
    if (variant && config.testEntries[level] && config.testEntries[level][variant]) {
      return config.testEntries[level][variant];
    }
    
    // Fallback for backward compatibility
    if (config.testData && config.testData[level] && config.testData[level][variant]) {
      return config.testData[level][variant];
    }
    
    return null;
  }
  
  /**
   * Get complex entry UID (cybersecurity with variants, global fields, etc.)
   * Value from COMPLEX_ENTRY_UID in .env
   */
  static getComplexEntryUID() {
    return config.testEntries.complex;
  }
  
  /**
   * Get medium entry UID (article with global fields, references, etc.)
   * Value from MEDIUM_ENTRY_UID in .env
   */
  static getMediumEntryUID() {
    return config.testEntries.medium;
  }
  
  /**
   * Get simple entry UID (author - basic content type)
   * Value from SIMPLE_ENTRY_UID in .env
   */
  static getSimpleEntryUID() {
    return config.testEntries.simple;
  }
  
  /**
   * Get self-referencing entry UID (section_builder)
   * Value from SELF_REF_ENTRY_UID in .env
   */
  static getSelfReferencingEntryUID() {
    return config.testEntries.selfReferencing;
  }
  
  /**
   * Get complex blocks entry UID (entry with complex modular blocks)
   * Value from COMPLEX_BLOCKS_ENTRY_UID in .env
   */
  static getComplexBlocksEntryUID() {
    return config.testEntries.complexBlocks;
  }
  
  /**
   * Get taxonomy configuration (UID and term)
   * @param {string} name - Taxonomy name (usa, india, china, uk, canada, one, two)
   * @returns {Object} {uid: string, term: string}
   */
  static getTaxonomy(name) {
    return config.taxonomies[name];
  }
  
  /**
   * Get taxonomy UID only
   * @param {string} name - Taxonomy name
   * @returns {string} Taxonomy UID
   */
  static getTaxonomyUID(name) {
    return config.taxonomies[name]?.uid;
  }
  
  /**
   * Get taxonomy term (for query filters)
   * @param {string} name - Taxonomy name
   * @returns {string} Taxonomy term (e.g., 'california', 'maharashtra')
   */
  static getTaxonomyTerm(name) {
    return config.taxonomies[name]?.term;
  }
  
  /**
   * Get locale code from .env
   * @param {string} name - Locale name (primary, secondary, japanese)
   * @returns {string} Locale code (e.g., 'en-us', 'fr-fr', 'ja-jp')
   */
  static getLocale(name) {
    return config.locales[name];
  }
  
  /**
   * Get global field name
   * @param {string} name - Global field name (seo, search, video_experience, content_block, gallery, referenced_data)
   * @returns {string} Global field name
   */
  static getGlobalField(name) {
    return config.globalFields[name];
  }
  
  /**
   * Get reference field name
   * @param {string} name - Reference field name (author, related_articles, products, references)
   * @returns {string} Reference field name
   */
  static getReferenceField(name) {
    return config.referenceFields[name];
  }
  
  /**
   * Get variant UID from .env
   * Value from VARIANT_UID in .env
   * @returns {string} Variant UID
   */
  static getVariantUID() {
    return config.variants.variantUID;
  }
  
  /**
   * Get image asset UID from .env
   * Value from IMAGE_ASSET_UID in .env
   * @returns {string} Image asset UID
   */
  static getImageAssetUID() {
    return config.assets.imageUID;
  }
  
  /**
   * Get branch UID from .env
   * Value from BRANCH_UID in .env (defaults to 'main')
   * @returns {string} Branch UID
   */
  static getBranchUID() {
    return config.branch;
  }
  
  /**
   * Get live preview configuration
   * @returns {Object} {host: string, previewToken: string, managementToken: string, enable: boolean}
   */
  static getLivePreviewConfig() {
    return {
      host: config.livePreviewHost,
      previewToken: config.previewToken,
      managementToken: config.managementToken,
      enable: !!(config.previewToken || config.managementToken)  // Live preview enabled if either token exists
    };
  }
  
  /**
   * Get management token for advanced operations
   * Value from MANAGEMENT_TOKEN in .env
   * @returns {string} Management token
   */
  static getManagementToken() {
    return config.managementToken;
  }
  
  /**
   * Check if running on complex stack
   * @returns {boolean}
   */
  static hasComplexStackData() {
    return Object.keys(config.complexContentTypes).length > 0;
  }
  
  /**
   * Validate that required .env values are present
   * @param {Array<string>} requiredKeys - Array of required env keys
   * @throws {Error} If any required key is missing
   */
  static validateEnvKeys(requiredKeys) {
    const missing = requiredKeys.filter(key => {
      const value = process.env[key];
      return !value || value === '';
    });
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  /**
   * Get all available content type UIDs for a given complexity level
   * @param {string} level - 'complex', 'medium', 'simple', or 'selfReferencing'
   * @returns {string} Content type UID
   */
  static getContentTypeByComplexity(level) {
    return config.complexContentTypes[level];
  }
}

module.exports = TestDataHelper;

