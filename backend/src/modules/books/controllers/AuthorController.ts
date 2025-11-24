import { inject, injectable } from "tsyringe";
import { ResponseValidator } from "../../../shared/infra/utils/validate"; // Ajuste o caminho conforme sua estrutura
import { validateUUID } from "../../../shared/infra/utils/validateUUID";
import { AuthorService } from "../services/AuthorService";
import { 
    CreateAuthorSchema, 
    ICreateAuthorDTO, 
    IUpdateAuthorDTO, 
    UpdateAuthorSchema 
} from "../dtos/AuthorDTO";
import { UUID } from "crypto";
import { IAuthorService } from "../services/interfaces/IAuthorService";

@injectable()
export class AuthorController {
    constructor(
        @inject("AuthorService") 
        private authorService: IAuthorService
    ) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreateAuthorDTO>(
            CreateAuthorSchema, 
            httpRequest.body
        );
        
        const author = await this.authorService.create(request);

        return {
            statusCode: 201,
            body: author
        }
    };    

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdateAuthorDTO>(
            UpdateAuthorSchema, 
            httpRequest.body
        );

        const author = await this.authorService.update(request);
        
        return {
            statusCode: 200,
            body: author
        }
    }

    async delete(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id); 
        
        await this.authorService.delete(id as UUID);
        
        return {
            statusCode: 200,
            body: { message: "Autor deletado com sucesso." }
        }      
    }

    async findById(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        
        const author = await this.authorService.findById(id as UUID);
        
        return {
            statusCode: 200,
            body: author
        } 
    }

    async list(httpRequest: any) {
        const authors = await this.authorService.list();
        return {
            statusCode: 200,
            body: authors
        }
    }
}