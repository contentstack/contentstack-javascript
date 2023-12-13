import { AxiosInstance, httpClient } from '@contentstack/core';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';
import { Entries } from '../../src/lib/entries';
import MockAdapter from 'axios-mock-adapter';
import { entryFetchMock, entryFindMock } from '../utils/mocks';
import { Query } from '../../src/lib/query';

describe('Entries class', () => {
  let entry: Entries;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    entry = new Entries(client, 'contentTypeUid');
  });

  it('should add "locale" in _queryParams when locale method is called', () => {
    const returnedValue = entry.locale('en-us');
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.locale).toBe('en-us');
  });

  it('should add "include_branch" in _queryParams when includeBranch method is called', () => {
    const returnedValue = entry.includeBranch();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_branch).toBe('true');
  });

  it('should set the include parameter to the given reference field UID', () => {
    const referenceFieldUid = 'referenceFieldUid';
    entry.includeReference(referenceFieldUid);

    expect(entry._queryParams['include[]']).toBe(referenceFieldUid);
  });

  it('should add "include_fallback" in _queryParams when includeFallback method is called', () => {
    const returnedValue = entry.includeFallback();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_fallback).toBe('true');
  });

  it('should add "include_metadata" in _queryParams when includeMetadata method is called', () => {
    const returnedValue = entry.includeMetadata();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_metadata).toBe('true');
  });

  it('should add "include_embedded_items" in _queryParams when includeEmbeddedItems method is called', () => {
    const returnedValue = entry.includeEmbeddedItems();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams['include_embedded_items[]']).toBe('BASE');
  });

  it('should add "include_content_type" in _queryParams when includeContentType method is called', () => {
    const returnedValue = entry.includeContentType();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_content_type).toBe('true');
  });

  it('should add "include_reference_content_type_uid" in _queryParams when includeReferenceContentTypeUID method is called', () => {
    const returnedValue = entry.includeReferenceContentTypeUID();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_reference_content_type_uid).toBe('true');
  });

  it('should add "include_schema" in _queryParams when includeSchema method is called', () => {
    const returnedValue = entry.includeSchema();
    expect(returnedValue).toBeInstanceOf(Entries);
    expect(entry._queryParams.include_schema).toBe('true');
  });

  it('should return Query instance when query method is called', () => {
    const returnedValue = entry.query();
    expect(returnedValue).toBeInstanceOf(Query);
  });

  it('should provide proper response when find method is called', async () => {
    mockClient.onGet(`/content_types/contentTypeUid/entries`).reply(200, entryFindMock);
    const returnedValue = await entry.find();
    expect(returnedValue).toEqual(entryFindMock);
  });
});
