import { stackInstance } from '../utils/stack-instance';
import { Entries } from '../../src/lib/entries';
import { TEntry } from './types';
import { QueryOperation } from 'src/lib/types';
import { Query } from 'src/lib/query';

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
      const query = await makeEntries('contenttype_uid').query().notExists('multi_line').find<TEntry>()
      if (query.entries) {
        expect(query.entries[0]._version).toBeDefined();
        expect(query.entries[0].title).toBeDefined();
        expect(query.entries[0].uid).toBeDefined();
        expect(query.entries[0].created_at).toBeDefined();
        expect((query.entries[0] as any).multi_line).not.toBeDefined()
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
});
  
function makeEntries(contentTypeUid = ''): Entries {
    const entries = stack.ContentType(contentTypeUid).Entry();
    return entries;
}