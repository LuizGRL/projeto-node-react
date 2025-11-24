import { UUID } from "crypto";
import { ICreateAuthorDTO, IUpdateAuthorDTO } from "modules/books/dtos/AuthorDTO";
import { IAuthor } from "modules/books/entities/interfaces/IAuthor";

export interface IAuthorsRepository {
    create(data: ICreateAuthorDTO): Promise<IAuthor>;
    update(data: IUpdateAuthorDTO): Promise<IAuthor>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<IAuthor | null>;
    findByIds(ids: UUID[]): Promise<IAuthor[]>;
    list(): Promise<IAuthor[]>;
}