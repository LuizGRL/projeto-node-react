import type { ZodUUID } from "zod";
import type { IBookCreateDTO } from "../../types/dtos/book.dtos";
import { api } from "../auth/api";

export const bookService = {
  create: async (data: IBookCreateDTO): Promise<IBookCreateDTO> => {
    const response = await api.post("/books/create", data);
    return response.data.body;
  },

  update: async (data: Partial<IBookCreateDTO> & { id: string }) => {
    const response = await api.put("/books/update", data);
    return response.data.body;
  },

  delete: async (id: ZodUUID) => {
    const response = await api.delete("/books/delete", {
      data: { id } 
    });
    return response.data;
  },

  getById: async (id: ZodUUID) => {
    const response = await api.post("/books/find-by-id", { id });
    return response.data.body;
  },

  findAll: async () => {
    const response = await api.get("/books/list");
    return response.data;
  }
};