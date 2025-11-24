import { PrismaAuthorsRepository } from "../../src/modules/books/repositories/AuthorsRepository";
import { AuthorService } from "../../src/modules/books/services/AuthorService";
import { prisma } from "../../prisma";
import { ICreateAuthorDTO } from "../../src/modules/books/dtos/AuthorDTO";
import { UUID } from "crypto";

describe("AuthorService", () => {
  let authorService: AuthorService;
  let authorsRepository: PrismaAuthorsRepository;

  beforeEach(async () => {
    await prisma.book.deleteMany(); 
    await prisma.author.deleteMany();
    
    authorsRepository = new PrismaAuthorsRepository();
    authorService = new AuthorService(authorsRepository);
  });

  afterAll(async () => {
    await prisma.author.deleteMany();
    await prisma.$disconnect();
  });

  const makeValidAuthor = (): ICreateAuthorDTO => ({
    firstName: "J.R.R.",
    lastName: "Tolkien",
  });

  test("deve criar um autor com sucesso", async () => {
    const data = makeValidAuthor();
    const author = await authorService.create(data);

    expect(author).toHaveProperty("id");
    expect(author.firstName).toBe(data.firstName);
    expect(author.lastName).toBe(data.lastName);

  });

  test("deve atualizar um autor com sucesso", async () => {
    const author = await authorService.create(makeValidAuthor());

    const updated = await authorService.update({
      id: author.id as UUID,
      firstName: "John Ronald",
      lastName: "Reuel Tolkien"
    });

    expect(updated.firstName).toBe("John Ronald");
    expect(updated.lastName).toBe("Reuel Tolkien");
    expect(updated.id).toBe(author.id);
  });

  test("não deve atualizar um autor inexistente", async () => {
    const fakeId = "550e8400-e29b-41d4-a716-446655440000" as UUID;
    await expect(authorService.update({
      id: fakeId,
      firstName: "Novo Nome"
    })).rejects.toMatchObject({
      message: "Autor não encontrado",
      statusCode: 404,
    });
  });

  test("deve deletar um autor com sucesso", async () => {
    const author = await authorService.create(makeValidAuthor());
    const result = await authorService.delete(author.id as UUID);

    expect(result).toBe(true);
    
    const check = await prisma.author.findUnique({ where: { id: author.id as string }});
    expect(check).toBeNull();
  });

  test("não deve deletar um autor inexistente", async () => {
    const fakeId = "550e8400-e29b-41d4-a716-446655440000" as UUID;
    
    await expect(authorService.delete(fakeId)).rejects.toMatchObject({
      message: "Autor não encontrado",
      statusCode: 404,
    });
  });
});