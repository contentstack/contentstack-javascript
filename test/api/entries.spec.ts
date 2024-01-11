/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { Entries } from '../../src/lib/entries';
import { stackInstance } from '../utils/stack-instance';
import { TEntries } from './types';

const stack = stackInstance();

describe('Entries API test cases', () => {
  it('should check for entries is defined', async () => {
    const result: TEntries = await makeEntries('blog_post').find();
    expect(result.entries).toBeDefined();
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
    expect(result.entries[0].created_by).toBeDefined();
    expect(result.entries[0].updated_by).toBeDefined();
  });
  it('should set the include parameter to the given reference field UID', async () => {
    const query = await makeEntries('blog_post').includeReference('author').find<TEntries>();
    expect(query.entries[0].title).toBeDefined();
    expect(query.entries[0].author).toBeDefined();
    expect(query.entries[0].title).toBeDefined();
    expect(query.entries[0].url).toBeDefined();
    expect(query.entries[0]._version).toBeDefined();
    expect(query.entries[0].publish_details).toBeDefined();
  });
  it('should check for include branch', async () => {
    const result = await makeEntries('blog_post').includeBranch().find<TEntries>();
    expect(result.entries[0]._branch).not.toEqual(undefined);
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result: TEntries = await makeEntries('blog_post').includeFallback().find();
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });
  it('should check for locale', async () => {
    const result: TEntries = await makeEntries('blog_post').locale('fr-fr').find();
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].publish_details.locale).toEqual('fr-fr');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });
  it('should check for only', async () => {
    const result: TEntries = await makeEntries('blog_post').locale('fr-fr').only('author').find();
    expect(result.entries[0]._version).not.toBeDefined();
    expect(result.entries[0].publish_details).not.toBeDefined();
    expect(result.entries[0].title).not.toBeDefined();
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].author).toBeDefined();
  });
  it('should check for limit', async () => {
    const query = makeEntries('blog_post');
    const result = await query.limit(2).find<TEntries>();
    expect(query._queryParams).toEqual({limit: 2});
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });
  it.only('should check for skip', async () => {
    const query = makeEntries('blog_post');
    const result = await query.skip(2).find<TEntries>();
    expect(query._queryParams).toEqual({skip: 2});
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });
});
function makeEntries(contentTypeUid = ''): Entries {
  const entries = stack.ContentType(contentTypeUid).Entry();

  return entries;
}
