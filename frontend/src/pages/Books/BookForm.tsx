import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppButton from "../../components/Button/AppButton";
import AppInput from "../../components/Input/AppInput/AppInput";
import AppDropdown from "../../components/Dropdown/AppDropdown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";

const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

const bookFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório").max(255),
  isbn: z.string()
      .regex(isbnRegex, "ISBN inválido")
      .transform(val => val.replace(/[^0-9X]/g, "")), 
  publicationDate: z.coerce.date({ errorMap: () => ({ message: "Data inválida" }) }), 
  description: z.string().max(1000, "Máximo de 1000 caracteres").optional().or(z.literal('')),
  coverUrl: z.string().url("URL inválida").optional().or(z.literal('')),
  pages: z.coerce.number().int().positive("Deve ser positivo"),
  quantityTotal: z.coerce.number().int().nonnegative("Não pode ser negativo"),
  publisherId: z.string().uuid("Selecione uma editora"),
  authorIds: z.array(z.string()).min(1, "Selecione ao menos um autor"),
  categoryIds: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface OptionType {
  id: string;
  name: string;
}

interface AuthorOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface BookFormProps {
  initialData?: any; 
  publishers: OptionType[];
  authors: AuthorOption[];
  categories: OptionType[];
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function BookForm({ 
  onCancel, 
  onSave, 
  initialData, 
  publishers = [], 
  authors = [], 
  categories = [] 
}: BookFormProps) {
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: { 
      id: "",
      title: "",
      isbn: "",
      publicationDate: new Date(),
      description: "",
      coverUrl: "",
      pages: 0,
      quantityTotal: 0,
      publisherId: "",
      authorIds: [],
      categoryIds: [],
    }, 
  });

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.publicationDate 
        ? new Date(initialData.publicationDate).toISOString().split('T')[0] 
        : new Date();

      reset({
        id: initialData.id,
        title: initialData.title,
        isbn: initialData.isbn,
        publicationDate: formattedDate as any,
        description: initialData.description || "",
        coverUrl: initialData.coverUrl || "",
        pages: initialData.pages,
        quantityTotal: initialData.quantityTotal,
        publisherId: initialData.publisherId,
        authorIds: Array.isArray(initialData.authorIds) ? initialData.authorIds : initialData.authors?.map((a: any) => a.id) || [],
        categoryIds: Array.isArray(initialData.categoryIds) ? initialData.categoryIds : initialData.categories?.map((c: any) => c.id) || [],
      });
    } else {
      reset({ 
        id: "",
        title: "",
        isbn: "",
        description: "",
        coverUrl: "",
        pages: 0,
        quantityTotal: 0,
        publisherId: "",
        authorIds: [],
        categoryIds: [],
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: BookFormData) => {
    const payload = {
      ...data,
      id: initialData?.id,
      publicationDate: new Date(data.publicationDate),
    };
    onSave(payload);
  };

  const ErrorMsg = ({ msg }: { msg?: string }) => 
    msg ? <span className="text-red-500 text-xs mt-1 block">{msg}</span> : null;

  
  const publisherOptions = publishers.map(p => ({ label: p.name, value: p.id }));

  const authorItems = authors.map(a => ({ id: a.id, nome: `${a.firstName} ${a.lastName}` }));
  const categoryItems = categories.map(c => ({ id: c.id, nome: c.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Editar Livro" : "Novo Livro"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Título do Livro"
                placeholder="Ex: Dom Casmurro"
                value={field.value || ""} 
                onChange={field.onChange} 
                titleCase
              />
            )}
          />
          <ErrorMsg msg={errors.title?.message} />
        </div>
        <div>
          <Controller
            name="isbn"
            control={control}
            render={({ field }) => (
              <AppInput
                label="ISBN"
                placeholder="978-3-16-148410-0"
                value={field.value || ""} 
                onChange={field.onChange} 
              />
            )}
          />
          <ErrorMsg msg={errors.isbn?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">Editora</label>
          <Controller
            name="publisherId"
            control={control}
            render={({ field }) => (
              <AppDropdown 
                label="Selecione uma editora"
                options={publisherOptions}
                onChange={field.onChange}
                
              />
            )}
          />
          <ErrorMsg msg={errors.publisherId?.message} />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
          <Controller
            name="publicationDate"
            control={control}
            render={({ field }) => (
              <input 
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={field.onChange}
              />
            )}
          />
          <ErrorMsg msg={errors.publicationDate?.message} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <Controller
            name="pages"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Nº Páginas"
                type="number"
                placeholder="0"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <ErrorMsg msg={errors.pages?.message} />
        </div>
        <div>
           <Controller
            name="quantityTotal"
            control={control}
            render={({ field }) => (
              <AppInput
                label="Qtd. Total"
                type="number"
                placeholder="0"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
           <ErrorMsg msg={errors.quantityTotal?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autores</label>
          <Controller
            name="authorIds"
            control={control}
            render={({ field }) => (
              <MultiSelectDropdown 
                items={authorItems}
                selectedIds={field.value || []}
                onSelectionChange={(ids: any[]) => field.onChange(ids)}
              />
            )}
          />
          <ErrorMsg msg={errors.authorIds?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categorias</label>
          <Controller
            name="categoryIds"
            control={control}
            render={({ field }) => (
              <MultiSelectDropdown 
                items={categoryItems}
                selectedIds={field.value || []}
                onSelectionChange={(ids: any[]) => field.onChange(ids)}
              />
            )}
          />
          <ErrorMsg msg={errors.categoryIds?.message} />
        </div>
      </div>

      <div>
        <Controller
          name="coverUrl"
          control={control}
          render={({ field }) => (
            <AppInput
              label="URL da Capa"
              placeholder="https://..."
              value={field.value || ""} 
              onChange={field.onChange} 
            />
          )}
        />
        <ErrorMsg msg={errors.coverUrl?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white h-24 resize-none"
              placeholder="Sinopse do livro..."
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
        <ErrorMsg msg={errors.description?.message} />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <AppButton type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </AppButton>
        <AppButton type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? "Salvar Alterações" : "Cadastrar Livro"}
        </AppButton>
      </div>
    </form>
  );
}1