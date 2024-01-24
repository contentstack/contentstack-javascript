import { Storage } from '../types/storage';
import { StorageType } from '../types/storage-type';

export type PersistanceStoreConfig =
  | (Store & PersistanceStoreOptions)
  | ({ storageType?: StorageType } & PersistanceStoreOptions);
export interface Store {
  storage: Storage;
  storageType: 'customStorage';
}
export interface PersistanceStoreOptions {
  maxAge?: number; // default 24 hrs
  serializer?: (content: any) => string; // default JSON.stringify
  deserializer?: (cacheString: string) => any; // default JSON.parse
}
