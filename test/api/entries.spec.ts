/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { QueryOperation, QueryOperator, TaxonomyQueryOperation } from '../../src/lib/types';
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
  it('should check for skip', async () => {
    const query = makeEntries('blog_post');
    const result = await query.skip(2).find<TEntries>();
    expect(query._queryParams).toEqual({skip: 2});
    expect(result.entries[0]._version).toBeDefined();
    expect(result.entries[0].uid).toBeDefined();
    expect(result.entries[0].title).toBeDefined();
  });

    it('CT Taxonomies Query: Get Entries With One Term', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', QueryOperation.EQUALS, 'term_one');
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    });
    
    it('CT Taxonomies Query: Get Entries With Any Term ($in)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', QueryOperation.INCLUDES, ['term_one', 'term_two']);
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Any Term ($or)', async () => {
      let Query1 = makeEntries('source').query().where('taxonomies.one', QueryOperation.EQUALS, 'term_one');
      let Query2 = makeEntries('source').query().where('taxonomies.two', QueryOperation.EQUALS, 'term_two');
      let Query = makeEntries('source').query().queryOperator(QueryOperator.OR, Query1, Query2);
      const data = await Query.find<TEntries>();
      return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With All Terms ($and)', async () => {
        let Query1 = makeEntries('source').query().where('taxonomies.one', QueryOperation.EQUALS, 'term_one');
        let Query2 = makeEntries('source').query().where('taxonomies.two', QueryOperation.EQUALS, 'term_two');
        let Query = makeEntries('source').query().queryOperator(QueryOperator.AND, Query1, Query2);
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Any Taxonomy Terms ($exists)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', QueryOperation.EXISTS, true);
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Taxonomy Terms and Also Matching Its Children Term ($eq_below, level)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', TaxonomyQueryOperation.EQ_BELOW, 'term_one', {"levels": 1});
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Taxonomy Terms Children\'s and Excluding the term itself ($below, level)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', TaxonomyQueryOperation.BELOW, 'term_one', {"levels": 1});
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Taxonomy Terms and Also Matching Its Parent Term ($eq_above, level)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', TaxonomyQueryOperation.EQ_ABOVE, 'term_one', {"levels": 1});
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
    
    it('CT Taxonomies Query: Get Entries With Taxonomy Terms Parent and Excluding the term itself ($above, level)', async () => {
        let Query = makeEntries('source').query().where('taxonomies.one', TaxonomyQueryOperation.ABOVE, 'term_one_child', {"levels": 1});
        const data = await Query.find<TEntries>();
        return expect(data.entries.length).toBeGreaterThan(0);
    })
});
function makeEntries(contentTypeUid = ''): Entries {
  const entries = stack.contentType(contentTypeUid).entry();

  return entries;
}
