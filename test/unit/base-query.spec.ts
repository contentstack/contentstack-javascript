import { BaseQuery } from '../../src/lib/base-query';
import { QueryOperation } from '../../src/lib/types';

describe('BaseQuery class', () => {
  let baseQuery: BaseQuery;
  beforeEach(() => {
    baseQuery = new BaseQuery();
  });

  it("should add 'include_count' parameter to the query parameters", () => {
    const returnedValue = baseQuery.includeCount();

    expect(returnedValue).toBeInstanceOf(BaseQuery);
    expect(baseQuery._queryParams.include_count).toBe('true');
  });

  it("should add 'asc' parameter with the specified key to the query parameters", () => {
    baseQuery.orderByAscending('name');

    expect(baseQuery._queryParams.asc).toBe('name');
  });

  it("should add 'desc' parameter with the specified key to the query parameters", () => {
    baseQuery.orderByDescending('date');

    expect(baseQuery._queryParams.desc).toBe('date');
  });

  it('should add the specified key-value pair to the query parameters', () => {
    baseQuery.param('category', 'books');

    expect(baseQuery._queryParams.category).toBe('books');
  });

  it('should add all the key-value pairs from the specified object to the query parameters', () => {
    baseQuery.addParams({ category: 'books', author: 'john' });

    expect(baseQuery._queryParams.category).toBe('books');
    expect(baseQuery._queryParams.author).toBe('john');
  });

  it('should remove a query parameter correctly', () => {
    baseQuery.param('key1', 'value1');
    baseQuery.param('key2', 'value2');
    expect(baseQuery._queryParams).toEqual({ key1: 'value1', key2: 'value2' });

    baseQuery.removeParam('key1');
    expect(baseQuery._queryParams).toEqual({ key2: 'value2' });

    baseQuery.removeParam('key2');
    expect(baseQuery._queryParams).toEqual({});
  });

  it('should do nothing if the parameter does not exist', () => {
    baseQuery.param('key1', 'value1');
    expect(baseQuery._queryParams).toEqual({ key1: 'value1' });

    baseQuery.removeParam('key2');
    expect(baseQuery._queryParams).toEqual({ key1: 'value1' });
  });
});
