export type Callback = (value: string | null, key: string) => void;

export const iGlobal = typeof window !== 'undefined' ? window : global;
