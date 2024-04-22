/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { BaseAsset } from 'src';
import { Asset } from '../../src/lib/asset';
import { stackInstance } from '../utils/stack-instance';
import { TAsset } from './types';
import dotenv from 'dotenv';

dotenv.config();

const stack = stackInstance();
const assetUid = process.env.ASSET_UID;
describe('Asset API tests', () => {
  it('should check for asset is defined', async () => {
    const result = await makeAsset(assetUid).fetch<BaseAsset>();
    expect(result).toBeDefined();
    expect(result._version).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for include dimension', async () => {
    interface AssetWithDimension extends BaseAsset {
      dimension: {
        height: number;
        width: number;
      }
    }
    const result = await makeAsset(assetUid).includeDimension().fetch<AssetWithDimension>();
    expect(result.dimension).not.toEqual(undefined);
    expect(result._version).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for include branch', async () => {
    interface AssetWithBranch extends BaseAsset {
      _branch: string;
    }
    const result = await makeAsset(assetUid).includeBranch().fetch<AssetWithBranch>();
    expect(result._branch).not.toEqual(undefined);
    expect(result._version).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for include fallback', async () => {
    const result = await makeAsset(assetUid).includeFallback().fetch<BaseAsset>();
    expect(result._version).toBeDefined();
    expect(result.publish_details?.locale).toEqual('en-us');
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });

  it('should check for relative urls', async () => {
    const result = await makeAsset(assetUid).relativeUrls().fetch<BaseAsset>();
    expect(result.url).not.toEqual(undefined);
    expect(result._version).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for version of asset', async () => {
    const result = await makeAsset(assetUid).version(1).fetch<BaseAsset>();
    expect(result._version).toEqual(1);
    expect(result.uid).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for include metadata', async () => {

    interface AssetWithMetadata extends BaseAsset {
      _metadata: string;
    }
    const result = await makeAsset(assetUid).includeMetadata().fetch<AssetWithMetadata>();
    expect(result._metadata).not.toEqual(undefined);
    expect(result._version).toBeDefined();
    expect(result.uid).toBeDefined();
    expect(result.content_type).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
  it('should check for locale', async () => {
    const result = await makeAsset(assetUid).locale('en-us').fetch<BaseAsset>();
    expect(result._version).toEqual(1);
    expect(result.uid).toBeDefined();
    expect(result.content_type).toBeDefined();
    expect(result.created_by).toBeDefined();
    expect(result.updated_by).toBeDefined();
  });
});
function makeAsset(uid = ''): Asset {
  const asset = stack.asset(uid);

  return asset;
}
