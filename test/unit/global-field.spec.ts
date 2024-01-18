import { AxiosInstance, httpClient } from '@contentstack/core';
import { GlobalField } from 'src/lib/global-field';
import MockAdapter from 'axios-mock-adapter';
import { gfieldFetchDataMock } from '../utils/mocks';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

describe('GlobalField class', () => {
  let gfield: GlobalField;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    gfield = new GlobalField(client, 'gfieldUid');
  });

  it('should add "include_branch" in _queryParams when includeBranch method is called', () => {
    const returnedValue = gfield.includeBranch();
    expect(returnedValue).toBeInstanceOf(GlobalField);
    expect(gfield._queryParams.include_branch).toBe('true');
  });

  it('should add "fetch" in _queryParams when fetch method is called', async () => {
    mockClient.onGet(`/global_fields/gfieldUid`).reply(200, gfieldFetchDataMock);
    const returnedValue = await gfield.fetch();
    expect(returnedValue).toEqual(gfieldFetchDataMock.global_field);
  });
});
