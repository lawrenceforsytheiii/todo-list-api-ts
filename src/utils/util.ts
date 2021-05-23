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
export const validateAgainstConstraints = (values: Generic<string>, constraints: Generic<object>) => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);

    if (typeof validation === 'undefined') {
      resolve();
    } else {
      reject(new ResponseModel({ validation }, 400, 'required fields are missing'));
    }
  });
};