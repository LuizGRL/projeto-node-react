import { prisma } from "../../../../prisma/index";
import type { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import type { Account } from "../entities/classes/Account";
import { Prisma } from "@prisma/client";
import type { IUser } from "../entities/interfaces/IUser";
import { injectable } from "tsyringe";
import type { IAccountRepository } from "./IAccountRepository";
import { AppError } from "shared/errors/AppError";
import { UUID } from "crypto";
import { IUpdateAccountDTO } from "../dtos/IUpdateAccountDTO";
import { IUpdatePasswordDTO } from "../dtos/IUpdatePasswordDTO";
import { AccountResponseDTO, IAccountResponseDTO } from "../dtos/IAccountResponseDTO";
import { ILoginRequestDTO } from "../dtos/ILoginDTO";
import { isValidEmail } from "shared/infra/utils/validateEmail";

@injectable()
export class PrismaAccountRepository implements IAccountRepository {

    async create(data: ICreateAccountDTO): Promise<IAccountResponseDTO> {
        try {
            const account = await prisma.account.create({
                data: {
                    ...data,
                }
            });
            const accontParsed = AccountResponseDTO.parse(account);
            return accontParsed as IAccountResponseDTO;

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

    async update(data: IUpdateAccountDTO, upgradeToken?: boolean): Promise<IAccountResponseDTO> {
        const { id, ...dataWithoutId } = data;
        try {
            const account =  await prisma.account.update({
                where: { id },
                data: {
                    ...dataWithoutId,
                    ...(upgradeToken ? { token_version: { increment: 1 } } : {})
                }
            });
            const accontParsed = AccountResponseDTO.parse(account);
            return accontParsed as IAccountResponseDTO;

        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError("Erro ao atualizar o usuário: " + err, 500);
            }
            throw new AppError("Erro ao atualizar o usuário" + err, 500);
        }
    }

    async updatePassword(data: IUpdatePasswordDTO): Promise<IAccountResponseDTO> {
        const { id, ...dataWithoutId } = data;
        try {
            const account =  await prisma.account.update({
                where: { id },
                data: { ...dataWithoutId }
            });

            const accontParsed = AccountResponseDTO.parse(account);
            return accontParsed as IAccountResponseDTO;
        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError("Erro ao atualizar o usuário: " + err, 500);
            }
            throw new AppError("Erro ao atualizar o usuário" + err, 500);
        }
    }

    async delete(data: Account): Promise<boolean> {
        const { id, ...dataWithoutId } = data;
        try {
            const account =  await prisma.account.delete({
                where: { id }           
            });

            return true;

        } catch (err: any) {
            throw new AppError("Erro ao remover o usuário: " + id  , 500);
        }
    }

    async findByEmail(email: string): Promise<IAccountResponseDTO | null> {
        if (!email) {
            return null;
        }

        const account = await prisma.account.findUnique({
            where: {
                email: email
            }
        });    

        if(!account) {
            return null;
        }

        const accontParsed = AccountResponseDTO.parse(account);
        return accontParsed as IAccountResponseDTO;
    }

    async findById(id: UUID): Promise<IAccountResponseDTO | null> {
        if (!id) {
            return null;
        }   

        const account = await prisma.account.findUnique({
            where: {
                id: id
            }
        });

        if(!account) {
            return null;
        }

        const accontParsed = AccountResponseDTO.parse(account);
        return accontParsed as IAccountResponseDTO;
    }

    async findLoginUser(email: string): Promise<Account | null> {

        if (!email) {
            return null;
        }

        const account = await prisma.account.findUnique({
            where: {
                email: email
            }
        });    

        if(!account) {
            return null;
        }

        return account as Account;
    }

};

