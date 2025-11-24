import type { IncomingMessage, ServerResponse } from "http";
import { container } from "tsyringe";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { CategoryController } from "../../../../modules/books/controllers/CategoryController"; 
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";
import { verifyAuth } from "../utils/verifyAuth";
import { checkRole } from "../utils/checkRole";

const categoryController = container.resolve(CategoryController);

export async function categoriesRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/categories';

  if (url === mainRoute + "/create" && method === "POST") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(categoryController.create.bind(categoryController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(categoryController.update.bind(categoryController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(categoryController.delete.bind(categoryController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/findById" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(categoryController.findById.bind(categoryController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/list" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(categoryController.list.bind(categoryController))(req, res);
    } catch (err) {
      throw err;
    }
  }


}