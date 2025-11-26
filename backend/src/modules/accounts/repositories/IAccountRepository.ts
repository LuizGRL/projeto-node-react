import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { IUpdateAccountDTO } from "../dtos/IUpdateAccountDTO";
import { UUID } from "crypto";
import { IUpdatePasswordDTO } from "../dtos/IUpdatePasswordDTO";
import { Account } from "../entities/classes/Account";
import { IAccountResponseDTO } from "../dtos/IAccountResponseDTO";

export interface IAccountRepository {
    create(data: ICreateAccountDTO): Promise<IAccountResponseDTO>;
    update(data: IUpdateAccountDTO, upgradeToken?: boolean): Promise<IAccountResponseDTO>;
    updatePassword(data: IUpdatePasswordDTO) : Promise<IAccountResponseDTO>;
    delete(data: Account) : Promise<boolean>;
    findAllUsers(): Promise<IAccountResponseDTO[]>;
    findByEmail(email: string): Promise<IAccountResponseDTO | null>;
    findById(id: UUID): Promise<IAccountResponseDTO | null>
    findLoginUser(email: string): Promise<Account | null>;
}