import { ObjectLiteral } from '../interfaces/generic-object';

export const queryStringsToObject = (queryStrings: string): ObjectLiteral => {
  const result = {};

  const fields = queryStrings.split(',');

  for (const field of fields) {
    const values = field.split(' ');

    result[values[0]] = values[1];
  }

  return result;
};
