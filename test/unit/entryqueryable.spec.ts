/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/naming-convention */
import { EntryQueryable } from '../../src/lib/entry-queryable';
describe('EntryQueryable class', () => {
  let entryQuery: EntryQueryable;

  beforeEach(() => {
    entryQuery = new EntryQueryable();
  });

  it('should create an instance of EntryQueryable', () => {
    expect(entryQuery).toBeInstanceOf(EntryQueryable);
  });

  it('should add a fieldUid to the _queryParams object', () => {
    entryQuery.only('fieldUid');
    expect(entryQuery._queryParams).toEqual({ 'only[BASE][]': 'fieldUid' });
  });

  it('should return an instance of EntryQueryable', () => {
    const result = entryQuery.only('fieldUid');
    expect(result).toBeInstanceOf(EntryQueryable);
  });

  it('should allow chaining of multiple calls', () => {
    entryQuery.only('fieldUid1').only('fieldUid2');
    expect(entryQuery._queryParams).toEqual({ 'only[BASE][]': 'fieldUid2' });
  });

  it('should add a fieldUid to the _queryParams object', () => {
    entryQuery.except('fieldUid');
    expect(entryQuery._queryParams).toEqual({ 'except[BASE][]': 'fieldUid' });
  });

  it('should return an instance of EntryQueryable', () => {
    const result = entryQuery.except('fieldUid');
    expect(result).toBeInstanceOf(EntryQueryable);
  });

  it('should allow chaining of multiple calls', () => {
    entryQuery.except('fieldUid1').except('fieldUid2');
    expect(entryQuery._queryParams).toEqual({ 'except[BASE][]': 'fieldUid2' });
  });
});
