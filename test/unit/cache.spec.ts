import MockAdapter from 'axios-mock-adapter';
import { httpClient, AxiosInstance } from '@contentstack/core';
import { handleRequest } from '../../src/lib/cache';
import { HOST_URL } from '../utils/constant';
import { Policy } from '../../src/lib/types';
import { PersistanceStore } from '../../src/persistance';

describe('Cache handleRequest function', () => {
  let client: AxiosInstance;
  let mockClient: MockAdapter;
  let apiKey: string;
  let resolve: jest.Mock<any, any>;
  let reject: jest.Mock<any, any>;
  let config: { contentTypeUid: string; headers: object };

  beforeAll(() => {
    client = httpClient({ defaultHostname: HOST_URL });
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    apiKey = 'testKey';
    resolve = jest.fn();
    reject = jest.fn();
    config = { contentTypeUid: 'testContentType', headers: {} };
  });

  describe('NETWORK_ELSE_CACHE policy', () => {
    it('should return network response when proper response is received', async () => {
      const cacheOptions = { policy: Policy.NETWORK_ELSE_CACHE, maxAge: 3600 };
      const defaultAdapter = jest.fn((_config) => ({ data: 'foo' }));
      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalledWith(config);
      expect(resolve).toBeCalledWith('foo');
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });

    it('should return cache data when proper network response is not received', async () => {
      const cacheOptions = { policy: Policy.NETWORK_ELSE_CACHE, maxAge: 3600 };
      const defaultAdapter = jest.fn().mockReturnValue({
        foo: 'bar',
        baz: 'quux',
      });
      const cacheStore = new PersistanceStore(cacheOptions);

      cacheStore.setItem(apiKey, 'cacheData', config.contentTypeUid, cacheOptions.maxAge);
      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalledWith(config);
      expect(resolve).toBeCalledWith({ config: {}, data: 'cacheData', headers: {}, status: 200, statusText: 'OK' });
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });

    it('should return error data when network response has error', async () => {
      const cacheOptions = { policy: Policy.NETWORK_ELSE_CACHE, maxAge: 3600 };
      const defaultAdapter = jest.fn().mockReturnValue({
        foo: 'bar',
        baz: 'quux',
      });
      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalledWith(config);
      expect(resolve).not.toBeCalled();
      expect(reject).toBeCalledWith({
        foo: 'bar',
        baz: 'quux',
      });

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });
  });

  describe('CACHE_THEN_NETWORK policy', () => {
    it('should return cache response when proper cache is available then return network response', async () => {
      const cacheOptions = { policy: Policy.CACHE_THEN_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn((_config) => ({ data: 'foo' }));

      const cacheStore = new PersistanceStore(cacheOptions);
      cacheStore.setItem(apiKey, 'cacheData', config.contentTypeUid, cacheOptions.maxAge);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).not.toHaveBeenCalled();
      expect(resolve).toBeCalledWith({ config: {}, data: 'cacheData', headers: {}, status: 200, statusText: 'OK' });
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });
    it('should return api response when proper cache is not available', async () => {
      const cacheOptions = { policy: Policy.CACHE_THEN_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn((_config) => ({ data: 'foo' }));

      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalled();
      expect(resolve).toBeCalledWith('foo');
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });
    it('should return error api response when data is not available in network or cache', async () => {
      const cacheOptions = { policy: Policy.CACHE_THEN_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn().mockReturnValue({
        foo: 'bar',
        baz: 'quux',
      });

      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalled();
      expect(resolve).not.toBeCalled();
      expect(reject).toBeCalledWith({
        foo: 'bar',
        baz: 'quux',
      });

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });
  });

  describe('CACHE_ELSE_NETWORK policy', () => {
    it('should return cache response when proper cache is available', async () => {
      const cacheOptions = { policy: Policy.CACHE_ELSE_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn((_config) => ({ data: 'foo' }));

      const cacheStore = new PersistanceStore(cacheOptions);
      cacheStore.setItem(apiKey, 'cacheData', config.contentTypeUid, cacheOptions.maxAge);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).not.toHaveBeenCalledWith(config);
      expect(resolve).toBeCalledWith({ config: {}, data: 'cacheData', headers: {}, status: 200, statusText: 'OK' });
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });

    it('should return network response data when cache is not available', async () => {
      const cacheOptions = { policy: Policy.CACHE_ELSE_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn((_config) => ({ data: 'foo' }));
      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalledWith(config);
      expect(resolve).toBeCalledWith('foo');
      expect(reject).not.toBeCalled();

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });

    it('should return error data when network response has error', async () => {
      const cacheOptions = { policy: Policy.CACHE_ELSE_NETWORK, maxAge: 3600 };
      const defaultAdapter = jest.fn().mockReturnValue({
        foo: 'bar',
        baz: 'quux',
      });
      const cacheStore = new PersistanceStore(cacheOptions);

      await handleRequest(cacheOptions, apiKey, defaultAdapter, resolve, reject, config);

      expect(defaultAdapter).toHaveBeenCalled();
      expect(resolve).not.toBeCalled();
      expect(reject).toBeCalledWith({
        foo: 'bar',
        baz: 'quux',
      });

      cacheStore.removeItem(apiKey, config.contentTypeUid);
    });
  });
});
