export interface TEntry {
  uid: string;
  title: string;
  created_at: string;
  _version: number;
  locale: string;
  created_by: string;
  updated_by: string;
  _branch?: string;
  publish_details: PublishDetails;
  author: Author[];
  url: string;
}


export interface TEntries {
  entries: TEntry[];
}

interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

interface Author {
  uid: string;
  _content_type_uid: string;
}

export interface TAsset {
  _version: number;
  uid: string;
  filename: string;
  content_type: string;
  created_by: string;
  updated_by: string;
  publish_details: PublishDetails;
  url: string;
  _branch?: string;
  _metadata?: { [key: string]: any }
  dimension?: {
    height: string;
    width: string;
  };
}

export interface TAssets {
  assets: TAsset[];
}

export interface TContentType {
  title: string;
  uid: string;
  _version: number;
  schema: {
    display_name: string;
    uid: string;
    data_type: string;
    mandatory: string;
  };
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TContentTypes {
  content_types: TContentType[];
}
