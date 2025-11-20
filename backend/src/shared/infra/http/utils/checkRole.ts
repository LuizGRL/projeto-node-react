import { AppError } from "../../../errors/AppError";
import { ERole } from "../../../../modules/accounts/entities/enums/ERole";

export function checkRole(user: { role: string }, allowedRoles: ERole[]): void {
  
  const userRole = user.role as ERole;

  if (!allowedRoles.includes(userRole)) {
    throw new AppError(
      `Access denied. User role '${userRole}' is not authorized. Required one of: [${allowedRoles.join(", ")}]`, 
      403
    );
  }
}