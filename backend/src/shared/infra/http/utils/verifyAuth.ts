import { IncomingMessage } from "http";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import authConfig from "../../../../config/auth";

interface IPayload {
  sub: string;
  role: string;
}

export function verifyAuth(req: IncomingMessage) {
  const authHeader = req.headers.authorization;
  console.log(authHeader)

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret_token) as IPayload;

    return {
      id: decoded.sub,
      role: decoded.role
    };
  } catch {
    throw new AppError("Invalid token", 401);
  }
}