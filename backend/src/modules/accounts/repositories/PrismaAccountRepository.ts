import { prisma } from "../../../../prisma/index";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { IUser } from "../entities/interfaces/IUser";
import type { Account } from "../entities/classes/Account";



export class PrismaAccountRepository {
    async create(data: ICreateAccountDTO): Promise<Account> {
        // O Prisma retorna o objeto criado, convertemos para User se necessário
        const account = await prisma.account.create({ data });
        return account as Account; 
    }
};