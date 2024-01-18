/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { AssetQuery } from '../../src/lib/asset-query';
import { stackInstance } from '../utils/stack-instance';
import { TAssets } from './types';

const stack = stackInstance();

describe('AssetQuery API tests', () => {
  it('should check for assets is defined', async () => {
    const result = await makeAssetQuery().find<TAssets>();
    expect(result.assets).toBeDefined();
    expect(result.assets[0]._version).toEqual(1);
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for include dimensions', async () => {
    const result = await makeAssetQuery().includeDimension().find<TAssets>();
    expect(result.assets[0].dimension).toBeDefined();
    expect(result.assets[0]._version).toBeDefined();
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result = await makeAssetQuery().includeFallback().find<TAssets>();
    expect(result.assets[0]._version).toBeDefined();
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for relative urls', async () => {
    const result = await makeAssetQuery().relativeUrls().find<TAssets>();
    expect(result.assets[0].url).not.toEqual(undefined);
    expect(result.assets[0]._version).toBeDefined();
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for include branch', async () => {
    const result = await makeAssetQuery().includeBranch().find<TAssets>();
    expect(result.assets[0]._branch).not.toEqual(undefined);
    expect(result.assets[0]._version).toBeDefined();
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for include metadata', async () => {
    const result = await makeAssetQuery().includeMetadata().find<TAssets>();
    expect(result.assets[0]._metadata).not.toEqual(undefined);
    expect(result.assets[0]._version).toBeDefined();
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for version', async () => {
    const result = await makeAssetQuery().version(1).find<TAssets>();
    expect(result.assets[0]._version).toEqual(1);
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for locale', async () => {
    const result = await makeAssetQuery().locale('en-us').find<TAssets>();
    expect(result.assets[0]._version).toEqual(1);
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for limit', async () => {
    const query = makeAssetQuery();
    const result = await query.limit(2).find<TAssets>();
    expect(query._queryParams).toEqual({limit: 2});
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
  it('should check for skip', async () => {
    const query = makeAssetQuery();
    const result = await query.skip(2).find<TAssets>();
    expect(query._queryParams).toEqual({skip: 2});
    expect(result.assets[0].uid).toBeDefined();
    expect(result.assets[0].content_type).toBeDefined();
    expect(result.assets[0].created_by).toBeDefined();
    expect(result.assets[0].updated_by).toBeDefined();
  });
});
function makeAssetQuery(): AssetQuery {
  const asset = stack.Asset();

  return asset;
}
