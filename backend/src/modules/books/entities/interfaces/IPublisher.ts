import { UUID } from "crypto";

export interface IPublisher {
    id: UUID,
    name: string,
    city: string,
    country: string,
}