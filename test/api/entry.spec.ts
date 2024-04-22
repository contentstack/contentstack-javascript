import { BaseEntry } from 'src';
import { Entry } from '../../src/lib/entry';
import { stackInstance } from '../utils/stack-instance';
import { TEntry } from './types';

const stack = stackInstance();
const entryUid = process.env.ENTRY_UID;

describe('Entry API tests', () => {
  it('should check for entry is defined', async () => {
    const result = await makeEntry(entryUid).fetch<TEntry>();
    expect(result).toBeDefined();
    expect(result._version).toBeDefined();
    expect(result.locale).toEqual('en-us');
    expect(result.uid).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });

  it('should check for entry is defined with BaseEntry', async () => {
    interface MyEntry extends BaseEntry {
      bio: string;
      age: string;
    }
    const result = await makeEntry(entryUid).fetch<MyEntry>();
    expect(result).toBeDefined();
  });
  it('should check for include branch', async () => {
    const result = await makeEntry(entryUid).includeBranch().fetch<TEntry>();
    expect(result._branch).not.toEqual(undefined);
    expect(result.uid).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for locale', async () => {
    const result = await makeEntry(entryUid).locale('fr-fr').fetch<TEntry>();
    expect(result).toBeDefined();
    expect(result._version).toBeDefined();
    expect(result.publish_details.locale).toEqual('fr-fr');
    expect(result.uid).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result = await makeEntry(entryUid).includeFallback().fetch<TEntry>();
    expect(result).toBeDefined();
    expect(result._version).toBeDefined();
    expect(result.locale).toEqual('en-us');
    expect(result.uid).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
});
function makeEntry(uid = ''): Entry {
  const entry = stack.contentType('author').entry(uid);

  return entry;
}
