import { inject, injectable } from "tsyringe";
import { CreateAccountSchema, ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { ResponseValidator } from "shared/infra/utils/validate";
import { IUpdateAccountDTO, UpdateAccountSchema } from "../dtos/IUpdateAccountDTO";
import { IUpdatePasswordDTO, UpdatePasswordSchema } from "../dtos/IUpdatePasswordDTO";
import { validateUUID } from "shared/infra/utils/validateUUID";
import { UUID } from "crypto";
import type { IAccountService } from "../entities/interfaces/IAccountService";
import { Account } from "@prisma/client";

@injectable()
export class AccountController {
    constructor(@inject("AccountService") private accountService: IAccountService) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreateAccountDTO>(
            CreateAccountSchema, 
            httpRequest.body
        );
        const account = await this.accountService.createUser(request);

        return {
            statusCode: 201,
            body: account
        }
    };    

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdateAccountDTO>(
            UpdateAccountSchema, 
            httpRequest.body
        );

        const account = await this.accountService.updateUser(request);
        
        return {
            statusCode: 201,
            body: account
        }
    }

    async updatePassword(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdatePasswordDTO>(
            UpdatePasswordSchema, 
            httpRequest.body
        );
        const account = await this.accountService.updatePassword(request);
        
        return {
            statusCode: 201,
            body: account
        }

    }

    async delete(httpRequest: any) { 

        const id = validateUUID(httpRequest.body['id']) as UUID;
        const account = await this.accountService.getUserById(id);
        if(account) {
           const result = await this.accountService.deleteUser(account as Account);
           if (result) {
                return {
                    statusCode: 201,
                    body: {message: "Usuário deletado."}
                }        
            }   
        }
        
        return {
            statusCode: 400,
            body: {message: "Usuário não encontrado."}
        }      
}

    async findById(httpRequest: any) { 
        const id = validateUUID(httpRequest.body['id']) as UUID;
        const account = await this.accountService.getUserById(id);
        if (account === null) {
            return {
                statusCode: 400,
                body: {message: "Usuário não econtrado."}
            } 
        }

        return {
            statusCode: 200,
            body: account
        } 
    }

    async findByEmail(httpRequest: any) { 
        const account = await this.accountService.getUserByEmail(httpRequest.body.email);
        if (account === null) {
            return {
                statusCode: 400,
                body: {message: "Usuário não econtrado."}
            } 
        }
        return {
            statusCode: 200,
            body: account
        } 
    }
}