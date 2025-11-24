import { UUID } from "crypto";
import { ICreatePublisherDTO, IUpdatePublisherDTO } from "modules/books/dtos/PublisherDTO";
import { IPublisher } from "modules/books/entities/interfaces/IPublisher";

export interface IPublishersRepository {
    create(data: ICreatePublisherDTO): Promise<IPublisher>;
    update(data: IUpdatePublisherDTO): Promise<IPublisher>;
    delete(id: UUID): Promise<boolean>;
    findById(id: UUID): Promise<IPublisher | null>;
    list(): Promise<IPublisher[]>;
}