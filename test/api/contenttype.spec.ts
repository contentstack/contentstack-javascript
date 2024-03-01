/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { BaseContentType, BaseEntry, FindResponse } from 'src';
import { ContentType } from '../../src/lib/content-type';
import { stackInstance } from '../utils/stack-instance';
import { TContentType, TEntries, TEntry } from './types';
import dotenv from 'dotenv';

dotenv.config()

const stack = stackInstance();
describe('ContentType API test cases', () => {
  it('should give Entry instance when entry method is called with entryUid', async () => {
    const result = await makeContentType('author').Entry(process.env.ENTRY_UID as string).fetch<TEntry>();
    expect(result).toBeDefined();
  });
  it('should check for content_types of the given contentTypeUid', async () => {
    const result = await makeContentType('header').fetch<TContentType>();
    expect(result).toBeDefined();
    expect(result._version).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.created_at).toBeDefined();
    expect(result.updated_at).toBeDefined();
    expect(result.schema).toBeDefined();
  });
});
describe('ContentType Query API test cases', () => {
  it('should get entries which matches the fieldUid and values', async () => {
    const query = await makeContentType('contenttype_uid').Query().containedIn('title', ['value']).find<TEntry>()
    if (query.entries) {
      expect(query.entries[0]._version).toBeDefined();
      expect(query.entries[0].title).toBeDefined();
      expect(query.entries[0].uid).toBeDefined();
      expect(query.entries[0].created_at).toBeDefined();
    }
  });

  it('should get entries which does not match the fieldUid and values', async () => {
    const query = await makeContentType('contenttype_uid').Query().NotContainedIn('title', ['test', 'test2']).find<TEntry>()
    if (query.entries) {
      expect(query.entries[0]._version).toBeDefined();
      expect(query.entries[0].title).toBeDefined();
      expect(query.entries[0].uid).toBeDefined();
      expect(query.entries[0].created_at).toBeDefined();
    }
  });
});
function makeContentType(uid = ''): ContentType {
  const contentType = stack.ContentType(uid);

  return contentType;
}
