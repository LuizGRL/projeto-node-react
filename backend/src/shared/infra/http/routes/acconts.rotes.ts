import type { IncomingMessage, ServerResponse } from "http";
import { AuthenticateAccountController } from "modules/accounts/controllers/AuthenticateAccountController";
import type { IAccountRepository } from "modules/accounts/repositories/IAccountRepository";
import { PrismaAccountRepository } from "modules/accounts/repositories/PrismaAccountRepository";
import { AuthenticateAccountService } from "modules/accounts/services/AuthenticateAccountService";
import { adaptRoute } from "../adapters/NodeRouteAdapter";


const accountRepository = new PrismaAccountRepository() as IAccountRepository;
const authUseCase = new AuthenticateAccountService(accountRepository);
const authController = new AuthenticateAccountController(authUseCase);


export async function accountsRoutes(req: IncomingMessage, res: ServerResponse) {
  const { url, method } = req;
  const mainRoute = '/accounts'

  if (url === mainRoute + "/login" && method === "POST") {
    return adaptRoute(authController.handle.bind(authController))(req,res);
  }

}