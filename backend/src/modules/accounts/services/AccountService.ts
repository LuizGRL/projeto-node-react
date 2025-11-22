import { isValidEmail } from "shared/infra/utils/validateEmail";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { IUser } from "../entities/interfaces/IUser";
import { PrismaAccountRepository } from "../repositories/PrismaAccountRepository";
import { hash } from "bcryptjs";
import { AppError } from "shared/errors/AppError";
import { isValidCPF } from "shared/infra/utils/valdiateCPF";
import { isValidPassword } from "shared/infra/utils/validatePassword";
import { IUpdateAccountDTO } from "../dtos/IUpdateAccountDTO";
import { IUpdatePasswordDTO } from "../dtos/IUpdatePasswordDTO";
import { UUID } from "crypto";
import { inject, injectable } from "tsyringe";
import type { IAccountRepository } from "../repositories/IAccountRepository";

@injectable()
export class AccountService {

    constructor(
        @inject("AccountRepository") private accountRepository: IAccountRepository) { }

    async createUser(data: ICreateAccountDTO): Promise<Account | null> {
        const result = this.accountEmailAndCPFIsValid(data as IUser);

        if (!isValidPassword(data.password)) { 
            throw new AppError("Senha em formato inválido", 400);
            return null;
        }    

        if (typeof(result) !== 'boolean' ) {
            throw result;
            return null;
        }
        
        data.password = await hash(data.password, 8);

        return this.accountRepository.create(data);
    }


    async updateUser(data: IUpdateAccountDTO): Promise<Account | null> {

        const result = this.accountEmailAndCPFIsValid(data as IUser);

        if (typeof(result) !== 'boolean') {
            throw result;
            return null;
        }

        const findAccountresult = await this.findAccount(data as IUser);
        if (findAccountresult instanceof AppError) {
            throw findAccountresult;
            return null;
        }

        return this.accountRepository.update(data);
    }

    async updatePassword(data: IUpdatePasswordDTO): Promise<Account | null> {

        const findAccountresult = await this.findAccount(data as IUser);

        if (findAccountresult instanceof AppError) {
            throw findAccountresult;
        }

        if (!isValidPassword(data.password)) { 
            throw new AppError("Senha em formato inválido", 400);
        }       

        data.password = await hash(data.password, 8);
        return this.accountRepository.updatePassword(data);
    }
    
    async deleteUser(data: Account): Promise<boolean> {

        const findAccountresult = await this.findAccount(data as IUser);
        if (findAccountresult instanceof AppError) {
            throw findAccountresult;
        }

        return this.accountRepository.delete(data);
    }

    async getUserById(id: UUID): Promise<Account | null> {
        return this.accountRepository.findById(id);
    }

    async getUserByEmail(email: string): Promise<Account| null> {
        
        if (!isValidEmail(email)) { 
            throw new AppError("Email inválido", 400);
        }

        return this.accountRepository.findByEmail(email);
    }

    accountEmailAndCPFIsValid(data: IUser): AppError | boolean {
        if (!isValidEmail(data.email)) { 
            return new AppError("Email inválido", 400);
        }

        if (!isValidCPF(data.cpf)) { 
            return new AppError("CPF inválido", 400);
        }    

        return true;
    }

    async findAccount(data: IUser): Promise<Account | AppError> {
        let account = null;

        if (data.id) {
            account = await this.accountRepository.findById(data.id);
        }

        if (!account) {
            return new AppError("Conta não econtrada", 400);
        }

        return account;
    }

}