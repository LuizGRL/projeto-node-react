import { inject, injectable } from "tsyringe";
import { ICreatePublisherDTO, IUpdatePublisherDTO } from "../dtos/PublisherDTO";
import { AppError } from "shared/errors/AppError";
import { IPublisherService } from "./interfaces/IPublisherService";
import { IPublisher } from "../entities/interfaces/IPublisher";
import { IPublishersRepository } from "../repositories/interface/IPublishersRepository";
import { UUID } from "crypto";

@injectable()
export class PublisherService implements IPublisherService{
    constructor(
        @inject("PublishersRepository") 
        private publishersRepository: IPublishersRepository
    ) {}

    async create(data: ICreatePublisherDTO): Promise<IPublisher> {
        return this.publishersRepository.create(data);
    }

    async update(data: IUpdatePublisherDTO): Promise<IPublisher> {
        await this.findPublisherById(data.id);
        return this.publishersRepository.update(data);
    }

    async delete(id: string): Promise<boolean> {
        await this.findPublisherById(id);
        return this.publishersRepository.delete(id as UUID);
    }

    async list(): Promise<IPublisher[]> {
        return this.publishersRepository.list();
    }

    async findById(id: string): Promise<IPublisher> {
        return this.findPublisherById(id);
    }

    private async findPublisherById(id: string): Promise<IPublisher> {
        const publisher = await this.publishersRepository.findById(id as UUID);
        if (!publisher) {
            throw new AppError("Editora não encontrada", 404);
        }
        return publisher;
    }
}