import type { ZodUUID } from "zod";

export interface ICategoryCreateDTO {
    name: string;
}

export interface ICategoryResponseDTO {
    id: ZodUUID;
    name: string;
}
