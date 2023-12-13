import { Callback } from '../helper/utils';

export interface Storage {
  name: string;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  each: (callback: Callback) => void;
  clear: () => void;
}
