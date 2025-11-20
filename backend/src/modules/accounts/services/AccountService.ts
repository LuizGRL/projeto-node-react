import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { PrismaAccountRepository } from "../repositories/PrismaAccountRepository";

export class AccountService {
    accountRepository: PrismaAccountRepository;
    constructor(userRepository: PrismaAccountRepository ) {
        this.accountRepository = userRepository;
    }
    async createUser(data: ICreateAccountDTO): Promise<Account> {
        return this.accountRepository.create(data);
    }
}