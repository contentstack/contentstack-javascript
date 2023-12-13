import { Store, PersistanceStoreConfig } from './config/persistance-storage-config';
import { localStorage } from './storages/local-storage';
import { memoryStorage } from './storages/memory-storage';
import { Storage } from './types/storage';
import { StorageType } from './types/storage-type';

export class PersistanceStore {
  protected store: Storage = localStorage;
  readonly config: PersistanceStoreConfig;
  protected name: string;

  constructor(config?: PersistanceStoreConfig) {
    let defaultConfig: PersistanceStoreConfig = {
      storageType: 'localStorage',
      maxAge: 1000 * 60 * 60 * 24,
      serializer: JSON.stringify,
      deserializer: JSON.parse,
    };
    defaultConfig = {
      ...defaultConfig,
      ...config,
    };
    this.setStore(defaultConfig.storageType, (defaultConfig as unknown as Store).storage);
    this.config = defaultConfig;
    this.name = ''; // TODO add stack api key to name
  }
  private setStore(type?: StorageType | 'customStorage', store?: Storage) {
    switch (type) {
      case 'localStorage':
        break;
      case 'memoryStorage':
        this.store = memoryStorage;
        break;
      case 'customStorage':
        if (!store) {
          throw new TypeError('StorageType `customStorage` should have `storage`.');
        } else {
          this.store = store;
        }
        break;
    }
  }
  setItem(key: string, value: any, contentTypeUid?: string, maxAge?: number) {
    if (!key) {
      return;
    }
    const generatedKey = this.generateCSKey(key, contentTypeUid);

    if (!value) {
      this.store.removeItem(generatedKey);

      return;
    }
    const expiry = this.calculateExpiry(maxAge);
    let content: any = { value, expiry };
    if (this.config.serializer) {
      content = this.config.serializer(content);
    }

    this.store.setItem(generatedKey, content);
  }
  getItem(key: string, contentTypeUid?: string): any {
    const generatedKey = this.generateCSKey(key, contentTypeUid);
    const content = this.store.getItem(generatedKey);

    if (content) {
      if (this.config.deserializer) {
        const item = this.config.deserializer(content);
        if (!this.isExpire(item.expiry)) {
          return item.value;
        } else {
          this.removeItem(key, contentTypeUid);
        }
      }
    }
  }

  removeItem(key: string, contentTypeUid?: string) {
    const generatedKey = this.generateCSKey(key, contentTypeUid);
    this.store.removeItem(generatedKey);
  }

  clear(contentTypeUid?: string) {
    if (!contentTypeUid) {
      this.store.clear();
    } else {
      this.store.each((_, key) => {
        if (key.match(contentTypeUid)) {
          this.store.removeItem(key);
        }
      });
    }
  }

  private generateCSKey(key: string, contentTypeUid?: string): string {
    let keyPrefix = 'cs_store_js';
    if (contentTypeUid) {
      keyPrefix = contentTypeUid + '_' + keyPrefix;
    }
    keyPrefix = this.name + '_' + keyPrefix + '_' + key;

    return keyPrefix;
  }
  private calculateExpiry(maxAge?: number): number {
    const now = new Date();
    const nowMSec = now.getTime();
    if (maxAge) {
      return nowMSec + maxAge;
    } else if (this.config.maxAge) {
      return nowMSec + this.config.maxAge;
    }

    return 0;
  }

  private isExpire(dateTime: number): boolean {
    if (dateTime) {
      return dateTime < new Date().getTime();
    }

    return true;
  }
}
