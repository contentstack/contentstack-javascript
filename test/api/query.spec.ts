import { QueryOperation, QueryOperator } from '../../src/lib/types';
import { stackInstance } from '../utils/stack-instance';
import { TEntries } from './types';

const stack = stackInstance();
describe('Query API tests', () => {
  it('should add a where filter to the query parameters', async () => {
    const query = await makeQuery('blog_post')
      .where('title', QueryOperation.EQUALS, 'The future of business with AI')
      .find<TEntries>();
    expect(query.entries[0].title).toEqual('The future of business with AI');
  });
  it('should add a where filter to the query parameters', async () => {
    const query = await makeQuery('blog_post').where('_version', QueryOperation.IS_LESS_THAN, 3).find<TEntries>();
    expect(query.entries[0].title).toEqual('The future of business with AI');
  });
  it('should add a where-in filter to the query parameters', async () => {
    const query = await makeQuery('blog_post')
      .whereIn('author', makeQuery('author').where('uid', QueryOperation.EQUALS, 'blt09f7d2d46afe6dc6'))
      .find<TEntries>();
    expect(query.entries[0].author[0].uid).toEqual('blt09f7d2d46afe6dc6');
    expect(query.entries[0].title).toBeDefined();
    expect(query.entries[0].url).toBeDefined();
    expect(query.entries[0]._version).toBeDefined();
    expect(query.entries[0].publish_details).toBeDefined();
  });
  it('should add a whereNotIn filter to the query parameters', async () => {
    const query = await makeQuery('blog_post')
      .whereNotIn('author', makeQuery('author').where('uid', QueryOperation.EQUALS, 'blt09f7d2d46afe6dc6'))
      .find<TEntries>();
    expect(query.entries[0].author[0]).not.toEqual('blt09f7d2d46afe6dc6');
    expect(query.entries[0].title).toBeDefined();
    expect(query.entries[0].url).toBeDefined();
    expect(query.entries[0]._version).toBeDefined();
    expect(query.entries[0].publish_details).toBeDefined();
  });
  it('should add a query operator to the query parameters', async () => {
    const query1 = makeQuery('blog_post').where('locale', QueryOperation.EQUALS, 'en-us');
    const query2 = makeQuery('blog_post').where('created_by', QueryOperation.EQUALS, 'blt79e6de1c5230a991');
    const query = await makeQuery('blog_post').queryOperator(QueryOperator.AND, query1, query2).find<TEntries>();
    expect(query.entries[0].locale).toEqual('en-us');
    expect(query.entries[0].created_by).toEqual('blt79e6de1c5230a991');
    expect(query.entries[0].title).not.toEqual(undefined);
    expect(query.entries[0].url).not.toEqual(undefined);
    expect(query.entries[0]._version).not.toEqual(undefined);
    expect(query.entries[0].publish_details).not.toEqual(undefined);
  });
});
function makeQuery(ctUid: string) {
  const query = stack.ContentType(ctUid).Entry().query();

  return query;
}
