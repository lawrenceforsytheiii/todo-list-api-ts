export type ResponseHeader = { [header: string]: string | number | boolean; }
export interface ResponseBody {
  data: any;
  message: string;
  status?: string;
}
export interface Response {
  statusCode: number;
  headers: ResponseHeader;
  body: string;
}