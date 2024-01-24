import { AxiosInstance, HttpClientParams, httpClient } from '@contentstack/core';
import { Asset } from '../../src/lib/asset';
import MockAdapter from 'axios-mock-adapter';
import { assetFetchDataMock } from '../utils/mocks';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

describe('Asset class', () => {
  let asset: Asset;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    asset = new Asset(client, 'assetUid');
  });

  it('should add "locale" in _queryParams when locale method is called', () => {
    const returnedValue = asset.locale('en-us');
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.locale).toBe('en-us');
  });

  it('should add "include_dimension" in _queryParams when includeDimension method is called', () => {
    const returnedValue = asset.includeDimension();
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.include_dimension).toBe('true');
  });

  it('should add "include_branch" in _queryParams when includeBranch method is called', () => {
    const returnedValue = asset.includeBranch();
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.include_branch).toBe('true');
  });

  it('should add "include_fallback" in _queryParams when includeFallback method is called', () => {
    const returnedValue = asset.includeFallback();
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.include_fallback).toBe('true');
  });

  it('should add "relative_urls" in _queryParams when relativeUrl method is called', () => {
    const returnedValue = asset.relativeUrls();
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.relative_urls).toBe('true');
  });

  it('should add "version" in _queryParams when version method is called', () => {
    const returnedValue = asset.version(1);
    expect(returnedValue).toBeInstanceOf(Asset);
    expect(asset._queryParams.version).toBe('1');
  });

  it('should add "fetch" in _queryParams when fetch method is called', async () => {
    mockClient.onGet(`/assets/assetUid`).reply(200, assetFetchDataMock);
    const returnedValue = await asset.fetch();
    expect(returnedValue).toEqual(assetFetchDataMock.asset);
  });
});
