import { z } from "zod";

const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

export const CreateBookSchema = z.object({
    title: z.string().min(1).max(255),
    isbn: z.string()
        .regex(isbnRegex, "ISBN inválido")
        .transform(val => val.replace(/[^0-9X]/g, "")), 
        
    publicationDate: z.coerce.date(), 
    description: z.string().max(1000).optional(),
    coverUrl: z.string().url().optional(),
    pages: z.number().int().positive(),
    quantityTotal: z.number().int().nonnegative(),
    quantityAvailable: z.number().int().nonnegative().optional(),
    publisherId: z.string().uuid(),
    authorIds: z.array(z.string().uuid()).min(1, "Selecione ao menos um autor"),
    categoryIds: z.array(z.string().uuid()).min(1, "Selecione ao menos uma categoria"),
});

export type ICreateBookDTO = z.infer<typeof CreateBookSchema>;

export const UpdateBookSchema = CreateBookSchema.partial().extend({
    id: z.uuid("ID do livro é obrigatório para atualização"),
});

export type IUpdateBookDTO = z.infer<typeof UpdateBookSchema>;