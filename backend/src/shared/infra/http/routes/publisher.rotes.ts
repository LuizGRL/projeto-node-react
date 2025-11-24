import type { IncomingMessage, ServerResponse } from "http";
import { container } from "tsyringe";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";
import { verifyAuth } from "../utils/verifyAuth";
import { checkRole } from "../utils/checkRole";
import { PublisherController } from "../../../../modules/books/controllers/PublishController";

const publisherController = container.resolve(PublisherController);

export async function publishersRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/publishers';

  if (url === mainRoute + "/create" && method === "POST") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(publisherController.create.bind(publisherController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(publisherController.update.bind(publisherController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN]);
      return adaptRoute(publisherController.delete.bind(publisherController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/list" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(publisherController.list.bind(publisherController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/getById" && method === "GET") {
    try {
      const user = await verifyAuth(req);
      checkRole(user, [ERole.ADMIN, ERole.CUSTOMER, ERole.VISITOR]);
      return adaptRoute(publisherController.findById.bind(publisherController))(req, res);
    } catch (err) {
      throw err;
    }
  }
}