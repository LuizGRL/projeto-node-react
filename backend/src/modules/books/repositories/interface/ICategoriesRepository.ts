import { UUID } from "crypto";
import { ICreateCategoryDTO, IUpdateCategoryDTO } from "modules/books/dtos/CategoryDTO";
import { ICategory } from "modules/books/entities/interfaces/ICategory";


export interface ICategoriesRepository {
    create(data: ICreateCategoryDTO): Promise<ICategory>;
    update(data: IUpdateCategoryDTO): Promise<ICategory>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<ICategory | null>;
    findByName(name: string): Promise<ICategory | null>; 
    findByIds(ids: UUID[]): Promise<ICategory[]>; 
    list(): Promise<ICategory[]>;
}