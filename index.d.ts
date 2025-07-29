// Type definitions for contentstack v3.12.2 and above
// Project: https://www.contentstack.com/
// Definitions by: Contentstack <https://github.com/contentstack>
import { EntryEmbedable, Option, RenderOption } from "@contentstack/utils";

// Utils
export class Utils {
  static render(option: {
    entry: EntryEmbedable | EntryEmbedable[];
    renderOption?: RenderOption;
    paths?: string[];
  }): void;
  static renderContent(
    content: string | string[],
    option: Option
  ): string | string[];
  static jsonToHTML(option: {
    entry: EntryEmbedable | EntryEmbedable[];
    paths: string[];
    renderOption?: RenderOption;
  }): void;
}

//Enum for Contentstack Region
export enum Region {
  US = "us",
  EU = "eu",
  AU = "au",
  AZURE_NA = "azure-na",
  AZURE_EU = "azure-eu",
  GCP_NA = "gcp-na",
  GCP_EU = "gcp-eu",
}

//Enum for Contentstack CachePolicy
export enum CachePolicy {
  IGNORE_CACHE = -1,
  ONLY_NETWORK = 0,
  CACHE_ELSE_NETWORK = 1,
  NETWORK_ELSE_CACHE = 2,
  CACHE_THEN_NETWORK = 3,
}

// Sync Result
export interface SyncResult {
  items: Array<any>;
  pagination_token?: string;
  sync_token?: string;
  skip: number;
  limit: number;
  total_count: number;
}

// Contentstack Config
export interface Config {
  api_key: string;
  delivery_token: string;
  environment: string;
  region?: Region;
  branch?: string;
  live_preview?: LivePreview;
  plugins?: ContentstackPlugin[];
  fetchOptions?: FetchOptions;
  early_access?: string[];
}
// Stack Config
export interface StackConfig {
  protocol: string;
  host: string;
  port: number;
  version: string;
}

// ContentTypeCollection
export interface ContentTypeCollection {
  content_types: Array<any>;
  count?: number;
}

export type LivePreview = {
  host?: string;
  enable: boolean;
} & (LivePreivewConfigWithManagementToken | LivePreviewConfigWithPreviewToken);

export interface LivePreivewConfigWithManagementToken {
  /**
   * @deprecated Please use `preview_token` instead to enable live preview.
   * The `management_token` will be removed in future releases.
   */
  management_token: string;
}

export interface LivePreviewConfigWithPreviewToken {
  preview_token: string;
}

export interface LivePreviewQuery {
  live_preview: string;
  content_type_uid: string;
  preview_timestamp: string;
  release_id: string;
}

export interface RetryDelayOption {
  base?: number;
  customBackoff?: (retryCount: number, error: Error) => number;
}
export interface FetchOptions {
  [propName: string]: any;
  debug?: boolean;
  timeout?: number;
  retryLimit?: number;
  retryDelay?: number;
  retryCondition?: (error: any) => boolean;
  logHandler?: (level: string, data: any) => void;
  retryDelayOptions?: RetryDelayOption;
}

//Plugins
export interface ContentstackPlugin {
  onRequest?(stack: Stack, request: ContentstackRequest): ContentstackRequest;
  onResponse?(
    stack: Stack,
    request: ContentstackRequest,
    response: any,
    data: any
  ): any;
}

export interface ContentstackRequest {
  url: string;
  option: object;
}

// Stack
export class Stack {
  constructor(config: Config);
  /**
   * @deprecated since version 3.15.0
   */
  constructor(
    api_key: string,
    delivery_token: string,
    environment_name: string,
    region?: Region,
    fetchOptions?: FetchOptions,
    live_preview?: LivePreview
  );

  environment: string;
  cachePolicy: CachePolicy;
  config: StackConfig;
  fetchOptions: any;
  live_preview: { enable: boolean; host: string; management_token: string };

  ContentType(uid: string): ContentType;
  Assets(uid: string): Asset;
  Assets(): Assets;
  Taxonomies(): Taxonomies;

  setPort(port: number): Stack;
  setProtocol(protocol: string): Stack;
  setHost(host: string): Stack;
  setCachePolicy(policy: CachePolicy): Stack;
  setCacheProvider(provider: object): Stack;
  livePreviewQuery(query: LivePreviewQuery): void;
  clearByQuery(): Stack;
  clearByContentType(): Stack;
  clearAll(): Stack;
  getCacheProvider(): object;
  getLastActivities(): Promise<any>;
  getContentTypes(param?: object): Promise<ContentTypeCollection>;
  sync(params: object): Promise<SyncResult>;
  imageTransform(url: string, params: any): string;
}

export function Stack(config: Config): Stack;
/**
 * @deprecated since version 3.15.0
 */
export function Stack(
  api_key: string,
  access_token: string,
  environment_name: string,
  region?: string,
  fetchOptions?: FetchOptions
): Stack;

export function updateAssetURL(entry: object): object;
export class ContentType {
  constructor();
  content_type_uid: string;

  Query(): Taxonomy;
  Entry(uid: string): Entry;
  fetch(fetchOptions?: object): Promise<any>;
}

export class Taxonomies extends Taxonomy {}

export class Assets {
  constructor();

  toJSON(): Assets;
  addParam(key: string, value: any): Assets;
  Query(): Query;
}

export class Asset {
  constructor();

  asset_uid: string;
  _query: object;

  toJSON(): Asset;
  addParam(key: string, value: any): Asset;
  includeFallback(): Asset;
  fetch(fetchOptions?: object): Promise<any>;
}

export class Entry {
  constructor();

  entry_uid: string;
  content_type_uid: string;
  _query: object;
  provider: any;
  cachePolicy: number;
  queryCachePolicy: number;

  only(field_uid: string): this;
  only(field_uids: string[]): this;
  only(reference_field_uid: string, field_uid: string): this;
  only(reference_field_uid: string, field_uids: string[]): this;

  except(field_uid: string): this;
  except(field_uids: string[]): this;
  except(reference_field_uid: string, field_uid: string): this;
  except(reference_field_uid: string, field_uids: string[]): this;

  setCacheProvider(provider: object): this;
  setCachePolicy(policy: number): this;
  includeReference(val: string[]): this;
  includeReference(...val: string[]): this;
  language(language_code: string): this;
  addQuery(key: string, value: string): this;
  includeEmbeddedItems(): this;
  includeFallback(): this;
  /**
   * @deprecated since version 3.3.0
   */
  includeSchema(): this;
  includeReferenceContentTypeUID(): this;
  includeContentType(): this;
  /**
   * @deprecated since version 3.3.0
   */
  includeOwner(): this;
  toJSON(): this;
  addParam(key: string, value: any): this;
  variants(variant_headers: string | string[]): this;
  fetch(fetchOptions?: object): Promise<any>;
}

export class Query extends Entry {
  constructor();
  _query: object;

  getQuery(): Query;

  includeCount(): Query;
  query(query: object): Query;
  count(fetchOptions?: object): Query;

  referenceIn(key: string, query: Query): Query;
  referenceNotIn(key: string, query: Query): Query;

  tags(value: string[]): Query;

  where(key: string, value: string | number | boolean): Query;
  equalTo(key: string, value: string | number | boolean): Query;
  notEqualTo(key: string, value: string | number | boolean): Query;

  lessThan(key: string, value: string | number): Query;
  lessThanOrEqualTo(key: string, value: string | number): Query;

  greaterThan(key: string, value: string | number): Query;
  greaterThanOrEqualTo(key: string, value: string | number): Query;

  containedIn(key: string, value: (string | number)[]): Query;
  notContainedIn(key: string, value: (string | number)[]): Query;

  exists(key: string): Query;
  notExists(key: string): Query;

  ascending(key: string): Query;
  descending(key: string): Query;

  beforeUid(uid: string): Query;
  afterUid(uid: string): Query;

  skip(skip: number): Query;
  limit(limit: number): Query;

  or(...queries: Query[]): Query;
  and(...queries: Query[]): Query;

  referenceIn(key: string, query: Query | object): Query;
  referenceNotIn(key: string, query: Query | object): Query;

  regex(key: string, value: string, options?: string): Query;

  /**
   * @deprecated since version 3.15.0
   */
  search(value: string): Query;

  find(fetchOptions?: object): Promise<any>;
  findOne(): Promise<any>;
}

export class Taxonomy extends Query {
  constructor();
  above(key: string, value: string, levels?: number): Query;
  equalAndAbove(key: string, value: string, levels?: number): Query;
  below(key: string, value: string, levels?: number): Query;
  equalAndBelow(key: string, value: string, levels?: number): Query;
}
