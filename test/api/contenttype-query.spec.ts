import { ContentTypeQuery } from '../../src/lib/contenttype-query';
import { stackInstance } from '../utils/stack-instance';
import { TContentTypes } from './types';

const stack = stackInstance();
describe('ContentTypeQuery API test cases', () => {
  it('should check for content_types are defined', async () => {
    const result = await makeContentTypeQuery().find<TContentTypes>();
    expect(result.content_types).toBeDefined();
    expect(result.content_types[0]._version).toBeDefined();
    expect(result.content_types[0].uid).toBeDefined();
    expect(result.content_types[0].schema).toBeDefined();
    expect(result.content_types[0].created_at).toBeDefined();
    expect(result.content_types[0].updated_at).toBeDefined();
  });
  it('should check for include global field schema', async () => {
    const result = await makeContentTypeQuery().includeGlobalFieldSchema().find<TContentTypes>();
    expect(result.content_types).toBeDefined();
    expect(result.content_types[0]._version).toBeDefined();
    expect(result.content_types[0].uid).toBeDefined();
    expect(result.content_types[0].schema).toBeDefined();
    expect(result.content_types[0].created_at).toBeDefined();
    expect(result.content_types[0].updated_at).toBeDefined();
  });
});
function makeContentTypeQuery(): ContentTypeQuery {
  const contentTypeQuery = stack.contentType();

  return contentTypeQuery;
}
