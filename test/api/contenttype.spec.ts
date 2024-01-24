/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { BaseContentType, BaseEntry } from 'src';
import { ContentType } from '../../src/lib/content-type';
import { stackInstance } from '../utils/stack-instance';
import { TContentType, TEntry } from './types';
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
function makeContentType(uid = ''): ContentType {
  const contentType = stack.ContentType(uid);

  return contentType;
}
