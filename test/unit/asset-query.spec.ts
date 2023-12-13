import { AssetQuery } from '../../src/lib/asset-query';
import { httpClient, AxiosInstance } from '@contentstack/core';
import MockAdapter from 'axios-mock-adapter';
import { assetQueryFindResponseDataMock } from '../utils/mocks';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

describe('AssetQuery class', () => {
  let assetQuery: AssetQuery;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    assetQuery = new AssetQuery(client);
  });
  it('should add "version" in queryParams when version method is called', () => {
    const returnedValue = assetQuery.version(1);
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.version).toBe('1');
  });

  it('should add "include_dimension" in queryParameter when includeDimension method is called', () => {
    const returnedValue = assetQuery.includeDimension();
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.include_dimension).toBe('true');
  });

  it('should add "include_branch" in queryParameter when includeBranch method is called', () => {
    const returnedValue = assetQuery.includeBranch();
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.include_branch).toBe('true');
  });

  it('should add "relative_urls" in queryParameter when relativeUrl method is called', () => {
    const returnedValue = assetQuery.relativeUrls();
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.relative_url).toBe('true');
  });

  it('should add "include_fallback" in queryParameter when includeFallback method is called', () => {
    const returnedValue = assetQuery.includeFallback();
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.include_fallback).toBe('true');
  });

  it('should add "locale" in Parameter when locale method is called', () => {
    const returnedValue = assetQuery.locale('en-us');
    expect(returnedValue).toBeInstanceOf(AssetQuery);
    expect(assetQuery._queryParams.locale).toBe('en-us');
  });

  it('should return response data when successful', async () => {
    mockClient.onGet('/assets').reply(200, assetQueryFindResponseDataMock);
    const response = await assetQuery.find();
    expect(response).toEqual(assetQueryFindResponseDataMock);
  });
});
