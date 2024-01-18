import { AxiosInstance, httpClient } from '@contentstack/core';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';
import { Entry } from '../../src/lib/entry';
import MockAdapter from 'axios-mock-adapter';
import { entryFetchMock } from '../utils/mocks';
import { getData } from '@contentstack/core';

describe('Entry class', () => {
  let entry: Entry;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    entry = new Entry(client, 'contentTypeUid', 'entryUid');
  });

  it('should add "locale" in _queryParams when locale method is called', () => {
    const returnedValue = entry.locale('en-us');
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams.locale).toBe('en-us');
  });

  it('should add "include_branch" in _queryParams when includeBranch method is called', () => {
    const returnedValue = entry.includeBranch();
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams.include_branch).toBe('true');
  });

  it('should add "include_fallback" in _queryParams when includeFallback method is called', () => {
    const returnedValue = entry.includeFallback();
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams.include_fallback).toBe('true');
  });

  it('should add "include_metadata" in _queryParams when includeMetadata method is called', () => {
    const returnedValue = entry.includeMetadata();
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams.include_metadata).toBe('true');
  });

  it('should add "include_embedded_items" in _queryParams when includeEmbeddedItems method is called', () => {
    const returnedValue = entry.includeEmbeddedItems();
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams['include_embedded_items[]']).toBe('BASE');
  });

  it('should add "include_content_type" in _queryParams when includeContentType method is called', () => {
    const returnedValue = entry.includeContentType();
    expect(returnedValue).toBeInstanceOf(Entry);
    expect(entry._queryParams.include_content_type).toBe('true');
  });

  it('should get the API response when fetch method is called', async () => {
    mockClient.onGet(`/content_types/contentTypeUid/entries/entryUid`).reply(200, entryFetchMock);
    const returnedValue = await entry.fetch();
    
    expect(returnedValue).toEqual(entryFetchMock.entry);
  });
});
