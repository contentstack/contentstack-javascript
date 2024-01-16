import { PersistanceStore } from '../../../src/persistance/persistance-store';
import { StorageType } from '../../../src/persistance/types/storage-type';
import { memoryStorage } from '../../../src/persistance/storages/memory-storage';
describe('persistance store intiialization test', () => {
  it('should initialize default persistance ', () => {
    const persistance = new PersistanceStore();
    expect(persistance).toBeDefined();
    expect(persistance.config).toBeDefined();
    expect(persistance.config.maxAge).toEqual(86400000);
    expect(persistance.config.storageType).toEqual('localStorage');
  });

  it('should initialize persistance with name and local storage type ', () => {
    const storageType = 'localStorage';
    const persistance = makePersistance({ storageType });
    expect(persistance).toBeDefined();
    expect(persistance.config).toBeDefined();
    expect(persistance.config.maxAge).toEqual(86400000);
    expect(persistance.config.storageType).toEqual(storageType);
  });
  it('should initialize persistance with name and memory storage type ', () => {
    const storageType = 'memoryStorage';
    const persistance = makePersistance({ storageType });
    expect(persistance).toBeDefined();
    expect(persistance.config).toBeDefined();
    expect(persistance.config.maxAge).toEqual(86400000);
    expect(persistance.config.storageType).toEqual(storageType);
  });
  it('should initialize persistance with name and local storage type ', () => {
    const storageType = 'customStorage';
    const persistance = makePersistance({ storageType });
    expect(persistance).toBeDefined();
    expect(persistance.config).toBeDefined();
    expect(persistance.config.maxAge).toEqual(86400000);
    expect(persistance.config.storageType).toEqual(storageType);
  });
  it('should throw error on custom storage without storage', () => {
    const config: any = { name: 'foobar', storageType: 'customStorage' };
    config.storage = '';
    const persistance = () => {
      new PersistanceStore(config);
    };
    expect(persistance).toThrow(TypeError);
  });
});

describe('persistance store init', () => {
  it('should set max age, serializer and deserializer', () => {
    const serializer = jest.fn();
    const deserializer = jest.fn();
    const maxAge = 1000 * 60;
    const persistance = new PersistanceStore({ serializer, deserializer, maxAge });
    expect(persistance.config.maxAge).toEqual(maxAge);
    persistance.config.serializer!('foo');
    persistance.config.deserializer!('foo');
    expect(serializer.mock.calls.length).toEqual(1);
    expect(deserializer.mock.calls.length).toEqual(1);
  });
});

describe('persistance functionality', () => {
  const persistance = new PersistanceStore();
  const namespace = 'namespace';
  it('should set item for key with value', () => {
    persistance.setItem('foo', 'bar');
    expect(persistance.getItem('foo')).toEqual('bar');
  });
  it('should not blank key', () => {
    persistance.setItem('', 'bar');
    expect(persistance.getItem('')).toEqual(undefined);
  });
  it('should remove item for key', () => {
    persistance.setItem('foo', 'bar', namespace);
    persistance.removeItem('foo');
    expect(persistance.getItem('foo')).toEqual(undefined);
    expect(persistance.getItem('foo', namespace)).toEqual('bar');
  });

  it('should not throw on blank or not present key', () => {
    persistance.removeItem('');
    persistance.removeItem('foo');
    expect(persistance.getItem('')).toEqual(undefined);
  });

  it('should update item for key', () => {
    persistance.setItem('foo', 'bar1');
    persistance.setItem('foo', 'bar2');
    expect(persistance.getItem('foo')).toEqual('bar2');
  });
  it('should contain key value on removed another key', () => {
    persistance.setItem('foo', 'bar');
    persistance.setItem('bar', 'foo');
    persistance.removeItem('foo');
    expect(persistance.getItem('foo')).toEqual(undefined);
    expect(persistance.getItem('bar')).toEqual('foo');
  });
  it('should return undefined on expiry', (done) => {
    persistance.setItem('foo', 'bar', undefined, 10);
    setTimeout(() => {
      expect(persistance.getItem('foo')).toEqual(undefined);
      done();
    }, 20);
  });

  it('should allow to set value undefined', () => {
    persistance.setItem('foo', 'bar');
    persistance.setItem('foo', undefined);

    expect(persistance.getItem('foo')).toEqual(undefined);
  });
  it('should not contain key value clear', () => {
    persistance.setItem('foo', 'bar');
    persistance.setItem('bar', 'foo');
    persistance.clear();
    expect(persistance.getItem('foo')).toEqual(undefined);
    expect(persistance.getItem('bar')).toEqual(undefined);
  });
});

describe('persistance with namespace functionality', () => {
  const persistance = new PersistanceStore();
  const namespace = 'namespace';

  it('should set item for key, value', () => {
    persistance.setItem('foo', 'bar', namespace);
    expect(persistance.getItem('foo')).toEqual(undefined);
    expect(persistance.getItem('foo', namespace)).toEqual('bar');
  });
  it('should remove item for key', () => {
    persistance.setItem('foo', 'bar');
    persistance.removeItem('foo', namespace);
    expect(persistance.getItem('foo')).toEqual('bar');
    expect(persistance.getItem('foo', namespace)).toEqual(undefined);
  });
  it('should update item for key', () => {
    persistance.setItem('foo', 'bar1', namespace);
    persistance.setItem('foo', 'bar2', namespace);
    expect(persistance.getItem('foo', namespace)).toEqual('bar2');
  });

  it('should contain key value on removed another key', () => {
    persistance.setItem('foo', 'bar', namespace);
    persistance.setItem('bar', 'foo', namespace);
    persistance.removeItem('foo', namespace);
    expect(persistance.getItem('foo', namespace)).toEqual(undefined);
    expect(persistance.getItem('bar', namespace)).toEqual('foo');
  });
  it('should not contain key value clear', () => {
    persistance.setItem('foo', 'bar', namespace);
    persistance.setItem('bar', 'foo', namespace);
    persistance.clear(namespace);
    expect(persistance.getItem('foo', namespace)).toEqual(undefined);
    expect(persistance.getItem('bar', namespace)).toEqual(undefined);
  });
});

describe('persistance with 0 maxAge', () => {
  it('should allow max age to be set to 0', () => {
    const persistance = new PersistanceStore({ maxAge: 0 });
    persistance.setItem('foo', 'bar');
    expect(persistance.getItem('foo')).toEqual(undefined);
  });
});

function makePersistance(config: { storageType: StorageType | 'customStorage' }) {
  return new PersistanceStore({ storageType: config.storageType, storage: memoryStorage });
}
