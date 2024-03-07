import { AxiosInstance, httpClient } from '@contentstack/core';
import { ContentType } from '../../src/lib/content-type';
import MockAdapter from 'axios-mock-adapter';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';


describe('Query Operators API test cases', () => {
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
    it('should get entries which matches the fieldUid and values', () => {
      const query = contentType.Entry().query().containedIn('fieldUID', ['value']);
      expect(query._parameters).toStrictEqual({'fieldUID': {'$in': ['value']}});
    });
    it('should get entries which does not match the fieldUid and values', () => {
      const query = contentType.Entry().query().notContainedIn('fieldUID', ['value', 'value2']);
      expect(query._parameters).toStrictEqual({'fieldUID': {'$nin': ['value', 'value2']}});
    });
    it('should get entries which does not match the fieldUid - notExists', () => {
      const query = contentType.Entry().query().notExists('fieldUID');
      expect(query._parameters).toStrictEqual({'fieldUID': {'$exists': false}});
    });
});