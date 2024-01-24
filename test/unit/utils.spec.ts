import { Region } from '../../src/lib/types';
import { getHost } from '../../src/lib/utils';
import { DUMMY_URL, HOST_EU_REGION, HOST_GCP_NA_REGION, HOST_URL, MOCK_CLIENT_OPTIONS } from '../utils/constant';
import { httpClient, AxiosInstance } from '@contentstack/core';
import MockAdapter from 'axios-mock-adapter';
import { assetQueryFindResponseDataMock } from '../utils/mocks';

let client: AxiosInstance;
let mockClient: MockAdapter;

beforeAll(() => {
  client = httpClient(MOCK_CLIENT_OPTIONS);
  mockClient = new MockAdapter(client as any);
});

describe('Utils', () => {
  it('should return host when region or host is passed', () => {
    const url = getHost(Region.EU);
    expect(url).toEqual(HOST_EU_REGION);
  });
  it('should return host when region or host is passed', () => {
    const url = getHost(Region.GCP_NA);
    expect(url).toEqual(HOST_GCP_NA_REGION);
  });
  it('should return proper US region when nothing is passed', () => {
    const url = getHost();
    expect(url).toEqual(HOST_URL);
  });

  it('should return the host url if host is passed instead of region', () => {
    const host = DUMMY_URL;
    const url = getHost(Region.US, host);
    expect(url).toEqual(DUMMY_URL);
  });
});
