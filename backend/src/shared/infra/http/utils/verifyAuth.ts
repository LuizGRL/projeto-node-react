import { IncomingMessage } from "http";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import authConfig from "../../../../config/auth";
import { PrismaAccountRepository } from "../../../../modules/accounts/repositories/PrismaAccountRepository";

interface IPayload {
  sub: string;
  role: string;
  token_version: number;
}

export async function verifyAuth(req: IncomingMessage) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret_token) as unknown as IPayload;

    const accountRepository = new PrismaAccountRepository();
    const user = await accountRepository.findById(decoded.sub);

    if (!user) {
      throw new AppError("User does not exist", 401);
    }


    if (decoded.token_version !== user.token_version) {
      throw new AppError("Token inválido (Sessão expirada)", 401);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role 
    };

  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Invalid token", 401);
  }
}