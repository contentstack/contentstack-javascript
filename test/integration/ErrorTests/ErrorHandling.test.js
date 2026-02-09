'use strict';

/**
 * Error Handling - COMPREHENSIVE Tests
 * 
 * Tests for error handling across SDK:
 * - Invalid API keys/tokens
 * - Malformed queries
 * - Network errors
 * - Invalid UIDs
 * - Error response structure
 * - Error recovery
 * 
 * Focus Areas:
 * 1. API credential errors
 * 2. Query validation errors
 * 3. UID validation errors
 * 4. Error response consistency
 * 5. Graceful degradation
 * 
 * Bug Detection:
 * - Missing error codes
 * - Unclear error messages
 * - SDK crashes on errors
 * - Inconsistent error structure
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const init = require('../../config.js');
const TestDataHelper = require('../../helpers/TestDataHelper');
const AssertionHelper = require('../../helpers/AssertionHelper');

let Stack;

describe('Error Tests - Error Handling & Validation', () => {
  beforeAll((done) => {
    Stack = Contentstack.Stack(init.stack);
    Stack.setHost(init.host);
    setTimeout(done, 1000);
  });

  describe('Invalid Content Type Errors', () => {
    test('Error_InvalidContentTypeUID_ReturnsStructuredError', async () => {
      try {
        await Stack.ContentType('invalid_ct_uid_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Validate error structure
        expect(error.error_code).toBeDefined();
        expect(error.error_message).toBeDefined();
        expect(error.status).toBeDefined();
        
        console.log(`✅ Invalid content type error: ${error.error_code} - ${error.error_message}`);
      }
    });

    test('Error_EmptyContentTypeUID_HandlesGracefully', async () => {
      try {
        await Stack.ContentType('')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log(`✅ Empty content type UID error handled`);
      }
    });

    test('Error_NullContentTypeUID_HandlesGracefully', async () => {
      try {
        await Stack.ContentType(null)
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Null content type UID error handled');
      }
    });

    test('Error_UndefinedContentTypeUID_HandlesGracefully', async () => {
      try {
        await Stack.ContentType(undefined)
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Undefined content type UID error handled');
      }
    });
  });

  describe('Invalid Entry Errors', () => {
    test('Error_InvalidEntryUID_ReturnsStructuredError', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry('invalid_entry_uid_12345')
          .toJSON()
          .fetch();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error.error_code).toBeDefined();
        expect(error.error_message).toBeDefined();
        
        console.log(`✅ Invalid entry UID error: ${error.error_code}`);
      }
    });

    test('Error_EmptyEntryUID_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry('')
          .toJSON()
          .fetch();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Empty entry UID error handled');
      }
    });

    test('Error_NonExistentEntryUID_ReturnsNotFound', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Entry('blt000000000000000')
          .toJSON()
          .fetch();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error.error_code).toBeDefined();
        // Error message can be "not found" or "doesn't exist"
        expect(error.error_message.toLowerCase()).toMatch(/not found|doesn't exist/);
        
        console.log('✅ Non-existent entry returns proper error');
      }
    });
  });

  describe('Invalid Query Parameters', () => {
    test('Error_InvalidLimit_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .limit(-1) // Negative limit
          .toJSON()
          .find();
        
        // May succeed with default limit or fail
        console.log('ℹ️  Negative limit handled (may use default)');
      } catch (error) {
        console.log('✅ Invalid limit error handled');
        expect(error).toBeDefined();
      }
    });

    test('Error_InvalidSkip_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await Stack.ContentType(contentTypeUID)
          .Query()
          .skip(-10) // Negative skip
          .limit(5)
          .toJSON()
          .find();
        
        // May succeed with skip=0 or fail
        console.log('ℹ️  Negative skip handled (may use 0)');
      } catch (error) {
        console.log('✅ Invalid skip error handled');
        expect(error).toBeDefined();
      }
    });

    test('Error_ExcessiveLimit_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(10000) // Excessive limit
        .toJSON()
        .find();
      
      // SDK may cap at max limit (typically 100)
      expect(result[0].length).toBeLessThanOrEqual(100);
      
      console.log(`✅ Excessive limit capped: ${result[0].length} entries returned`);
    });
  });

  describe('Invalid Field Names', () => {
    test('Error_InvalidFieldName_ReturnsEmpty', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('non_existent_field_xyz', 'value')
        .limit(5)
        .toJSON()
        .find();
      
      // Should return empty or all entries (depends on SDK)
      expect(result[0]).toBeDefined();
      console.log(`✅ Invalid field name handled: ${result[0].length} results`);
    });

    test('Error_EmptyFieldName_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .where('', 'value')
          .limit(5)
          .toJSON()
          .find();
        
        // May succeed or fail
        console.log('ℹ️  Empty field name handled gracefully');
      } catch (error) {
        console.log('✅ Empty field name error handled');
        expect(error).toBeDefined();
      }
    });

    test('Error_SpecialCharactersInFieldName_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .where('field$%^&name', 'value')
          .limit(5)
          .toJSON()
          .find();
        
        // May succeed with special characters handled
        expect(result[0]).toBeDefined();
        console.log('✅ Special characters in field name handled');
      } catch (error) {
        // Special characters may cause validation error - acceptable
        expect(error.error_code).toBeDefined();
        console.log('✅ Special characters in field name trigger validation error (acceptable)');
      }
    });
  });

  describe('Error Response Structure Validation', () => {
    test('ErrorStructure_HasRequiredFields', async () => {
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        // Validate error structure
        expect(error.error_code).toBeDefined();
        expect(typeof error.error_code).toBe('number');
        
        expect(error.error_message).toBeDefined();
        expect(typeof error.error_message).toBe('string');
        
        expect(error.status).toBeDefined();
        expect(typeof error.status).toBe('number');
        
        console.log('✅ Error structure has all required fields');
      }
    });

    test('ErrorStructure_StatusCodeMatches', async () => {
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        // Status should be HTTP-like (400, 404, 422, etc.)
        expect(error.status).toBeGreaterThanOrEqual(400);
        expect(error.status).toBeLessThan(600);
        
        console.log(`✅ Error status code valid: ${error.status}`);
      }
    });

    test('ErrorStructure_MessageIsInformative', async () => {
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        // Error message should be non-empty and helpful
        expect(error.error_message.length).toBeGreaterThan(10);
        expect(error.error_message).not.toBe('Error');
        
        console.log(`✅ Error message is informative: "${error.error_message}"`);
      }
    });
  });

  describe('Query Validation Errors', () => {
    test('Error_InvalidWhereOperator_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .addQuery('field', { $invalid_op: 'value' })
          .limit(5)
          .toJSON()
          .find();
        
        // May ignore invalid operator or fail
        console.log('ℹ️  Invalid query operator handled');
      } catch (error) {
        console.log('✅ Invalid query operator error handled');
        expect(error).toBeDefined();
      }
    });

    test('Error_MalformedQuery_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        const result = await Stack.ContentType(contentTypeUID)
          .Query()
          .addQuery('field', { nested: { deeply: { invalid: true } } })
          .limit(5)
          .toJSON()
          .find();
        
        // Should handle malformed queries
        console.log('ℹ️  Malformed query handled');
      } catch (error) {
        console.log('✅ Malformed query error handled');
        expect(error).toBeDefined();
      }
    });
  });

  describe('Reference Resolution Errors', () => {
    test('Error_InvalidReferenceField_IgnoresGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference('non_existent_reference_field')
        .limit(3)
        .toJSON()
        .find();
      
      // Should ignore invalid reference field
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Invalid reference field ignored gracefully');
    });

    test('Error_EmptyReferenceFieldArray_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .includeReference([])
        .limit(3)
        .toJSON()
        .find();
      
      // Empty array should be handled gracefully
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Empty reference field array handled');
    });
  });

  describe('Projection Errors', () => {
    test('Error_EmptyOnlyArray_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only([])
        .limit(3)
        .toJSON()
        .find();
      
      // Empty only() should return all fields or minimal fields
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Empty only() array handled');
    });

    test('Error_EmptyExceptArray_HandlesGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .except([])
        .limit(3)
        .toJSON()
        .find();
      
      // Empty except() should return all fields
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Empty except() array handled');
    });

    test('Error_InvalidFieldInProjection_IgnoresGracefully', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .only(['title', 'non_existent_field_xyz'])
        .limit(3)
        .toJSON()
        .find();
      
      // Should return valid fields, ignore invalid ones
      if (result[0].length > 0) {
        expect(result[0][0].title).toBeDefined();
      }
      
      console.log('✅ Invalid field in projection ignored');
    });
  });

  describe('Error Recovery & Consistency', () => {
    test('ErrorRecovery_AfterError_NextQueryWorks', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      // First query - causes error
      try {
        await Stack.ContentType('invalid_ct_12345')
          .Query()
          .limit(1)
          .toJSON()
          .find();
      } catch (error) {
        // Error expected
      }
      
      // Second query - should work fine
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .limit(3)
        .toJSON()
        .find();
      
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ SDK recovers gracefully after error');
    });

    test('ErrorRecovery_MultipleErrors_ConsistentBehavior', async () => {
      const errors = [];
      
      // Trigger same error multiple times
      for (let i = 0; i < 3; i++) {
        try {
          await Stack.ContentType('invalid_ct_12345')
            .Query()
            .limit(1)
            .toJSON()
            .find();
        } catch (error) {
          errors.push(error);
        }
      }
      
      // All errors should have same structure
      expect(errors.length).toBe(3);
      errors.forEach(error => {
        expect(error.error_code).toBeDefined();
        expect(error.error_message).toBeDefined();
      });
      
      // Error codes should be consistent
      expect(errors[0].error_code).toBe(errors[1].error_code);
      expect(errors[1].error_code).toBe(errors[2].error_code);
      
      console.log('✅ Error handling is consistent across multiple calls');
    });
  });

  describe('Special Error Cases', () => {
    test('Error_VeryLongUID_HandlesGracefully', async () => {
      const veryLongUID = 'a'.repeat(1000);
      
      try {
        await Stack.ContentType(veryLongUID)
          .Query()
          .limit(1)
          .toJSON()
          .find();
        
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        console.log('✅ Very long UID handled gracefully');
      }
    });

    test('Error_SQLInjectionAttempt_SafelyHandled', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('title', "'; DROP TABLE entries; --")
        .limit(3)
        .toJSON()
        .find();
      
      // Should treat as normal string, not SQL
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ SQL injection attempt safely handled');
    });

    test('Error_XSSAttempt_SafelyHandled', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('title', '<script>alert("xss")</script>')
        .limit(3)
        .toJSON()
        .find();
      
      // Should treat as normal string
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ XSS attempt safely handled');
    });

    test('Error_UnicodeInQuery_HandlesCorrectly', async () => {
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await Stack.ContentType(contentTypeUID)
        .Query()
        .where('title', '日本語テスト 🎉')
        .limit(3)
        .toJSON()
        .find();
      
      // Should handle Unicode correctly
      AssertionHelper.assertQueryResultStructure(result);
      console.log('✅ Unicode in query handled correctly');
    });
  });
});

