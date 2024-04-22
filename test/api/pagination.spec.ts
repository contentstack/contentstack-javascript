import { stackInstance } from '../utils/stack-instance';
import { TEntries } from './types';

const stack = stackInstance();

describe('Pagination API tests', () => {
  it('should paginate query to be defined', () => {
    const query = makePagination('content_type_uid');
    expect(query).toBeDefined();
  });
  it('should change the skip value when next method is called', async () => {
    const query = makePagination('author', { skip: 2, limit: 2 });
    const result = await query.next().find<TEntries>();

    expect(query._queryParams).toEqual({ skip: 4, limit: 2 });
    expect(result.entries[0]).toBeDefined();
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].created_by).toBeDefined();
    expect(result.entries[0].updated_by).toBeDefined();
  });

  it('should change the skip value when previous method is called', async () => {
    const query = makePagination('author', { skip: 10, limit: 10 });
    expect(query._queryParams).toEqual({ skip: 10, limit: 10 });

    const result = await query.previous().find<TEntries>();
    expect(query._queryParams).toEqual({ skip: 0, limit: 10 });
    expect(result.entries[0]).toBeDefined();
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].locale).toEqual('en-us');
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].created_by).toBeDefined();
    expect(result.entries[0].updated_by).toBeDefined();
  });
});
function makePagination(uid = '', pageObj = {}) {
  const query = stack.contentType(uid).entry().paginate(pageObj);

  return query;
}
