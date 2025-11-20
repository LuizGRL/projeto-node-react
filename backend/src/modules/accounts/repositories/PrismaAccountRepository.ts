import { prisma } from "../../../../prisma/index";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { Role } from "@prisma/client";
import type { IUser } from "../entities/interfaces/IUser";

export class PrismaAccountRepository {

    async create(data: ICreateAccountDTO): Promise<Account> {
            
        const account = await prisma.account.create({
            data: {
                ...data,
                role: data.role as unknown as Role 
            }
        });

        return account as Account; 
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const account = await prisma.account.findUnique({
            where: {
                email: email
            }
        });    
        return account as IUser | null;
    }
};

