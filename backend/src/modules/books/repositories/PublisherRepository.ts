import { injectable } from "tsyringe";
import { IPublishersRepository } from "./interface/IPublishersRepository";
import { ICreatePublisherDTO, IUpdatePublisherDTO } from "../dtos/PublisherDTO";
import { IPublisher } from "../entities/interfaces/IPublisher";
import { AppError } from "shared/errors/AppError";
import { prisma } from "../../../../prisma";

@injectable()
export class PrismaPublishersRepository implements IPublishersRepository {

    async create(data: ICreatePublisherDTO): Promise<IPublisher> {
        try {
            return await prisma.publisher.create({ data });
        } catch (err) {
            throw new AppError("Erro ao criar editora", 500);
        }
    }

    async update(data: IUpdatePublisherDTO): Promise<IPublisher> {
        const { id, ...rest } = data;
        try {
            return await prisma.publisher.update({
                where: { id },
                data: { ...rest }
            });
        } catch (err) {
            throw new AppError("Erro ao atualizar editora", 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.publisher.delete({ where: { id } });
            return true;
        } catch (err) {
            throw new AppError("Erro ao remover editora", 500);
        }
    }

    async findById(id: string): Promise<IPublisher | null> {
        return prisma.publisher.findUnique({ where: { id } });
    }

    async list(): Promise<IPublisher[]> {
        return prisma.publisher.findMany();
    }
}