import { useEffect, useState } from "react";
import { CreateAuthorForm } from "./AuthorForm";
import type { ZodUUID } from "zod";
import { createColumnHelper } from "@tanstack/react-table";
import { authorService } from "../../services/auth/authorsService";
import { getErrorMessage } from "../../utils/utilsHandler";
import { toast } from "react-toastify";
import { Table } from "../../components/Table/Table";
import AppModal from "../../components/Modal/AppModal";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import type { ICreateAuthorDTO } from "../../types/dtos/authors.dtos";
import { usePageTitle } from "../../context/BreadcrumbContext";

export const AuthorsManagment = () => {
  usePageTitle("Gerenciar Autores");

  const [users, setUsers] = useState<ICreateAuthorDTO[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<ICreateAuthorDTO | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<ZodUUID | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columnHelper = createColumnHelper<ICreateAuthorDTO>();

  const columns = [
    columnHelper.accessor("firstName", {
      header: "Nome",
    }),
    columnHelper.accessor("lastName", {
      header: "Sobrenome",
    }),
  ];

  const fetchUsers = async () => {
    try {
      const data = await authorService.findAll(); 
      setUsers(data);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao carregar autores: " + msg);
    } 
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setUserToEdit(user); 
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleRequestDelete = (id: ZodUUID) => {
    setUserToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return;

    try {
      setIsDeleting(true); 
      await authorService.delete(userToDeleteId);
      
      toast.success("Autor deletado com sucesso");
      await fetchUsers();
      
      setIsDeleteModalOpen(false);
      setUserToDeleteId(null);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao deletar autor: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try { 
      if (userToEdit) {
        await authorService.update(userData); 
        toast.success("Autor atualizado com sucesso!");
      } else {
        await authorService.create(userData);
        toast.success("Autor cadastrado com sucesso!");
      }
      
      fetchUsers(); 
      handleCloseModal(); 
    } catch(error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao salvar: " + msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Autores</h1>
          <p className="text-gray-500">Listagem completa de autores do sistema</p>
      </div>

      <div>
        <Table
          data={users || []} 
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
        <CreateAuthorForm
            initialData={userToEdit}
            onCancel={handleCloseModal} 
            onSave={handleSaveUser}
        />
      </AppModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Autor"
        description="Tem certeza que deseja excluir este autor? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
};