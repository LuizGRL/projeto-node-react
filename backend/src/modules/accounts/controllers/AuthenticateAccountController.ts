import { inject } from "tsyringe";
import { AuthenticateAccountService } from "../services/AuthenticateAccountService";

export class AuthenticateAccountController {
    constructor(@inject("AuthenticateAccountService") private authenticateAccountService: AuthenticateAccountService) {}

    async handle(httpRequest: any) { 
        const { email, password } = httpRequest.body;

        const result = await this.authenticateAccountService.execute({
            email,
            password,
        });

        return {
            statusCode: 200,
            body: result,
        };
    }
}