import { z } from "zod";

export const CreateAuthorSchema = z.object({
    firstName: z.string().min(1, "Primeiro nome obrigatório").max(255),
    lastName: z.string().min(1, "Sobrenome obrigatório").max(255),
});

export type ICreateAuthorDTO = z.infer<typeof CreateAuthorSchema>;

export const UpdateAuthorSchema = CreateAuthorSchema.partial().extend({
    id: z.uuid("ID do autor é obrigatório"),
});

export type IUpdateAuthorDTO = z.infer<typeof UpdateAuthorSchema>;