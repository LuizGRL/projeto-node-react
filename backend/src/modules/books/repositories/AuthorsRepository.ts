import { injectable } from "tsyringe";
import { IAuthorsRepository } from "./interface/IAuthorsRepository";
import { ICreateAuthorDTO, IUpdateAuthorDTO } from "../dtos/AuthorDTO";
import { IAuthor } from "../entities/interfaces/IAuthor";
import { AppError } from "shared/errors/AppError";
import { prisma } from "../../../../prisma";

@injectable()
export class PrismaAuthorsRepository implements IAuthorsRepository {

    async create(data: ICreateAuthorDTO): Promise<IAuthor> {
        try {
            const author = await prisma.author.create({ data });
            return author;
        } catch (err: any) {
            throw new AppError("Erro ao criar autor", 500);
        }
    }

    async update(data: IUpdateAuthorDTO): Promise<IAuthor> {
        const { id, ...dataWithoutId } = data;
        try {
            const author = await prisma.author.update({
                where: { id },
                data: { ...dataWithoutId }
            });
            return author;
        } catch (err: any) {
            throw new AppError("Erro ao atualizar autor", 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.author.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new AppError("Erro ao remover autor", 500);
        }
    }

    async findById(id: string): Promise<IAuthor | null> {
        return prisma.author.findUnique({ where: { id } });
    }

    async findByIds(ids: string[]): Promise<IAuthor[]> {
        return prisma.author.findMany({
            where: {
                id: { in: ids }
            }
        });
    }

    async list(): Promise<IAuthor[]> {
        return prisma.author.findMany();
    }
}