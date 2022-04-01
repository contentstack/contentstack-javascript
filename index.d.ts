// Type definitions for contentstack 3.12.2
// Project: https://www.contentstack.com/
// Definitions by: Contentstack <https://github.com/contentstack>
import { EntryEmbedable, Option, RenderOption } from '@contentstack/utils'

// Utils
export class Utils {
    static render(option: { 
        entry: EntryEmbedable| EntryEmbedable[],
        renderOption?: RenderOption,
        paths?: string[]
    }): void;
    static renderContent(content: (string | string[]), option: Option): (string| string[]);
    static jsonToHTML(option: { 
        entry: EntryEmbedable| EntryEmbedable[],
        paths: string[],
        renderOption?: RenderOption,
    }): void;
}

//Enum for Contentstack Region
export enum Region {
    US = "us",
    EU = "eu",
    AZURE_NA = "azure-na"
}

//Enum for Contentstack CachePolicy
export enum CachePolicy {
     IGNORE_CACHE = -1,
     ONLY_NETWORK = 0,
     CACHE_ELSE_NETWORK = 1,
     NETWORK_ELSE_CACHE = 2,
     CACHE_THEN_NETWORK = 3
}

// Sync Result 
export interface SyncResult {
    items: Array<any>;
    paginationToken?: string;
    syncToken?: string;
    skip: number;
    limit: number;
    totalCount: number;
}

// Contentstack Config 
export interface Config {
    api_key: string;
    delivery_token: string;
    environment: string;
    region?: Region;
    branch?: string;
    live_preview?: LivePreview;
    fetchOptions?: object;
}
// Stack Config
export interface StackConfig {
    protocol: string;
    host: string;
    port: number;
    version: string;
}

// ContentTypeCollection
export interface ContentTypeCollection{
    content_types: Array<any>
    count?: number
}

export interface LivePreview {
    host: string
    management_token: string
    enable: boolean
}

export interface LivePreviewQuery {
    live_preview: string
    content_type_uid: string
}

// Stack 
export class Stack {
    constructor(config: Config);
    /**
     * @deprecated since version 3.15.0
     */
    constructor(api_key: string, delivery_token: string, environment_name: string, region?: Region, fetchOptions?: any, live_preview?: LivePreview);

    environment: string;
    cachePolicy: CachePolicy;
    config: StackConfig;
    fetchOptions: any;

    ContentType(uid: string): ContentType;
    Assets(uid: string): Asset;
    Assets(): Assets;

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
    getLastActivities(): Promise<any>;;
    getContentTypes(param?: object): Promise<ContentTypeCollection>;
    sync(params: object): Promise<SyncResult>;
    imageTransform(url: string, params: any): string;
}

export function Stack(config: Config): Stack;
/**
 * @deprecated since version 3.15.0
 */
export function Stack(api_key: string, access_token: string, environment_name: string, region?: string, fetchOptions?: object): Stack;

export class ContentType {
    constructor();
    content_type_uid: string
    
    Query(): Query;
    Entry(uid: string): Entry;
    fetch(fetchOptions?: object): Promise<any>;
}

export class Assets {
    constructor();

    toJSON(): Assets;
    addParam(key: string, value: any): Assets;
    Query(): Query;

}

export class Asset {
    constructor();

    asset_uid: string
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
    only(reference_field_uid:string, field_uid: string): this;
    only(reference_field_uid:string, field_uids: string[]): this;

    except(field_uid: string): this;
    except(field_uids: string[]): this;
    except(reference_field_uid:string, field_uid: string): this;
    except(reference_field_uid:string, field_uids: string[]): this;

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
    includeOwner(): this;
    toJSON(): this;
    addParam(key: string, value: any): this;
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

    where(key: string, value: (string | number | boolean)): Query;
    equalTo(key: string, value: (string | number | boolean)): Query;
    notEqualTo(key: string, value: (string | number | boolean)): Query;

    lessThan(key: string, value: (string | number)): Query;
    lessThanOrEqualTo(key: string, value: (string | number)): Query;

    greaterThan(key: string, value: (string | number)): Query;
    greaterThanOrEqualTo(key: string, value: (string | number)): Query;

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

    referenceIn(key: string, query: (Query | object)): Query;
    referenceNotIn(key: string, query: (Query | object)): Query;

    regex(key: string, value: string, options?: string): Query;
    
    /**
     * @deprecated since version 3.15.0
     */
    search(value: string): Query;

    find(fetchOptions?: object): Promise<any>;
    findOne(): Promise<any>;
}
