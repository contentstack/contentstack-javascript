import { GlobalFieldQuery } from '../../src/lib/global-field-query';
import { httpClient, AxiosInstance } from '@contentstack/core';
import MockAdapter from 'axios-mock-adapter';
import { gfieldQueryFindResponseDataMock } from '../utils/mocks';
import { MOCK_CLIENT_OPTIONS } from '../utils/constant';

describe('GlobalFieldQuery class', () => {
  let gfieldQuery: GlobalFieldQuery;
  let client: AxiosInstance;
  let mockClient: MockAdapter;

  beforeAll(() => {
    client = httpClient(MOCK_CLIENT_OPTIONS);
    mockClient = new MockAdapter(client as any);
  });

  beforeEach(() => {
    gfieldQuery = new GlobalFieldQuery(client);
  });

  it('should add "include_branch" in queryParameter when includeBranch method is called', () => {
    const returnedValue = gfieldQuery.includeBranch();
    expect(returnedValue).toBeInstanceOf(GlobalFieldQuery);
    expect(gfieldQuery._queryParams.include_branch).toBe('true');
  });

  it('should return response data when successful', async () => {
    mockClient.onGet('/global_fields').reply(200, gfieldQueryFindResponseDataMock);
    const response = await gfieldQuery.find();
    expect(response).toEqual(gfieldQueryFindResponseDataMock);
  });
});
