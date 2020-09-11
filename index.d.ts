// Type definitions for contentstack 3.10.1
// Project: https://www.contentstack.com/
// Definitions by: Contentstack <https://github.com/contentstack>

//Enum for Contentstack Region
export enum Region {
    US = "us",
    EU = "eu"
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
    contentTypes: Array<any>
    count?: number
}

// Stack 
export class Stack {
    constructor(config: Config);
    constructor(api_key: string, delivery_token: string, environment_name: string, region?: Region, fetchOptions?: any);

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
    clearByQuery(): Stack;
    clearByContentType(): Stack;
    clearAll(): Stack;
    getCacheProvider(): object;
    getLastActivites(): Promise<any>;;
    getContentTypes(param?: object): Promise<ContentTypeCollection>;
    sync(params: object): Promise<SyncResult>;
    imageTransform(url: string, params: any): string;
}

export function Stack(config: Config): Stack;
export function Stack(api_key: string, access_token: string, environment_name: string, region?: string, fetchOptions?: object): Stack;

export class ContentType {
    constructor();
    content_type_uid: string
    
    fetch(): Promise<any>;
    Query(): Query;
    Entry(uid: string): Entry;
}

export class Assets {
    constructor();

    toJSON(): Assets;
    addParam(key: string, value: any): Assets;
    Query(): Query;

}

export class Asset {
    constructor();

    toJSON(): Assets;
    addParam(key: string, value: any): Assets;
    fetch(): Promise<any>;
}

export class Entry {
    constructor();

    setCacheProvider(provider: object): Entry;
    setCachePolicy(policy: number): Entry;
    includeReference(val: string[]): Entry;
    includeReference(...val: string[]): Entry;
    language(language_code: string): Entry;
    addQuery(key: string, value: string): Entry;
    includeSchema(): Entry;
    includeReferenceContentTypeUID(): Entry;
    includeContentType(): Entry;
    includeOwner(): Entry;
    toJSON(): Entry;
    addParam(key: string, value: any): Entry;
    fetch(): Promise<any>;
}

export class Query extends Entry {
    constructor();

    equalTo(key: string, value: any): Query;
    where(key: string, value: any): Query;
    count(): Query;
    query(query: any): Query;
    referenceIn(key: string, query: Query): Query;
    referenceNotIn(key: string, query: Query): Query;
    tags(value: any[]): Query;
    includeCount(): Query;
    getQuery(): Query;
    regex(key: string, value: any, options: string): Query;
    search(value: string): Query;
    greaterThan(key: string, value: any): Query;
    greaterThanOrEqualTo(key: string, value: any): Query;
    lessThan(key: string, value: any): Query;
    lessThanOrEqualTo(key: string, value: any): Query;
    notEqualTo(key: string, value: any): Query;
    containedIn(key: string, value: any): Query;

    find(): Promise<any>;
    findOne(): Promise<any>;

}