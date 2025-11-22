import z from "zod";
import { ERole } from "../entities/enums/ERole";
import { isValidCPF } from "shared/infra/utils/valdiateCPF";


export const IUpdatePasswordSchema = z.object({
    id: z.uuid(),
    password: z.string()
    .min(8, "A senha precisa ter no mínimo 8 caracteres")
    .regex(/(?=.*[A-Z])/, "A senha deve ter pelo menos 1 letra maiúscula")
    .regex(/(?=.*\d)/, "A senha deve ter pelo menos 1 número")
    .regex(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, "A senha deve ter 1 caractere especial"),  
})

export type IUpdatePasswordDTO = z.infer<typeof IUpdatePasswordSchema>;