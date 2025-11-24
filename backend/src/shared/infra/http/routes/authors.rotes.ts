import type { IncomingMessage, ServerResponse } from "http";
import { container } from "tsyringe";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";
import { verifyAuth } from "../utils/verifyAuth";
import { checkRole } from "../utils/checkRole";
import { AuthorController } from "modules/books/controllers/AuthorController";

const authorController = container.resolve(AuthorController);

export async function authorsRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/authors';

  if (url === mainRoute + "/create" && method === "POST") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(authorController.create.bind(authorController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(authorController.update.bind(authorController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(authorController.delete.bind(authorController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/getById" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]); 
      return adaptRoute(authorController.findById.bind(authorController))(req, res);
    } catch (err) {
      throw err;
    }
  } 

  if (url === mainRoute + "/list" && method === "GET") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]); 
      return adaptRoute(authorController.list.bind(authorController))(req, res);
    } catch (err) {
      throw err;
    }
  } 
}