import { PrismaAuthorsRepository } from "../../src/modules/books/repositories/AuthorsRepository";
import { PrismaPublishersRepository } from "../../src/modules/books/repositories/PublisherRepository";
import { PrismaCategoriesRepository } from "../../src/modules/books/repositories/CategoriesRepository";
import { BookService } from "../../src/modules/books/services/BookService";
import { ICreateBookDTO } from "../../src/modules/books/dtos/BookDTO"; // Importe a tipagem correta
import { prisma } from "../../prisma";
import { UUID } from "crypto";
import { PrismaBooksRepository } from "../../src/modules/books/repositories/BooksRepository";

describe("BookService", () => {
  let bookService: BookService;
  let booksRepository: PrismaBooksRepository;
  let authorsRepository: PrismaAuthorsRepository;
  let publishersRepository: PrismaPublishersRepository;
  let categoriesRepository: PrismaCategoriesRepository;

  let authorId: UUID;
  let publisherId: UUID;
  let categoryId: UUID;

  beforeEach(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.category.deleteMany();

    booksRepository = new PrismaBooksRepository();
    authorsRepository = new PrismaAuthorsRepository();
    publishersRepository = new PrismaPublishersRepository();
    categoriesRepository = new PrismaCategoriesRepository();

    bookService = new BookService(
      booksRepository,
      publishersRepository,
      authorsRepository,
      categoriesRepository
    );


    const author = await authorsRepository.create({ 
        firstName: "George", 
        lastName: "Orwell" 
    });
    authorId = author.id as UUID;

    const publisher = await publishersRepository.create({ 
        name: "Companhia das Letras",
        city: "São Paulo",
        country: "Brasil"
    });
    publisherId = publisher.id as UUID;

    const category = await categoriesRepository.create({ name: "Distopia" });
    categoryId = category.id as UUID;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.publisher.deleteMany();
    await prisma.category.deleteMany();
    await prisma.$disconnect();
  });

  const makeValidBookDTO = (): ICreateBookDTO => ({
    title: "1984",
    isbn: "978-85-359-1484-9", 
    pages: 416,
    publicationDate: new Date("1949-06-08"),
    quantityTotal: 10,
    publisherId,
    authorIds: [authorId as string],
    categoryIds: [categoryId as string],
  });

  test("deve criar um livro com sucesso", async () => {
    const data = makeValidBookDTO();
    const book = await bookService.create(data);

    expect(book).toHaveProperty("id");
    expect(book.title).toBe(data.title);
    expect(book.isbn).toBe(data.isbn); 
    expect(book.quantityTotal).toBe(10);
  });

  test("não deve criar livro com ISBN duplicado", async () => {
    const data = makeValidBookDTO();
    await bookService.create(data);

    const duplicateData = { ...makeValidBookDTO(), title: "Outro Livro" };

    await expect(bookService.create(duplicateData)).rejects.toMatchObject({
      message: "Já existe um livro com este ISBN",
      statusCode: 409,
    });
  });

  test("não deve criar livro com Editora inexistente", async () => {
    const data = makeValidBookDTO();
    data.publisherId = "550e8400-e29b-41d4-a716-446655440000";

    await expect(bookService.create(data)).rejects.toMatchObject({
      message: "Editora informada não existe",
      statusCode: 400,
    });
  });

  test("não deve criar livro com Autor inexistente", async () => {
    const data = makeValidBookDTO();
    data.authorIds = ["550e8400-e29b-41d4-a716-446655440000"];

    await expect(bookService.create(data)).rejects.toMatchObject({
      message: "Um ou mais autores informados não existem",
      statusCode: 400,
    });
  });

  test("deve atualizar um livro com sucesso", async () => {
    const book = await bookService.create(makeValidBookDTO());

    const updated = await bookService.update({
      id: book.id as UUID,
      title: "1984 - Edição Especial",
      quantityTotal: 20
    });

    expect(updated.title).toBe("1984 - Edição Especial");
    expect(updated.quantityTotal).toBe(20);
    expect(updated.id).toBe(book.id);
  });
  
  test("não deve deletar um livro inexistente", async () => {
      const fakeId = "550e8400-e29b-41d4-a716-446655440000" as UUID;
      await expect(bookService.delete(fakeId)).rejects.toMatchObject({
          message: "Livro não encontrado",
          statusCode: 404
      });
  });
});