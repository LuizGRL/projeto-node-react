import { useEffect, useState } from "react";
import AppModal from "../../components/Modal/AppModal";
import { Table } from "../../components/Table/Table";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../utils/utilsHandler";
import { createColumnHelper } from "@tanstack/react-table";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import type { ICategoryCreateDTO } from "../../types/dtos/category.dto";
import { categoryService } from "../../services/category/categoryService";
import { CategoryForm } from "./CategoryForm";
import { usePageTitle } from "../../context/BreadcrumbContext";

export const CategoriesManagement = () => {
  usePageTitle("Gerenciar Categorias");
  const [categories, setCategories] = useState<ICategoryCreateDTO[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategoryCreateDTO | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columnHelper = createColumnHelper<ICategoryCreateDTO>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Nome",
      cell: (info) => <span className="font-medium text-gray-700">{info.getValue()}</span>
    }),
  ];

  const fetchCategories = async () => {
    try {
      const data = await categoryService.findAll(); 
      setCategories(data);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao carregar categorias: " + msg);
    } 
  };

  useEffect(() => {
    fetchCategories();
  }, [])

  const handleAdd = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setCategoryToEdit(category); 
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleRequestDelete = (id: string) => {
    setCategoryToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDeleteId) return;

    try {
      setIsDeleting(true); 
      await categoryService.delete(categoryToDeleteId as any);
      
      toast.success("Categoria deletada com sucesso");
      await fetchCategories();
      
      setIsDeleteModalOpen(false);
      setCategoryToDeleteId(null);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao deletar categoria: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    try { 
      if (categoryToEdit) {
        await categoryService.update(categoryData); 
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await categoryService.create(categoryData);
        toast.success("Categoria cadastrada com sucesso!");
      }
      
      fetchCategories(); 
      handleCloseModal(); 
    } catch(error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao salvar: " + msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h1>
          <p className="text-gray-500">Listagem completa de categorias literárias</p>
      </div>

      <div>
        <Table
          data={categories || []} 
          columns={columns}
          onAddClick={handleAdd}
          onEdit={handleEdit}
          onDelete={handleRequestDelete} 
        />
      </div>

      <AppModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      >
        <CategoryForm 
            initialData={categoryToEdit}
            onCancel={handleCloseModal} 
            onSave={handleSaveCategory}
        />
      </AppModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Livros associados podem perder a referência."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
};