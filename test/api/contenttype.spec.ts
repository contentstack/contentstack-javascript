/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { ContentType } from '../../src/lib/content-type';
import { stackInstance } from '../utils/stack-instance';
import { TContentType, TEntry } from './types';

const stack = stackInstance();
describe('ContentType API test cases', () => {
  it('should give Entry instance when entry method is called with entryUid', async () => {
    const result = await makeContentType('header').Entry('blt657fe7db362fea22').fetch<TEntry>();
    expect(result.entry).toBeDefined();
  });
  it('should check for content_types of the given contentTypeUid', async () => {
    const result = await makeContentType('header').fetch<TContentType>();
    expect(result.content_type).toBeDefined();
    expect(result.content_type._version).toBeDefined();
    expect(result.content_type.title).toBeDefined();
    expect(result.content_type.description).toBeDefined();
    expect(result.content_type.uid).toBeDefined();
    expect(result.content_type.created_at).toBeDefined();
    expect(result.content_type.updated_at).toBeDefined();
    expect(result.content_type.schema).toBeDefined();
  });
});
function makeContentType(uid = ''): ContentType {
  const contentType = stack.ContentType(uid);

  return contentType;
}
