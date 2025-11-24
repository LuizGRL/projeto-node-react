import { UUID } from "crypto";
import { ICreateCategoryDTO, IUpdateCategoryDTO } from "modules/books/dtos/CategoryDTO";
import { ICategory } from "modules/books/entities/interfaces/ICategory";

export interface ICategoryService {
    create(data: ICreateCategoryDTO): Promise<ICategory>;
    update(data: IUpdateCategoryDTO): Promise<ICategory>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<ICategory>;
    list(): Promise<ICategory[]>;
}