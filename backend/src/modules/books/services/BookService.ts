import { inject, injectable } from "tsyringe";
import type { ICategoriesRepository } from "../repositories/interface/ICategoriesRepository";
import type { IAuthorsRepository } from "../repositories/interface/IAuthorsRepository";
import type { IPublishersRepository } from "../repositories/interface/IPublishersRepository";
import type{ IBooksRepository } from "../repositories/interface/IBooksRepository";
import { ICreateBookDTO, IUpdateBookDTO } from "../dtos/BookDTO";
import { IBook } from "../entities/interfaces/IBook";
import { AppError } from "shared/errors/AppError";
import { UUID } from "crypto";
import { IBookService } from "./interfaces/IBookService";

@injectable()
export class BookService implements IBookService {
    constructor(
        @inject("BooksRepository") private booksRepository: IBooksRepository,
        @inject("PublishersRepository") private publishersRepository: IPublishersRepository,
        @inject("AuthorsRepository") private authorsRepository: IAuthorsRepository,
        @inject("CategoriesRepository") private categoriesRepository: ICategoriesRepository
    ) {}

    async create(data: ICreateBookDTO): Promise<IBook> {
        const bookExists = await this.booksRepository.findByIsbn(data.isbn);
        if (bookExists) {
            throw new AppError("Já existe um livro com este ISBN", 409);
        }

        const publisher = await this.publishersRepository.findById(data.publisherId as UUID);
        if (!publisher) {
            throw new AppError("Editora informada não existe", 400);
        }

        const authors = await this.authorsRepository.findByIds(data.authorIds as UUID[]);
        if (authors.length !== data.authorIds.length) {
            throw new AppError("Um ou mais autores informados não existem", 400);
        }

        const categories = await this.categoriesRepository.findByIds(data.categoryIds as UUID[]);
        if (categories.length !== data.categoryIds.length) {
            throw new AppError("Uma ou mais categorias informadas não existem", 400);
        }

        return this.booksRepository.create(data);
    }

    async update(data: IUpdateBookDTO): Promise<IBook> {
        const book = await this.findBookById(data.id as UUID);

        if (data.isbn && data.isbn !== book.isbn) {
            const isbnExists = await this.booksRepository.findByIsbn(data.isbn);
            if (isbnExists) throw new AppError("Já existe um livro com este ISBN", 409);
        }

        if (data.publisherId) {
            const publisher = await this.publishersRepository.findById(data.publisherId as UUID);
            if (!publisher) throw new AppError("Editora não encontrada", 400);
        }

        if (data.authorIds) {
            const authors = await this.authorsRepository.findByIds(data.authorIds as UUID[]);
            if (authors.length !== data.authorIds.length) throw new AppError("Autores inválidos", 400);
        }

        return this.booksRepository.update(data);
    }

    async delete(id: UUID): Promise<boolean> {
        await this.findBookById(id);
        return this.booksRepository.delete(id);
    }

    async list(): Promise<IBook[]> {
        return this.booksRepository.list();
    }

    async findById(id: UUID): Promise<IBook> {
        return this.findBookById(id);
    }

    private async findBookById(id: UUID): Promise<IBook> {
        const book = await this.booksRepository.findById(id);
        if (!book) {
            throw new AppError("Livro não encontrado", 404);
        }
        return book;
    }
}