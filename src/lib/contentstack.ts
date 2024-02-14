import { httpClient, retryRequestHandler, retryResponseErrorHandler, retryResponseHandler } from '@contentstack/core';
import { InternalAxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { handleRequest } from './cache';
import { Stack as StackClass } from './stack';
import { Policy, StackConfig } from './types';
import { getHost } from './utils';
export * as Utils from '@contentstack/utils';

/**
 * @method stack
 * @memberof Contentstack
 * @description Creates a stack instance
 * @param {StackConfig} config - config object for stack with apiKey, deliveryToken and environment as required fields
 *
 * @example
 * import contentstack from '@contentstack/delivery-sdk'
 * const stack = contentstack.Stack({ apiKey: "apiKey", deliveryToken: "deliveryToken", environment: "environment" });
 * @example
 * import contentstack from '@contentstack/delivery-sdk'
 * const stack = contentstack.Stack({
 *   apiKey: "apiKey",
 *   deliveryToken: "deliveryToken",
 *   environment: "environment",
 *   region:"region",
 *   locale:"locale",
 *   cacheOptions: {
 *    policy: Policy.CACHE_THEN_NETWORK,
 *    storeType: 'localStorage'
 *   }
 * }
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Stack(config: StackConfig): StackClass {
  let defaultConfig = {
    defaultHostname: 'cdn.contentstack.io',
    headers: {} as AxiosRequestHeaders,
    params: {} as any,
    live_preview: {} as any
  };

  if (config.live_preview?.enable === true) {
    if (config.live_preview?.management_token != null && config.live_preview?.preview_token == null) {
      config.host = 'api.contentstack.io'
      config.live_preview.host = config.host
    } else if (config.live_preview?.preview_token != null && config.live_preview?.management_token == null) {
      config.host = 'rest-preview.contentstack.com'
      config.live_preview.host = config.host
    }
  } else config.host = defaultConfig.defaultHostname
  defaultConfig.live_preview = config.live_preview

  defaultConfig.defaultHostname = getHost(config.region, config.host);

  if (config.apiKey) {
    defaultConfig.headers.api_key = config.apiKey;
  } else {
    throw new Error('API key for Stack is required.');
  }
  if (config.deliveryToken) {
    defaultConfig.headers.access_token = config.deliveryToken;
  } else {
    throw new Error('Delivery token for Stack is required.');
  }
  if (config.environment) {
    defaultConfig.params.environment = config.environment;
  } else {
    throw new Error('Environment for Stack is required');
  }

  if (config.early_access) {
    defaultConfig.headers['x-header-ea'] = config.early_access.join(',');
  }

  // return new Stack(httpClient(defaultConfig), config);
  const client = httpClient(defaultConfig as any);

  if (config.logHandler) client.defaults.logHandler = config.logHandler;

  if (config.cacheOptions && config.cacheOptions.policy !== Policy.IGNORE_CACHE) {
    const defaultAdapter = client.defaults.adapter;
    client.defaults.adapter = (adapterConfig: any) => {
      return new Promise(async (resolve, reject) => {
        if (config.cacheOptions)
          await handleRequest(config.cacheOptions, config.apiKey, defaultAdapter, resolve, reject, adapterConfig);
      });
    };
  }
  // Retry policy handlers
  const errorHandler = (error: any) => {
    retryResponseErrorHandler(error, config);
  };
  client.interceptors.request.use(retryRequestHandler);
  client.interceptors.response.use(retryResponseHandler, errorHandler);

  if (config.plugins) {
    client.interceptors.request.use((reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (config && config.plugins)
        config.plugins.forEach((pluginInstance) => {
          reqConfig = pluginInstance.onRequest(reqConfig);
        });
      
      return reqConfig;
    });

    client.interceptors.response.use((response: AxiosResponse) => {
      if (config && config.plugins)
        config.plugins.forEach((pluginInstance) => {
          response = pluginInstance.onResponse(response.request, response, response.data);
        });

      return response;
    });
  }

  return new StackClass(client, config);
}
