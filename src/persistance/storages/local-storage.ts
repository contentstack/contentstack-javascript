import { Callback, iGlobal } from '../helper/utils';
import { Storage } from '../types/storage';

export const localStorage: Storage = {
  name: 'localStorage',
  clear: clear,
  each: each,
  getItem: getItem,
  removeItem: removeItem,
  setItem: setItem,
};

function _localStorage() {
  return iGlobal.localStorage;
}

function clear() {
  _localStorage().clear();
}
function each(callback: Callback) {
  for (let i = _localStorage().length - 1; i >= 0; i--) {
    const key = _localStorage().key(i);
    if (key && getItem(key)) {
      const value = getItem(key);
      callback(value, key);
    }
  }
}
function setItem(key: string, value: string) {
  if (!key) {
    return;
  }
  _localStorage().setItem(key, value);
}
function getItem(key: string): string | null {
  return _localStorage().getItem(key);
}
function removeItem(key: string) {
  _localStorage().removeItem(key);
}
