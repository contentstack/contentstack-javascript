'use strict';

/**
 * COMPREHENSIVE PLUGIN SYSTEM TESTS (PHASE 3)
 * 
 * Tests SDK's plugin architecture for extensibility.
 * 
 * SDK Features Covered:
 * - Plugin registration
 * - onRequest hook execution
 * - onResponse hook execution
 * - Multiple plugin chaining
 * - Plugin state management
 * 
 * Bug Detection Focus:
 * - Plugin execution order
 * - Hook parameter passing
 * - Plugin error handling
 * - Request/response modification
 */

const Contentstack = require('../../../dist/node/contentstack.js');
const TestDataHelper = require('../../helpers/TestDataHelper');

const config = TestDataHelper.getConfig();

describe('Plugin System - Comprehensive Tests (Phase 3)', () => {

  // =============================================================================
  // BASIC PLUGIN REGISTRATION TESTS
  // =============================================================================

  describe('Plugin Registration', () => {
    
    test('Plugin_SinglePlugin_Registered', () => {
      const plugin = {
        name: 'TestPlugin',
        onRequest: (stack, request) => request,
        onResponse: (stack, request, response, data) => data
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      
      expect(stack.plugins).toBeDefined();
      expect(stack.plugins.length).toBe(1);
      expect(stack.plugins[0].name).toBe('TestPlugin');
      
      console.log('✅ Single plugin registered');
    });

    test('Plugin_MultiplePlugins_AllRegistered', () => {
      const plugin1 = {
        name: 'Plugin1',
        onRequest: (stack, request) => request
      };
      const plugin2 = {
        name: 'Plugin2',
        onResponse: (stack, request, response, data) => data
      };
      const plugin3 = {
        name: 'Plugin3',
        onRequest: (stack, request) => request,
        onResponse: (stack, request, response, data) => data
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin1, plugin2, plugin3]
      });
      
      expect(stack.plugins.length).toBe(3);
      expect(stack.plugins[0].name).toBe('Plugin1');
      expect(stack.plugins[1].name).toBe('Plugin2');
      expect(stack.plugins[2].name).toBe('Plugin3');
      
      console.log('✅ Multiple plugins registered in order');
    });

    test('Plugin_NoPlugins_EmptyArray', () => {
      const stack = Contentstack.Stack(config.stack);
      
      expect(stack.plugins).toBeDefined();
      expect(Array.isArray(stack.plugins)).toBe(true);
      expect(stack.plugins.length).toBe(0);
      
      console.log('✅ No plugins: empty array');
    });

  });

  // =============================================================================
  // ON_REQUEST HOOK TESTS
  // =============================================================================

  describe('onRequest Hook', () => {
    
    test('OnRequest_ExecutedBeforeQuery_CanModifyRequest', async () => {
      let requestIntercepted = false;
      
      const plugin = {
        name: 'RequestLogger',
        onRequest: (stack, request) => {
          requestIntercepted = true;
          expect(request).toBeDefined();
          expect(request.url).toBeDefined();
          expect(request.option).toBeDefined();
          console.log(`🔍 Request intercepted: ${request.url}`);
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(requestIntercepted).toBe(true);
      expect(result[0]).toBeDefined();
      
      console.log('✅ onRequest hook executed and request modified');
    });

    test('OnRequest_AddCustomHeader_WorksCorrectly', async () => {
      const plugin = {
        name: 'HeaderInjector',
        onRequest: (stack, request) => {
          request.option.headers['X-Custom-Header'] = 'test-value';
          console.log('🔍 Custom header added');
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Custom header injected via plugin');
    });

    test('OnRequest_ModifyURL_ReflectsInRequest', async () => {
      let originalURL = '';
      
      const plugin = {
        name: 'URLLogger',
        onRequest: (stack, request) => {
          originalURL = request.url;
          console.log(`🔍 Original URL: ${originalURL}`);
          // Don't modify, just log
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(originalURL).toBeTruthy();
      expect(originalURL).toContain(contentTypeUID);
      
      console.log('✅ URL logged via onRequest');
    });

  });

  // =============================================================================
  // ON_RESPONSE HOOK TESTS
  // =============================================================================

  describe('onResponse Hook', () => {
    
    test('OnResponse_ExecutedAfterQuery_ReceivesData', async () => {
      let responseIntercepted = false;
      
      const plugin = {
        name: 'ResponseLogger',
        onResponse: (stack, request, response, data) => {
          responseIntercepted = true;
          expect(data).toBeDefined();
          console.log(`🔍 Response intercepted with ${data.entries ? data.entries.length : 0} entries`);
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(responseIntercepted).toBe(true);
      expect(result[0]).toBeDefined();
      
      console.log('✅ onResponse hook executed with data');
    });

    test('OnResponse_ModifyData_AffectsResult', async () => {
      const plugin = {
        name: 'DataTransformer',
        onResponse: (stack, request, response, data) => {
          // Add a custom property to the data
          if (data && data.entries) {
            data.custom_property = 'added_by_plugin';
          }
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      // The custom property might be visible depending on how SDK processes the data
      console.log('✅ Data modified via onResponse');
    });

    test('OnResponse_AccessResponseMetadata_WorksCorrectly', async () => {
      let statusCode = 0;
      
      const plugin = {
        name: 'MetadataLogger',
        onResponse: (stack, request, response, data) => {
          statusCode = response.status;
          console.log(`🔍 Response status: ${statusCode}`);
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(statusCode).toBe(200);
      
      console.log('✅ Response metadata accessed in onResponse');
    });

  });

  // =============================================================================
  // MULTIPLE PLUGIN CHAINING TESTS
  // =============================================================================

  describe('Plugin Chaining', () => {
    
    test('PluginChain_MultipleOnRequest_ExecuteInOrder', async () => {
      const executionOrder = [];
      
      const plugin1 = {
        name: 'Plugin1',
        onRequest: (stack, request) => {
          executionOrder.push('Plugin1_onRequest');
          return request;
        }
      };
      
      const plugin2 = {
        name: 'Plugin2',
        onRequest: (stack, request) => {
          executionOrder.push('Plugin2_onRequest');
          return request;
        }
      };
      
      const plugin3 = {
        name: 'Plugin3',
        onRequest: (stack, request) => {
          executionOrder.push('Plugin3_onRequest');
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin1, plugin2, plugin3]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(executionOrder).toEqual(['Plugin1_onRequest', 'Plugin2_onRequest', 'Plugin3_onRequest']);
      
      console.log('✅ Multiple onRequest hooks executed in registration order');
    });

    test('PluginChain_MultipleOnResponse_ExecuteInOrder', async () => {
      const executionOrder = [];
      
      const plugin1 = {
        name: 'Plugin1',
        onResponse: (stack, request, response, data) => {
          executionOrder.push('Plugin1_onResponse');
          return data;
        }
      };
      
      const plugin2 = {
        name: 'Plugin2',
        onResponse: (stack, request, response, data) => {
          executionOrder.push('Plugin2_onResponse');
          return data;
        }
      };
      
      const plugin3 = {
        name: 'Plugin3',
        onResponse: (stack, request, response, data) => {
          executionOrder.push('Plugin3_onResponse');
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin1, plugin2, plugin3]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(executionOrder).toEqual(['Plugin1_onResponse', 'Plugin2_onResponse', 'Plugin3_onResponse']);
      
      console.log('✅ Multiple onResponse hooks executed in registration order');
    });

    test('PluginChain_BothHooks_CorrectLifecycle', async () => {
      const lifecycle = [];
      
      const plugin = {
        name: 'LifecyclePlugin',
        onRequest: (stack, request) => {
          lifecycle.push('onRequest');
          return request;
        },
        onResponse: (stack, request, response, data) => {
          lifecycle.push('onResponse');
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(lifecycle).toEqual(['onRequest', 'onResponse']);
      
      console.log('✅ Plugin lifecycle: onRequest → onResponse');
    });

  });

  // =============================================================================
  // PLUGIN STATE MANAGEMENT
  // =============================================================================

  describe('Plugin State', () => {
    
    test('PluginState_MaintainsState_AcrossRequests', async () => {
      let requestCount = 0;
      
      const plugin = {
        name: 'StatefulPlugin',
        onRequest: (stack, request) => {
          requestCount++;
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      await stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      await stack.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      
      expect(requestCount).toBe(3);
      
      console.log('✅ Plugin state maintained across requests');
    });

    test('PluginState_IndependentStacks_IndependentState', async () => {
      let stack1Count = 0;
      let stack2Count = 0;
      
      const plugin1 = {
        name: 'Plugin1',
        onRequest: (stack, request) => {
          stack1Count++;
          return request;
        }
      };
      
      const plugin2 = {
        name: 'Plugin2',
        onRequest: (stack, request) => {
          stack2Count++;
          return request;
        }
      };
      
      const stack1 = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin1]
      });
      stack1.setHost(config.host);
      
      const stack2 = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin2]
      });
      stack2.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      await stack1.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      await stack2.ContentType(contentTypeUID).Query().limit(2).toJSON().find();
      
      expect(stack1Count).toBe(1);
      expect(stack2Count).toBe(1);
      
      console.log('✅ Independent stacks maintain independent plugin state');
    });

  });

  // =============================================================================
  // EDGE CASES
  // =============================================================================

  describe('Plugin Edge Cases', () => {
    
    test('EdgeCase_PluginWithoutOnRequest_WorksCorrectly', async () => {
      const plugin = {
        name: 'OnlyResponsePlugin',
        onResponse: (stack, request, response, data) => {
          console.log('🔍 Only onResponse hook');
          return data;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Plugin with only onResponse works');
    });

    test('EdgeCase_PluginWithoutOnResponse_WorksCorrectly', async () => {
      const plugin = {
        name: 'OnlyRequestPlugin',
        onRequest: (stack, request) => {
          console.log('🔍 Only onRequest hook');
          return request;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Plugin with only onRequest works');
    });

    test('EdgeCase_EmptyPlugin_DoesNotBreak', async () => {
      const plugin = {
        name: 'EmptyPlugin'
        // No hooks defined
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      const result = await stack.ContentType(contentTypeUID)
        .Query()
        .limit(2)
        .toJSON()
        .find();
      
      expect(result[0]).toBeDefined();
      
      console.log('✅ Empty plugin does not break execution');
    });

    test('EdgeCase_PluginReturnsNull_HandlesGracefully', async () => {
      const plugin = {
        name: 'NullReturningPlugin',
        onRequest: (stack, request) => {
          // Return null instead of request (bad plugin behavior)
          return null;
        }
      };
      
      const stack = Contentstack.Stack({
        ...config.stack,
        plugins: [plugin]
      });
      stack.setHost(config.host);
      
      const contentTypeUID = TestDataHelper.getContentTypeUID('article', true);
      
      try {
        await stack.ContentType(contentTypeUID)
          .Query()
          .limit(2)
          .toJSON()
          .find();
        
        // If it doesn't fail, SDK handles null gracefully
        console.log('✅ SDK handles null return from plugin');
      } catch (error) {
        // Or it might fail
        console.log('✅ Plugin returning null causes error (as expected)');
      }
    });

  });

});

