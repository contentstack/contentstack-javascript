import { Region } from './types';

export function getHost(region: Region = Region.US, host?: string) {
  if (host) return host;

  let url = 'cdn.contentstack.io';
  if (region !== Region.US) {
    url = region.toString().toLowerCase() + '-cdn.contentstack.com';
  }

  return url;
}
