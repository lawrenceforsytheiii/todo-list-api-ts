import validate from 'validate.js/validate';
import ResponseModel from "../models/response.model";

// Types
type Generic<T> = {
  [index in string | number | any]: T;
};

/**
 * Validate values against constraints
 * @param values
 * @param constraints
 * @return {Promise<any>}
 */
export const validateAgainstConstraints = (values: Generic<string>, constraints: Generic<Record<string, unknown>>) => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);

    if (typeof validation === 'undefined') {
      resolve();
    } else {
      reject(new ResponseModel({ validation }, 400, 'required fields are missing'));
    }
  });
};

export const createChunks = (data: any[], chunkSize: number) => {
  const urlChunks = [];
  let batchIterator = 0;
  while (batchIterator < data.length) {
    urlChunks.push(data.slice(batchIterator, (batchIterator += chunkSize)));
  }
  return urlChunks;
};