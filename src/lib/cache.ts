// import { PersistanceStore } from '../persistance';

import { PersistanceStore } from '../persistance';
import { CacheOptions, Policy } from './types';

export async function handleRequest(
  cacheOptions: CacheOptions,
  apiKey: string,
  defaultAdapter: any,
  resolve: any,
  reject: any,
  config: any
) {
  const cacheStore = new PersistanceStore(cacheOptions);
  switch (cacheOptions.policy) {
    case Policy.NETWORK_ELSE_CACHE: {
      const apiResponse = await defaultAdapter(config);

      if (apiResponse.data) {
        cacheStore.setItem(apiKey, apiResponse.data, config.contentTypeUid, cacheOptions.maxAge);

        return resolve(apiResponse.data);
      } else {
        const cacheResponse = cacheStore.getItem(apiKey, config.contentTypeUid);
        if (cacheResponse)
          return resolve({
            data: cacheResponse,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          });
      }

      return reject(apiResponse);
    }
    case Policy.CACHE_THEN_NETWORK: {
      const cacheResponse = cacheStore.getItem(apiKey, config.contentTypeUid);
      if (cacheResponse)
        return resolve({
          data: cacheResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });

      const apiResponse = await defaultAdapter(config);

      if (apiResponse.data) {
        cacheStore.setItem(apiKey, apiResponse.data, config.contentTypeUid, cacheOptions.maxAge);

        return resolve(apiResponse.data);
      } else {
        return reject(apiResponse);
      }
    }
    case Policy.CACHE_ELSE_NETWORK: {
      const cacheResponse = cacheStore.getItem(apiKey, config.contentTypeUid);

      if (cacheResponse)
        return resolve({
          data: cacheResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });
      else {
        const apiResponse = await defaultAdapter(config);

        if (apiResponse.data) {
          cacheStore.setItem(apiKey, apiResponse.data, config.contentTypeUid, cacheOptions.maxAge);

          return resolve(apiResponse.data);
        } else {
          return reject(apiResponse);
        }
      }
    }
  }
}
