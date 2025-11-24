import { inject, injectable } from "tsyringe";
import { ResponseValidator } from "../../../shared/infra/utils/validate";
import { validateUUID } from "../../../shared/infra/utils/validateUUID";
import { CategoryService } from "../services/CategoryService";
import { 
    CreateCategorySchema, 
    ICreateCategoryDTO, 
    IUpdateCategoryDTO, 
    UpdateCategorySchema 
} from "../dtos/CategoryDTO";
import { UUID } from "crypto";
import type { ICategoryService } from "../services/interfaces/ICategoryService";

@injectable()
export class CategoryController {
    constructor(
        @inject("CategoryService") 
        private categoryService: ICategoryService
    ) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreateCategoryDTO>(
            CreateCategorySchema, 
            httpRequest.body
        );
        
        const category = await this.categoryService.create(request);

        return {
            statusCode: 201,
            body: category
        }
    };    

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdateCategoryDTO>(
            UpdateCategorySchema, 
            httpRequest.body
        );

        const category = await this.categoryService.update(request);
        
        return {
            statusCode: 200,
            body: category
        }
    }

    async delete(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        await this.categoryService.delete(id as UUID);
        
        return {
            statusCode: 200,
            body: { message: "Categoria deletada com sucesso." }
        }      
    }

    async findById(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        const category = await this.categoryService.findById(id as UUID);
        
        return {
            statusCode: 200,
            body: category
        } 
    }

    async list(httpRequest: any) {
        const categories = await this.categoryService.list();
        return {
            statusCode: 200,
            body: categories
        }
    }
}