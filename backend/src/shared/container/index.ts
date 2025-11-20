import { container } from "tsyringe";
import { AuthenticateAccountService } from "modules/accounts/services/AuthenticateAccountService";
import type { IAccountRepository } from "modules/accounts/repositories/IAccountRepository";
import { PrismaAccountRepository } from "modules/accounts/repositories/PrismaAccountRepository";

container.registerSingleton<IAccountRepository>(
  "AccountRepository",
  PrismaAccountRepository
);

container.registerSingleton(
  "AuthenticateAccountService",
  AuthenticateAccountService
);
