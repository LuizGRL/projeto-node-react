import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput/AppInput";

const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório").max(255, "Máximo de 255 caracteres"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: any; 
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function CategoryForm({ onCancel, onSave, initialData }: CategoryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { 
      id: "",
      name: "",
    }, 
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        name: initialData.name,
      });
    } else {
      reset({ 
        id: "",
        name: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: CategoryFormData) => {
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
        {initialData ? "Editar Categoria" : "Nova Categoria"}
      </h2>

      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <AppInput
              label="Nome da Categoria"
              placeholder="Ex: Ficção Científica"
              value={field.value || ""} 
              onChange={field.onChange} 
              titleCase
            />
          )}
        />
        <ErrorMsg msg={errors.name?.message} />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <AppButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? "Salvar Alterações" : "Cadastrar Categoria"}
        </AppButton>
      </div>
    </form>
  );
}