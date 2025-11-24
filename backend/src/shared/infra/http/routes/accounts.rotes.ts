import type { IncomingMessage, ServerResponse } from "http";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { container } from "tsyringe";
import { AuthenticateAccountController } from "../../../../modules/accounts/controllers/AuthenticateAccountController";
import { AccountController } from "../../../../modules/accounts/controllers/AccountController";
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";import "shared/container";
import { verifyAuth } from "../utils/verifyAuth";
import { checkRole } from "../utils/checkRole";
import { ensureOwner } from "../utils/ensureOwner";
import { parseBody } from "../utils/parseBody";

const authController = container.resolve(AuthenticateAccountController);
const accountController = container.resolve(AccountController);

export async function accountsRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/accounts'

  if (url === mainRoute + "/login" && method === "POST") {
    return adaptRoute(authController.handle.bind(authController))(req,res);
  }

  if (url === mainRoute + "/create" && method === "POST") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(accountController.create.bind(accountController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/createADMIN" && method === "POST") {
    try {
      return adaptRoute(accountController.create.bind(accountController))(req, res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    const user = await verifyAuth(req); 
    checkRole(user, [ERole.ADMIN]); 
    return adaptRoute(accountController.delete.bind(accountController))(req,res);
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    const user = await verifyAuth(req); 
    checkRole(user, [ERole.ADMIN]); 
    return adaptRoute(accountController.update.bind(accountController))(req,res);
  }

  if (url === mainRoute + "/updatePassword" && method === "PUT") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.CUSTOMER, ERole.ADMIN, ERole.VISITOR]); 
      const body = await parseBody(req);
      ensureOwner(user.email, body.email)
      return adaptRoute(accountController.findByEmail.bind(accountController), body)(req,res);
    } catch (err) {
      throw err;
    }
  }

  if (url === mainRoute + "/getById" && method === "GET") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(accountController.findById.bind(accountController))(req,res);
    } catch (err) {
      throw err;
    }
  } 

  if (url === mainRoute + "/getByEmail" && method === "GET") {
    try {
      const user = await verifyAuth(req); 
      checkRole(user, [ERole.ADMIN]); 
      return adaptRoute(accountController.findByEmail.bind(accountController))(req,res);
    } catch (err) {
      throw err;
    }
  } 
}