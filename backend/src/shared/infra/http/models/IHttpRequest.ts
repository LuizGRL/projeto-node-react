export interface IHttpRequest {
  body?: any;
  headers?: any;
  params?: any;
  query?: any;
  user?: {
    id: string;
    role: string;
  };
}

export interface IHttpResponse {
  statusCode: number;
  body: any;
}