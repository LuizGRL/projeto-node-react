import z from "zod";
import { ERole } from "../entities/enums/ERole";
import { isValidCPF } from "shared/infra/utils/valdiateCPF";


export const ICreateAccountSchema = z.object({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres")
    .regex(/(?=.*[A-Z])/, "A senha deve ter pelo menos 1 letra maiúscula")
    .regex(/(?=.*\d)/, "A senha deve ter pelo menos 1 número")
    .regex(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, "A senha deve ter 1 caractere especial"),    
    cpf: z.string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(isValidCPF, "CPF inválido"),    
    birthDate: z.coerce.date(),
    role: z.nativeEnum(ERole)
})

export type ICreateAccountDTO = z.infer<typeof ICreateAccountSchema>;