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
    publicationDate: Date,
    description: string,
    publisher: IPublisher,
    category: ICategory[],
    coverUrl: string
    pages: Int,
    quantityTotal: Int
    quantityAvailable: Int

}