import { AxiosInstance, httpClient } from '@contentstack/core';
import { ContentType } from '../../src/lib/content-type';
import MockAdapter from 'axios-mock-adapter';
import { Entry } from '../../src/lib/entry';
import { contentTypeResponseMock } from '../utils/mocks';
import { Entries } from '../../src/lib/entries';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

describe('ContentType class', () => {
  let contentType: ContentType;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    contentType = new ContentType(client, 'contentTypeUid');
  });

  it('should allow to create a class object when contentTypeUid is passed', () => {
    expect(contentType).toBeInstanceOf(ContentType);
  });

  it('should give Entry instance when entry method is called with entryUid', () => {
    const query = contentType.Entry('entryUid');
    expect(query).toBeInstanceOf(Entry);
  });

  it('should give Entries instance when entry method is called without entryUid', () => {
    const query = contentType.Entry();
    expect(query).toBeInstanceOf(Entries);
  });

  it('should fetch the contentType response when fetch method is called', async () => {
    mockClient.onGet('/content_types/contentTypeUid').reply(200, contentTypeResponseMock);

    const response = await contentType.fetch();
    expect(response).toEqual(contentTypeResponseMock);
  });
});
