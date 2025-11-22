import { PrismaAccountRepository } from "../../src/modules/accounts/repositories/PrismaAccountRepository";
import type { ICreateAccountDTO } from "../../src/modules/accounts/dtos/ICreateAccountDTO";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";
import { AccountService } from "../../src/modules/accounts/services/AccountService";
import { prisma } from "../../prisma";
import { AppError } from "shared/errors/AppError";
import { Account } from  "../../src/modules/accounts/entities/classes/Account";
import { randomUUID, UUID } from "crypto";
import { IUpdateAccountDTO } from "modules/accounts/dtos/IUpdateAccountDTO";

beforeEach(async () => {
  await prisma.account.deleteMany();
});

afterAll(async () => {
  await prisma.account.deleteMany();
  await prisma.$disconnect();
});

describe("UserService - Cadastro", () => {
  const makeValidUser = (): ICreateAccountDTO => ({
    firstName: "Luiz Guilherme",
    lastName: "Rodrigues Lins",
    email: "luizguilherme.lgrl@gmail.com",
    password: "Teste123@",
    cpf: "918.390.300-38",
    birthDate: new Date(),
    role: ERole.VISITOR,
  });

  // -------------------------------------------------------
  // HAPPY PATH
  // -------------------------------------------------------
  test("deve criar um usuário com sucesso", async () => {
    const accountRepository = new PrismaAccountRepository();
    const accountService = new AccountService(accountRepository);

    const data = makeValidUser();
    const account = await accountService.createUser(data);

    expect(account).toHaveProperty("id");
    expect(account.email).toBe(data.email);
    expect(account.firstName).toBe(data.firstName);
    expect(account.lastName).toBe(data.lastName);
    expect(account.role).toBe(data.role);
    expect(account.cpf).toBe(data.cpf);

    expect(account.password).toMatch(/^\$2[aby]\$.+/); // bcrypt hash

    expect(account).toHaveProperty("birthDate");

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });

  describe("Validação de email", () => {
    const invalidEmails = [
      "luizguilhermegmail.com",
      "asdasdasdasd",
      "teste@",
      "@gmail.com",
      "dsadsa@dsadsa",
    ];

    invalidEmails.forEach((email) => {
      test(`não deve criar usuário com email inválido: ${email}`, async () => {
        const accountRepository = new PrismaAccountRepository();
        const accountService = new AccountService(accountRepository);

        const data = { ...makeValidUser(), email };

        await expect(accountService.createUser(data)).rejects.toMatchObject({
          message: "Email inválido",
          statusCode: 400,
        });
      });
    });
  });

  // -------------------------------------------------------
  // CPF INVÁLIDO
  // -------------------------------------------------------
  describe("Validação de CPF", () => {
    const invalidCpfs = [
      "9999999999",
      "918.390.300-00",
      "111.111.111-11",
      "12345678900",
    ];

    invalidCpfs.forEach((cpf) => {
      test(`não deve criar usuário com CPF inválido: ${cpf}`, async () => {
        const accountRepository = new PrismaAccountRepository();
        const accountService = new AccountService(accountRepository);

        const data = { ...makeValidUser(), cpf };

        await expect(accountService.createUser(data)).rejects.toMatchObject({
          message: "CPF inválido",
          statusCode: 400,
        });
      });
    });
  });

  // -------------------------------------------------------
  // DUPLICIDADE
  // -------------------------------------------------------
  test("não deve criar um usuário com campos duplicados", async () => {
    const accountRepository = new PrismaAccountRepository();
    const accountService = new AccountService(accountRepository);

    const data = makeValidUser();

    await accountService.createUser(data);

    await expect(accountService.createUser(data)).rejects.toMatchObject({
      message: "Existem campos duplicados",
      statusCode: 409,
    });

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });
});

describe("UserService - Update", () => {
  let accountRepository: PrismaAccountRepository;
  let accountService: AccountService;

  let id: UUID;

  const makeValidUser = (): ICreateAccountDTO => ({
    firstName: "Luiz Guilherme",
    lastName: "Rodrigues Lins",
    email: "luizguilherme.lgrl@gmail.com",
    password: "Teste123@",
    cpf: "918.390.300-38",
    birthDate: new Date(),
    role: ERole.VISITOR,
  });

    const makeUpdateValidUser = (id: UUID): IUpdateAccountDTO => ({
    id: id,
    firstName: "Felipe",
    lastName: "Carlos",
    email: "carlos@gmail.com",
    cpf: "102.685.020-72",
    birthDate: new Date(),
    role: ERole.ADMIN,
  });


  beforeEach(async () => {
    accountRepository = new PrismaAccountRepository();
    accountService = new AccountService(accountRepository);
    const data = makeValidUser();
    const account = await accountService.createUser(data);

    if (account) {
      id = account.id;
    }
  });

  test("deve atualizar um usuário com sucesso", async () => {

    const data = makeValidUser();
    const newData = makeUpdateValidUser(id);

    const account = await accountService.updateUser(newData);

    expect(account).not.toBe(null);
    expect(account?.id).toBe(id);
    expect(account!.email).toBe(newData.email);
    expect(account!.firstName).toBe(newData.firstName);
    expect(account!.lastName).toBe(newData.lastName);
    expect(account!.role).toBe(newData.role);
    expect(account!.cpf).toBe(newData.cpf);
    expect(account!.role).toBe(newData.role);

    expect(account!.email).not.toBe(data.email);
    expect(account!.firstName).not.toBe(data.firstName);
    expect(account!.lastName).not.toBe(data.lastName);
    expect(account!.role).not.toBe(data.role);
    expect(account!.cpf).not.toBe(data.cpf);
    expect(account!.role).not.toBe(data.role);

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });

 test("usuário não encontrado não deve ser atualizado", async () => {
    const data = makeValidUser();
    const newData = makeUpdateValidUser(id);
    const fakeId = randomUUID();
    newData.id = fakeId;

    await expect(accountService.updateUser(newData)).rejects.toMatchObject({
          message: "Conta não econtrada",
          statusCode: 400,
    });

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });

  describe("Validação de email", () => {
    const invalidEmails = [
      "luizguilhermegmail.com",
      "asdasdasdasd",
      "teste@",
      "@gmail.com",
      "dsadsa@dsadsa",
    ];

    invalidEmails.forEach((email) => {
      test(`não deve atualizar usuário com email inválido: ${email}`, async () => {
        const data = makeValidUser();
        const newData = makeUpdateValidUser(id);
        newData.email = email;

        await expect(accountService.updateUser(newData)).rejects.toMatchObject({
          message: "Email inválido",
          statusCode: 400,
        });
      });
    });
  });

  describe("Validação de CPF", () => {
    const invalidCpfs = [
      "9999999999",
      "918.390.300-00",
      "111.111.111-11",
      "12345678900",
    ];

    invalidCpfs.forEach((cpf) => {
      test(`não deve criar usuário com CPF inválido: ${cpf}`, async () => {
        const data = makeValidUser();
        const newData = makeUpdateValidUser(id);
        newData.cpf = cpf;

        await expect(accountService.updateUser(newData)).rejects.toMatchObject({
          message: "CPF inválido",
          statusCode: 400,
        });
      });
    });
  });

});



// Não deve atualizar o password de um usuario nao existente
// Nao deve ataluzar o passqord de um usuario que caso o password n corresponda ao apdrao definido



// Deve deletar um usuário existente
// Não deve deletar um usuario que não existe

// Deve reotrnar um usuasrio existente buscando pelo id
// não deve retornar um usuario existente buscando pelo email

