import { queryStringsToObject } from '../query.helper';

describe('Query Helper', () => {
  it('should return an object based on the string', () => {
    const input = 'id asc,name desc';
    const expected = {
      id: 'asc',
      name: 'desc',
    };

    expect(queryStringsToObject(input)).toEqual(expected);
  });
});
