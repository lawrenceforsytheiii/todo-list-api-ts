/**
 * Types
 */
type ResponseHeader = { [header: string]: string | number | boolean; };

/**
 * Interfaces
 */
interface ResponseBody {
  data: any;
  message: string;
  status?: string;
};
interface Response {
  statusCode: number;
  headers: ResponseHeader;
  body: string;
};

/**
 * Enums
 */
enum Status {
  SUCCESS = 'success',
  ERROR = 'error',
  BAD_REQUEST = 'bad request',
};

const STATUS_MESSAGES = {
  200: Status.SUCCESS,
  400: Status.BAD_REQUEST,
  500: Status.ERROR,
};

const RESPONSE_HEADERS: ResponseHeader = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
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
  constructor(data = {}, statusCode = 402, message = '') {
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