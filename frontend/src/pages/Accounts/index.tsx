import { useEffect, useState } from "react";
import { CreateAccountForm } from "./UserForm"; 
import AppModal from "../../components/Modal/AppModal";
import { Table } from "../../components/Table/Table";
import { toast } from "react-toastify";
import { userService } from "../../services/auth/accountService";
import { getErrorMessage } from "../../utils/utilsHandler";
import type { IAccountResponseDTO } from "../../types/dtos/accounts.dtos";
import { createColumnHelper } from "@tanstack/react-table";
import type { ZodUUID } from "zod";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";

export const AccountsManagment = () => {
  const [users, setUsers] = useState<IAccountResponseDTO[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<IAccountResponseDTO | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<ZodUUID | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columnHelper = createColumnHelper<IAccountResponseDTO>();

  const columns = [
    columnHelper.accessor("firstName", {
      header: "Nome",
    }),
    columnHelper.accessor("lastName", {
      header: "Sobrenome",
    }),
    columnHelper.accessor("email", {
      header: "E-mail",
    }),
    columnHelper.accessor("role", {
      header: "Perfil",
    }),
  ];

  const fetchUsers = async () => {
    try {
      const data = await userService.findAll(); 
      setUsers(data);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao carregar usuários: " + msg);
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
      await userService.delete(userToDeleteId);
      
      toast.success("Usuário deletado com sucesso");
      await fetchUsers();
      
      setIsDeleteModalOpen(false);
      setUserToDeleteId(null);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao deletar usuários: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try { 
      if (userToEdit) {
        await userService.update(userData); 
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await userService.create(userData);
        toast.success("Usuário cadastrado com sucesso!");
      }
      
      fetchUsers(); 
      handleCloseModal(); 
    } catch(error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao salvar: " + msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-500">Listagem completa de usuários do sistema</p>
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
        <CreateAccountForm 
            initialData={userToEdit}
            onCancel={handleCloseModal} 
            onSave={handleSaveUser}
        />
      </AppModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Usuário"
        description="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
};