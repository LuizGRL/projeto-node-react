import type { ZodUUID } from "zod";
import { api } from "./api";
import type { IPublisherCreateDTO } from "../../types/dtos/publisher.dto";

export const publisherService = {
  create: async (data: IPublisherCreateDTO): Promise<IPublisherCreateDTO> => {
    const response = await api.post("/publishers/create", data);
    return response.data.body;
  },

  update: async (data: Partial<IPublisherCreateDTO> & { id: string }) => {
    const response = await api.put("/publishers/update", data);
    return response.data.body;
  },

  delete: async (id: ZodUUID) => {
    const response = await api.delete("/publishers/delete", {
      data: { id } 
    });
    return response.data;
  },

  getById: async (id: ZodUUID) => {
    const response = await api.post("/publishers/find-by-id", { id });
    return response.data.body;
  },

  findAll: async () => {
    const response = await api.get("/publishers/list");
    return response.data;
  }
};