import { PrismaAccountRepository } from "../../src/modules/accounts/repositories/PrismaAccountRepository";
import type { ICreateAccountDTO } from "../../src/modules/accounts/dtos/ICreateAccountDTO";
import { ERole } from "../../src/modules/accounts/entities/enums/ERole";
import { AccountService } from "../../src/modules/accounts/services/AccountService";

describe("UserService - Cadastro", () => {

  test("deve criar um usuário com sucesso", async () => {
    const accountRepository = new PrismaAccountRepository();
    const accountService = new AccountService(accountRepository);

    const data: ICreateAccountDTO = {
          'firstName': 'Luiz Guilherme',
          'lastName': 'Rodrigues Lins',
          'email': 'luizguilherme.lgrl@gmail.com',
          'password': 'Teste123@',
          'cpf': '918.390.300-38',
          'birthDate': new Date(Date.now()),
          'role': ERole.VISITOR,
    };

    const account = await accountService.createUser(data);

    expect(account).toHaveProperty("id");
    expect(account.email).toBe(data.email);
    expect(account.firstName).toBe(data.firstName);
    expect(account.lastName).toBe(data.lastName);
    expect(account.password).toBe(data.password);
    expect(account.role).toBe(data.role);
    expect(account.cpf).toBe(data.cpf);
    expect(account).toHaveProperty("birthDate");
  });

  //TODO  o usuaro tem email invlaido
  //TODO  o usuaro tem cpf invlaido
  //TODO  o usuaro tem campo faltando
  //TODO  



});
