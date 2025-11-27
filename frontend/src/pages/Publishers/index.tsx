import { useEffect, useState } from "react";
import { PublisherForm } from "./PublisherForm"; 
import { createColumnHelper } from "@tanstack/react-table";
import { getErrorMessage } from "../../utils/utilsHandler";
import { toast } from "react-toastify";
import { Table } from "../../components/Table/Table";
import AppModal from "../../components/Modal/AppModal";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { publisherService } from "../../services/auth/publisherService";
import type { IPublisherResponseDTO } from "../../types/dtos/publisher.dto";
import type { ZodUUID } from "zod";
import { usePageTitle } from "../../context/BreadcrumbContext";


export const PublishersManagement = () => {
  usePageTitle("Gerenciar Editoras");

  const [publishers, setPublishers] = useState<IPublisherResponseDTO[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publisherToEdit, setPublisherToEdit] = useState<IPublisherResponseDTO | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [publisherToDeleteId, setPublisherToDeleteId] = useState<ZodUUID | null>(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  const columnHelper = createColumnHelper<IPublisherResponseDTO>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Nome",
    }),
    columnHelper.accessor("city", {
      header: "Cidade",
    }),
    columnHelper.accessor("country", {
      header: "País",
    }),
  ];

  const fetchPublishers = async () => {
    try {
      const data = await publisherService.findAll(); 
      setPublishers(data);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao carregar editoras: " + msg);
    } 
  };

  useEffect(() => {
    fetchPublishers();
  }, [])

  const handleAdd = () => {
    setPublisherToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (publisher: any) => {
    setPublisherToEdit(publisher); 
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPublisherToEdit(null);
  };

  const handleRequestDelete = (id: ZodUUID) => {
    setPublisherToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!publisherToDeleteId) return;

    try {
      setIsDeleting(true); 
      await publisherService.delete(publisherToDeleteId);
      
      toast.success("Editora deletada com sucesso");
      await fetchPublishers();
      
      setIsDeleteModalOpen(false);
      setPublisherToDeleteId(null);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao deletar editora: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSavePublisher = async (publisherData: any) => {
    try { 
      if (publisherToEdit) {
        await publisherService.update(publisherData); 
        toast.success("Editora atualizada com sucesso!");
      } else {
        await publisherService.create(publisherData);
        toast.success("Editora cadastrada com sucesso!");
      }
      
      fetchPublishers(); 
      handleCloseModal(); 
    } catch(error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao salvar: " + msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Editoras</h1>
          <p className="text-gray-500">Listagem completa de editoras do sistema</p>
      </div>

      <div>
        <Table
          data={publishers || []} 
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
        <PublisherForm 
            initialData={publisherToEdit}
            onCancel={handleCloseModal} 
            onSave={handleSavePublisher}
        />
      </AppModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Editora"
        description="Tem certeza que deseja excluir esta editora? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
};