import { inject, injectable } from "tsyringe";
import { ResponseValidator } from "../../../shared/infra/utils/validate";
import { validateUUID } from "../../../shared/infra/utils/validateUUID";
import { BookService } from "../services/BookService";
import { 
    CreateBookSchema, 
    ICreateBookDTO, 
    IUpdateBookDTO, 
    UpdateBookSchema 
} from "../dtos/BookDTO";
import { UUID } from "crypto";
import type { IBookService } from "../services/interfaces/IBookService";

@injectable()
export class BookController {
    constructor(
        @inject("BookService") 
        private bookService: IBookService
    ) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreateBookDTO>(
            CreateBookSchema, 
            httpRequest.body
        );
        
        const book = await this.bookService.create(request);

        return {
            statusCode: 201,
            body: book
        }
    };    

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdateBookDTO>(
            UpdateBookSchema, 
            httpRequest.body
        );

        const book = await this.bookService.update(request);
        
        return {
            statusCode: 200,
            body: book
        }
    }

    async delete(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        await this.bookService.delete(id as UUID);
        
        return {
            statusCode: 200,
            body: { message: "Livro deletado com sucesso." }
        }      
    }

    async findById(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        const book = await this.bookService.findById(id as UUID);
        
        return {
            statusCode: 200,
            body: book
        } 
    }

    async list(httpRequest: any) {
        const books = await this.bookService.list();
        return {
            statusCode: 200,
            body: books
        }
    }
}