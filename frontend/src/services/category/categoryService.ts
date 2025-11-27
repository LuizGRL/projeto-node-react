import type { ZodUUID } from "zod";
import type { ICategoryCreateDTO } from "../../types/dtos/category.dto";
import { api } from "../auth/api";

export const categoryService = {
  create: async (data: ICategoryCreateDTO): Promise<ICategoryCreateDTO> => {
    const response = await api.post("/categories/create", data);
    return response.data.body;
  },

  update: async (data: Partial<ICategoryCreateDTO> & { id: string }) => {
    const response = await api.put("/categories/update", data);
    return response.data.body;
  },

  delete: async (id: ZodUUID) => {
    const response = await api.delete("/categories/delete", {
      data: { id } 
    });
    return response.data;
  },

  getById: async (id: ZodUUID) => {
    const response = await api.post("/categories/find-by-id", { id });
    return response.data.body;
  },

  findAll: async () => {
    const response = await api.get("/categories/list");
    return response.data;
  }
};