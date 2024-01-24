import exp = require('constants');
import * as core from '@contentstack/core';
import * as Contentstack from '../../src/lib/contentstack';
import { Stack } from '../../src/lib/stack';
import { Policy, Region, StackConfig } from '../../src/lib/types';
import { DUMMY_URL, HOST_EU_REGION, HOST_URL } from '../utils/constant';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

jest.mock('@contentstack/core');
const createHttpClientMock = <jest.Mock<typeof core.httpClient>>(<unknown>core.httpClient);

const reqInterceptor = jest.fn();
const resInterceptor = jest.fn();

describe('Contentstack', () => {
  beforeEach(() =>
    createHttpClientMock.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      defaults: {
        host: HOST_URL,
      },
      interceptors: {
        request: {
          use: reqInterceptor,
        },
        response: {
          use: resInterceptor,
        },
      },
    })
  );
  afterEach(() => {
    createHttpClientMock.mockReset();
  });

  const createStackInstance = (config: StackConfig) => Contentstack.Stack(config);

  it('should throw error when api key is empty', (done) => {
    const config = {
      apiKey: '',
      deliveryToken: '',
      environment: '',
    };

    expect(() => createStackInstance(config)).toThrow('API key for Stack is required.');
    done();
  });

  it('should throw error when Delivery Token is empty', (done) => {
    expect(() => {
      const config = {
        apiKey: 'apiKey',
        deliveryToken: '',
        environment: '',
      };
      createStackInstance(config);
    }).toThrow('Delivery token for Stack is required.');
    done();
  });

  it('should throw error when Environment is empty', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery_token',
      environment: '',
    };
    expect(() => createStackInstance(config)).toThrow('Environment for Stack is required');
    done();
  });

  it('should create stack instance when the mandatory params are passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should create stack instance when the mandatory params are passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      early_access: ['newCDA', 'taxonomy'],
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should set defaultHost, header and params when stack instance is created', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    expect(stackInstance.config.apiKey).toEqual(config.apiKey);
    expect(stackInstance.config.deliveryToken).toEqual(config.deliveryToken);
    expect(stackInstance.config.environment).toEqual(config.environment);
    done();
  });

  it('should change default host when host config is passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      host: HOST_EU_REGION,
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should change default host to config host when region and host in config passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      host: DUMMY_URL,
      region: Region.EU,
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should change default host to EU when EU region in config is passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      region: Region.US,
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });
  it('should change default host to EU when EU region in config is passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      region: Region.EU,
    };
    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should change default host to azure-na when AZURE_NA region in config is passed', (done) => {
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      region: Region.AZURE_NA,
    };

    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    done();
  });

  it('should add logHandler', async () => {
    const mockLogHandler = jest.fn();
    const config = {
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      region: Region.AZURE_NA,
      logHandler: mockLogHandler,
      cacheOptions: {
        policy: Policy.IGNORE_CACHE
      }
    };

    const stackInstance = createStackInstance(config);
    expect(stackInstance).toBeInstanceOf(Stack);
    expect(mockLogHandler).not.toHaveBeenCalled();
    mockLogHandler.mockReset();
  });

  it('should add plugins onRequest and onResponse as req and res interceptors when plugin is passed', (done) => {

    const mockPlugin = {
      onRequest: jest.fn((request) => request),
      onResponse: jest.fn((response) => response),
    };

    const stackInstance = createStackInstance({
      apiKey: 'apiKey',
      deliveryToken: 'delivery',
      environment: 'env',
      plugins: [mockPlugin],
    });

    expect(stackInstance).toBeInstanceOf(Stack);
    expect(reqInterceptor).toHaveBeenCalledWith(expect.any(Function));
    expect(resInterceptor).toHaveBeenCalledWith(expect.any(Function));

    createHttpClientMock.mockReset();
    done();
  });
});
