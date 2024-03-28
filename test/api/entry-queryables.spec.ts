import { stackInstance } from '../utils/stack-instance';
import { Entries } from '../../src/lib/entries';
import { TEntry } from './types';
import { QueryOperation } from '../../src/lib/types';
import { Query } from '../../src/lib/query';

const stack = stackInstance();

describe('Query Operators API test cases', () => {
    it('should get entries which matches the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().containedIn('title', ['value']).find<TEntry>()
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });
  
    it('should get entries which does not match the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().notContainedIn('title', ['test', 'test2']).find<TEntry>()
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });
  
    it('should get entries which does not match the fieldUid - notExists', async () => {
      const query = await makeEntries('contenttype_uid2').query().notExists('multi_line').find<TEntry>()
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
        expect((query.entries[0] as any).multi_line).not.toBeDefined()
      }
    });

    it('should get entries which matches the fieldUid - exists', async () => {
      const query = await makeEntries('contenttype_uid').query().exists('multi_line').find<TEntry>()
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
        expect((query.entries[0] as any).multi_line).toBeDefined()
      }
    });

    it('should return entries matching any of the conditions - or', async () => {
        const query1: Query = await makeEntries('contenttype_uid').query().containedIn('title', ['value']);
        const query2: Query = await makeEntries('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value2');
        const query = await makeEntries('contenttype_uid').query().or(query1, query2).find<TEntry>();
      
        if (query.entries) {
          expect(query.entries.length).toBeGreaterThan(0);
          expect(query.entries[0]._version).toBeDefined();
          expect(query.entries[0].locale).toBeDefined();
          expect(query.entries[0].uid).toBeDefined();
          expect(query.entries[0].title).toBe('value2');
          expect(query.entries[1]._version).toBeDefined();
          expect(query.entries[1].locale).toBeDefined();
          expect(query.entries[1].uid).toBeDefined();
          expect(query.entries[1].title).toBe('value');
        }
    });

    it('should return entries when at least 1 entry condition is matching  - or', async () => {
        const query1: Query = await makeEntries('contenttype_uid').query().containedIn('title', ['value0']);
        const query2: Query = await makeEntries('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value2');
        const query = await makeEntries('contenttype_uid').query().or(query1, query2).find<TEntry>();
      
        if (query.entries) {
          expect(query.entries.length).toBeGreaterThan(0);
          expect(query.entries[0]._version).toBeDefined();
          expect(query.entries[0].locale).toBeDefined();
          expect(query.entries[0].uid).toBeDefined();
          expect(query.entries[0].title).toBe('value2');
        }
    });

    it('should return entry both conditions are matching - and', async () => {
        const query1: Query = await makeEntries('contenttype_uid').query().containedIn('title', ['value']);
        const query2: Query = await makeEntries('contenttype_uid').query().where('locale', QueryOperation.EQUALS, 'en-us');
        const query = await makeEntries('contenttype_uid').query().and(query1, query2).find<TEntry>();

        if (query.entries) {
          expect(query.entries.length).toBeGreaterThan(0);
          expect(query.entries[0]._version).toBeDefined();
          expect(query.entries[0].locale).toBeDefined();
          expect(query.entries[0].uid).toBeDefined();
          expect(query.entries[0].title).toBe('value');
        }
    });

    it('should return null when any one condition is not matching - and', async () => {
        const query1: Query = await makeEntries('contenttype_uid').query().containedIn('title', ['value0']);
        const query2: Query = await makeEntries('contenttype_uid').query().where('locale', QueryOperation.EQUALS, 'fr-fr');
        const query = await makeEntries('contenttype_uid').query().and(query1, query2).find<TEntry>();
      
        if (query.entries) {
          expect(query.entries).toHaveLength(0);

        }
    });

    it('should return entry equal to the condition - equalTo', async () => {
      const query = await makeEntries('contenttype_uid').query().equalTo('title', 'value').find<TEntry>();
    
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].locale).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].title).toBe('value');
      }
    });

    it('should return entry for referencedIn query', async () => {
      const query = makeEntries('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
      const entryQuery = await makeEntries('contenttype_uid').query().referenceIn('reference_uid', query).find<TEntry>();
      if (entryQuery.entries) {
        expect(entryQuery.entries[0]._version).toBeDefined();
        expect(entryQuery.entries[0].locale).toBeDefined();
        expect(entryQuery.entries[0].uid).toBeDefined();
        expect(entryQuery.entries[0].title).toBe('test');
      }
    });
    it('should return entry for referenceNotIn query', async () => {
      const query = makeEntries('contenttype_uid').query().where('title', QueryOperation.EQUALS, 'value');
      const entryQuery = await makeEntries('contenttype_uid').query().referenceNotIn('reference_uid', query).find<TEntry>();

      if (entryQuery.entries) {
        expect(entryQuery.entries[0]._version).toBeDefined();
        expect(entryQuery.entries[0].locale).toBeDefined();
        expect(entryQuery.entries[0].uid).toBeDefined();
        expect(entryQuery.entries[0].title).not.toBe('test');
        expect(entryQuery.entries[0].title).toBe('value2');
        expect(entryQuery.entries[1]._version).toBeDefined();
        expect(entryQuery.entries[1].locale).toBeDefined();
        expect(entryQuery.entries[1].uid).toBeDefined();
        expect(entryQuery.entries[1].title).toBe('value');
      }
    });

    it('should return entry if tags are matching', async () => {
      const query = await makeEntries('contenttype_uid').query().tags(['tag1']).find<TEntry>();
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].locale).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].title).toBe('value');
      }
    });

    it('should search for the matching key and return the entry', async () => {
      const query = await makeEntries('contenttype_uid').query().search('value2').find<TEntry>();
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].locale).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].title).toBe('value2');
      }
    });
  
    it('should sort entries in ascending order of the given fieldUID', async () => {
      const query = await makeEntries('contenttype_uid').query().orderByAscending('title').find<TEntry>();
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].locale).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].title).toBe('test');
        expect(query.entries[1].title).toBe('test2');
        expect(query.entries[2].title).toBe('value');
      }
    });

    it('should sort entries in descending order of the given fieldUID', async () => {
      const query = await makeEntries('contenttype_uid').query().orderByDescending('title').find<TEntry>();
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].locale).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].title).toBe('value2');
        expect(query.entries[1].title).toBe('value');
        expect(query.entries[2].title).toBe('test2');
      }
    });

    it('should get entries which is lessThan the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().lessThan('created_at', '2024-03-01T05:25:30.940Z').find<TEntry>()
      if (query.entries) {
        expect(query.entries.length).toBeGreaterThan(0);
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });

    it('should get entries which is lessThanOrEqualTo the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().lessThanOrEqualTo('created_at', '2024-03-01T05:25:30.940Z').find<TEntry>()
      if (query.entries) {
        expect(query.entries.length).toBeGreaterThan(0);
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });

    it('should get entries which is greaterThan the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().greaterThan('created_at', '2024-03-01T05:25:30.940Z').find<TEntry>()
      if (query.entries) {
        expect(query.entries.length).toBeGreaterThan(0);
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });

    it('should get entries which is greaterThanOrEqualTo the fieldUid and values', async () => {
      const query = await makeEntries('contenttype_uid').query().greaterThanOrEqualTo('created_at', '2024-03-01T05:25:30.940Z').find<TEntry>()
      if (query.entries) {
        expect(query.entries.length).toBeGreaterThan(0);
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
      }
    });
});
  
function makeEntries(contentTypeUid = ''): Entries {
    const entries = stack.ContentType(contentTypeUid).Entry();
    return entries;
}