import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "../repositories/interface/ICategoriesRepository";
import { ICreateCategoryDTO, IUpdateCategoryDTO } from "../dtos/CategoryDTO";
import { ICategory } from "../entities/interfaces/ICategory";
import { AppError } from "shared/errors/AppError";
import { UUID } from "crypto";
import { ICategoryService } from "./interfaces/ICategoryService";


@injectable()
export class CategoryService implements ICategoryService {
    constructor(
        @inject("CategoriesRepository") 
        private categoriesRepository: ICategoriesRepository
    ) {}

    async create(data: ICreateCategoryDTO): Promise<ICategory> {
        const categoryAlreadyExists = await this.categoriesRepository.findByName(data.name);
        
        if (categoryAlreadyExists) {
            throw new AppError("Categoria já existe", 409);
        }

        return this.categoriesRepository.create(data);
    }

    async update(data: IUpdateCategoryDTO): Promise<ICategory> {
        const category = await this.findCategoryById(data.id as UUID);

        if (data.name && data.name !== category.name) {
            const nameExists = await this.categoriesRepository.findByName(data.name);
            if (nameExists) {
                throw new AppError("Já existe uma categoria com este nome", 409);
            }
        }

        return this.categoriesRepository.update(data);
    }

    async delete(id: UUID): Promise<boolean> {
        await this.findCategoryById(id);
        return this.categoriesRepository.delete(id);
    }

    async list(): Promise<ICategory[]> {
        return this.categoriesRepository.list();
    }

    async findById(id: UUID): Promise<ICategory> {
        return this.findCategoryById(id);
    }

    private async findCategoryById(id: UUID): Promise<ICategory> {
        const category = await this.categoriesRepository.findById(id);
        if (!category) {
            throw new AppError("Categoria não encontrada", 404);
        }
        return category;
    }
}