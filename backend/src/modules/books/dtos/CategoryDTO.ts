import { z } from "zod";

export const CreateCategorySchema = z.object({
    name: z.string().min(3, "Nome da categoria muito curto").max(100),
});

export type ICreateCategoryDTO = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
    id: z.uuid("ID da categoria é obrigatório"),
});

export type IUpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;