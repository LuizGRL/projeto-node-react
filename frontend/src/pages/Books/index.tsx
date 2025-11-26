import { useEffect, useState } from "react";
import { BookForm } from "./BookForm"; 
import AppModal from "../../components/Modal/AppModal";
import { Table } from "../../components/Table/Table";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import type { IBookCreateDTO } from "../../types/dtos/book.dtos";
import { bookService } from "../../services/book/bookService";
import { getErrorMessage } from "../../utils/utilsHandler";
import { authorService } from "../../services/auth/authorsService";
import { publisherService } from "../../services/auth/publisherService";


interface IBookResponseDTO extends IBookCreateDTO {
  publisher?: { name: string };
  authors?: { name: string }[];
}

export const BooksManagement = () => {
  const [books, setBooks] = useState<IBookResponseDTO[]>([]);
  
  const [formOptions, setFormOptions] = useState({
    publishers: [],
    authors: [],
    categories: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<IBookResponseDTO | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columnHelper = createColumnHelper<IBookResponseDTO>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Título",
    }),
    columnHelper.accessor("isbn", {
      header: "ISBN",
    }),
    columnHelper.accessor((row) => row.publisher?.name || "N/A", {
      id: "publisher",
      header: "Editora",
    }),
    columnHelper.accessor("publicationDate", {
      header: "Data Pub.",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("quantityTotal", {
      header: "Estoque",
    }),
  ];

  const fetchBooks = async () => {
    try {
      const data = await bookService.findAll(); 
      setBooks(data);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao carregar livros: " + msg);
    } 
  };

  const fetchFormOptions = async () => {
    try {
      const [publishersData, authorsData, categoriesData] = await Promise.all([
        publisherService.findAll(),
        authorService.findAll(),
        categoryService.findAll(),
      ]);

      setFormOptions({
        publishers: publishersData,
        authors: authorsData,
        categories: categoriesData,
      });
    } catch (error) {
      console.error("Erro ao carregar opções do formulário", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchFormOptions();
  }, [])

  const handleAdd = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (book: any) => {
    setBookToEdit(book); 
    setIsModalOpen(true);  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookToEdit(null);
  };

  const handleRequestDelete = (id: string) => {
    setBookToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDeleteId) return;

    try {
      setIsDeleting(true); 
      await bookService.delete(bookToDeleteId);
      
      toast.success("Livro deletado com sucesso");
      await fetchBooks();
      
      setIsDeleteModalOpen(false);
      setBookToDeleteId(null);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao deletar livro: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveBook = async (bookData: any) => {
    try { 
      if (bookToEdit) {
        await bookService.update(bookData); 
        toast.success("Livro atualizado com sucesso!");
      } else {
        await bookService.create(bookData);
        toast.success("Livro cadastrado com sucesso!");
      }
      
      fetchBooks(); 
      handleCloseModal(); 
    } catch(error) {
      const msg = getErrorMessage(error);
      toast.error("Erro ao salvar: " + msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Livros</h1>
          <p className="text-gray-500">Listagem completa do acervo de livros</p>
      </div>

      <div>
        <Table
          data={books || []} 
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
        <BookForm 
            initialData={bookToEdit}
            publishers={formOptions.publishers}
            authors={formOptions.authors}
            categories={formOptions.categories}
            onCancel={handleCloseModal} 
            onSave={handleSaveBook}
        />
      </AppModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Livro"
        description="Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
};