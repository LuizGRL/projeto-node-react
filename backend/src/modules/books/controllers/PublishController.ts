import { inject, injectable } from "tsyringe";
import { ResponseValidator } from "../../../shared/infra/utils/validate";
import { validateUUID } from "../../../shared/infra/utils/validateUUID";
import { PublisherService } from "../services/PublisherService";
import { 
    CreatePublisherSchema, 
    ICreatePublisherDTO, 
    IUpdatePublisherDTO, 
    UpdatePublisherSchema 
} from "../dtos/PublisherDTO";
import { IPublisherService } from "../services/interfaces/IPublisherService";

@injectable()
export class PublisherController {
    constructor(
        @inject("PublisherService") 
        private publisherService: IPublisherService
    ) {}
    
    async create(httpRequest: any) {
        const request = ResponseValidator.validate<ICreatePublisherDTO>(
            CreatePublisherSchema, 
            httpRequest.body
        );
        
        const publisher = await this.publisherService.create(request);

        return {
            statusCode: 201,
            body: publisher
        }
    };    

    async update(httpRequest: any) { 
        const request = ResponseValidator.validate<IUpdatePublisherDTO>(
            UpdatePublisherSchema, 
            httpRequest.body
        );

        const publisher = await this.publisherService.update(request);
        
        return {
            statusCode: 200,
            body: publisher
        }
    }

    async delete(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        await this.publisherService.delete(id);
        
        return {
            statusCode: 200,
            body: { message: "Editora deletada com sucesso." }
        }      
    }

    async findById(httpRequest: any) { 
        const id = validateUUID(httpRequest.body.id || httpRequest.params?.id);
        const publisher = await this.publisherService.findById(id);
        
        return {
            statusCode: 200,
            body: publisher
        } 
    }

    async list(httpRequest: any) {
        const publishers = await this.publisherService.list();
        return {
            statusCode: 200,
            body: publishers
        }
    }
}