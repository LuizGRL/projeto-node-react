import type { IncomingMessage, ServerResponse } from "http";
import { container } from "tsyringe";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { BookController } from "../../../../modules/books/controllers/BookController"; 
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";
import { verifyAuth } from "../utils/verifyAuth";
import { checkRole } from "../utils/checkRole";

const bookController = container.resolve(BookController);

export async function booksRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/books';

  if (url === mainRoute + "/create" && method === "POST") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(bookController.create.bind(bookController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/list" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(bookController.list.bind(bookController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/getById" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(bookController.findById.bind(bookController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(bookController.update.bind(bookController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(bookController.delete.bind(bookController))(req, res);
    } catch (err) {
      throw err;
    }
  }
}