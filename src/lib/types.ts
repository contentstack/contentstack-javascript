/* eslint-disable @cspell/spellchecker */
import { HttpClientParams } from '@contentstack/core';
import { PersistanceStoreOptions, StorageType } from '../persistance';

export enum Region {
  US = 'us',
  EU = 'eu',
  AZURE_NA = 'azure-na',
  AZURE_EU = 'azure-eu',
}
export interface StackConfig extends HttpClientParams {
  host?: string;
  apiKey: string;
  deliveryToken: string;
  environment: string;
  early_access?: string[];
  region?: Region;
  locale?: string;
  plugins?: any[];
  logHandler?: (level: string, data: any) => void;
  cacheOptions?: CacheOptions;
}
export interface CacheOptions extends PersistanceStoreOptions {
  policy: Policy;
  storeType?: StorageType;
}

export enum Policy {
  IGNORE_CACHE = 'IGNORE_CACHE',
  CACHE_THEN_NETWORK = 'CACHE_THEN_NETWORK',
  CACHE_ELSE_NETWORK = 'CACHE_ELSE_NETWORK',
  NETWORK_ELSE_CACHE = 'NETWORK_ELSE_CACHE',
}

export interface SyncStack {
  paginationToken?: string;
  syncToken?: string;
}
export enum PublishType {
  ENTRY_PUBLISHED = 'entry_published',
  ENTRY_UNPUBLISHED = 'entry_unpublished',
  ENTRY_DELETED = 'entry_deleted',
  ASSET_PUBLISHED = 'asset_published',
  ASSET_UNPUBLISHED = 'asset_unpublished',
  ASSET_DELETED = 'asset_deleted',
  CONTENT_TYPE_DELETED = 'content_type_deleted',
}
export interface SyncType {
  environment?: string;
  contentTypeUid?: string;
  type?: PublishType[] | PublishType | string;
  locale?: string;
  startDate?: string;
}
export type TransformData = { [key: string]: string | string[] };

export enum Format {
  GIF = 'gif',
  PNG = 'png',
  JPG = 'jpg',
  PJPG = 'pjpg',
  WEBP = 'webp',
  WEBPLL = 'webpll',
  WEBPLY = 'webply',
}

export enum CropBy {
  DEFAULT = 'default',
  ASPECTRATIO = 'aspectRatio',
  REGION = 'region',
  OFFSET = 'offset',
}

export enum FitBy {
  BOUNDS = 'bounds',
  CROP = 'crop',
}

export enum Orientation {
  DEFAULT = 1,
  FLIP_HORIZONTAL = 2,
  FLIP_HORIZONTAL_VERTICAL = 3,
  FLIP_VERTICAL = 4,
  FLIP_HORIZONTAL_LEFT = 5,
  RIGHT = 6,
  FLIP_HORIZONTAL_RIGHT = 7,
  LEFT = 8,
}

export enum OverlayAlign {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  MIDDLE = 'middle',
  CENTER = 'center',
}

export enum OverlayRepeat {
  X = 'x',
  Y = 'y',
  BOTH = 'both',
}

export enum ResizeFilter {
  NEAREST = 'nearest',
  BILINEAR = 'bilinear',
  BICUBIC = 'bicubic',
  LANCZOS2 = 'lanczos2',
  LANCZOS3 = 'lanczos3',
}

export enum CanvasBy {
  DEFAULT = 'default',
  ASPECTRATIO = 'aspectRatio',
  REGION = 'region',
  OFFSET = 'offset',
}

export enum QueryOperation {
  EQUALS = '',
  NOT_EQUALS = '$ne',
  INCLUDES = '$in',
  EXCLUDES = '$nin',
  IS_LESS_THAN = '$lt',
  IS_LESS_THAN_OR_EQUAL = '$lte',
  IS_GREATER_THAN = '$gt',
  IS_GREATER_THAN_OR_EQUAL = '$gte',
  EXISTS = '$exists',
  MATCHES = '$regex',
}

export type BaseQueryParameters = {
  [key: string]:
    | string
    | string[]
    | { [key in QueryOperation]?: string | string[] }
    | { [key: string]: BaseQueryParameters | any };
};

export enum QueryOperator {
  AND = '$and',
  OR = '$or',
}

export type PaginationObj = {
  skip?: number;
  limit?: number;
};

interface ACL {
  roles?: Record<string, never>;
  others?: {
    read?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    sub_acl?: {
      read?: boolean;
      create?: boolean;
      update?: boolean;
      delete?: boolean;
      publish?: boolean;
    };
  };
}

export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}
export interface BaseEntry {
  _version: number;
  locale: string;
  uid: string;
  ACL: Record<string, never> | ACL;
  _in_progress: boolean;
  created_at: string;
  created_by: string;
  tags: string[];
  title: string;
  updated_at: string;
  updated_by: string;
  publish_details: PublishDetails;
}

export interface ReferenceResponse {
  uid: string;
  _content_type_uid: string;
}

export interface BaseAsset {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: [];
  filename: string;
  url: string;
  ACL: ACL;
  is_dir: boolean;
  parent_uid: null | string;
  _version: number;
  title: string;
  publish_details?: PublishDetails;
}

export interface BaseContentType {
  title: string;
  uid: string;
  options: {
    is_page: false;
    singleton: false;
    title: string;
    sub_title: [];
  };
  DEFAULT_ACL: ACL;
  SYS_ACL: ACL;
  created_at: string;
  updated_at: string;
  inbuilt_class: false;
  description: string;
  abilities: {
    get_one_object: true;
    get_all_objects: true;
    create_object: true;
    update_object: true;
    delete_object: true;
    delete_all_objects: true;
  };
  last_activity: any;
  maintain_revisions: boolean;
  _version: number;
}

export interface FindEntry<T> {
  entries: T[];
  count?: number;
}

export interface FindContentType<T> {
  content_types: T[];
  count?: number;
}

export interface FindAsset<T> {
  assets: T[];
  count?: number;
}
