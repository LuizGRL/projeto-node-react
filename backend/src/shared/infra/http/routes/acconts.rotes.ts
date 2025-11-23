import type { IncomingMessage, ServerResponse } from "http";
import { AuthenticateAccountController } from "modules/accounts/controllers/AuthenticateAccountController";
import { adaptRoute } from "../adapters/NodeRouteAdapter";
import { container } from "tsyringe";
import { AccountController } from "modules/accounts/controllers/AccountController";
import "shared/container";



const authController = container.resolve(AuthenticateAccountController);
const accountController = container.resolve(AccountController);

export async function accountsRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/accounts'

  if (url === mainRoute + "/login" && method === "POST") {
    return adaptRoute(authController.handle.bind(authController))(req,res);
  }

  if (url === mainRoute + "/create" && method === "POST") {
    return adaptRoute(accountController.create.bind(accountController))(req,res);
  }

  if (url === mainRoute + "/delete" && method === "DELETE") {
    return adaptRoute(accountController.delete.bind(accountController))(req,res);
  }

  if (url === mainRoute + "/update" && method === "PUT") {
    return adaptRoute(accountController.update.bind(accountController))(req,res);
  }
1
  if (url === mainRoute + "/updatePassword" && method === "PUT") {
    return adaptRoute(accountController.updatePassword.bind(accountController))(req,res);
  }

 if (url === mainRoute + "/getById" && method === "GET") {
    return adaptRoute(accountController.findById.bind(accountController))(req,res);
  } 

  if (url === mainRoute + "/getByEmail" && method === "GET") {
    return adaptRoute(accountController.findByEmail.bind(accountController))(req,res);
  } 
}