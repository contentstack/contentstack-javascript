'use strict';
require('dotenv').config();

const requiredVars = ['HOST', 'API_KEY', 'DELIVERY_TOKEN', 'ENVIRONMENT'];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  const errorMessage = `\x1b[31mError: Missing environment variables - ${missingVars.join(', ')}`;
  const error = new Error(errorMessage);
  error.stack = error.message;
  throw error;
}

module.exports = {
  // Stack configuration
  stack: { 
    api_key: process.env.API_KEY, 
    delivery_token: process.env.DELIVERY_TOKEN, 
    environment: process.env.ENVIRONMENT,
    branch: process.env.BRANCH_UID || 'main'  // Branch is part of Stack config
  },
  host: process.env.HOST,
  
  // Additional tokens for comprehensive tests
  managementToken: process.env.MANAGEMENT_TOKEN,
  previewToken: process.env.PREVIEW_TOKEN,
  livePreviewHost: process.env.LIVE_PREVIEW_HOST,
  
  // Branch configuration (also available separately for reference)
  branch: process.env.BRANCH_UID || 'main',
  
  // LEGACY content types (keep for backward compatibility)
  contentTypes: {
    source: 'source',
    numbers_content_type: 'numbers_content_type'
  },
  
  // Content Types (UIDs from environment variables)
  complexContentTypes: {
    // Complexity level shortcuts
    complex: process.env.COMPLEX_CONTENT_TYPE_UID,
    medium: process.env.MEDIUM_CONTENT_TYPE_UID,
    simple: process.env.SIMPLE_CONTENT_TYPE_UID,
    selfReferencing: process.env.SELF_REF_CONTENT_TYPE_UID,
    
    // Generic content type names (all values from env vars, keys are generic)
    article: process.env.MEDIUM_CONTENT_TYPE_UID,
    author: process.env.SIMPLE_CONTENT_TYPE_UID,
    cybersecurity: process.env.COMPLEX_CONTENT_TYPE_UID,
    section_builder: process.env.SELF_REF_CONTENT_TYPE_UID,  // Alias for selfReferencing
    page_builder: 'page_builder'  // Standard content type for modular blocks testing
  },
  
  // Test Entry UIDs (all from environment variables)
  testEntries: {
    complex: process.env.COMPLEX_ENTRY_UID,
    medium: process.env.MEDIUM_ENTRY_UID,
    simple: process.env.SIMPLE_ENTRY_UID,
    selfReferencing: process.env.SELF_REF_ENTRY_UID,
    complexBlocks: process.env.COMPLEX_BLOCKS_ENTRY_UID
  },
  
  // Variant configuration
  variants: {
    variantUID: process.env.VARIANT_UID
  },
  
  // Asset configuration
  assets: {
    imageUID: process.env.IMAGE_ASSET_UID
  },
  
  // Taxonomy configuration (generic country-based taxonomies with terms from .env)
  taxonomies: {
    usa: {
      uid: 'usa',
      term: process.env.TAX_USA_STATE
    },
    india: {
      uid: 'india',
      term: process.env.TAX_INDIA_STATE
    }
  },
  
  // Locale configurations (standard/common locale codes)
  locales: {
    primary: 'en-us',
    secondary: 'fr-fr',
    japanese: 'ja-jp'
  },
  
  // Global field UIDs (values from environment variables, keys are descriptive)
  globalFields: {
    seo: process.env.GLOBAL_FIELD_SIMPLE,               // Simple global field
    gallery: process.env.GLOBAL_FIELD_MEDIUM,           // Medium complexity
    content_block: process.env.GLOBAL_FIELD_COMPLEX,    // Complex global field
    video_experience: process.env.GLOBAL_FIELD_VIDEO,   // Video field
    referenced_data: 'referenced_data'                  // Generic field name (optional)
  },
  
  // Reference field name (generic/common field name)
  referenceFields: {
    author: 'author'
  }
};
