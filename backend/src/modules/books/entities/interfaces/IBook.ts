import type { UUID } from "crypto";
import { Int } from "effect/Schema";
import { IAuthor } from "./IAuthor";
import { IPublisher } from "./IPublisher";
import { ICategory } from "./ICategory";

export interface IBook {
    id: UUID;
    title: string,
    isbn: string,
    authors: IAuthor[],
    publication_date: Date,
    description: string,
    publisher: IPublisher,
    category: ICategory[],
    cover_url: string
    pages: Int,
    quantity_total: Int
    quantity_available: Int

}