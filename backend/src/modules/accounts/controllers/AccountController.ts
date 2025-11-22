import { inject, injectable } from "tsyringe";
import { AccountService } from "../services/AccountService";
import { CreateAccountSchema, ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { ResponseValidator } from "shared/infra/utils/validate";
import { IUpdateAccountDTO, UpdateAccountSchema } from "../dtos/IUpdateAccountDTO";
import { IUpdatePasswordDTO, UpdatePasswordSchema } from "../dtos/IUpdatePasswordDTO";

@injectable()
export class AccountController {
    constructor(@inject("AccountService") accountService: AccountService) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreateAccountDTO>(
            CreateAccountSchema, 
            httpRequest.body
        );

    }

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdateAccountDTO>(
            UpdateAccountSchema, 
            httpRequest.body
        );
    }

    async updatePassword(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdatePasswordDTO>(
            UpdatePasswordSchema, 
            httpRequest.body
        );
    }

    // async delete(httpRequest: {body: ICreateAccountDTO}) { 

    // }

    // async findById(httpRequest: {body: ICreateAccountDTO}) { 

    // }

    // async findByEmail(httpRequest: {body: ICreateAccountDTO}) { 

    // }
}