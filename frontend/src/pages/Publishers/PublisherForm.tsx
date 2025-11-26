import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput/AppInput";

const publisherFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório").max(255),
  city: z.string().min(1, "Cidade obrigatória").max(255),
  country: z.string().min(1, "País obrigatório").max(255),
});

type PublisherFormData = z.infer<typeof publisherFormSchema>;

interface PublisherFormProps {
  initialData?: any; 
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function PublisherForm({ onCancel, onSave, initialData }: PublisherFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublisherFormData>({
    resolver: zodResolver(publisherFormSchema),
    defaultValues: { 
      id: "",
      name: "",
      city: "",
      country: "",
    }, 
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        name: initialData.name,
        city: initialData.city,
        country: initialData.country,
      });
    } else {
      reset({ 
        id: "",
        name: "",
        city: "",
        country: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: PublisherFormData) => {
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
        {initialData ? "Editar Editora" : "Nova Editora"}
      </h2>

      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <AppInput
              label="Nome da Editora"
              placeholder="Ex: Companhia das Letras"
              value={field.value || ""} 
              onChange={field.onChange} 
              titleCase
            />
          )}
        />
        <ErrorMsg msg={errors.name?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Cidade"
                placeholder="São Paulo"
                value={field.value || ""}
                onChange={field.onChange}
                titleCase
              />
            )}
          />
          <ErrorMsg msg={errors.city?.message} />
        </div>
        
        <div>
           <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <AppInput
                label="País"
                placeholder="Brasil"
                value={field.value || ""}
                onChange={field.onChange}
                titleCase
              />
            )}
          />
           <ErrorMsg msg={errors.country?.message} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <AppButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? "Salvar Alterações" : "Cadastrar Editora"}
        </AppButton>
      </div>
    </form>
  );
}