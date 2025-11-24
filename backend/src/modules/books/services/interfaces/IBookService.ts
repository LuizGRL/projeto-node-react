import { UUID } from "crypto";
import { ICreateBookDTO, IUpdateBookDTO } from "modules/books/dtos/BookDTO";
import { IBook } from "modules/books/entities/interfaces/IBook";


export interface IBookService {
    create(data: ICreateBookDTO): Promise<IBook>;
    update(data: IUpdateBookDTO): Promise<IBook>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<IBook>;
    list(): Promise<IBook[]>;
}