import { compare } from "bcryptjs";
import { injectable, inject } from "tsyringe";
import jwt from "jsonwebtoken";
import { AppError } from "shared/errors/AppError";
import type { IAccountRepository } from "../repositories/IAccountRepository";
import auth from "../../../config/auth";
import type { ILoginRequestDTO } from "../dtos/ILoginDTO";

const { sign } = jwt;

@injectable()
export class AuthenticateAccountService {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute(request: ILoginRequestDTO) { 

        const user = await this.accountRepository.findLoginUser(request.email);

        if (!user) {
            throw new AppError("Email ou senha incorretos", 401);
        }

        const passwordMatch = await compare(request.password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email ou senha incorretos", 401);
        }

        const token = sign({ role: user.role,token_version: user.token_version, id: user.id}, auth.secret_token, 
            {subject: user.id, expiresIn: auth.expires_in_token as any }
        );

        const tokenReturn = { token, user: {
                name: user.firstName,
                id: user.id,
                email: user.email,
                role: user.role,
                token_version: user.token_version
            },
        };

        return tokenReturn;
    }
}