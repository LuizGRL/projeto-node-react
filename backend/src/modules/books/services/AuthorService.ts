import { inject, injectable } from "tsyringe";
import type { IAuthorsRepository } from "../repositories/interface/IAuthorsRepository";
import { ICreateAuthorDTO, IUpdateAuthorDTO } from "../dtos/AuthorDTO";
import { IAuthor } from "../entities/interfaces/IAuthor";
import { UUID } from "crypto";
import { AppError } from "shared/errors/AppError";
import { IAuthorService } from "./interfaces/IAuthorService";


@injectable()
export class AuthorService implements IAuthorService{
    constructor(
        @inject("AuthorsRepository") 
        private authorsRepository: IAuthorsRepository
    ) {}

    async create(data: ICreateAuthorDTO): Promise<IAuthor> {
        return this.authorsRepository.create(data);
    }

    async update(data: IUpdateAuthorDTO): Promise<IAuthor> {
        await this.findAuthorById(data.id as UUID);
        return this.authorsRepository.update(data);
    }

    async delete(id: UUID): Promise<boolean> {
        await this.findAuthorById(id);
        return this.authorsRepository.delete(id);
    }

    async list(): Promise<IAuthor[]> {
        return this.authorsRepository.list();
    }

    async findById(id: UUID): Promise<IAuthor> {
        return this.findAuthorById(id);
    }

    private async findAuthorById(id: UUID): Promise<IAuthor> {
        const author = await this.authorsRepository.findById(id);
        if (!author) {
            throw new AppError("Autor não encontrado", 404);
        }
        return author;
    }
}