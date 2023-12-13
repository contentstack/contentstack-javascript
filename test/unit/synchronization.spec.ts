import { synchronization } from '../../src/lib/synchronization';
import { LOCALE } from '../utils/constant';
import * as core from '@contentstack/core';
import { SyncStack, SyncType, PublishType } from '../../src/lib/types';
import { axiosGetMock } from '../utils/mocks';
import { httpClient } from '@contentstack/core';

jest.mock('@contentstack/core');
const getDataMock = <jest.Mock<typeof core.getData>>(<unknown>core.getData);

describe('Synchronization function', () => {
  beforeEach(() => {
    getDataMock.mockImplementation((_client, _url, params) => {
      const resp: any = axiosGetMock;
      if ('pagination_token' in params) {
        delete resp.data.pagination_token;
        resp.data.sync_token = '<sync_token>';
      } else resp.data.pagination_token = '<pagination_token>';

      return resp;
    });
  });
  afterEach(() => {
    getDataMock.mockReset();
  });
  const syncCall = async (params?: SyncStack | SyncType, recursive = false) => {
    return await synchronization(httpClient({}), params, recursive);
  };
  it('should have valid init and environment params as req params when no request params is passed', async () => {
    await await synchronization(httpClient({}));
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toEqual({ init: true });
  });

  it('should have only pagination_token param when sync is called with pagination_token.', async () => {
    await syncCall({ paginationToken: '<page_tkn>' });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).not.toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).not.toHaveProperty('environment');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('pagination_token');
    expect(getDataMock.mock.calls[0][2].params).toEqual({ pagination_token: '<page_tkn>' });
  });
  it('should have only sync_token param when sync is called with sync_token.', async () => {
    await syncCall({ syncToken: '<sync_tkn>' });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).not.toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).not.toHaveProperty('environment');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('sync_token');
    expect(getDataMock.mock.calls[0][2].params).toEqual({ sync_token: '<sync_tkn>' });
  });
  it('should have valid content_type_uid when content_type_uid is passed as param', async () => {
    await syncCall({ contentTypeUid: 'session' });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('content_type_uid');
    expect(getDataMock.mock.calls[0][2].params).toEqual({
      init: true,
      content_type_uid: 'session',
    });
  });
  it('should have valid locale when a locale is passed as param', async () => {
    await syncCall({ locale: LOCALE });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('locale');
    expect(getDataMock.mock.calls[0][2].params).toEqual({
      init: true,
      locale: LOCALE,
    });
  });
  it('should have valid date structure and other required params when start_date is passed as param', async () => {
    await syncCall({ startDate: '2018-10-22' });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('start_date');
    expect(getDataMock.mock.calls[0][2].params).toEqual({
      init: true,
      start_date: '2018-10-22',
    });
  });
  it('should have valid publish_type when type is passed as param', async () => {
    await syncCall({ type: [PublishType.ENTRY_PUBLISHED] });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('type');
    expect(getDataMock.mock.calls[0][2].params).toEqual({
      init: true,
      type: 'entry_published',
    });
  });
  it('should have all the passed params when multiple params are passed', async () => {
    await syncCall({
      locale: 'en-us',
      startDate: '2018-10-22',
      type: [PublishType.ENTRY_PUBLISHED, PublishType.CONTENT_TYPE_DELETED],
    });
    expect(getDataMock.mock.calls[0][1]).toBe('/sync');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('init');
    expect(getDataMock.mock.calls[0][2].params).toHaveProperty('type');
    expect(getDataMock.mock.calls[0][2].params).toEqual({
      init: true,
      start_date: '2018-10-22',
      locale: 'en-us',
      type: 'entry_published,content_type_deleted',
    });
  });
  it('should return pagination_token when a batch of updates are fetched ', async () => {
    const syncData = await syncCall({
      locale: 'en-us',
      startDate: '2018-10-22',
      type: [PublishType.ENTRY_PUBLISHED],
    });

    expect(syncData).toHaveProperty('pagination_token');
  });
  it('should return sync_token when all the updates are fetched ', async () => {
    const syncData = await syncCall(
      {
        locale: 'en-us',
        startDate: '2018-10-22',
        type: [PublishType.ENTRY_PUBLISHED],
      },
      true
    );

    expect(syncData).toHaveProperty('sync_token');
  });
});
