import type { UUID } from "crypto";
import type { ERole } from "../enums/ERole";
import { Int } from "effect/Schema";

export interface IUser {
    id: UUID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cpf: string
    birthDate: Date;
    role: ERole;
    createdAt: Date;
    updatedAt: Date;
    token_version?: Int;
}