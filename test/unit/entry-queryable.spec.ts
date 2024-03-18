import { AxiosInstance, httpClient } from '@contentstack/core';
import { ContentType } from '../../src/lib/content-type';
import MockAdapter from 'axios-mock-adapter';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';
import { Query } from '../../src/lib/query';
import { QueryOperation } from '../../src/lib/types';


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
    it('should return entries matching any of the conditions - or', async () => {
      const query1: Query = await contentType.Entry().query().containedIn('fieldUID', ['value']);
      const query2: Query = await contentType.Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');
      const query = await contentType.Entry().query().or(query1, query2);
      expect(query._parameters).toStrictEqual({ '$or': [ {'fieldUID': {'$in': ['value']}}, { 'fieldUID': 'value2' } ] });
    });
    it('should return entry when both conditions are matching - and', async () => {
      const query1: Query = await contentType.Entry().query().containedIn('fieldUID', ['value']);
      const query2: Query = await contentType.Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value2');
      const query = await contentType.Entry().query().and(query1, query2);
      expect(query._parameters).toStrictEqual({ '$and': [ {'fieldUID': {'$in': ['value']}}, { 'fieldUID': 'value2' } ] });
    });
    it('should return entry equal to the condition - equalTo', async () => {
      const query = contentType.Entry().query().equalTo('fieldUID', 'value');
      expect(query._parameters).toStrictEqual({ 'fieldUID': 'value' });
    });
    it('should return entry for referenceIn query', async () => {
      const query1 = contentType.Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value');
      const entryQuery = await contentType.Entry().query().referenceIn('reference_uid', query1);
      if (entryQuery) {
        expect(entryQuery._parameters).toEqual({ reference_uid: { '$in_query': { fieldUID: 'value' } } });
      }
    });
    it('should return entry for referenceNotIn query', async () => {
      const query1 = contentType.Entry().query().where('fieldUID', QueryOperation.EQUALS, 'value');
      const entryQuery = await contentType.Entry().query().referenceNotIn('reference_uid', query1);
      if (entryQuery) {
        expect(entryQuery._parameters).toEqual({ reference_uid: { '$nin_query': { fieldUID: 'value' } } });
      }
    });
    it('should return entry if tags are matching', async () => {
      const query =  contentType.Entry().query().tags(['tag1']);
      if (query) {
        expect(query._parameters).toEqual({ tags: ['tag1'] });
      }
    });
    it('should search for the matching key and return the entry', async () => {
      const query =  contentType.Entry().query().search('entry');
      if (query) {
        expect(query._queryParams).toEqual({ typeahead: 'entry' });
      }
    });
});