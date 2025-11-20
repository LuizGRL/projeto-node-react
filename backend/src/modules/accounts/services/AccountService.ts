import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { PrismaAccountRepository } from "../repositories/PrismaAccountRepository";
import { hash } from "bcryptjs";

export class AccountService {
    accountRepository: PrismaAccountRepository;
    constructor(userRepository: PrismaAccountRepository ) {
        this.accountRepository = userRepository;
    }
    async createUser(data: ICreateAccountDTO): Promise<Account> {
        data.password = await hash(data.password, 8);
        return this.accountRepository.create(data);
    }
}