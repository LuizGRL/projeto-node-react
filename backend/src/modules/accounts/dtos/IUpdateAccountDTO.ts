import z from "zod";
import { ERole } from "../entities/enums/ERole";
import { isValidCPF } from "shared/infra/utils/valdiateCPF";


export const IUpdateAccountSchema = z.object({
    id: z.uuid(),
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email(),
    cpf: z.string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCPF, "CPF inválido"),    
    birthDate: z.coerce.date(),
    role: z.nativeEnum(ERole)
})

export type IUpdateAccountDTO = z.infer<typeof IUpdateAccountSchema>;