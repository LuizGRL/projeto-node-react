import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { IUpdateAccountDTO } from "../dtos/IUpdateAccountDTO";
import { UUID } from "crypto";
import { IUpdatePasswordDTO } from "../dtos/IUpdatePasswordDTO";
import { Account } from "../entities/classes/Account";

export interface IAccountRepository {
    create(data: ICreateAccountDTO): Promise<Account>;
    update(data: IUpdateAccountDTO): Promise<Account>;
    updatePassword(data: IUpdatePasswordDTO) : Promise<Account>;
    delete(data: Account) : Promise<boolean>;
    findByEmail(email: string): Promise<Account | null>;
    findById(id: UUID): Promise<Account | null>;

}