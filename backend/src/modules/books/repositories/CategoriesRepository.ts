import { injectable } from "tsyringe";
import { ICreateCategoryDTO, IUpdateCategoryDTO } from "../dtos/CategoryDTO";
import { ICategory } from "../entities/interfaces/ICategory";
import { ICategoriesRepository } from "./interface/ICategoriesRepository";
import { prisma } from "../../../../prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "shared/errors/AppError";


@injectable()
export class PrismaCategoriesRepository implements ICategoriesRepository {

    async create(data: ICreateCategoryDTO): Promise<ICategory> {
        try {
            return await prisma.category.create({ data });
        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                throw new AppError("Categoria já existe", 409);
            }
            throw new AppError("Erro ao criar categoria", 500);
        }
    }

    async update(data: IUpdateCategoryDTO): Promise<ICategory> {
        const { id, ...rest } = data;
        try {
            return await prisma.category.update({
                where: { id },
                data: { ...rest }
            });
        } catch (err) {
            throw new AppError("Erro ao atualizar categoria", 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.category.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new AppError("Erro ao remover categoria", 500);
        }
    }

    async findById(id: string): Promise<ICategory | null> {
        return prisma.category.findUnique({ where: { id } });
    }

    async findByName(name: string): Promise<ICategory | null> {
        return prisma.category.findUnique({ where: { name } });
    }

    async findByIds(ids: string[]): Promise<ICategory[]> {
        return prisma.category.findMany({ where: { id: { in: ids } } });
    }

    async list(): Promise<Category[]> {
        return prisma.category.findMany();
    }
}