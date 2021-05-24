import {
  ResponseBody,
  Response,
  ResponseHeader,
} from '../interfaces/response.interface';
import { Status } from '../enums/status.enum';
import { StatusCode } from '../enums/status-code.enum';

const RESPONSE_HEADERS: ResponseHeader = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const STATUS_MESSAGES = {
  [StatusCode.OK]: Status.SUCCESS,
  [StatusCode.BAD_REQUEST]: Status.BAD_REQUEST,
  [StatusCode.ERROR]: Status.ERROR,
};

/**
 * class ResponseModel
 */
export default class ResponseModel {
  private body: ResponseBody;
  private statusCode: number;

  /**
   * ResponseModel constructor
   * @param data
   * @param statusCode
   * @param message
   */
  constructor(data = {}, statusCode = StatusCode.BAD_REQUEST, message = '') {
    this.body = {
      data: data,
      message: message,
      status: STATUS_MESSAGES[statusCode],
    };
    this.statusCode = statusCode;
  };

  /**
   * Add or update a body variable
   * @param variable
   * @param value
   */
  setBodyVariable = (variable: string, value: string): void => {
    this.body[variable] = value;
  };

  /**
   * Set data
   * @param data
   */
  setBodyData = (data: any): void => {
    this.body.data = data;
  };

  /**
   * Set status code
   * @param statusCode
   */
  setStatusCode = (statusCode: number): void => {
    this.statusCode = statusCode;
  };

  /**
   * Get status code
   * @return {*}
   */
  getStatusCode = (): number => {
    return this.statusCode;
  };

  /**
   * Set body message
   * @param message
   */
  setBodyMessage = (message: string): void => {
    this.body.message = message;
  };

  /**
   * Get body message
   * @return {string|*}
   */
  getBodyMessage = (): any => {
    return this.body.message;
  };

  /**
   * Geneate a response
   * @return {Response}
   */
  generate = (): Response => {
    return {
      statusCode: this.statusCode,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify(this.body),
    };
  };
};