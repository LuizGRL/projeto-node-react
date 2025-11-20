import { prisma } from "../../../../prisma/index";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { Role } from "@prisma/client";
import type { IUser } from "../entities/interfaces/IUser";
import { injectable } from "tsyringe";
import type { IAccountRepository } from "./IAccountRepository";

@injectable()
export class PrismaAccountRepository implements IAccountRepository {

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
          if (!email) {
            return null;
        }
        const account = await prisma.account.findUnique({
            where: {
                email: email
            }
        });    
        return account as IUser | null;
    }
};

