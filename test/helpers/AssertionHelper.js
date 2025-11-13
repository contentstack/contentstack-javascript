'use strict';

/**
 * Helper class for common test assertions
 * Provides reusable assertion patterns for SDK testing
 */
class AssertionHelper {
  /**
   * Assert entry has expected structure
   * @param {Object} entry - Entry object
   * @param {Array<string>} requiredFields - Required field names (defaults to uid and title)
   */
  static assertEntryStructure(entry, requiredFields = ['uid', 'title']) {
    expect(entry).toBeDefined();
    expect(typeof entry).toBe('object');
    expect(entry).not.toBeNull();
    
    requiredFields.forEach(field => {
      expect(entry[field]).toBeDefined();
    });
  }
  
  /**
   * Assert reference is resolved (not just UID string)
   * @param {Object} entry - Entry object
   * @param {string} refField - Reference field name
   */
  static assertReferenceResolved(entry, refField) {
    expect(entry[refField]).toBeDefined();
    
    if (Array.isArray(entry[refField])) {
      // Multiple references
      expect(entry[refField].length).toBeGreaterThan(0);
      entry[refField].forEach(ref => {
        expect(typeof ref).toBe('object');
        expect(typeof ref).not.toBe('string'); // Not just UID
        expect(ref.uid).toBeDefined();
      });
    } else {
      // Single reference
      expect(typeof entry[refField]).toBe('object');
      expect(typeof entry[refField]).not.toBe('string'); // Not just UID
      expect(entry[refField].uid).toBeDefined();
    }
  }
  
  /**
   * Assert global field is present and valid
   * @param {Object} entry - Entry object
   * @param {string} globalFieldName - Global field name
   */
  static assertGlobalFieldPresent(entry, globalFieldName) {
    expect(entry[globalFieldName]).toBeDefined();
    expect(typeof entry[globalFieldName]).toBe('object');
    expect(entry[globalFieldName]).not.toBeNull();
  }
  
  /**
   * Assert taxonomy is attached to entry
   * @param {Object} entry - Entry object
   * @param {string} taxonomyUID - Taxonomy UID
   */
  static assertTaxonomyAttached(entry, taxonomyUID) {
    expect(entry.taxonomies).toBeDefined();
    expect(entry.taxonomies[taxonomyUID]).toBeDefined();
    expect(Array.isArray(entry.taxonomies[taxonomyUID])).toBe(true);
  }
  
  /**
   * Assert array of entries all match condition
   * @param {Array} entries - Array of entries
   * @param {Function} condition - Condition function that returns boolean
   * @param {string} conditionDescription - Description of condition for error messages
   */
  static assertAllEntriesMatch(entries, condition, conditionDescription = 'match condition') {
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
    
    const allMatch = entries.every(condition);
    if (!allMatch) {
      const failedEntries = entries.filter(e => !condition(e));
      console.error(`${failedEntries.length} entries failed to ${conditionDescription}:`, failedEntries);
    }
    expect(allMatch).toBe(true);
  }
  
  /**
   * Assert query result structure
   * @param {Array} result - Query result from .find()
   * @param {boolean} expectCount - Whether count should be present
   * @param {boolean} expectContentType - Whether content type should be present
   */
  static assertQueryResultStructure(result, expectCount = false, expectContentType = false) {
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeDefined(); // entries array
    expect(Array.isArray(result[0])).toBe(true);
    
    if (expectContentType) {
      expect(result[1]).toBeDefined(); // content type
      expect(typeof result[1]).toBe('object');
    }
    
    if (expectCount) {
      const countIndex = expectContentType ? 2 : 1;
      expect(result[countIndex]).toBeDefined(); // count
      expect(typeof result[countIndex]).toBe('number');
      expect(result[countIndex]).toBeGreaterThanOrEqual(0);
    }
  }
  
  /**
   * Assert performance is within acceptable range
   * @param {Function} fn - Async function to measure
   * @param {number} maxTimeMs - Maximum time in milliseconds (default: 3000ms)
   * @returns {Promise<number>} Duration in milliseconds
   */
  static async assertPerformance(fn, maxTimeMs = 3000) {
    const startTime = Date.now();
    await fn();
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(maxTimeMs);
    return duration;
  }
  
  /**
   * Assert field types are correct
   * @param {Object} entry - Entry object
   * @param {Object} fieldTypes - Object mapping field names to expected types ('string', 'number', 'boolean', 'object', 'array')
   */
  static assertFieldTypes(entry, fieldTypes) {
    Object.keys(fieldTypes).forEach(fieldName => {
      const expectedType = fieldTypes[fieldName];
      
      if (expectedType === 'array') {
        expect(Array.isArray(entry[fieldName])).toBe(true);
      } else {
        const actualType = typeof entry[fieldName];
        expect(actualType).toBe(expectedType);
      }
    });
  }
  
  /**
   * Assert deep reference is resolved to specified depth
   * @param {Object} entry - Entry object
   * @param {Array<string>} referencePath - Path to follow (e.g., ['author', 'posts', 'comments'])
   * @param {number} expectedDepth - Expected depth of resolution
   */
  static assertDeepReferenceResolved(entry, referencePath, expectedDepth) {
    let current = entry;
    
    for (let i = 0; i < expectedDepth; i++) {
      const fieldName = referencePath[i];
      expect(current[fieldName]).toBeDefined();
      
      if (Array.isArray(current[fieldName])) {
        expect(current[fieldName].length).toBeGreaterThan(0);
        current = current[fieldName][0];
      } else {
        current = current[fieldName];
      }
      
      expect(typeof current).toBe('object');
      expect(typeof current).not.toBe('string'); // Not just UID
      expect(current.uid).toBeDefined();
    }
  }
  
  /**
   * Assert modular blocks structure
   * @param {Object} entry - Entry object
   * @param {string} blockFieldName - Modular blocks field name
   * @param {number} minBlocks - Minimum expected number of blocks (default: 1)
   */
  static assertModularBlocksPresent(entry, blockFieldName, minBlocks = 1) {
    expect(entry[blockFieldName]).toBeDefined();
    expect(Array.isArray(entry[blockFieldName])).toBe(true);
    expect(entry[blockFieldName].length).toBeGreaterThanOrEqual(minBlocks);
    
    // Each block should be an object with required fields
    entry[blockFieldName].forEach((block, index) => {
      expect(typeof block).toBe('object');
      expect(block).not.toBeNull();
      // Most modular blocks have a UID or _metadata
      expect(block._metadata || block.uid || block._content_type_uid).toBeDefined();
    });
  }
  
  /**
   * Assert variant is applied
   * @param {Object} entry - Entry object
   * @param {string} variantUID - Expected variant UID
   */
  static assertVariantApplied(entry, variantUID) {
    expect(entry._variant).toBeDefined();
    expect(entry._variant).toBe(variantUID);
  }
  
  /**
   * Assert locale fallback worked
   * @param {Object} entry - Entry object
   * @param {string} requestedLocale - Locale that was requested
   * @param {string} fallbackLocale - Expected fallback locale
   */
  static assertLocaleFallback(entry, requestedLocale, fallbackLocale) {
    expect(entry.publish_details).toBeDefined();
    expect(entry.publish_details.locale).toBeDefined();
    
    // Entry should be from fallback locale if content not available in requested locale
    const actualLocale = entry.publish_details.locale;
    expect([requestedLocale, fallbackLocale]).toContain(actualLocale);
  }
  
  /**
   * Assert embedded items are present and resolved in JSON RTE
   * @param {Object} entry - Entry object
   * @param {string} rteFieldName - JSON RTE field name
   */
  static assertEmbeddedItemsResolved(entry, rteFieldName) {
    expect(entry[rteFieldName]).toBeDefined();
    expect(typeof entry[rteFieldName]).toBe('object');
    
    // Check for embedded items in JSON RTE structure
    if (entry[rteFieldName].json) {
      // JSON RTE format
      expect(entry._embedded_items).toBeDefined();
      // Embedded items should be objects, not just UIDs
      Object.values(entry._embedded_items).forEach(item => {
        expect(typeof item).toBe('object');
        expect(typeof item).not.toBe('string');
      });
    }
  }
  
  /**
   * Assert error response structure
   * @param {Error} error - Error object
   * @param {number} expectedStatusCode - Expected HTTP status code
   */
  static assertErrorStructure(error, expectedStatusCode) {
    expect(error).toBeDefined();
    expect(error.http_code || error.status || error.statusCode).toBe(expectedStatusCode);
    expect(error.http_message || error.message).toBeTruthy();
  }
  
  /**
   * Assert pagination metadata
   * @param {Array} result - Query result
   * @param {number} expectedLimit - Expected limit
   * @param {number} expectedSkip - Expected skip
   */
  static assertPaginationMetadata(result, expectedLimit, expectedSkip) {
    // Note: SDK may not always return pagination metadata in result
    // This is a helper to check when it does
    if (result.length > 1 && result[result.length - 1].limit !== undefined) {
      const metadata = result[result.length - 1];
      expect(metadata.limit).toBe(expectedLimit);
      expect(metadata.skip).toBe(expectedSkip);
    }
  }
  
  /**
   * Assert image transformation URL is valid
   * @param {string} originalUrl - Original image URL
   * @param {string} transformedUrl - Transformed image URL
   * @param {Object} params - Transformation parameters applied
   */
  static assertImageTransformation(originalUrl, transformedUrl, params) {
    expect(transformedUrl).toBeDefined();
    expect(typeof transformedUrl).toBe('string');
    expect(transformedUrl).toContain(originalUrl);
    
    // Check that transformation params are in URL
    Object.keys(params).forEach(key => {
      const value = params[key];
      // Transformation params should appear in URL query string
      expect(transformedUrl).toContain(`${key}=`);
    });
  }
}

module.exports = AssertionHelper;

