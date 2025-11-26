import type { ZodUUID } from "zod";

export interface IBookCreateDTO {
    title: string;
    isbn: string;
    publicationDate: Date;
    description: string;
    coverUrl: string;
    pages: number;
    quantityTotal: string;
    publisherId: ZodUUID;
    authorIds: ZodUUID;
    categoryIds: ZodUUID;
}

export interface IBookResponseDTO {
    id: ZodUUID;
    title: string;
    isbn: string;
    publicationDate: Date;
    description: string;
    coverUrl: string;
    pages: number;
    quantityTotal: string;
    publisherId: ZodUUID;
    authorIds: ZodUUID;
    categoryIds: ZodUUID;
}
