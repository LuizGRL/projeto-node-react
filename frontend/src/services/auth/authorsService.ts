import type { ZodUUID } from "zod";
import { api } from "./api";
import type { ICreateAuthorDTO } from "../../types/dtos/authors.dtos";

export const authorService = {
  create: async (data: ICreateAuthorDTO): Promise<ICreateAuthorDTO> => {
    const response = await api.post("/authors/create", data);
    return response.data.body;
  },

  update: async (data: Partial<ICreateAuthorDTO> & { id: string }) => {
    const response = await api.put("/authors/update", data);
    return response.data.body;
  },

  delete: async (id: ZodUUID) => {
    const response = await api.delete("/authors/delete", {
      data: { id } 
    });
    return response.data;
  },

  getById: async (id: ZodUUID) => {
    const response = await api.post("/authors/find-by-id", { id });
    return response.data.body;
  },

  findAll: async () => {
    const response = await api.get("/authors/list");
    return response.data;
  }
};