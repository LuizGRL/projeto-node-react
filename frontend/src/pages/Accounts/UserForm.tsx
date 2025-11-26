import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidCPF } from "../../utils/validateCpf";
import { ERoles } from "../../types/enums/ERoles";

import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput/AppInput";
import AppDateInput from "../../components/Input/AppDateInput/AppDateInput";

const createAccountSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Nome é obrigatório").max(255),
  lastName: z.string().min(1, "Sobrenome é obrigatório").max(255),
  email: z.string().email("E-mail inválido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/(?=.*[A-Z])/, "Precisa de 1 letra maiúscula")
    .regex(/(?=.*\d)/, "Precisa de 1 número")
    .regex(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, "Precisa de 1 caractere especial")
    .optional()
    .or(z.literal('')), 
  cpf: z.string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((val) => val.length === 11, "CPF deve ter 11 dígitos")
    .refine(isValidCPF, "CPF inválido"),
  birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
      message: "Data inválida"
  }),
  role: z.nativeEnum(ERoles, { errorMap: () => ({ message: "Selecione um perfil válido" }) })
}).superRefine((data, ctx) => {
  if (!data.id && (!data.password || data.password.length < 8)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["password"],
      message: "Senha é obrigatória para novos usuários",
    });
  }
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface UserFormProps {
  initialData?: any; 
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function CreateAccountForm({ onCancel, onSave, initialData }: UserFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { 
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      role: ERoles.CUSTOMER, 
      cpf: "",
      birthDate: "",
      password: "" 
    }, 
  });

  useEffect(() => {
    if (initialData) {
      let formattedDate = "";
      if (initialData.birthDate) {
        const dateObj = new Date(initialData.birthDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      }

      reset({
        id: initialData.id,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        cpf: initialData.cpf, 
        role: initialData.role,
        birthDate: formattedDate,
        password: ""
      });
    } else {
      reset({ 
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: ERoles.CUSTOMER, 
        cpf: "",
        birthDate: "",
        password: "" 
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: CreateAccountFormData) => {
    const payload = {
      ...data,
      id: initialData?.id, 
      cpf: data.cpf.replace(/\D/g, ""),
      birthDate: new Date(data.birthDate), 
    };

    if (!payload.password) {
      delete (payload as any).password;
    }

    onSave(payload);
  };

  const ErrorMsg = ({ msg }: { msg?: string }) => 
    msg ? <span className="text-red-500 text-xs mt-1 block">{msg}</span> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Editar Usuário" : "Novo Usuário"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Nome"
                placeholder="João"
                value={field.value || ""} 
                onChange={field.onChange} 
                titleCase
              />
            )}
          />
          <ErrorMsg msg={errors.firstName?.message} />
        </div>
        
        <div>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Sobrenome"
                placeholder="Silva"
                value={field.value || ""}
                onChange={field.onChange}
                titleCase
              />
            )}
          />
          <ErrorMsg msg={errors.lastName?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <AppInput
                label="CPF"
                placeholder="000.000.000-00"
                value={field.value || ""}
                onChange={field.onChange}
                cpf={true} 
                disabled={!!initialData}
              />
            )}
          />
           <ErrorMsg msg={errors.cpf?.message} />
        </div>
        
        <div>
           <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <AppDateInput
                label="Data de Nascimento"
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.birthDate?.message}
              />
            )}
          />
        </div>
      </div>

      <div>
        <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <AppInput
                label="E-mail"
                placeholder="email@exemplo.com"
                type="email"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
        />
        <ErrorMsg msg={errors.email?.message} />
      </div>

      <div>
        <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <AppInput
                label={initialData ? "Nova Senha (Opcional)" : "Senha"}
                placeholder="********"
                type="password"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
        />
        <ErrorMsg msg={errors.password?.message} />
        <p className="text-[10px] text-gray-400 mt-1">
          Mín. 8 chars, 1 maiúscula, 1 número, 1 especial.
        </p>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Perfil (Role)</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <select 
                {...field} 
                className="bg-white border border-black rounded p-2 w-full focus:outline-none"
            >
              {Object.values(ERoles).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          )}
        />
        <ErrorMsg msg={errors.role?.message} />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <AppButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? "Salvar Alterações" : "Criar Conta"}
        </AppButton>
      </div>
    </form>
  );
}