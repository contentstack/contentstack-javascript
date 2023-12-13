/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { Asset } from '../../src/lib/asset';
import { stackInstance } from '../utils/stack-instance';
import { TAsset } from './types';

const stack = stackInstance();
const assetUid = 'blt122ea52c5d4ddf19';
describe('Asset API tests', () => {
  it('should check for asset is defined', async () => {
    const result = await makeAsset(assetUid).fetch<TAsset>();
    expect(result.asset).toBeDefined();
    expect(result.asset._version).toBeDefined();
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for include dimension', async () => {
    const result = await makeAsset(assetUid).includeDimension().fetch<TAsset>();
    expect(result.asset.dimension).not.toEqual(undefined);
    expect(result.asset._version).toBeDefined();
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for include branch', async () => {
    const result = await makeAsset(assetUid).includeBranch().fetch<TAsset>();
    expect(result.asset._branch).not.toEqual(undefined);
    expect(result.asset._version).toBeDefined();
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result = await makeAsset(assetUid).includeFallback().fetch<TAsset>();
    expect(result.asset._version).toBeDefined();
    expect(result.asset.publish_details.locale).toEqual('en-us');
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });

  it('should check for relative urls', async () => {
    const result = await makeAsset(assetUid).relativeUrls().fetch<TAsset>();
    expect(result.asset.url).not.toEqual(undefined);
    expect(result.asset._version).toBeDefined();
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for version of asset', async () => {
    const result = await makeAsset(assetUid).version(1).fetch<TAsset>();
    expect(result.asset._version).toEqual(1);
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.url).toBeDefined();
    expect(result.asset.filename).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for include metadata', async () => {
    const result = await makeAsset(assetUid).includeMetadata().fetch<TAsset>();
    expect(result.asset._metadata).not.toEqual(undefined);
    expect(result.asset._version).toBeDefined();
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.content_type).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
  it('should check for locale', async () => {
    const result = await makeAsset(assetUid).locale('en-us').fetch<TAsset>();
    expect(result.asset._version).toEqual(1);
    expect(result.asset.uid).toBeDefined();
    expect(result.asset.content_type).toBeDefined();
    expect(result.asset.created_by).toBeDefined();
    expect(result.asset.updated_by).toBeDefined();
  });
});
function makeAsset(uid = ''): Asset {
  const asset = stack.Asset(uid);

  return asset;
}
