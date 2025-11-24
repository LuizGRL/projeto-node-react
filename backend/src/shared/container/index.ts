import "reflect-metadata";
import { container } from "tsyringe";

// ============================================================
// 1. MÓDULO ACCOUNTS (EXISTENTE)
// ============================================================
import { IAccountService } from "../../modules/accounts/entities/interfaces/IAccountService";
import type { IAccountRepository } from "../../modules/accounts/repositories/IAccountRepository";
import { PrismaAccountRepository } from "../../modules/accounts/repositories/PrismaAccountRepository";
import { AuthenticateAccountService } from "../../modules/accounts/services/AuthenticateAccountService";
import { AccountService } from "../../modules/accounts/services/AccountService";
import { AuthenticateAccountController } from "../../modules/accounts/controllers/AuthenticateAccountController";
import { AccountController } from "../../modules/accounts/controllers/AccountController";
import { IAuthorsRepository } from "modules/books/repositories/interface/IAuthorsRepository";
import { PrismaAuthorsRepository } from "modules/books/repositories/AuthorsRepository";
import { AuthorService } from "modules/books/services/AuthorService";
import { IPublishersRepository } from "modules/books/repositories/interface/IPublishersRepository";
import { PrismaPublishersRepository } from "modules/books/repositories/PublisherRepository";
import { PublisherService } from "modules/books/services/PublisherService";
import { ICategoriesRepository } from "modules/books/repositories/interface/ICategoriesRepository";
import { PrismaCategoriesRepository } from "modules/books/repositories/CategoriesRepository";
import { CategoryService } from "modules/books/services/CategoryService";
import { PrismaBooksRepository } from "modules/books/repositories/BookRepository";
import { IBooksRepository } from "modules/books/repositories/interface/IBooksRepository";
import { BookService } from "modules/books/services/BookService";
import { IBookService } from "modules/books/services/interfaces/IBookService";
import { ICategoryService } from "modules/books/services/interfaces/ICategoryService";
import { IPublisherService } from "modules/books/services/interfaces/IPublisherService";
import { IAuthorService } from "modules/books/services/interfaces/IAuthorService";
import { AuthorController } from "modules/books/controllers/AuthorController";
import { PublisherController } from "modules/books/controllers/PublishController";
import { CategoryController } from "modules/books/controllers/CategoryController";
import { BookController } from "modules/books/controllers/BookController";

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


// ============================================================
// 2. MÓDULO BOOKS - AUTORES (AUTHORS)
// ============================================================


container.registerSingleton<IAuthorsRepository>(
  "AuthorsRepository",
  PrismaAuthorsRepository
);

container.registerSingleton<IAuthorService>(
  "AuthorService",
  AuthorService
);

container.registerSingleton(
  "AuthorController",
  AuthorController
);


// ============================================================
// 3. MÓDULO BOOKS - EDITORAS (PUBLISHERS)
// ============================================================


container.registerSingleton<IPublishersRepository>(
  "PublishersRepository",
  PrismaPublishersRepository
);

container.registerSingleton<IPublisherService>(
  "PublisherService",
  PublisherService
);

container.registerSingleton(
  "PublisherController",
  PublisherController
);


// ============================================================
// 4. MÓDULO BOOKS - CATEGORIAS (CATEGORIES)
// ============================================================


container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  PrismaCategoriesRepository
);

container.registerSingleton<ICategoryService>(
  "CategoryService",
  CategoryService
);

container.registerSingleton(
  "CategoryController",
  CategoryController
);


// ============================================================
// 5. MÓDULO BOOKS - LIVROS (CORE)
// ============================================================


container.registerSingleton<IBooksRepository>(
  "BooksRepository",
  PrismaBooksRepository
);

container.registerSingleton<IBookService>(
  "BookService",
  BookService
);

container.registerSingleton(
  "BookController",
  BookController
);