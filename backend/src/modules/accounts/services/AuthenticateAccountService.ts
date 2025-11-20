import type { ILoginDTO } from "../dtos/ILoginDTO";
import { compare } from "bcryptjs";
import { injectable, inject } from "tsyringe";
import jwt from "jsonwebtoken";
import { AppError } from "shared/errors/AppError";
import type { IAccountRepository } from "../repositories/IAccountRepository";
import auth from "../../../config/auth";

const { sign } = jwt;

@injectable()
export class AuthenticateAccountService {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) {}

    async execute(request: ILoginDTO) {

        const user = await this.accountRepository.findByEmail(request.email);

        if (!user) {
            throw new AppError("Email ou senha incorretos", 401);
        }

        const passwordMatch = await compare(request.email, user.password);

        if (!passwordMatch) {
            throw new AppError("Email ou senha incorretos", 401);
        }

        const token = sign({ role: user.role}, auth.secret_token, 
            {subject: user.id, expiresIn: auth.expires_in_token as any }
        );

        const tokenReturn = { token, user: {
                name: user.firstName,
                email: user.email,
                role: user.role,
            },
        };

        return tokenReturn;
    }
}