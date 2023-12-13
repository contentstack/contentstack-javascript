import { Callback } from '../helper/utils';
import { Storage } from '../types/storage';

export const memoryStorage: Storage = {
  name: 'memoryStorage',
  clear: clear,
  each: each,
  getItem: getItem,
  removeItem: removeItem,
  setItem: setItem,
};

let memory: { [key: string]: string | null } = {};

function clear() {
  memory = {};
}
function each(callback: Callback) {
  for (const key in memory) {
    const value = getItem(key);
    callback(value, key);
  }
}
function setItem(key: string, value: string) {
  if (!key) {
    return;
  }
  memory[key] = value;
}
function getItem(key: string): string | null {
  return memory[key];
}
function removeItem(key: string) {
  delete memory[key];
}
