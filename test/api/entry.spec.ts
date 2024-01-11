import { BaseEntry } from 'src';
import { Entry } from '../../src/lib/entry';
import { stackInstance } from '../utils/stack-instance';
import { TEntry } from './types';

const stack = stackInstance();
const entryUid = process.env.ENTRY_UID;

describe('Entry API tests', () => {
  it('should check for entry is defined', async () => {
    const result = await makeEntry(entryUid).fetch<TEntry>();
    expect(result.entry).toBeDefined();
    expect(result.entry._version).toBeDefined();
    expect(result.entry.locale).toEqual('en-us');
    expect(result.entry.uid).toBeDefined();
    expect(result.entry.created_by).toBeDefined();
    expect(result.entry.updated_by).toBeDefined();
  });

  it('should check for entry is defined with BaseEntry', async () => {
    interface MyEntry extends BaseEntry {
      bio: string;
      age: string;
    }
    const result = await makeEntry(entryUid).fetch<MyEntry>();

    console.log('🚀 ~ file: entry.spec.ts:25 ~ it ~ result:', result);
    expect(result.entry).toBeDefined();
  });
  it('should check for include branch', async () => {
    const result = await makeEntry(entryUid).includeBranch().fetch<TEntry>();
    expect(result.entry._branch).not.toEqual(undefined);
    expect(result.entry.uid).toBeDefined();
    expect(result.entry.created_by).toBeDefined();
    expect(result.entry.updated_by).toBeDefined();
  });
  it('should check for locale', async () => {
    const result = await makeEntry(entryUid).locale('fr-fr').fetch<TEntry>();
    expect(result.entry).toBeDefined();
    expect(result.entry._version).toBeDefined();
    expect(result.entry.publish_details.locale).toEqual('fr-fr');
    expect(result.entry.uid).toBeDefined();
    expect(result.entry.created_by).toBeDefined();
    expect(result.entry.updated_by).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result = await makeEntry(entryUid).includeFallback().fetch<TEntry>();
    expect(result.entry).toBeDefined();
    expect(result.entry._version).toBeDefined();
    expect(result.entry.locale).toEqual('en-us');
    expect(result.entry.uid).toBeDefined();
    expect(result.entry.created_by).toBeDefined();
    expect(result.entry.updated_by).toBeDefined();
  });
});
function makeEntry(uid = ''): Entry {
  const entry = stack.ContentType('author').Entry(uid);

  return entry;
}
