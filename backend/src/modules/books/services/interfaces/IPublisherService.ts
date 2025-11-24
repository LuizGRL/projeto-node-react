import { UUID } from "crypto";
import { ICreatePublisherDTO, IUpdatePublisherDTO } from "modules/books/dtos/PublisherDTO";
import { IPublisher } from "modules/books/entities/interfaces/IPublisher";

export interface IPublisherService {
    create(data: ICreatePublisherDTO): Promise<IPublisher>;
    update(data: IUpdatePublisherDTO): Promise<IPublisher>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<IPublisher>;
    list(): Promise<IPublisher[]>;
}