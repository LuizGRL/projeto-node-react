import { inject, injectable } from "tsyringe";
import { AuthenticateAccountService } from "../services/AuthenticateAccountService";
import { ResponseValidator } from "shared/infra/utils/validate";
import { LoginRequestSchema, type ILoginRequestDTO } from "../dtos/ILoginDTO";

@injectable()
export class AuthenticateAccountController {
    constructor(@inject("AuthenticateAccountService") private authenticateAccountService: AuthenticateAccountService) {}
    
    async handle(httpRequest: any) { 
        const request = ResponseValidator.validate<ILoginRequestDTO>(
            LoginRequestSchema, 
            httpRequest.body
        );

        const result = await this.authenticateAccountService.execute(request);

        return {
            statusCode: 200,
            body: result,
        };
    }
}