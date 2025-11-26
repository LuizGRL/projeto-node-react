import type { ZodUUID } from "zod";

export interface IPublisherCreateDTO {
  name: string;
  city: string;
  country: string;
}

export interface IPublisherResponseDTO {
  id: ZodUUID;
  name: string;
  city: string;
  country: string;
}