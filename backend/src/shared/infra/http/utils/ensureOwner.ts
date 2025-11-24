import { AppError } from "shared/errors/AppError";

export function ensureOwner(tokenUserId: string, targetUserId: string) {
  if (tokenUserId !== targetUserId) {
    throw new AppError("Você não tem permissão para alterar este recurso.", 403);
  }
}
