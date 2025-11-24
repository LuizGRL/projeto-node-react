import { IncomingMessage, ServerResponse } from "http";
import type { IHttpRequest } from "../models/IHttpRequest";
import { parseBody } from "../utils/parseBody";

type ControllerMethod = (httpRequest: IHttpRequest) => Promise<any>;

export const adaptRoute = (controller: ControllerMethod, body?: any) => {
  return async (req: IncomingMessage, res: ServerResponse) => {

    if(!body) {
      body = await parseBody(req);
    }
    const httpRequest: IHttpRequest = {
      body,
      headers: req.headers,
      query: (req as any).query || {},
      user: (req as any).user, 
    };

    const httpResponse = await controller(httpRequest);

    res.writeHead(httpResponse.statusCode, {
      "Content-Type": "application/json",
    });
    
    res.end(JSON.stringify(httpResponse.body));
  };
};