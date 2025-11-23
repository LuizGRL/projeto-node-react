import { UUID } from "crypto";

export class ValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function validateUUID(id: string): string {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(id)) {
    throw new ValidationError("ID inválido, deve ser um UUID válido", 400);
  }

  return id as UUID;
}
