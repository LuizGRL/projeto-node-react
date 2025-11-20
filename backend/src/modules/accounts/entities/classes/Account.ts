import type { UUID } from "crypto";
import type { ERole } from "../enums/ERole";
import type { IUser } from "../interfaces/IUser";

export class Account implements IUser {
    id: UUID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cpf: string;
    birthDate: Date;
    role: ERole;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: IUser) {
        this.id = props.id;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.password = props.password;
        this.cpf = props.cpf;
        this.birthDate = props.birthDate;
        this.role = props.role;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    getAge(): Date {
        return this.birthDate;
    }
}
