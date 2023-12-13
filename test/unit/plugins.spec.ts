import exp = require('constants');
import * as core from '@contentstack/core';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as Contentstack from '../../src/lib/contentstack';
import { Stack } from '../../src/lib/stack';
import { StackConfig } from '../../src/lib/types';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

jest.mock('axios');

describe('Contentstack', () => {

  it('should add plugins to stack when plugins in config is passed', async () => {
    // const spy = jest.spyOn(axios.interceptors.request, 'use');

    // spy.mockImplementationOnce((callback) => {
    //   // Simulate the request interceptor logic
    //   const modifiedConfig = callback(config);
    //   // Modify the config or assert as needed
    //   modifiedConfig.headers.Authorization = 'Bearer yourToken';

    //   return Promise.resolve(modifiedConfig);
    // });

    const client = core.httpClient(MOCK_CLIENT_OPTIONS);
    const mockClient = new MockAdapter(client as any);

    mockClient.onGet('/asset/myAsset').reply(200, {});
    class CustomPlugin {
      onRequest(request: AxiosRequestConfig) {
        request.data = { ...request.data, key1: 'value1' };

        return request;
      }
      async onResponse(request: AxiosRequestConfig, response: AxiosResponse) {
        response.data = { ...response.data, assetDetails: 'addedDetails' };

        return response;
      }
    }

    const stackInstance = Contentstack.Stack({
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      plugins: [new CustomPlugin()],
    });

    const myasset = await stackInstance.Asset('myAsset').fetch<any>();
    console.log('🚀 ~ file: contentstack.spec.ts:195 ~ it ~ myasset:', myasset);
    expect(stackInstance).toBeInstanceOf(Stack);
  });
});
