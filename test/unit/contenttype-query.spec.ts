import { ContentTypeQuery } from '../../src/lib/contenttype-query';
import { AxiosInstance, HttpClientParams, httpClient } from '@contentstack/core';
import MockAdapter from 'axios-mock-adapter';
import { HOST_URL } from '../utils/constant';
import { contentTypeQueryFindResponseDataMock } from '../utils/mocks';
import axios, { Axios } from 'axios';

describe('ContentTypeQuery class', () => {
  let contentTypeQuery: ContentTypeQuery;
  let client: AxiosInstance;
  let mockClient: MockAdapter;
  let clientConfig: HttpClientParams;

  beforeAll(() => {
    clientConfig = {
      apiKey: 'API_KEY',
      accessToken: 'DELIVERY_TOKEN',
    };
    client = httpClient(clientConfig);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    contentTypeQuery = new ContentTypeQuery(client);
  });
  it('should add "include_global_field_schema" in queryParams when includeGlobalFieldSchema method is called ', () => {
    const returnedValue = contentTypeQuery.includeGlobalFieldSchema();

    expect(returnedValue).toBeInstanceOf(ContentTypeQuery);
    expect(contentTypeQuery._queryParams.include_global_field_schema).toBe('true');
  });

  it('should return response data when successful', async () => {
    mockClient.onGet('/content_types').reply(200, contentTypeQueryFindResponseDataMock);
    const response = await contentTypeQuery.find();
    expect(response).toEqual(contentTypeQueryFindResponseDataMock);
  });
});
