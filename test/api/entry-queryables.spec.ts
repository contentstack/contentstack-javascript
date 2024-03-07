import { stackInstance } from '../utils/stack-instance';
import { Entries } from '../../src/lib/entries';
import { TEntry } from './types';

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
  });
  
  function makeEntries(contentTypeUid = ''): Entries {
    const entries = stack.ContentType(contentTypeUid).Entry();
  
    return entries;
  }