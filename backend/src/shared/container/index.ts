import { container } from "tsyringe";
import type { IAccountRepository } from "modules/accounts/repositories/IAccountRepository";
import { PrismaAccountRepository } from "modules/accounts/repositories/PrismaAccountRepository";
import { AuthenticateAccountService } from "modules/accounts/services/AuthenticateAccountService";
import { AccountService } from "modules/accounts/services/AccountService";
import { AccountController } from "modules/accounts/controllers/AccountController";
import { AuthenticateAccountController } from "modules/accounts/controllers/AuthenticateAccountController";
import { IAccountService } from "modules/accounts/entities/interfaces/IAccountService";

container.registerSingleton<IAccountRepository>(
  "AccountRepository",
  PrismaAccountRepository
);

container.registerSingleton(
  "AuthenticateAccountService",
  AuthenticateAccountService
);

container.registerSingleton(
  "AuthenticateAccountController",
  AuthenticateAccountController
);


container.registerSingleton<IAccountService>(
  "AccountService",
  AccountService
);

container.registerSingleton(
  "AccountController",
  AccountController
);
