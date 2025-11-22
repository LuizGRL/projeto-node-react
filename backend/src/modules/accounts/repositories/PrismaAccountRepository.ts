import { prisma } from "../../../../prisma/index";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { Prisma, Role } from "@prisma/client";
import type { IUser } from "../entities/interfaces/IUser";
import { injectable } from "tsyringe";
import type { IAccountRepository } from "./IAccountRepository";
import { AppError } from "shared/errors/AppError";
import { UUID } from "crypto";
import { IUpdateAccountDTO } from "../dtos/IUpdateAccountDTO";

@injectable()
export class PrismaAccountRepository implements IAccountRepository {

    async create(data: ICreateAccountDTO): Promise<Account> {
        try {
            const account = await prisma.account.create({
                data: {
                    ...data,
                }
            });
            return account as Account;

        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    throw new AppError(`Existem campos duplicados`, 409);
                }
                if (err.code === "P2004" || err.code === "P2012") {
                    throw new AppError(`Existem campos faltando`, 400);
                }
            }
            throw new AppError("Erro ao criar usuário", 500);
        }
    }

    async update(data: IUpdateAccountDTO): Promise<Account> {
        const { id, ...dataWithoutId } = data;
        try {
            const account =  await prisma.account.update({
                where: { id },
                data: { ...dataWithoutId }
            });

            return account as Account;

        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError("Erro ao atualizar o usuário: " + err, 500);
            }
            throw new AppError("Erro ao atualizar o usuário" + err, 500);
        }
    }

    async findByEmail(email: string): Promise<Account | null> {
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

    async findById(id: UUID): Promise<Account | null> {
        if (!id) {
            return null;
        }

        const account = await prisma.account.findUnique({
            where: {
                id: id
            }
        });

        return account as IUser | null;
    }

};

