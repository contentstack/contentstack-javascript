import { httpClient, AxiosInstance } from '@contentstack/core';
import MockAdapter from 'axios-mock-adapter';
import { Stack } from '../../src/lib/stack';
import { Asset } from '../../src/lib/asset';
import { ContentType } from '../../src/lib/content-type';
import { HOST_URL, LOCALE } from '../utils/constant';
import { syncResult } from '../utils/mocks';
import { synchronization } from '../../src/lib/synchronization';
import { ContentTypeQuery } from '../../src/lib/contenttype-query';
import { AssetQuery } from '../../src/lib/asset-query';

jest.mock('../../src/lib/synchronization');
const syncMock = <jest.Mock<typeof synchronization>>(<unknown>synchronization);

describe('Stack class tests', () => {
  let stack: Stack;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient({ defaultHostname: HOST_URL });
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    const config = jest.fn().mockReturnValue({
      apiKey: '',
      deliveryToken: '',
      environment: '',
    });

    stack = new Stack(client, config());
  });
  it('should test import of class Stack', (done) => {
    expect(stack).toBeInstanceOf(Stack);
    done();
  });

  it('should return Asset instance when asset function is called with stack obj', (done) => {
    expect(stack.asset('assetUid')).toBeInstanceOf(Asset);
    expect(stack.asset()).toBeInstanceOf(AssetQuery);
    done();
  });

  it('should return ContentType instance when contentType function is called with stack obj', (done) => {
    expect(stack.contentType('contentTypeUid')).toBeInstanceOf(ContentType);
    expect(stack.contentType()).toBeInstanceOf(ContentTypeQuery);
    done();
  });

  it('should set the correct locale when setLocale function is called with proper locale param', (done) => {
    stack.setLocale(LOCALE);
    expect(stack.config.locale).toEqual(LOCALE);
    done();
  });

  it('should return the syncMock value when sync is called', async () => {
    syncMock.mockReturnValue(syncResult);
    const result = await stack.sync();
    expect(result).toEqual(syncResult);
    syncMock.mockReset();
  });
});
