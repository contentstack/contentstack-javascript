import { Pagination } from '../../src/lib/pagination';

describe('Pagination class', () => {

  it('should paginate the query with paginateObj skip and limit values when paginateObj is passed', () => {
    const pageObject = new Pagination().paginate({ skip: 10, limit: 10 });
    expect(pageObject).toBeInstanceOf(Pagination);
    expect(pageObject._queryParams).toEqual({ skip: 10, limit: 10 });
  });

  it('should change the skip value when next method is called', () => {
    const pageObject = new Pagination().paginate({ skip: 10, limit: 10 });
    expect(pageObject).toBeInstanceOf(Pagination);
    expect(pageObject._queryParams).toEqual({ skip: 10, limit: 10 });

    pageObject.next();
    expect(pageObject._queryParams).toEqual({ skip: 20, limit: 10 });
  });

  it('should change the skip value when previous method is called', () => {
    const pageObject = new Pagination().paginate({ skip: 10, limit: 10 });
    expect(pageObject).toBeInstanceOf(Pagination);
    expect(pageObject._queryParams).toEqual({ skip: 10, limit: 10 });

    pageObject.previous();
    expect(pageObject._queryParams).toEqual({ skip: 0, limit: 10 });
  });
});
