import type { ERole } from "../entities/enums/ERole";

export interface ICreateAccountDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cpf: string
    birthDate: Date;
    role: ERole;
}