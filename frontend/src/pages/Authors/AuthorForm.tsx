import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput/AppInput";

export const createAuthorSchema = z.object({
  firstName: z.string().min(1, "Primeiro nome obrigatório").max(255),
  lastName: z.string().min(1, "Sobrenome obrigatório").max(255),
});


type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;

interface AuthorFormProps {
  initialData?: any; 
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function CreateAuthorForm({ onCancel, onSave, initialData }: AuthorFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthorFormData>({
    resolver: zodResolver(createAuthorSchema),
    defaultValues: { 
      firstName: "",
      lastName: "",
    }, 
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        firstName: initialData.firstName,
        lastName: initialData.lastName});
    } else {
      reset({ 
        id: "",
        firstName: "",
        lastName: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: CreateAuthorFormData) => {
    const payload = {
      ...data,
      id: initialData?.id, 
    };
    onSave(payload);
  };

  const ErrorMsg = ({ msg }: { msg?: string }) => 
    msg ? <span className="text-red-500 text-xs mt-1 block">{msg}</span> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Editar Autor" : "Novo Autor"}
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

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <AppButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? "Salvar Alterações" : "Criar autor"}
        </AppButton>
      </div>
    </form>
  );
}