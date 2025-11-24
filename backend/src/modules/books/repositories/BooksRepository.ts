import { injectable } from "tsyringe";
import { IBooksRepository } from "./interface/IBooksRepository";
import { IBook } from "../entities/interfaces/IBook";
import { ICreateBookDTO, IUpdateBookDTO } from "../dtos/BookDTO";
import { prisma } from "../../../../prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "shared/errors/AppError";

@injectable()
export class PrismaBooksRepository implements IBooksRepository {

    async create(data: ICreateBookDTO): Promise<IBook> {
        const { authorIds, categoryIds, publisherId, ...rest } = data;

        try {
            const book = await prisma.book.create({
                data: {
                    ...rest, 
                    
                    publisher: {
                        connect: { id: publisherId }
                    },


                    authors: {
                        connect: authorIds.map((id) => ({ id }))
                    },

                    categories: {
                        connect: categoryIds.map((id) => ({ id }))
                    }
                },
                include: {
                    authors: true,
                    publisher: true,
                    categories: true
                }
            });

            return book;

        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw new AppError("Já existe um livro com este ISBN", 409);
            }
            throw new AppError("Erro ao criar livro", 500);
        }
    }

    async update(data: IUpdateBookDTO): Promise<IBook> {
        const { id, authorIds, categoryIds, publisherId, ...rest } = data;

        try {
            const book = await prisma.book.update({
                where: { id },
                data: {
                    ...rest,
                    ...(publisherId ? { publisher: { connect: { id: publisherId } } } : {}),
                    
                    ...(authorIds ? { authors: { set: authorIds.map(id => ({ id })) } } : {}),
                    ...(categoryIds ? { categories: { set: categoryIds.map(id => ({ id })) } } : {})
                },
                include: { authors: true, publisher: true, categories: true }
            });
            return book;
        } catch (err) {
            throw new AppError("Erro ao atualizar livro", 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.book.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new AppError("Erro ao remover livro", 500);
        }
    }

    async findById(id: string): Promise<IBook | null> {
        return prisma.book.findUnique({
            where: { id },
            include: {
                authors: true,
                publisher: true,
                categories: true
            }
        });
    }

    async findByIsbn(isbn: string): Promise<IBook | null> {
        return prisma.book.findUnique({
            where: { isbn }
        });
    }

    async list(): Promise<IBook[]> {
        return prisma.book.findMany({
            include: {
                authors: true,
                publisher: true,
                categories: true
            }
        });
    }
}