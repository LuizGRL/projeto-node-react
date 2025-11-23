import { PrismaAccountRepository } from "../../src/modules/accounts/repositories/PrismaAccountRepository";
import type { ICreateAccountDTO } from "../../src/modules/accounts/dtos/ICreateAccountDTO";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";
import { AccountService } from "../../src/modules/accounts/services/AccountService";
import { prisma } from "../../prisma";
import { randomUUID, UUID } from "crypto";
import { IUpdateAccountDTO } from "modules/accounts/dtos/IUpdateAccountDTO";
import { IUpdatePasswordDTO } from "modules/accounts/dtos/IUpdatePasswordDTO";
import { compare } from "bcryptjs";
import { IUser } from "modules/accounts/entities/interfaces/IUser";

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

  test("deve criar um usuário com sucesso", async () => {
    const accountRepository = new PrismaAccountRepository();
    const accountService = new AccountService(accountRepository);

    const data = makeValidUser();
    const account = await accountService.createUser(data);
    expect(account).toHaveProperty("id");
    expect(account!.email).toBe(data.email);
    expect(account!.firstName).toBe(data.firstName);
    expect(account!.lastName).toBe(data.lastName);
    expect(account!.role).toBe(data.role);
    expect(account!.cpf).toBe(data.cpf.replace(/\D/g, ""));
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
      id = account.id as UUID;
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
    expect(account!.cpf).toBe(newData.cpf.replace(/\D/g, ""));
    expect(account!.role).toBe(newData.role);

    expect(account!.email).not.toBe(data.email);
    expect(account!.firstName).not.toBe(data.firstName);
    expect(account!.lastName).not.toBe(data.lastName);
    expect(account!.role).not.toBe(data.role);
    expect(account!.cpf).not.toBe(data.cpf.replace(/\D/g, ""));
    expect(account!.role).not.toBe(data.role);

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });


  test("deve atualizar um usuário com sucesso apenas com id existente", async () => {
    const data = makeValidUser();
    const newData = makeUpdateValidUser(id);
    newData.email = "naoexiste@gmail.com"

    const account = await accountService.updateUser(newData);

    expect(account).not.toBe(null);
    expect(account?.id).toBe(id);
    expect(account!.email).toBe(newData.email);
    expect(account!.firstName).toBe(newData.firstName);
    expect(account!.lastName).toBe(newData.lastName);
    expect(account!.role).toBe(newData.role);
    expect(account!.cpf).toBe(newData.cpf.replace(/\D/g, ""));
    expect(account!.role).toBe(newData.role);

    expect(account!.email).not.toBe(data.email);
    expect(account!.firstName).not.toBe(data.firstName);
    expect(account!.lastName).not.toBe(data.lastName);
    expect(account!.role).not.toBe(data.role);
    expect(account!.cpf).not.toBe(data.cpf.replace(/\D/g, ""));
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

describe("UserService - PasswordUpdate", () => {
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

  const makeUpdateValidPassword = (id: UUID): IUpdatePasswordDTO => ({
    id: id,
    password: "Teste@999",
  });


  beforeEach(async () => {
    await prisma.account.deleteMany();
    accountRepository = new PrismaAccountRepository();
    accountService = new AccountService(accountRepository);
    const data = makeValidUser();
    const account = await accountService.createUser(data);

    if (account) {
      id = account.id as UUID;
    }
  });

  test("deve atualizar a senha de um usuário com sucesso", async () => {
    const newData = makeUpdateValidPassword(id);
    const oldPassword = newData.password;

    const oldAccount = await prisma.account.findUnique({ where: { id } });
    const account = await accountService.updatePassword(newData);

    expect(account).not.toBe(null);

    expect(account?.id).toBe(id);


    expect(oldAccount?.email).toBe(account?.email);
    expect(oldAccount?.id).toBe(account?.id);

    const count = await prisma.account.count();
    expect(count).toBe(1);
  });

  test("não deve atualizar a senha de um usuário que não corresponda ao padrão", async () => {
    const newData = makeUpdateValidPassword(id);
    const oldAccount = await prisma.account.findUnique({ where: { id } });
    newData.password = '1231112222112'
    await expect(accountService.updatePassword(newData)).rejects.toMatchObject({
          message: "Senha em formato inválido",
          statusCode: 400,
    });
    const account = await prisma.account.findUnique({ where: { id } });
    expect(account!.password).toBe(oldAccount!.password);
  });

  test("não deve atualizar a senha de um usuário que não foi encontrado", async () => {
    const newData = makeUpdateValidPassword(id);
    newData.id = randomUUID();
    const oldAccount = await prisma.account.findUnique({ where: { id } });
    const lastPassword  = oldAccount?.password;
    await expect(accountService.updatePassword(newData)).rejects.toMatchObject({
          message: "Conta não econtrada",
          statusCode: 400,
    });
    expect(lastPassword).toBe(oldAccount!.password);
  });
});

describe("UserService - Delete", () => {
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


  beforeEach(async () => {
    accountRepository = new PrismaAccountRepository();
    accountService = new AccountService(accountRepository);
    const account = await accountService.createUser(makeValidUser());
    if(account?.id) {
      id = account.id as UUID;
      
    }
  });

  test("deve deletar um usuário com sucesso", async () => {

    const account = await prisma.account.findUnique({ where: { id } });
    expect(account).not.toBe(null);
    const result = await accountService.deleteUser(account as IUser);
    expect(result).toBe(true);
  });

  test("não deve deletar um usuário que não foi encotrado", async () => {
    const account = await prisma.account.findUnique({ where: { id } });
    expect(account).not.toBe(null);
    const fakeId = randomUUID();
    account!.id = fakeId;    
    await expect(accountService.deleteUser(account as IUser)).rejects.toMatchObject({
          message: "Conta não econtrada",
          statusCode: 400,
    });
  });
});

describe("UserService - Achar Usuário", () => {
  let accountRepository: PrismaAccountRepository;
  let accountService: AccountService;
  let firstUserId: UUID;
  let otherUserId: UUID;
  let firstUserEmail: string;
  let otherUserEmail: string;


  const makeValidUser = (): ICreateAccountDTO => ({
    firstName: "Luiz Guilherme",
    lastName: "Rodrigues Lins",
    email: "luizguilherme.lgrl@gmail.com",
    password: "Teste123@",
    cpf: "918.390.300-38",
    birthDate: new Date(),
    role: ERole.VISITOR,
  });

  const anotherUser = (): ICreateAccountDTO => ({
    firstName: "Carlos",
    lastName: "Ferreira",
    email: "carlos@gmai.com",
    password: "Teste123@",
    cpf: "715.974.500-06",
    birthDate: new Date(),
    role: ERole.ADMIN,
  });


  beforeEach(async () => {
    accountRepository = new PrismaAccountRepository();
    accountService = new AccountService(accountRepository);
    const account = await accountService.createUser(makeValidUser());
    if(account?.id) {
      firstUserId = account.id as UUID;
      firstUserEmail = account.email;

    }

    const otherAccount = await accountService.createUser(anotherUser());
    if(otherAccount?.id) {
      otherUserId = otherAccount.id as UUID;
      otherUserEmail = otherAccount.email;

    }

  });

  test("deve achar um usuário pelo email com sucesso", async () => {
    const account1 = await accountService.getUserByEmail(firstUserEmail);
    const account2 = await accountService.getUserByEmail(otherUserEmail);

    expect(account1).not.toBe(null);
    expect(account2).not.toBe(null);
  
    expect(account1?.firstName).not.toBe(account2?.firstName);
    expect(account1?.email).not.toBe(account2?.email);
    expect(account1?.cpf).not.toBe(account2?.cpf);
    expect(account1?.lastName).not.toBe(account2?.lastName);
    expect(account1?.role).not.toBe(account2?.role);
  });


  test("não deve achar um usuário pelo email", async () => {
    const fakeEmail = "naoexisto@gmail.com";
    const account1 = await accountService.getUserByEmail(fakeEmail);
    expect(account1).toBe(null);
  });


  const invalidEmails = [
    "luizguilhermegmail.com",
    "asdasdasdasd",
    "teste@",
    "@gmail.com",
    "dsadsa@dsadsa",
  ];

  invalidEmails.forEach((email) => {
    test(`não deve atualizar usuário com email inválido: ${email}`, async () => {
        await expect(accountService.getUserByEmail(email)).rejects.toMatchObject({
          message: "Email inválido",
          statusCode: 400,});
    });
  });

  test("deve achar um usuário pelo id com sucesso", async () => {
    const account1 = await accountService.getUserById(firstUserId);
    const account2 = await accountService.getUserById(otherUserId);

    expect(account1).not.toBe(null);
    expect(account2).not.toBe(null);
  
    expect(account1?.firstName).not.toBe(account2?.firstName);
    expect(account1?.email).not.toBe(account2?.email);
    expect(account1?.cpf).not.toBe(account2?.cpf);
    expect(account1?.lastName).not.toBe(account2?.lastName);
    expect(account1?.role).not.toBe(account2?.role);

  });

  test("não deve achar um usuário pelo id", async () => {
    const fakeId = randomUUID();
    const account1 = await accountService.getUserById(fakeId);
    expect(account1).toBe(null);
  });

});

