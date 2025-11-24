import { z } from "zod";

export const CreatePublisherSchema = z.object({
    name: z.string().min(1, "Nome obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    country: z.string().min(1, "País obrigatório"),
});

export type ICreatePublisherDTO = z.infer<typeof CreatePublisherSchema>;

export const UpdatePublisherSchema = CreatePublisherSchema.partial().extend({
    id: z.uuid("ID da editora é obrigatório"),
});

export type IUpdatePublisherDTO = z.infer<typeof UpdatePublisherSchema>;