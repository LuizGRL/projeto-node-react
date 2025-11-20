import { IncomingMessage, ServerResponse } from "http";
import type { IHttpRequest } from "../models/IHttpRequest";
import { parseBody } from "../utils/parseBody";


interface IController {
  handle(httpRequest: IHttpRequest): Promise<any>;
}

export const adaptRoute = (controller: IController) => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const body = await parseBody(req);

    const httpRequest: IHttpRequest = {
      body,
      headers: req.headers,
      query: (req as any).query || {},
      user: (req as any).user, 
    };

    const httpResponse = await controller.handle(httpRequest);

    res.writeHead(httpResponse.statusCode, {
      "Content-Type": "application/json",
    });
    
    res.end(JSON.stringify(httpResponse.body));
  };
};