import type { ZodUUID } from "zod";
import type { IAccountResponseDTO, ICreateAccountDTO } from "../../types/accounts.dtos";
import { api } from "./api";

export const userService = {
  create: async (data: ICreateAccountDTO): Promise<IAccountResponseDTO> => {
    const response = await api.post("/accounts/create", data);
    return response.data.body;
  },

  update: async (data: Partial<ICreateAccountDTO> & { id: string }) => {
    const response = await api.put("/accounts/update", data);
    return response.data.body;
  },

  delete: async (id: ZodUUID) => {
    const response = await api.delete("/accounts/delete", {
      data: { id } 
    });
    return response.data;
  },

  getById: async (id: ZodUUID) => {
    const response = await api.post("/accounts/find-by-id", { id });
    return response.data.body;
  },

  findAll: async () => {
    const response = await api.get("/accounts/findAllUsers");
    return response.data;
  }
};