import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { IUser } from "../entities/interfaces/IUser";

export interface IAccountRepository {
    create(data: ICreateAccountDTO): Promise<IUser>;
    findByEmail(email: string): Promise<IUser>;

}