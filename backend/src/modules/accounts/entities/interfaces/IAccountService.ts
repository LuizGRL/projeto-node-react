import { Account } from "@prisma/client"
import { UUID } from "crypto"
import { ICreateAccountDTO } from "modules/accounts/dtos/ICreateAccountDTO"
import { IUpdateAccountDTO } from "modules/accounts/dtos/IUpdateAccountDTO"
import { IUpdatePasswordDTO } from "modules/accounts/dtos/IUpdatePasswordDTO"
import { IUser } from "./IUser"
import { AppError } from "shared/errors/AppError"
import { IAccountResponseDTO } from "modules/accounts/dtos/IAccountResponseDTO"

export interface IAccountService {
    createUser(data: ICreateAccountDTO): Promise<IAccountResponseDTO | null>
    updateUser(data: IUpdateAccountDTO): Promise<IAccountResponseDTO | null>
    updatePassword(data: IUpdatePasswordDTO): Promise<IAccountResponseDTO | null>
    deleteUser(data: Account): Promise<boolean>
    getUserById(id: UUID): Promise<IAccountResponseDTO | null>
    getUserByEmail(email: string): Promise<IAccountResponseDTO | null>
    accountEmailAndCPFIsValid(data: IUser): AppError | boolean
    findAccount(data: IUser): Promise<IAccountResponseDTO | AppError>
    findAllAccounts(): Promise<IAccountResponseDTO[]>
    
}